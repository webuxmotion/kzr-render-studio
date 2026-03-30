import { useEffect, useRef, useMemo } from 'react'
import { useLoader, useThree } from '@react-three/fiber'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import { useAnimations } from '@react-three/drei'
import { Box3, Vector3, Mesh, MeshStandardMaterial, MeshPhysicalMaterial, Color, Group, PerspectiveCamera } from 'three'
import { useSceneStore } from '@/store'
import type { MaterialOverride, LoadedModel } from '@/types'

// Configure Draco loader
const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.6/')

export default function ModelViewer() {
  const { models, materials, setMaterials, selectedModelId } = useSceneStore()
  const hasSetCamera = useRef(false)

  // Fit camera to all models on first load
  useEffect(() => {
    if (models.length > 0 && !hasSetCamera.current) {
      hasSetCamera.current = true
    }
  }, [models.length])

  // Reset camera flag when all models are removed
  useEffect(() => {
    if (models.length === 0) {
      hasSetCamera.current = false
    }
  }, [models.length])

  if (models.length === 0) {
    return null
  }

  return (
    <>
      {models.map((model) => (
        <Model
          key={model.id}
          modelData={model}
          materials={materials}
          setMaterials={setMaterials}
          isSelected={model.id === selectedModelId}
          isFirst={models[0].id === model.id}
        />
      ))}
    </>
  )
}

interface ModelProps {
  modelData: LoadedModel
  materials: MaterialOverride[]
  setMaterials: (materials: MaterialOverride[]) => void
  isSelected: boolean
  isFirst: boolean
}

function Model({ modelData, materials, setMaterials, isSelected, isFirst }: ModelProps) {
  const groupRef = useRef<Group>(null)
  const { camera } = useThree()
  const { setLoading, selectModel } = useSceneStore()

  const gltf = useLoader(GLTFLoader, modelData.url, (loader) => {
    loader.setDRACOLoader(dracoLoader)
  })

  const { actions, names } = useAnimations(gltf.animations, groupRef)

  // Extract materials from the model (only for selected model)
  useEffect(() => {
    if (!gltf.scene || !isSelected) return

    const extractedMaterials: MaterialOverride[] = []
    const seen = new Set<string>()

    gltf.scene.traverse((child) => {
      if (child instanceof Mesh && child.material) {
        const mats = Array.isArray(child.material) ? child.material : [child.material]

        mats.forEach((mat) => {
          if (mat instanceof MeshStandardMaterial || mat instanceof MeshPhysicalMaterial) {
            const id = mat.uuid
            if (seen.has(id)) return
            seen.add(id)

            const color = mat.color instanceof Color ? `#${mat.color.getHexString()}` : '#ffffff'
            const emissive =
              mat.emissive instanceof Color ? `#${mat.emissive.getHexString()}` : '#000000'

            extractedMaterials.push({
              id,
              name: mat.name || `Material ${extractedMaterials.length + 1}`,
              color,
              metalness: mat.metalness ?? 0,
              roughness: mat.roughness ?? 1,
              envMapIntensity: mat.envMapIntensity ?? 1,
              emissive,
              emissiveIntensity: mat.emissiveIntensity ?? 1,
              transparent: mat.transparent ?? false,
              opacity: mat.opacity ?? 1,
              clearcoat: mat instanceof MeshPhysicalMaterial ? mat.clearcoat ?? 0 : 0,
              clearcoatRoughness:
                mat instanceof MeshPhysicalMaterial ? mat.clearcoatRoughness ?? 0 : 0,
              transmission: mat instanceof MeshPhysicalMaterial ? mat.transmission ?? 0 : 0,
              ior: mat instanceof MeshPhysicalMaterial ? mat.ior ?? 1.5 : 1.5,
            })
          }
        })
      }
    })

    setMaterials(extractedMaterials)
    setLoading(false)
  }, [gltf.scene, setMaterials, setLoading, isSelected])

  // Apply material overrides
  useEffect(() => {
    if (!gltf.scene || materials.length === 0) return

    gltf.scene.traverse((child) => {
      if (child instanceof Mesh && child.material) {
        const mats = Array.isArray(child.material) ? child.material : [child.material]

        mats.forEach((mat) => {
          const override = materials.find((m) => m.id === mat.uuid)
          if (!override) return

          if (mat instanceof MeshStandardMaterial || mat instanceof MeshPhysicalMaterial) {
            mat.color.set(override.color)
            mat.metalness = override.metalness
            mat.roughness = override.roughness
            mat.envMapIntensity = override.envMapIntensity
            mat.emissive.set(override.emissive)
            mat.emissiveIntensity = override.emissiveIntensity
            mat.transparent = override.transparent || override.transmission > 0
            mat.opacity = override.opacity

            if (mat instanceof MeshPhysicalMaterial) {
              mat.clearcoat = override.clearcoat
              mat.clearcoatRoughness = override.clearcoatRoughness
              mat.transmission = override.transmission
              mat.ior = override.ior
            }

            mat.needsUpdate = true
          }
        })
      }
    })
  }, [gltf.scene, materials])

  // Fit camera to model (only for first model loaded)
  useEffect(() => {
    if (!gltf.scene || !isFirst) return

    const box = new Box3().setFromObject(gltf.scene)
    const size = box.getSize(new Vector3())
    const height = size.y
    const maxDim = Math.max(size.x, size.y, size.z)
    const perspCamera = camera as PerspectiveCamera
    const fov = perspCamera.fov * (Math.PI / 180)
    let distance = maxDim / (2 * Math.tan(fov / 2))
    distance *= 1.8 // Add padding

    // Look at center of model (which is now at origin, height/2 up)
    const lookAtPoint = new Vector3(0, height / 2, 0)
    camera.position.set(distance * 0.6, height / 2 + distance * 0.3, distance)
    camera.lookAt(lookAtPoint)
    camera.updateProjectionMatrix()
  }, [gltf.scene, camera, isFirst])

  // Play animations if available
  useEffect(() => {
    if (names.length > 0 && actions[names[0]]) {
      actions[names[0]]?.play()
    }
    return () => {
      names.forEach((name) => actions[name]?.stop())
    }
  }, [actions, names])

  // Enable shadows on meshes
  useEffect(() => {
    gltf.scene.traverse((child) => {
      if (child instanceof Mesh) {
        child.castShadow = true
        child.receiveShadow = true
      }
    })
  }, [gltf.scene])

  // Calculate bottom offset to place model on ground
  const offsets = useMemo(() => {
    const box = new Box3().setFromObject(gltf.scene)
    const bottomY = box.min.y
    const centerX = (box.max.x + box.min.x) / 2
    const centerZ = (box.max.z + box.min.z) / 2
    return { bottomY, centerX, centerZ }
  }, [gltf.scene])

  const handleClick = (e: { stopPropagation: () => void }) => {
    e.stopPropagation()
    selectModel(modelData.id)
  }

  return (
    <group
      position={[
        modelData.position[0] - offsets.centerX,
        modelData.position[1] - offsets.bottomY,
        modelData.position[2] - offsets.centerZ,
      ]}
      rotation={modelData.rotation}
      scale={modelData.scale}
      visible={modelData.visible}
      onClick={handleClick}
    >
      <group ref={groupRef}>
        <primitive object={gltf.scene} />
      </group>
    </group>
  )
}
