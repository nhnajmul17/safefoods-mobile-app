import { API_URL } from "@/constants/variables";
import { useAuthStore } from "@/store/authStore";
import { useCartStore } from "@/store/cartStore";
import Toast from "react-native-toast-message";

interface CartApiItem {
  id: string;
  variantProductId: string;
  productTitle: string;
  productImageUrl: string;
  productPrice: number;
  unitTitle: string;
  quantity: number;
}

interface CartApiResponse {
  success: boolean;
  data: {
    items: CartApiItem[];
  };
}

interface AddToCartParams {
  productId: string;
  variantId: string;
  productTitle: string;
  productImage: string;
  productPrice: number;
  unitTitle: string;
  newQuantity: number;
  showToast?: boolean;
}

// Cache for cart item IDs from database
let cartItemsCache: Map<string, string> = new Map(); // key: `${productId}-${variantId}`, value: cartItemId

/**
 * Fetch cart items from API and update cache with database cart item IDs
 */
export const fetchCartItemsFromApi = async (): Promise<CartApiItem[]> => {
  const { userId } = useAuthStore.getState();

  if (!userId) {
    return [];
  }

  try {
    const response = await fetch(`${API_URL}/v1/cart?userId=${userId}`);

    const data: CartApiResponse = await response.json();

    if (data.success) {
      // Update cache with cart item IDs
      cartItemsCache.clear();
      data.data.items.forEach((item) => {
        const key = `${item.variantProductId}-${item.variantProductId}`; // Fix: should be productId-variantId but using variantId for both for now
        cartItemsCache.set(key, item.id);
      });

      return data.data.items;
    }

    return [];
  } catch (error) {
    console.error("Error fetching cart items:", error);
    return [];
  }
};

/**
 * Get cart item ID from cache or fetch from API
 */
const getCartItemId = async (
  productId: string,
  variantId: string
): Promise<string | null> => {
  const key = `${productId}-${variantId}`;

  // Check cache first
  if (cartItemsCache.has(key)) {
    return cartItemsCache.get(key) || null;
  }

  // If not in cache, fetch from API
  const cartItems = await fetchCartItemsFromApi();
  const foundItem = cartItems.find(
    (item) => item.variantProductId === variantId
  );

  return foundItem ? foundItem.id : null;
};

/**
 * Update cart quantity in database
 */
const updateCartInDatabase = async (
  variantId: string,
  quantityChange: number
): Promise<boolean> => {
  const { userId } = useAuthStore.getState();

  if (!userId) {
    return false;
  }

  try {
    const response = await fetch(`${API_URL}/v1/cart`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: userId,
        variantProductId: variantId,
        quantity: quantityChange,
      }),
    });

    const result = await response.json();
    return result.success || response.ok;
  } catch (error) {
    console.error("Cart API Error:", error);
    return false;
  }
};

/**
 * Mark cart item as discarded in database
 */
const discardCartItemInDatabase = async (
  productId: string,
  variantId: string
): Promise<boolean> => {
  try {
    const cartItemId = await getCartItemId(productId, variantId);

    if (!cartItemId) {
      console.warn("Cart item ID not found for discarding");
      return false;
    }

    const response = await fetch(`${API_URL}/v1/cart`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: cartItemId,
        isDiscarded: true,
      }),
    });

    const result = await response.json();

    // Remove from cache after successful discard
    if (result.success || response.ok) {
      const key = `${productId}-${variantId}`;
      cartItemsCache.delete(key);
    }

    return result.success || response.ok;
  } catch (error) {
    console.error("Cart discard API Error:", error);
    return false;
  }
};

/**
 * Common function to handle add to cart operations
 * This function handles both local storage (Zustand) and database synchronization
 */
export const handleAddToCart = async ({
  productId,
  variantId,
  productTitle,
  productImage,
  productPrice,
  unitTitle,
  newQuantity,
  showToast = true,
}: AddToCartParams): Promise<void> => {
  const { cartItems, addItem, updateQuantity, removeItem } =
    useCartStore.getState();
  const { userId } = useAuthStore.getState();

  // Find current item in cart
  const currentItem = cartItems.find(
    (item) => item.id === productId && item.variantId === variantId
  );
  const currentQuantity = currentItem ? currentItem.quantity : 0;
  const quantityChange = newQuantity - currentQuantity;

  try {
    // Handle database synchronization for logged-in users FIRST
    if (userId) {
      if (newQuantity > 0) {
        // Update quantity in database
        const success = await updateCartInDatabase(variantId, quantityChange);

        if (!success) {
          console.warn("Failed to update cart in database");
          // Don't proceed with local update if database update failed
          return;
        }
      } else {
        // First reduce quantity to 0, then discard
        if (currentQuantity > 0) {
          await updateCartInDatabase(variantId, -currentQuantity);
        }

        // Mark as discarded in database
        const discardSuccess = await discardCartItemInDatabase(
          productId,
          variantId
        );

        if (!discardSuccess) {
          console.warn("Failed to discard cart item in database");
          // Don't proceed with local removal if database discard failed
          return;
        }
      }
    }

    // Handle local cart operations AFTER successful database operations
    if (newQuantity > 0) {
      if (currentQuantity === 0) {
        // Add new item to local cart
        await addItem({
          id: productId,
          variantId: variantId,
          name: productTitle,
          image: productImage,
          price: productPrice,
          unit: unitTitle,
          quantity: newQuantity,
        });
      } else {
        // Update existing item quantity in local cart
        await updateQuantity(productId, variantId, newQuantity);
      }
    } else {
      // Remove item from local cart
      await removeItem(productId, variantId);
    }

    // Show toast notifications
    if (showToast) {
      if (newQuantity > 0) {
        Toast.show({
          type: "success",
          text1: currentQuantity === 0 ? "Added to Cart" : "Cart Updated",
          text2: unitTitle
            ? `${productTitle} (${unitTitle}) x${newQuantity} in cart.`
            : `${productTitle} x${newQuantity} in cart.`,
          text1Style: { fontSize: 16, fontWeight: "bold" },
          text2Style: { fontSize: 14, fontWeight: "bold" },
        });
      } else {
        Toast.show({
          type: "info",
          text1: "Removed from Cart",
          text2: unitTitle
            ? `${productTitle} (${unitTitle}) removed from cart.`
            : `${productTitle} removed from cart.`,
          text1Style: { fontSize: 16, fontWeight: "bold" },
          text2Style: { fontSize: 14, fontWeight: "bold" },
        });
      }
    }
  } catch (error) {
    console.error("Error in handleAddToCart:", error);

    if (showToast) {
      Toast.show({
        type: "error",
        text1: "Cart Error",
        text2: "Failed to update cart. Please try again.",
        text1Style: { fontSize: 16, fontWeight: "bold" },
        text2Style: { fontSize: 14, fontWeight: "bold" },
      });
    }
  }
};

/**
 * Initialize cart from API for logged-in users
 * This should be called when user logs in or app starts
 */
export const initializeCartFromApi = async (): Promise<void> => {
  const { userId } = useAuthStore.getState();
  const { isCartFetchedFromApi } = useCartStore.getState();

  if (!userId || isCartFetchedFromApi) {
    return;
  }

  try {
    const cartItems = await fetchCartItemsFromApi();

    // Add items to local cart
    const { addItem } = useCartStore.getState();

    for (const item of cartItems) {
      await addItem({
        id: item.variantProductId, // Using variantId as product ID for consistency
        variantId: item.variantProductId,
        name: item.productTitle,
        image: item.productImageUrl || "https://via.placeholder.com/50",
        price: item.productPrice,
        unit: item.unitTitle,
        quantity: item.quantity,
      });
    }

    // Mark as fetched
    useCartStore.setState({ isCartFetchedFromApi: true });
  } catch (error) {
    console.error("Error initializing cart from API:", error);
  }
};

/**
 * Clear entire cart for logged-in users (isPurchased true all items in database)
 */
export const clearCartInDatabase = async (): Promise<boolean> => {
  const { userId } = useAuthStore.getState();

  if (!userId) {
    return false;
  }

  try {
    // First get all cart items to get their IDs
    const cartItems = await fetchCartItemsFromApi();

    if (cartItems.length === 0) {
      return true;
    }

    // Discard each item in the database
    const discardPromises = cartItems.map(async (item) => {
      try {
        const response = await fetch(`${API_URL}/v1/cart`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: item.id,
            isDiscarded: true,
          }),
        });

        return response.ok;
      } catch (error) {
        console.error(`Error discarding cart item ${item.id}:`, error);
        return false;
      }
    });

    const results = await Promise.all(discardPromises);
    const allSuccessful = results.every((result) => result);

    // Clear cache after successful discard
    if (allSuccessful) {
      clearCartCache();
    }

    return allSuccessful;
  } catch (error) {
    console.error("Error clearing cart in database:", error);
    return false;
  }
};

/**
 * Clear entire cart for logged-in users (discard all items in database)
 */
export const clearCartInDatabaseInOrderPlaced = async (): Promise<boolean> => {
  const { userId } = useAuthStore.getState();

  if (!userId) {
    return false;
  }

  try {
    // First get all cart items to get their IDs
    const cartItems = await fetchCartItemsFromApi();

    if (cartItems.length === 0) {
      return true;
    }

    // Mark each item in the database
    const orderPromises = cartItems.map(async (item) => {
      try {
        const response = await fetch(`${API_URL}/v1/cart`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: item.id,
            isPurchased: true,
          }),
        });

        return response.ok;
      } catch (error) {
        console.error(`Error discarding cart item ${item.id}:`, error);
        return false;
      }
    });

    const results = await Promise.all(orderPromises);
    const allSuccessful = results.every((result) => result);

    // Clear cache after successful purchase
    if (allSuccessful) {
      clearCartCache();
    }

    return allSuccessful;
  } catch (error) {
    console.error("Error clearing cart in database while order placed:", error);
    return false;
  }
};

/**
 * Clear cart cache (useful when user logs out)
 */
export const clearCartCache = (): void => {
  cartItemsCache.clear();
};
