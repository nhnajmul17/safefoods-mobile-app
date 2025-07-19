import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { CartItem, CartState } from "./storeTypes"; // Define types in a separate file if needed

// Storage key for AsyncStorage
const CART_STORAGE_KEY = "@CartItems";

// Load initial cart items from AsyncStorage
const loadCartFromStorage = async () => {
  try {
    const storedCart = await AsyncStorage.getItem(CART_STORAGE_KEY);
    return storedCart ? JSON.parse(storedCart) : [];
  } catch (error) {
    console.error("Error loading cart from storage:", error);
    return [];
  }
};

// Save cart items to AsyncStorage
const saveCartToStorage = async (cartItems: CartItem[]) => {
  try {
    await AsyncStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
  } catch (error) {
    console.error("Error saving cart to storage:", error);
  }
};

export const useCartStore = create<CartState>((set, get) => ({
  cartItems: [],
  isCartFetchedFromApi: false,
  addItem: async (item: CartItem) =>
    set((state) => {
      const existingItem = state.cartItems.find(
        (i) => i.id === item.id && i.variantId === item.variantId
      );
      const newCartItems = existingItem
        ? state.cartItems.map((i) =>
            i.id === item.id && i.variantId === item.variantId
              ? { ...i, quantity: i.quantity + item.quantity }
              : i
          )
        : [...state.cartItems, item];

      saveCartToStorage(newCartItems); // Persist after update
      return { cartItems: newCartItems };
    }),
  removeItem: async (id: string, variantId: string) =>
    set((state) => {
      const newCartItems = state.cartItems.filter(
        (item) => !(item.id === id && item.variantId === variantId)
      );
      saveCartToStorage(newCartItems); // Persist after update
      return { cartItems: newCartItems };
    }),
  updateQuantity: async (id: string, variantId: string, quantity: number) =>
    set((state) => {
      let newCartItems;
      if (quantity <= 0) {
        newCartItems = state.cartItems.filter(
          (item) => !(item.id === id && item.variantId === variantId)
        );
      } else {
        newCartItems = state.cartItems.map((item) =>
          item.id === id && item.variantId === variantId
            ? { ...item, quantity }
            : item
        );
      }
      saveCartToStorage(newCartItems); // Persist after update
      return { cartItems: newCartItems };
    }),
  clearCart: async () => {
    await AsyncStorage.removeItem(CART_STORAGE_KEY); // Clear persisted data
    set({ cartItems: [] });
  },
  getTotalItems: () =>
    get().cartItems.reduce((total, item) => total + item.quantity, 0),
  getTotalPrice: () =>
    get().cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    ),
}));

// Initialize store with persisted data
loadCartFromStorage().then((initialCart) => {
  useCartStore.setState({ cartItems: initialCart });
});
