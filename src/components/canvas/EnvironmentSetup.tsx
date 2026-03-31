import { useEffect, useState } from 'react'
import { Environment } from '@react-three/drei'
import { useThree } from '@react-three/fiber'
import { Color } from 'three'
import { useEnvironmentStore } from '@/store'

type EnvironmentPreset =
  | 'sunset'
  | 'dawn'
  | 'night'
  | 'warehouse'
  | 'forest'
  | 'apartment'
  | 'studio'
  | 'city'
  | 'park'
  | 'lobby'

export default function EnvironmentSetup() {
  const { preset, customHdr, intensity, background, backgroundBlur, backgroundType, backgroundColor } =
    useEnvironmentStore()
  const { scene, gl } = useThree()
  const [mounted, setMounted] = useState(false)

  // Delay environment rendering to ensure Canvas is fully mounted
  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 100)
    return () => clearTimeout(timer)
  }, [])

  // Handle background color/transparency
  useEffect(() => {
    if (backgroundType === 'solid') {
      scene.background = new Color(backgroundColor)
      gl.setClearColor(backgroundColor, 1)
    } else if (backgroundType === 'transparent') {
      scene.background = null
      gl.setClearColor(0x000000, 0)
    } else {
      // For 'environment' type, clear manual background so Environment component can set it
      scene.background = null
    }
  }, [backgroundType, backgroundColor, scene, gl])

  // Wait for Canvas to fully mount before rendering Environment
  if (!mounted) return null

  // Don't render environment background if using solid color or transparent
  if (backgroundType === 'solid' || backgroundType === 'transparent') {
    if (!preset) return null
    return (
      <Environment
        preset={preset as EnvironmentPreset}
        background={false}
        environmentIntensity={intensity}
      />
    )
  }

  if (customHdr) {
    return (
      <Environment
        files={customHdr}
        background={background}
        backgroundBlurriness={backgroundBlur}
        environmentIntensity={intensity}
      />
    )
  }

  if (preset) {
    return (
      <Environment
        preset={preset as EnvironmentPreset}
        background={background}
        backgroundBlurriness={backgroundBlur}
        environmentIntensity={intensity}
      />
    )
  }

  return null
}
