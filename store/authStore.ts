// store/authStore.ts
import { create } from "zustand";

type AuthState = {
  isAuthenticated: boolean;
  userId: string | null;
  userName?: string | null;
  login: (userId: string) => void;
  logout: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  userId: null,
  login: (userId: string) =>
    set(() => ({ isAuthenticated: true, userId, userName: "MSajiba" })),
  logout: () =>
    set(() => ({ isAuthenticated: false, userId: null, userName: null })),
}));
