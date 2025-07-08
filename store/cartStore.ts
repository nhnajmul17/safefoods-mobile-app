import { create } from "zustand";

interface CartItem {
  id: string;
  variantId: string;
  name: string;
  image: string;
  price: number;
  unit: string;
  quantity: number;
}

interface CartState {
  cartItems: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string, variantId: string) => void;
  updateQuantity: (id: string, variantId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

export const useCartStore = create<CartState>((set, get) => ({
  cartItems: [],
  addItem: (item: CartItem) =>
    set((state) => {
      const existingItem = state.cartItems.find(
        (i) => i.id === item.id && i.variantId === item.variantId
      );
      if (existingItem) {
        return {
          cartItems: state.cartItems.map((i) =>
            i.id === item.id && i.variantId === item.variantId
              ? { ...i, quantity: i.quantity + item.quantity }
              : i
          ),
        };
      }
      return { cartItems: [...state.cartItems, item] };
    }),
  removeItem: (id: string, variantId: string) =>
    set((state) => ({
      cartItems: state.cartItems.filter(
        (item) => !(item.id === id && item.variantId === variantId)
      ),
    })),
  updateQuantity: (id: string, variantId: string, quantity: number) =>
    set((state) => {
      if (quantity <= 0) {
        return {
          cartItems: state.cartItems.filter(
            (item) => !(item.id === id && item.variantId === variantId)
          ),
        };
      }
      return {
        cartItems: state.cartItems.map((item) =>
          item.id === id && item.variantId === variantId
            ? { ...item, quantity }
            : item
        ),
      };
    }),
  clearCart: () => set({ cartItems: [] }),
  getTotalItems: () =>
    get().cartItems.reduce((total, item) => total + item.quantity, 0),
  getTotalPrice: () =>
    get().cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    ),
}));
