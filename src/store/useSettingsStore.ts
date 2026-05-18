import { create } from 'zustand'
import type { SettingsState } from '@/types/settings'

export const useSettingsStore = create<SettingsState>((set) => ({
  minimumAgeInHours: null,
  setMinimumAgeInHours: (minimumAgeInHours) => set({ minimumAgeInHours }),
}))
