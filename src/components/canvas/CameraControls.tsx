import { OrbitControls } from '@react-three/drei'

export default function CameraControls() {
  return (
    <OrbitControls
      makeDefault
      enableDamping
      dampingFactor={0.05}
      minDistance={0.01}
      maxDistance={1000}
      minPolarAngle={0}
      maxPolarAngle={Math.PI}
      enablePan
      panSpeed={1}
      rotateSpeed={1}
      zoomSpeed={1.2}
    />
  )
}
