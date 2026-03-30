import { create } from 'zustand'
import { useEnvironmentStore } from './environmentStore'
import { useLightingStore } from './lightingStore'
import { useRenderStore } from './renderStore'
import type { LightConfig } from '@/types'

export interface ScenePreset {
  id: string
  name: string
  description: string
  environment: {
    preset: string
    intensity: number
    backgroundType: 'environment' | 'solid' | 'transparent'
    backgroundColor: string
    background: boolean
    backgroundBlur: number
  }
  lights: LightConfig[]
  render: {
    shadows: boolean
    ssao: boolean
    bloom: boolean
    toneMapping: boolean
  }
}

export const SCENE_PRESETS: ScenePreset[] = [
  {
    id: 'studio-clean',
    name: 'Studio Clean',
    description: 'Clean white studio with soft lighting',
    environment: {
      preset: 'studio',
      intensity: 1,
      backgroundType: 'solid',
      backgroundColor: '#f5f5f5',
      background: false,
      backgroundBlur: 0,
    },
    lights: [
      { id: 'ambient-1', type: 'ambient', color: '#ffffff', intensity: 0.5, position: [0, 0, 0], castShadow: false, visible: true },
      { id: 'key-1', type: 'directional', color: '#ffffff', intensity: 1.5, position: [5, 8, 5], castShadow: true, visible: true },
      { id: 'fill-1', type: 'directional', color: '#e8f0ff', intensity: 0.6, position: [-5, 4, -3], castShadow: false, visible: true },
    ],
    render: { shadows: true, ssao: true, bloom: false, toneMapping: true },
  },
  {
    id: 'studio-dark',
    name: 'Studio Dark',
    description: 'Dark studio with dramatic lighting',
    environment: {
      preset: 'studio',
      intensity: 0.8,
      backgroundType: 'solid',
      backgroundColor: '#1a1a1a',
      background: false,
      backgroundBlur: 0,
    },
    lights: [
      { id: 'ambient-1', type: 'ambient', color: '#404040', intensity: 0.3, position: [0, 0, 0], castShadow: false, visible: true },
      { id: 'key-1', type: 'spot', color: '#ffffff', intensity: 2, position: [3, 6, 4], castShadow: true, visible: true },
      { id: 'rim-1', type: 'point', color: '#4488ff', intensity: 0.8, position: [-4, 3, -2], castShadow: false, visible: true },
    ],
    render: { shadows: true, ssao: true, bloom: true, toneMapping: true },
  },
  {
    id: 'product-showcase',
    name: 'Product Showcase',
    description: 'Professional product photography setup',
    environment: {
      preset: 'warehouse',
      intensity: 1.2,
      backgroundType: 'solid',
      backgroundColor: '#ffffff',
      background: false,
      backgroundBlur: 0,
    },
    lights: [
      { id: 'ambient-1', type: 'ambient', color: '#ffffff', intensity: 0.4, position: [0, 0, 0], castShadow: false, visible: true },
      { id: 'key-1', type: 'directional', color: '#fff8f0', intensity: 1.8, position: [4, 10, 6], castShadow: true, visible: true },
      { id: 'fill-1', type: 'directional', color: '#f0f4ff', intensity: 0.7, position: [-6, 5, 2], castShadow: false, visible: true },
      { id: 'back-1', type: 'point', color: '#ffffff', intensity: 0.5, position: [0, 3, -5], castShadow: false, visible: true },
    ],
    render: { shadows: true, ssao: true, bloom: false, toneMapping: true },
  },
  {
    id: 'outdoor-sunny',
    name: 'Outdoor Sunny',
    description: 'Bright outdoor daylight scene',
    environment: {
      preset: 'park',
      intensity: 1.5,
      backgroundType: 'environment',
      backgroundColor: '#87ceeb',
      background: true,
      backgroundBlur: 0.1,
    },
    lights: [
      { id: 'ambient-1', type: 'ambient', color: '#b4d7ff', intensity: 0.6, position: [0, 0, 0], castShadow: false, visible: true },
      { id: 'sun-1', type: 'directional', color: '#fff4e0', intensity: 2.5, position: [10, 15, 5], castShadow: true, visible: true },
    ],
    render: { shadows: true, ssao: false, bloom: true, toneMapping: true },
  },
  {
    id: 'sunset-warm',
    name: 'Sunset Warm',
    description: 'Golden hour sunset lighting',
    environment: {
      preset: 'sunset',
      intensity: 1.3,
      backgroundType: 'environment',
      backgroundColor: '#ff6b35',
      background: true,
      backgroundBlur: 0.2,
    },
    lights: [
      { id: 'ambient-1', type: 'ambient', color: '#ffaa77', intensity: 0.4, position: [0, 0, 0], castShadow: false, visible: true },
      { id: 'sun-1', type: 'directional', color: '#ff8844', intensity: 2, position: [15, 5, 0], castShadow: true, visible: true },
      { id: 'fill-1', type: 'directional', color: '#4477aa', intensity: 0.3, position: [-5, 3, 5], castShadow: false, visible: true },
    ],
    render: { shadows: true, ssao: true, bloom: true, toneMapping: true },
  },
  {
    id: 'night-scene',
    name: 'Night Scene',
    description: 'Nighttime with artificial lighting',
    environment: {
      preset: 'night',
      intensity: 0.5,
      backgroundType: 'environment',
      backgroundColor: '#0a0a1a',
      background: true,
      backgroundBlur: 0,
    },
    lights: [
      { id: 'ambient-1', type: 'ambient', color: '#1a1a2e', intensity: 0.2, position: [0, 0, 0], castShadow: false, visible: true },
      { id: 'spot-1', type: 'spot', color: '#ffcc88', intensity: 2, position: [3, 5, 3], castShadow: true, visible: true },
      { id: 'spot-2', type: 'point', color: '#4488ff', intensity: 1, position: [-4, 2, -2], castShadow: false, visible: true },
    ],
    render: { shadows: true, ssao: true, bloom: true, toneMapping: true },
  },
  {
    id: 'neon-glow',
    name: 'Neon Glow',
    description: 'Cyberpunk neon lighting',
    environment: {
      preset: 'city',
      intensity: 0.6,
      backgroundType: 'solid',
      backgroundColor: '#0d0d15',
      background: false,
      backgroundBlur: 0,
    },
    lights: [
      { id: 'ambient-1', type: 'ambient', color: '#1a0a2e', intensity: 0.3, position: [0, 0, 0], castShadow: false, visible: true },
      { id: 'neon-1', type: 'point', color: '#ff00ff', intensity: 2, position: [4, 2, 2], castShadow: false, visible: true },
      { id: 'neon-2', type: 'point', color: '#00ffff', intensity: 2, position: [-4, 2, -2], castShadow: false, visible: true },
      { id: 'key-1', type: 'spot', color: '#ffffff', intensity: 1, position: [0, 6, 4], castShadow: true, visible: true },
    ],
    render: { shadows: true, ssao: true, bloom: true, toneMapping: true },
  },
  {
    id: 'soft-gradient',
    name: 'Soft Gradient',
    description: 'Soft diffused lighting with gray background',
    environment: {
      preset: 'studio',
      intensity: 1.5,
      backgroundType: 'solid',
      backgroundColor: '#e0e0e0',
      background: false,
      backgroundBlur: 0,
    },
    lights: [
      { id: 'ambient-1', type: 'ambient', color: '#ffffff', intensity: 0.7, position: [0, 0, 0], castShadow: false, visible: true },
      { id: 'top-1', type: 'directional', color: '#ffffff', intensity: 1, position: [0, 10, 0], castShadow: true, visible: true },
      { id: 'front-1', type: 'directional', color: '#f8f8ff', intensity: 0.5, position: [0, 3, 8], castShadow: false, visible: true },
    ],
    render: { shadows: true, ssao: true, bloom: false, toneMapping: true },
  },
  {
    id: 'industrial',
    name: 'Industrial',
    description: 'Warehouse industrial lighting',
    environment: {
      preset: 'warehouse',
      intensity: 1,
      backgroundType: 'environment',
      backgroundColor: '#2a2a2a',
      background: true,
      backgroundBlur: 0.3,
    },
    lights: [
      { id: 'ambient-1', type: 'ambient', color: '#888888', intensity: 0.4, position: [0, 0, 0], castShadow: false, visible: true },
      { id: 'overhead-1', type: 'spot', color: '#ffffee', intensity: 2, position: [0, 8, 0], castShadow: true, visible: true },
      { id: 'side-1', type: 'point', color: '#ffeedd', intensity: 0.8, position: [6, 4, 0], castShadow: false, visible: true },
    ],
    render: { shadows: true, ssao: true, bloom: false, toneMapping: true },
  },
  {
    id: 'natural-light',
    name: 'Natural Light',
    description: 'Soft natural window lighting',
    environment: {
      preset: 'apartment',
      intensity: 1.2,
      backgroundType: 'solid',
      backgroundColor: '#f8f6f0',
      background: false,
      backgroundBlur: 0,
    },
    lights: [
      { id: 'ambient-1', type: 'ambient', color: '#fff8f0', intensity: 0.5, position: [0, 0, 0], castShadow: false, visible: true },
      { id: 'window-1', type: 'directional', color: '#fff8ee', intensity: 1.5, position: [8, 6, 2], castShadow: true, visible: true },
      { id: 'bounce-1', type: 'directional', color: '#f0f0ff', intensity: 0.4, position: [-4, 2, -4], castShadow: false, visible: true },
    ],
    render: { shadows: true, ssao: true, bloom: false, toneMapping: true },
  },
]

interface ScenePresetsState {
  activePresetId: string | null
  setActivePreset: (id: string | null) => void
  applyPreset: (preset: ScenePreset) => void
}

export const useScenePresetsStore = create<ScenePresetsState>((set) => ({
  activePresetId: null,

  setActivePreset: (id) => set({ activePresetId: id }),

  applyPreset: (preset) => {
    // Apply environment settings
    const envStore = useEnvironmentStore.getState()
    envStore.setPreset(preset.environment.preset)
    envStore.setIntensity(preset.environment.intensity)
    envStore.setBackgroundType(preset.environment.backgroundType)
    envStore.setBackgroundColor(preset.environment.backgroundColor)
    envStore.setBackground(preset.environment.background)
    envStore.setBackgroundBlur(preset.environment.backgroundBlur)

    // Apply lighting settings
    const lightStore = useLightingStore.getState()
    // Reset lights and apply preset lights
    lightStore.resetLights()
    // We need to modify the store to accept full light configs
    // For now, update via the store's internal state
    useLightingStore.setState({ lights: preset.lights })

    // Apply render settings
    const renderStore = useRenderStore.getState()
    renderStore.updateConfig({
      shadows: preset.render.shadows,
      ssao: preset.render.ssao,
      bloom: preset.render.bloom,
      toneMapping: preset.render.toneMapping,
    })

    set({ activePresetId: preset.id })
  },
}))
