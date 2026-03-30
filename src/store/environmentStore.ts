import { create } from 'zustand'
import type { EnvironmentConfig } from '@/types'

export const ENVIRONMENT_PRESETS = [
  { id: 'studio', name: 'Studio', preset: 'studio' },
  { id: 'city', name: 'City', preset: 'city' },
  { id: 'sunset', name: 'Sunset', preset: 'sunset' },
  { id: 'dawn', name: 'Dawn', preset: 'dawn' },
  { id: 'night', name: 'Night', preset: 'night' },
  { id: 'warehouse', name: 'Warehouse', preset: 'warehouse' },
  { id: 'forest', name: 'Forest', preset: 'forest' },
  { id: 'apartment', name: 'Apartment', preset: 'apartment' },
  { id: 'park', name: 'Park', preset: 'park' },
  { id: 'lobby', name: 'Lobby', preset: 'lobby' },
] as const

const defaultConfig: EnvironmentConfig = {
  preset: 'studio',
  customHdr: null,
  intensity: 1,
  background: true,
  backgroundBlur: 0,
  backgroundColor: '#f0f0f0',
  backgroundType: 'solid',
}

interface EnvironmentState extends EnvironmentConfig {
  setPreset: (preset: string | null) => void
  setCustomHdr: (hdr: string | null) => void
  setIntensity: (intensity: number) => void
  setBackground: (show: boolean) => void
  setBackgroundBlur: (blur: number) => void
  setBackgroundColor: (color: string) => void
  setBackgroundType: (type: EnvironmentConfig['backgroundType']) => void
  reset: () => void
}

export const useEnvironmentStore = create<EnvironmentState>((set) => ({
  ...defaultConfig,

  setPreset: (preset) => set({ preset, customHdr: null }),
  setCustomHdr: (customHdr) => set({ customHdr, preset: null }),
  setIntensity: (intensity) => set({ intensity }),
  setBackground: (background) => set({ background }),
  setBackgroundBlur: (backgroundBlur) => set({ backgroundBlur }),
  setBackgroundColor: (backgroundColor) => set({ backgroundColor }),
  setBackgroundType: (backgroundType) => set({ backgroundType }),
  reset: () => set(defaultConfig),
}))
