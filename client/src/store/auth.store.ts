import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  token: string | null;
  userId: string | null;
  role: string | null;
  isAuth: () => boolean;
  setAuth: (token: string, userId: string, role: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      userId: null,
      role: null,
      isAuth: () => !!get().token,
      setAuth: (token, userId, role) => set({ token, userId, role }),
      logout: () => set({ token: null, userId: null, role: null }),
    }),
    {
      name: 'auth-storage',
    }
  )
);

