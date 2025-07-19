// store/authStore.ts
import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AuthState } from "./storeTypes";

// Storage key for AsyncStorage
const AUTH_STORAGE_KEY = "@AuthState";

// Load initial auth state from AsyncStorage
const loadAuthFromStorage = async () => {
  try {
    const storedAuth = await AsyncStorage.getItem(AUTH_STORAGE_KEY);
    return storedAuth ? JSON.parse(storedAuth) : initialAuthState;
  } catch (error) {
    console.error("Error loading auth from storage:", error);
    return initialAuthState;
  }
};

// Save auth state to AsyncStorage
const saveAuthToStorage = async (state: Partial<AuthState>) => {
  try {
    await AsyncStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.error("Error saving auth to storage:", error);
  }
};

// Initial state (default values)
const initialAuthState = {
  isAuthenticated: false,
  userId: null,
  userName: null,
  userEmail: null,
  accessToken: null,
  registerEmail: null,
  registerToken: null,
  resetEmail: null,
  resetToken: null,
  otpCode: null,
};

export const useAuthStore = create<AuthState>((set, get) => {
  // Initialize with persisted data
  const initialState = loadAuthFromStorage();
  initialState.then((state) => {
    useAuthStore.setState(state);
  });

  return {
    ...initialAuthState,
    login: (
      userId: string,
      userName: string,
      userEmail: string,
      accessToken: string
    ) =>
      set((state) => {
        const newState = {
          ...state,
          isAuthenticated: true,
          userId,
          userName,
          userEmail,
          accessToken,
        };
        saveAuthToStorage(newState); // Persist after login
        return newState;
      }),
    logout: () =>
      set((state) => {
        const newState = {
          ...initialAuthState,
        };
        saveAuthToStorage(newState); // Clear persisted data on logout
        return newState;
      }),
    setRegisterData: (email: string, token: string) =>
      set((state) => {
        const newState = {
          ...state,
          registerEmail: email,
          registerToken: token,
        };
        saveAuthToStorage(newState); // Persist registration data
        return newState;
      }),
    setResetData: (email: string, token: string) =>
      set((state) => {
        const newState = {
          ...state,
          resetEmail: email,
          resetToken: token,
        };
        saveAuthToStorage(newState); // Persist reset data
        return newState;
      }),
    setOtpCode: (code: string) =>
      set((state) => {
        const newState = {
          ...state,
          otpCode: code,
        };
        saveAuthToStorage(newState); // Persist OTP code
        return newState;
      }),
  };
});
