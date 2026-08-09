import { create } from "zustand";

import { clearAccessToken, getSession, setAccessToken } from "@/lib/auth";

export type AuthUser = {
  userId: string;
  role: "admin" | "customer";
};

type AuthState = {
  user: AuthUser | undefined;
  isReady: boolean;
  login: (token: string) => void;
  logout: () => void;
  hydrate: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: undefined,
  // false sampai sesi dari cookie selesai dibaca — mencegah UI
  // berkedip "belum login" padahal sebenarnya sudah.
  isReady: false,

  login: (token) => {
    setAccessToken(token);
    const session = getSession();
    set({
      user: session ? { userId: session.userId, role: session.role } : undefined,
      isReady: true,
    });
  },

  logout: () => {
    clearAccessToken();
    set({ user: undefined, isReady: true });
  },

  // Dipanggil sekali saat app load untuk memulihkan sesi dari cookie.
  hydrate: () => {
    const session = getSession();
    set({
      user: session ? { userId: session.userId, role: session.role } : undefined,
      isReady: true,
    });
  },
}));
