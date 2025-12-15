'use client'

import { create } from 'zustand'

interface UserUI {
  id: string
  email: string
  name: string
}

interface AppState {
  user: UserUI | null
  setUser: (user: UserUI | null) => void
  clearUser: () => void
}

export const useAppStore = create<AppState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  clearUser: () => set({ user: null }),
}))
