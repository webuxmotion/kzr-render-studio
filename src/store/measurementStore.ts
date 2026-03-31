import { create } from 'zustand'

export type MeasurementType = 'linear' | 'diameter'

export interface Measurement {
  id: string
  type: MeasurementType
  start: [number, number, number]
  end: [number, number, number]
  label: string
  color: string
  visible: boolean
}

interface MeasurementState {
  measurements: Measurement[]
  isAddingMeasurement: boolean
  measurementType: MeasurementType
  pendingPoint: [number, number, number] | null
  snapEnabled: boolean
  snapPoint: [number, number, number] | null
  unit: 'mm' | 'cm' | 'm' | 'in'

  addMeasurement: (start: [number, number, number], end: [number, number, number]) => void
  removeMeasurement: (id: string) => void
  updateMeasurement: (id: string, updates: Partial<Measurement>) => void
  clearMeasurements: () => void
  setIsAddingMeasurement: (adding: boolean) => void
  setMeasurementType: (type: MeasurementType) => void
  setPendingPoint: (point: [number, number, number] | null) => void
  setSnapEnabled: (enabled: boolean) => void
  setSnapPoint: (point: [number, number, number] | null) => void
  setUnit: (unit: 'mm' | 'cm' | 'm' | 'in') => void
}

let measurementIdCounter = 0
const generateMeasurementId = () => `measurement-${++measurementIdCounter}`

const calculateDistance = (start: [number, number, number], end: [number, number, number]): number => {
  const dx = end[0] - start[0]
  const dy = end[1] - start[1]
  const dz = end[2] - start[2]
  return Math.sqrt(dx * dx + dy * dy + dz * dz)
}

const formatDistance = (distance: number, unit: 'mm' | 'cm' | 'm' | 'in', type: MeasurementType): string => {
  // Assume model units are in meters (Three.js default)
  // For diameter, the measured distance is radius (center to edge), so multiply by 2
  const actualDistance = type === 'diameter' ? distance * 2 : distance
  let value: number
  let suffix: string
  const prefix = type === 'diameter' ? 'Ø ' : ''

  switch (unit) {
    case 'mm':
      value = actualDistance * 1000
      suffix = 'mm'
      break
    case 'cm':
      value = actualDistance * 100
      suffix = 'cm'
      break
    case 'm':
      value = actualDistance
      suffix = 'm'
      break
    case 'in':
      value = actualDistance * 39.3701
      suffix = 'in'
      break
  }

  return `${prefix}${value.toFixed(1)} ${suffix}`
}

export const useMeasurementStore = create<MeasurementState>((set, get) => ({
  measurements: [],
  isAddingMeasurement: false,
  measurementType: 'linear',
  pendingPoint: null,
  snapEnabled: true,
  snapPoint: null,
  unit: 'mm',

  addMeasurement: (start, end) => {
    const state = get()
    const distance = calculateDistance(start, end)
    const label = formatDistance(distance, state.unit, state.measurementType)

    const newMeasurement: Measurement = {
      id: generateMeasurementId(),
      type: state.measurementType,
      start,
      end,
      label,
      color: state.measurementType === 'diameter' ? '#ff6600' : '#00aaff',
      visible: true,
    }

    set((state) => ({
      measurements: [...state.measurements, newMeasurement],
      isAddingMeasurement: false,
      pendingPoint: null,
      snapPoint: null,
    }))
  },

  removeMeasurement: (id) => {
    set((state) => ({
      measurements: state.measurements.filter((m) => m.id !== id),
    }))
  },

  updateMeasurement: (id, updates) => {
    set((state) => ({
      measurements: state.measurements.map((m) =>
        m.id === id ? { ...m, ...updates } : m
      ),
    }))
  },

  clearMeasurements: () => {
    set({ measurements: [], pendingPoint: null, isAddingMeasurement: false, snapPoint: null })
  },

  setIsAddingMeasurement: (adding) => {
    set({ isAddingMeasurement: adding, pendingPoint: null, snapPoint: null })
  },

  setMeasurementType: (type) => {
    set({ measurementType: type, pendingPoint: null, snapPoint: null })
  },

  setPendingPoint: (point) => {
    set({ pendingPoint: point })
  },

  setSnapEnabled: (enabled) => {
    set({ snapEnabled: enabled })
  },

  setSnapPoint: (point) => {
    set({ snapPoint: point })
  },

  setUnit: (unit) => {
    // Recalculate all labels with new unit
    set((state) => ({
      unit,
      measurements: state.measurements.map((m) => ({
        ...m,
        label: formatDistance(calculateDistance(m.start, m.end), unit, m.type),
      })),
    }))
  },
}))
