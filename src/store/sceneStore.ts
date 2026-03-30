import { create } from 'zustand'
import type { LoadedModel, MaterialOverride } from '@/types'

interface SceneState {
  models: LoadedModel[]
  selectedModelId: string | null
  isLoading: boolean
  error: string | null
  materials: MaterialOverride[]
  selectedMaterialId: string | null

  // Model actions
  addModel: (model: Omit<LoadedModel, 'id' | 'position' | 'rotation' | 'scale' | 'visible'>) => void
  removeModel: (id: string) => void
  updateModel: (id: string, updates: Partial<LoadedModel>) => void
  selectModel: (id: string | null) => void

  // Legacy single model support (returns first model)
  model: LoadedModel | null
  setModel: (model: Omit<LoadedModel, 'id' | 'position' | 'rotation' | 'scale' | 'visible'> | null) => void

  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  setMaterials: (materials: MaterialOverride[]) => void
  setSelectedMaterial: (id: string | null) => void
  updateMaterial: (id: string, updates: Partial<MaterialOverride>) => void
  clearScene: () => void
}

let modelIdCounter = 0
const generateModelId = () => `model-${++modelIdCounter}`

export const useSceneStore = create<SceneState>((set, get) => ({
  models: [],
  selectedModelId: null,
  isLoading: false,
  error: null,
  materials: [],
  selectedMaterialId: null,

  // Computed property for legacy support
  get model() {
    return get().models[0] || null
  },

  addModel: (modelData) => {
    const newModel: LoadedModel = {
      ...modelData,
      id: generateModelId(),
      position: [0, 0, 0],
      rotation: [0, 0, 0],
      scale: 1,
      visible: true,
    }
    set((state) => ({
      models: [...state.models, newModel],
      selectedModelId: newModel.id,
      error: null,
    }))
  },

  removeModel: (id) => {
    set((state) => {
      const newModels = state.models.filter((m) => m.id !== id)
      return {
        models: newModels,
        selectedModelId: state.selectedModelId === id
          ? (newModels[0]?.id || null)
          : state.selectedModelId,
      }
    })
  },

  updateModel: (id, updates) => {
    set((state) => ({
      models: state.models.map((m) =>
        m.id === id ? { ...m, ...updates } : m
      ),
    }))
  },

  selectModel: (id) => set({ selectedModelId: id }),

  // Legacy single model setter (clears all and adds new)
  setModel: (modelData) => {
    if (!modelData) {
      set({ models: [], selectedModelId: null, error: null })
      return
    }
    const newModel: LoadedModel = {
      ...modelData,
      id: generateModelId(),
      position: [0, 0, 0],
      rotation: [0, 0, 0],
      scale: 1,
      visible: true,
    }
    set({
      models: [newModel],
      selectedModelId: newModel.id,
      error: null,
    })
  },

  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error, isLoading: false }),
  setMaterials: (materials) => set({ materials }),
  setSelectedMaterial: (selectedMaterialId) => set({ selectedMaterialId }),
  updateMaterial: (id, updates) =>
    set((state) => ({
      materials: state.materials.map((m) =>
        m.id === id ? { ...m, ...updates } : m
      ),
    })),
  clearScene: () =>
    set({
      models: [],
      selectedModelId: null,
      materials: [],
      selectedMaterialId: null,
      error: null,
    }),
}))
