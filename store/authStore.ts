// store/authStore.ts
import { create } from "zustand";

type AuthState = {
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

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  userId: null,
  userName: null,
  resetEmail: null,
  resetToken: null,
  otpCode: null,
  login: (
    userId: string,
    userName: string,
    userEmail: string,
    accessToken: string
  ) =>
    set(() => ({
      isAuthenticated: true,
      userId,
      userName,
      userEmail,
      accessToken,
    })),
  logout: () =>
    set(() => ({
      isAuthenticated: false,
      userId: null,
      userName: null,
      userEmail: null,
      accessToken: null,
      resetEmail: null,
      resetToken: null,
      otpCode: null,
      registerEmail: null,
      registerToken: null,
    })),

  // Setter for registration email and token
  setRegisterData: (email: string, token: string) =>
    set(() => ({ registerEmail: email, registerToken: token })),
  setResetData: (email: string, token: string) =>
    set(() => ({ resetEmail: email, resetToken: token })),
  setOtpCode: (code: string) => set(() => ({ otpCode: code })),
}));
