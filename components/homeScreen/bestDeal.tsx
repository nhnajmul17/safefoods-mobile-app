import {
  View,
  StyleSheet,
  ScrollView,
  Text,
  ActivityIndicator,
} from "react-native";
import { Fragment, useState, useEffect } from "react";
import { useCartStore } from "@/store/cartStore";
import Toast from "react-native-toast-message";
import {
  ShopNowProduct,
  ProductVariant,
} from "@/components/shopNowScreen/shopNowProductCard";

import BestDealProductCard from "./bestDealProductCard";
import { API_URL } from "@/constants/variables";
import { useAuthStore } from "@/store/authStore";
import BestDealSkeleton from "./bestDealSkeleton";

// Define QuantityMap interface
interface QuantityMap {
  [productId: string]: number;
}

export default function HomeBestDeal() {
  const { cartItems, addItem, removeItem, updateQuantity } = useCartStore();
  const { userId, accessToken } = useAuthStore();
  const [products, setProducts] = useState<ShopNowProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [quantities, setQuantities] = useState<QuantityMap>({});
  const [selectedVariants, setSelectedVariants] = useState<{
    [productId: string]: ProductVariant;
  }>({});

  // Fetch best-selling products from API
  useEffect(() => {
    const fetchBestSellingProducts = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`${API_URL}/v1/products?bestDeal=true`);
        const data = await response.json();
        if (data.success) {
          setProducts(data.data);
          setSelectedVariants(
            Object.fromEntries(
              data.data.map((product: ShopNowProduct) => [
                product.id,
                product.variants[0] || null,
              ])
            )
          );
        } else {
          setError("Failed to load best-selling products.");
        }
      } catch (err) {
        console.error("Error fetching best-selling products:", err);
        setError("Failed to load best-selling products. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchBestSellingProducts();
  }, []);

  const handleAddToCart = (
    item: ShopNowProduct,
    selectedVariant: ProductVariant,
    newQuantity: number
  ) => {
    // Find the current quantity in cart
    const cartItem = cartItems.find(
      (cartItem) =>
        cartItem.id === item.id && cartItem.variantId === selectedVariant.id
    );
    const currentQuantity = cartItem ? cartItem.quantity : 0;

    if (newQuantity > 0) {
      if (currentQuantity === 0) {
        // Add new item to cart
        addItem({
          id: item.id,
          variantId: selectedVariant.id,
          name: item.title,
          image: selectedVariant.mediaItems?.[0]?.mediaUrl
            ? selectedVariant.mediaItems[0].mediaUrl.startsWith("http://")
              ? selectedVariant.mediaItems[0].mediaUrl.replace(
                  "http://",
                  "https://"
                )
              : selectedVariant.mediaItems[0].mediaUrl
            : "https://via.placeholder.com/50",
          price: selectedVariant.price,
          unit: selectedVariant.unitTitle,
          quantity: newQuantity,
        });
      } else {
        // Update existing item quantity
        updateQuantity(item.id, selectedVariant.id, newQuantity);
      }

      // Update API if user is logged in
      if (userId && accessToken) {
        const quantityChange = newQuantity - currentQuantity;
        fetch(`${API_URL}/v1/cart`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            userId: userId,
            variantProductId: selectedVariant.id,
            quantity: quantityChange,
          }),
        })
          .then((response) => response.json())
          .catch((error) => console.error("Cart API Error:", error));
      }

      Toast.show({
        type: "success",
        text1: currentQuantity === 0 ? "Added to Cart" : "Cart Updated",
        text2: `${item.title} (${selectedVariant.unitTitle}) x${newQuantity} in cart.`,
        text1Style: { fontSize: 16, fontWeight: "bold" },
        text2Style: { fontSize: 14, fontWeight: "bold" },
      });
    } else {
      // Remove item from cart
      removeItem(item.id, selectedVariant.id);

      // Update API if user is logged in
      if (userId && accessToken) {
        fetch(`${API_URL}/v1/cart`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            userId: userId,
            variantProductId: selectedVariant.id,
            quantity: -currentQuantity,
          }),
        })
          .then((response) => response.json())
          .catch((error) => console.error("Cart API Error:", error));
      }

      Toast.show({
        type: "info",
        text1: "Removed from Cart",
        text2: `${item.title} (${selectedVariant.unitTitle}) removed from cart.`,
        text1Style: { fontSize: 16, fontWeight: "bold" },
        text2Style: { fontSize: 14, fontWeight: "bold" },
      });
    }
  };

  if (loading) {
    return <BestDealSkeleton />;
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  if (!products.length) {
    return (
      <View style={styles.container}>
        <Text style={styles.noProducts}>
          No best-deal products available at the moment.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Horizontal Scrollable Product List */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.productsContainer}
        contentContainerStyle={styles.productsContent}
      >
        {products.map((item) => (
          <Fragment key={item.id}>
            <BestDealProductCard
              item={item}
              quantity={quantities[item.id] || 0}
              selectedVariant={selectedVariants[item.id] || item.variants[0]}
              setSelectedVariants={setSelectedVariants}
              setQuantities={setQuantities}
              handleAddToCart={handleAddToCart}
            />
          </Fragment>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    backgroundColor: "#f9f9f9",
    justifyContent: "center",
    alignItems: "center",
  },
  productsContainer: {
    paddingLeft: 0,
    marginTop: 16,
    marginBottom: 16,
  },
  productsContent: {
    paddingRight: 16,
  },
  noProducts: {
    fontSize: 18,
    color: "#888",
    textAlign: "center",
    marginVertical: 32,
    fontWeight: "bold",
  },
  errorText: {
    fontSize: 18,
    color: "#d32f2f",
    textAlign: "center",
    marginVertical: 32,
    fontWeight: "bold",
  },
});
