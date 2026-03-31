import { useMemo, useRef } from 'react'
import { Text, Line } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import { Vector3, Group } from 'three'
import type { Measurement } from '@/store/measurementStore'

interface Measurement3DProps {
  measurement: Measurement
}

export default function Measurement3D({ measurement }: Measurement3DProps) {
  const { start, end, label, color, visible, type } = measurement
  const textRef = useRef<Group>(null)
  const { camera } = useThree()

  // Calculate distance for scaling
  const distance = useMemo(() => {
    const dx = end[0] - start[0]
    const dy = end[1] - start[1]
    const dz = end[2] - start[2]
    return Math.sqrt(dx * dx + dy * dy + dz * dz)
  }, [start, end])

  // Scale factors based on distance (smaller for small measurements)
  const scale = Math.max(0.001, Math.min(distance * 0.03, 0.01))
  const pointSize = scale * 0.3
  const lineOffset = scale * 3
  const fontSize = Math.max(0.004, Math.min(distance * 0.08, 0.015))

  // Calculate midpoint for label position
  const midpoint = useMemo(() => {
    return [
      (start[0] + end[0]) / 2,
      (start[1] + end[1]) / 2,
      (start[2] + end[2]) / 2,
    ] as [number, number, number]
  }, [start, end])

  // Calculate offset direction (perpendicular to line)
  const { offset, linePoints } = useMemo(() => {
    const startVec = new Vector3(...start)
    const endVec = new Vector3(...end)
    const direction = endVec.clone().sub(startVec).normalize()

    // Get perpendicular direction (cross with up or right)
    let perpendicular = new Vector3(0, 1, 0).cross(direction)
    if (perpendicular.length() < 0.1) {
      perpendicular = new Vector3(1, 0, 0).cross(direction)
    }
    perpendicular.normalize().multiplyScalar(lineOffset)

    // Create offset points for dimension line style
    const offsetStart = startVec.clone().add(perpendicular)
    const offsetEnd = endVec.clone().add(perpendicular)

    return {
      offset: perpendicular,
      linePoints: [
        // Main line
        [offsetStart.toArray(), offsetEnd.toArray()],
        // Start tick
        [startVec.toArray(), offsetStart.toArray()],
        // End tick
        [endVec.toArray(), offsetEnd.toArray()],
      ] as [[number, number, number], [number, number, number]][],
    }
  }, [start, end, lineOffset])

  // Make text always face camera
  useFrame(() => {
    if (textRef.current) {
      textRef.current.lookAt(camera.position)
    }
  })

  if (!visible) return null

  const labelPosition: [number, number, number] = [
    midpoint[0] + offset.x * 1.5,
    midpoint[1] + offset.y * 1.5 + fontSize,
    midpoint[2] + offset.z * 1.5,
  ]

  // Diameter measurement rendering
  if (type === 'diameter') {
    const center = start
    // Calculate the opposite point for full diameter visualization
    const direction = new Vector3(
      end[0] - start[0],
      end[1] - start[1],
      end[2] - start[2]
    )
    const oppositeEnd: [number, number, number] = [
      start[0] - direction.x,
      start[1] - direction.y,
      start[2] - direction.z,
    ]

    return (
      <group userData={{ isMeasurement: true }}>
        {/* Center point */}
        <mesh position={center}>
          <sphereGeometry args={[pointSize * 0.7, 12, 12]} />
          <meshBasicMaterial color={color} />
        </mesh>

        {/* Full diameter line (through center) */}
        <Line
          points={[oppositeEnd, end]}
          color={color}
          lineWidth={1.5}
        />

        {/* Edge points */}
        <mesh position={end}>
          <sphereGeometry args={[pointSize, 12, 12]} />
          <meshBasicMaterial color={color} />
        </mesh>
        <mesh position={oppositeEnd}>
          <sphereGeometry args={[pointSize, 12, 12]} />
          <meshBasicMaterial color={color} />
        </mesh>

        {/* Label */}
        <group ref={textRef} position={labelPosition}>
          <mesh position={[0, 0, -0.0005]}>
            <planeGeometry args={[label.length * fontSize * 0.6 + fontSize, fontSize * 1.4]} />
            <meshBasicMaterial color="#ffffff" opacity={0.95} transparent />
          </mesh>
          <Text
            fontSize={fontSize}
            color="#000000"
            anchorX="center"
            anchorY="middle"
          >
            {label}
          </Text>
        </group>
      </group>
    )
  }

  // Linear measurement rendering
  return (
    <group userData={{ isMeasurement: true }}>
      {/* Main dimension line */}
      <Line
        points={linePoints[0]}
        color={color}
        lineWidth={1.5}
      />

      {/* Start tick line */}
      <Line
        points={linePoints[1]}
        color={color}
        lineWidth={1.5}
      />

      {/* End tick line */}
      <Line
        points={linePoints[2]}
        color={color}
        lineWidth={1.5}
      />

      {/* Small measurement points at endpoints */}
      <mesh position={start}>
        <sphereGeometry args={[pointSize, 12, 12]} />
        <meshBasicMaterial color={color} />
      </mesh>
      <mesh position={end}>
        <sphereGeometry args={[pointSize, 12, 12]} />
        <meshBasicMaterial color={color} />
      </mesh>

      {/* Label with background */}
      <group ref={textRef} position={labelPosition}>
        {/* Background plane */}
        <mesh position={[0, 0, -0.0005]}>
          <planeGeometry args={[label.length * fontSize * 0.6 + fontSize, fontSize * 1.4]} />
          <meshBasicMaterial color="#ffffff" opacity={0.95} transparent />
        </mesh>

        {/* Text */}
        <Text
          fontSize={fontSize}
          color="#000000"
          anchorX="center"
          anchorY="middle"
        >
          {label}
        </Text>
      </group>
    </group>
  )
}
