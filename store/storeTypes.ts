export interface CartItem {
  id: string;
  variantId: string;
  name: string;
  image: string;
  price: number;
  unit: string;
  quantity: number;
}

export interface CartState {
  cartItems: CartItem[];
  isCartFetchedFromApi: boolean;
  addItem: (item: CartItem) => void;
  removeItem: (id: string, variantId: string) => void;
  updateQuantity: (id: string, variantId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

export type AuthState = {
  isAuthenticated: boolean;
  accessToken?: string | null; // Optional access token
  userId: string | null;
  userName?: string | null;
  userEmail?: string | null; // Optional user email
  registerEmail?: string | null; // For registration email
  registerToken?: string | null; // For registration token
  resetEmail: string | null; // For forgot password email
  resetToken: string | null; // For reset token
  otpCode: string | null;
  login: (
    userId: string,
    userName: string,
    userEmail: string,
    accessToken: string
  ) => void;
  logout: () => void;
  setRegisterData: (email: string, token: string) => void; // Setter for registration email and token
  setResetData: (email: string, token: string) => void; // Setter for reset data
  setOtpCode: (code: string) => void; // New setter for OTP code
};
