import { ContactShadows } from '@react-three/drei'
import { useLightingStore, useRenderStore, useEnvironmentStore } from '@/store'
import { useSceneStore } from '@/store'

export default function LightingRig() {
  const { lights } = useLightingStore()
  const { config } = useRenderStore()
  const { models } = useSceneStore()
  const { backgroundType } = useEnvironmentStore()
  const hasModels = models.length > 0

  // Only show ground shadows when using solid/transparent backgrounds
  const showGroundShadows = backgroundType !== 'environment'

  return (
    <>
      {lights
        .filter((light) => light.visible)
        .map((light) => {
          switch (light.type) {
            case 'ambient':
              return (
                <ambientLight key={light.id} color={light.color} intensity={light.intensity} />
              )

            case 'directional':
              return (
                <directionalLight
                  key={light.id}
                  color={light.color}
                  intensity={light.intensity}
                  position={light.position}
                  castShadow={light.castShadow && config.shadows}
                  shadow-mapSize-width={config.shadowMapSize}
                  shadow-mapSize-height={config.shadowMapSize}
                  shadow-camera-far={50}
                  shadow-camera-near={0.1}
                  shadow-camera-left={-10}
                  shadow-camera-right={10}
                  shadow-camera-top={10}
                  shadow-camera-bottom={-10}
                  shadow-bias={-0.0001}
                />
              )

            case 'point':
              return (
                <pointLight
                  key={light.id}
                  color={light.color}
                  intensity={light.intensity}
                  position={light.position}
                  castShadow={light.castShadow && config.shadows}
                  shadow-mapSize-width={config.shadowMapSize}
                  shadow-mapSize-height={config.shadowMapSize}
                  shadow-bias={-0.0001}
                  decay={2}
                  distance={0}
                />
              )

            case 'spot':
              return (
                <spotLight
                  key={light.id}
                  color={light.color}
                  intensity={light.intensity}
                  position={light.position}
                  castShadow={light.castShadow && config.shadows}
                  shadow-mapSize-width={config.shadowMapSize}
                  shadow-mapSize-height={config.shadowMapSize}
                  shadow-bias={-0.0001}
                  angle={Math.PI / 6}
                  penumbra={0.5}
                  decay={2}
                  distance={0}
                />
              )

            default:
              return null
          }
        })}

      {/* Contact shadows for realistic grounding - only on solid/transparent backgrounds */}
      {config.shadows && hasModels && showGroundShadows && (
        <ContactShadows
          position={[0, -0.001, 0]}
          opacity={0.5}
          scale={10}
          blur={2}
          far={4}
          resolution={512}
          color="#000000"
        />
      )}

      {/* Shadow-receiving ground plane - only on solid/transparent backgrounds */}
      {config.shadows && showGroundShadows && (
        <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.002, 0]}>
          <planeGeometry args={[50, 50]} />
          <shadowMaterial transparent opacity={0.3} />
        </mesh>
      )}
    </>
  )
}
