import { create } from 'zustand';
import type { User } from '../types/auth.types';

interface AuthState {
  token: string | null;
  user: User | null;
  isAuth: () => boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
  setToken: (token: string) => void;
}

export const useAuthStore = create<AuthState>()((set, get) => ({
  token: null,
  user: null,
  isAuth: () => !!get().token,
  login: (token, user) => set({ token, user }),
  logout: () => set({ token: null, user: null }),
  setToken: (token) => set({ token }),
}));
