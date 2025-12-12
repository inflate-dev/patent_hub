'use client';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  email: string;
  token: string;
  name: string;
}

interface AppState {
  user: User | null;
  setUser: (user: User) => void;
  clearUser: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user: User) => set({ user }),
      clearUser: () => set({ user: null }),
    }),
    {
      name: 'user-storage', // localStorage に保存されるキー名
    }
  )
);