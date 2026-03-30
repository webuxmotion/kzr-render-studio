import { create } from 'zustand'
import type { RenderConfig, ExportOptions } from '@/types'

const defaultRenderConfig: RenderConfig = {
  shadows: true,
  shadowMapSize: 2048,
  toneMapping: true,
  toneMappingExposure: 1,
  ssao: true,
  ssaoIntensity: 15,
  bloom: false,
  bloomIntensity: 0.5,
  bloomThreshold: 0.9,
}

const defaultExportOptions: ExportOptions = {
  format: 'png',
  quality: 0.92,
  scale: 1,
  transparentBackground: false,
}

interface RenderState {
  config: RenderConfig
  exportOptions: ExportOptions

  updateConfig: (updates: Partial<RenderConfig>) => void
  updateExportOptions: (updates: Partial<ExportOptions>) => void
  resetConfig: () => void
}

export const useRenderStore = create<RenderState>((set) => ({
  config: defaultRenderConfig,
  exportOptions: defaultExportOptions,

  updateConfig: (updates) =>
    set((state) => ({ config: { ...state.config, ...updates } })),

  updateExportOptions: (updates) =>
    set((state) => ({ exportOptions: { ...state.exportOptions, ...updates } })),

  resetConfig: () => set({ config: defaultRenderConfig }),
}))
