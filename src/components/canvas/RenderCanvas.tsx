import { Canvas } from '@react-three/fiber'
import { Suspense } from 'react'
import { NoToneMapping, SRGBColorSpace } from 'three'
import ModelViewer from './ModelViewer'
import EnvironmentSetup from './EnvironmentSetup'
import CameraControls from './CameraControls'
import LightingRig from './LightingRig'
import PostProcessing from './PostProcessing'
import DropZone from './DropZone'
import { useRenderStore, useEnvironmentStore } from '@/store'

export default function RenderCanvas() {
  const { config } = useRenderStore()
  const { backgroundColor, backgroundType } = useEnvironmentStore()

  return (
    <Canvas
      gl={{
        antialias: true,
        preserveDrawingBuffer: true,
        toneMapping: NoToneMapping,
        outputColorSpace: SRGBColorSpace,
        alpha: backgroundType === 'transparent',
      }}
      shadows={config.shadows ? 'soft' : false}
      camera={{ position: [3, 2, 5], fov: 45, near: 0.1, far: 1000 }}
      style={{
        background: backgroundType === 'solid' ? backgroundColor : undefined,
      }}
    >
      <Suspense fallback={null}>
        <SceneContent />
      </Suspense>
    </Canvas>
  )
}

function SceneContent() {
  return (
    <>
      <EnvironmentSetup />
      <LightingRig />
      <ModelViewer />
      <CameraControls />
      <PostProcessing />
      <DropZone />
    </>
  )
}
