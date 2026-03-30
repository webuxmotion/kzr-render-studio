import { create } from 'zustand'
import type { LightConfig } from '@/types'

const defaultLights: LightConfig[] = [
  {
    id: 'ambient-1',
    type: 'ambient',
    color: '#ffffff',
    intensity: 0.4,
    position: [0, 0, 0],
    castShadow: false,
    visible: true,
  },
  {
    id: 'directional-1',
    type: 'directional',
    color: '#ffffff',
    intensity: 1.5,
    position: [5, 8, 5],
    castShadow: true,
    visible: true,
  },
  {
    id: 'directional-2',
    type: 'directional',
    color: '#b4c6e0',
    intensity: 0.5,
    position: [-5, 3, -5],
    castShadow: false,
    visible: true,
  },
]

interface LightingState {
  lights: LightConfig[]
  selectedLightId: string | null

  addLight: (type: LightConfig['type']) => void
  removeLight: (id: string) => void
  updateLight: (id: string, updates: Partial<LightConfig>) => void
  setSelectedLight: (id: string | null) => void
  resetLights: () => void
}

let lightCounter = 3

export const useLightingStore = create<LightingState>((set) => ({
  lights: defaultLights,
  selectedLightId: null,

  addLight: (type) => {
    const id = `${type}-${++lightCounter}`
    const newLight: LightConfig = {
      id,
      type,
      color: '#ffffff',
      intensity: type === 'ambient' ? 0.5 : 1,
      position: [0, 5, 0],
      castShadow: type !== 'ambient',
      visible: true,
    }
    set((state) => ({ lights: [...state.lights, newLight] }))
  },

  removeLight: (id) =>
    set((state) => ({
      lights: state.lights.filter((l) => l.id !== id),
      selectedLightId: state.selectedLightId === id ? null : state.selectedLightId,
    })),

  updateLight: (id, updates) =>
    set((state) => ({
      lights: state.lights.map((l) => (l.id === id ? { ...l, ...updates } : l)),
    })),

  setSelectedLight: (selectedLightId) => set({ selectedLightId }),

  resetLights: () => set({ lights: defaultLights, selectedLightId: null }),
}))
