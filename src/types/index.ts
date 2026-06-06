import type { Material } from 'three'
import type { GLTF } from 'three/examples/jsm/loaders/GLTFLoader.js'

export interface LoadedModel {
  id: string
  gltf: GLTF
  url: string
  name: string
  fileType?: 'gltf' | 'glb' | 'stl'
  position: [number, number, number]
  rotation: [number, number, number]
  scale: number
  visible: boolean
}

export interface LightConfig {
  id: string
  type: 'ambient' | 'directional' | 'point' | 'spot'
  color: string
  intensity: number
  position: [number, number, number]
  castShadow: boolean
  visible: boolean
}

export interface MaterialOverride {
  id: string
  name: string
  color: string
  metalness: number
  roughness: number
  envMapIntensity: number
  emissive: string
  emissiveIntensity: number
  transparent: boolean
  opacity: number
  clearcoat: number
  clearcoatRoughness: number
  transmission: number
  ior: number
}

export interface EnvironmentConfig {
  preset: string | null
  customHdr: string | null
  intensity: number
  background: boolean
  backgroundBlur: number
  backgroundColor: string
  backgroundType: 'environment' | 'solid' | 'transparent'
}

export interface CameraConfig {
  position: [number, number, number]
  target: [number, number, number]
  fov: number
  autoRotate: boolean
  autoRotateSpeed: number
}

export interface RenderConfig {
  shadows: boolean
  shadowMapSize: number
  toneMapping: boolean
  toneMappingExposure: number
  ssao: boolean
  ssaoIntensity: number
  bloom: boolean
  bloomIntensity: number
  bloomThreshold: number
}

export interface ExportOptions {
  format: 'png' | 'jpeg' | 'webp'
  quality: number
  scale: number
  transparentBackground: boolean
}

export type MaterialMap = Map<string, Material>
