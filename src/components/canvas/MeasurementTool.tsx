import { useEffect, useCallback, useRef, useState, useMemo } from 'react'
import { useThree } from '@react-three/fiber'
import { Raycaster, Vector2, Vector3, BufferGeometry, Mesh, Line3, EdgesGeometry, Quaternion, Euler } from 'three'
import { useMeasurementStore, useSceneStore } from '@/store'
import Measurement3D from './Measurement3D'

interface EdgeData {
  geometry: EdgesGeometry
  position: [number, number, number]
  rotation: [number, number, number]
  scale: [number, number, number]
}

// Snap threshold in screen pixels
const SNAP_THRESHOLD_PX = 20

interface GeometryData {
  vertices: Vector3[]
  edges: Line3[]
}

export default function MeasurementTool() {
  const {
    measurements,
    isAddingMeasurement,
    pendingPoint,
    snapEnabled,
    snapPoint,
    addMeasurement,
    setPendingPoint,
    setSnapPoint,
  } = useMeasurementStore()
  const { models } = useSceneStore()
  const { camera, gl, scene } = useThree()
  const [geometryData, setGeometryData] = useState<GeometryData>({ vertices: [], edges: [] })
  const extractionTimeoutRef = useRef<number | null>(null)

  // Extract vertices and edges from all visible meshes
  const extractGeometry = useCallback(() => {
    const vertices: Vector3[] = []
    const edges: Line3[] = []

    scene.traverse((obj) => {
      if (obj instanceof Mesh && obj.visible) {
        // Skip measurement objects and helpers
        let parent = obj.parent
        let shouldSkip = false
        while (parent) {
          if (parent.userData?.isMeasurement || parent.userData?.isHelper) {
            shouldSkip = true
            break
          }
          parent = parent.parent
        }
        if (shouldSkip) return
        if (obj.userData?.isMeasurement || obj.userData?.isHelper) return

        const geometry = obj.geometry as BufferGeometry
        if (!geometry.attributes.position) return

        const positions = geometry.attributes.position
        const matrixWorld = obj.matrixWorld

        // Extract unique vertices
        const seenVertices = new Set<string>()
        for (let i = 0; i < positions.count; i++) {
          const v = new Vector3(
            positions.getX(i),
            positions.getY(i),
            positions.getZ(i)
          ).applyMatrix4(matrixWorld)

          const key = `${v.x.toFixed(3)},${v.y.toFixed(3)},${v.z.toFixed(3)}`
          if (!seenVertices.has(key)) {
            seenVertices.add(key)
            vertices.push(v)
          }
        }

        // Extract edges from indexed geometry
        if (geometry.index) {
          const indices = geometry.index.array
          const seenEdges = new Set<string>()

          for (let i = 0; i < indices.length; i += 3) {
            const triIndices = [indices[i], indices[i + 1], indices[i + 2]]

            for (let j = 0; j < 3; j++) {
              const i1 = triIndices[j]
              const i2 = triIndices[(j + 1) % 3]

              const edgeKey = i1 < i2 ? `${i1}-${i2}` : `${i2}-${i1}`
              if (seenEdges.has(edgeKey)) continue
              seenEdges.add(edgeKey)

              const v1 = new Vector3(
                positions.getX(i1),
                positions.getY(i1),
                positions.getZ(i1)
              ).applyMatrix4(matrixWorld)

              const v2 = new Vector3(
                positions.getX(i2),
                positions.getY(i2),
                positions.getZ(i2)
              ).applyMatrix4(matrixWorld)

              edges.push(new Line3(v1, v2))
            }
          }
        }
      }
    })

    setGeometryData({ vertices, edges })
  }, [scene])

  // Re-extract geometry when models change (with delay to ensure scene is rendered)
  useEffect(() => {
    if (extractionTimeoutRef.current) {
      clearTimeout(extractionTimeoutRef.current)
    }

    // Delay extraction to ensure Three.js scene has updated
    extractionTimeoutRef.current = window.setTimeout(() => {
      extractGeometry()
    }, 100)

    return () => {
      if (extractionTimeoutRef.current) {
        clearTimeout(extractionTimeoutRef.current)
      }
    }
  }, [models, extractGeometry])

  // Find snap point near cursor (screen-space comparison)
  const findSnapPoint = useCallback(
    (screenPos: Vector2): Vector3 | null => {
      if (!snapEnabled) return null
      if (geometryData.vertices.length === 0) return null

      let closestVertex: Vector3 | null = null
      let closestDistPx = SNAP_THRESHOLD_PX

      const width = gl.domElement.clientWidth
      const height = gl.domElement.clientHeight

      // Check vertices - prioritize vertices over edge midpoints
      for (const vertex of geometryData.vertices) {
        const screenVertex = vertex.clone().project(camera)

        // Skip vertices behind the camera
        if (screenVertex.z > 1) continue

        const screenX = (screenVertex.x + 1) / 2 * width
        const screenY = (-screenVertex.y + 1) / 2 * height

        const distPx = Math.sqrt(
          Math.pow(screenX - screenPos.x, 2) +
          Math.pow(screenY - screenPos.y, 2)
        )

        if (distPx < closestDistPx) {
          closestDistPx = distPx
          closestVertex = vertex.clone()
        }
      }

      // If we found a vertex within half the threshold, use it (prioritize vertices)
      if (closestVertex && closestDistPx < SNAP_THRESHOLD_PX / 2) {
        return closestVertex
      }

      // Check edges for midpoints
      for (const edge of geometryData.edges) {
        const midpoint = new Vector3().lerpVectors(edge.start, edge.end, 0.5)
        const screenMid = midpoint.clone().project(camera)

        // Skip midpoints behind the camera
        if (screenMid.z > 1) continue

        const screenMidX = (screenMid.x + 1) / 2 * width
        const screenMidY = (-screenMid.y + 1) / 2 * height

        const midDistPx = Math.sqrt(
          Math.pow(screenMidX - screenPos.x, 2) +
          Math.pow(screenMidY - screenPos.y, 2)
        )

        if (midDistPx < closestDistPx) {
          closestDistPx = midDistPx
          closestVertex = midpoint
        }
      }

      return closestVertex
    },
    [snapEnabled, geometryData, camera, gl]
  )

  // Update snap point on mouse move
  useEffect(() => {
    if (!isAddingMeasurement) {
      setSnapPoint(null)
      return
    }

    const handleMouseMove = (event: MouseEvent) => {
      const canvas = gl.domElement
      const rect = canvas.getBoundingClientRect()
      const screenPos = new Vector2(
        event.clientX - rect.left,
        event.clientY - rect.top
      )

      // Find snap point based on screen position (regardless of raycast hit)
      const snapPt = findSnapPoint(screenPos)
      if (snapPt) {
        setSnapPoint([snapPt.x, snapPt.y, snapPt.z])
      } else {
        setSnapPoint(null)
      }
    }

    const canvas = gl.domElement
    canvas.addEventListener('mousemove', handleMouseMove)

    return () => {
      canvas.removeEventListener('mousemove', handleMouseMove)
    }
  }, [isAddingMeasurement, gl, findSnapPoint, setSnapPoint])

  const handleCanvasClick = useCallback(
    (event: MouseEvent) => {
      if (!isAddingMeasurement) return
      if (models.length === 0) return

      const canvas = gl.domElement
      const rect = canvas.getBoundingClientRect()
      const screenPos = new Vector2(
        event.clientX - rect.left,
        event.clientY - rect.top
      )

      const mouse = new Vector2(
        ((event.clientX - rect.left) / rect.width) * 2 - 1,
        -((event.clientY - rect.top) / rect.height) * 2 + 1
      )

      // First try to snap to geometry
      const snapPt = findSnapPoint(screenPos)

      if (snapPt) {
        // Use snap point
        const clickedPoint: [number, number, number] = [snapPt.x, snapPt.y, snapPt.z]
        if (pendingPoint) {
          addMeasurement(pendingPoint, clickedPoint)
        } else {
          setPendingPoint(clickedPoint)
        }
        return
      }

      // If no snap, try raycast intersection
      const raycaster = new Raycaster()
      raycaster.setFromCamera(mouse, camera)

      const intersects = raycaster.intersectObjects(scene.children, true).filter((intersect) => {
        if (!intersect.object.visible) return false
        let obj = intersect.object
        while (obj) {
          if (obj.userData?.isMeasurement) return false
          if (obj.userData?.isHelper) return false
          obj = obj.parent as typeof obj
        }
        return true
      })

      if (intersects.length > 0) {
        const intersectionPoint = intersects[0].point
        const clickedPoint: [number, number, number] = [
          intersectionPoint.x,
          intersectionPoint.y,
          intersectionPoint.z,
        ]

        if (pendingPoint) {
          addMeasurement(pendingPoint, clickedPoint)
        } else {
          setPendingPoint(clickedPoint)
        }
      }
    },
    [isAddingMeasurement, models.length, pendingPoint, camera, gl, scene, findSnapPoint, addMeasurement, setPendingPoint]
  )

  useEffect(() => {
    const canvas = gl.domElement

    if (isAddingMeasurement) {
      canvas.addEventListener('click', handleCanvasClick)
      canvas.style.cursor = 'crosshair'
    } else {
      canvas.style.cursor = 'default'
    }

    return () => {
      canvas.removeEventListener('click', handleCanvasClick)
      canvas.style.cursor = 'default'
    }
  }, [isAddingMeasurement, handleCanvasClick, gl])

  // Base point size for indicators
  const pointSize = 0.005

  // Extract edge geometries from all visible meshes for wireframe display
  const edgeData = useMemo(() => {
    const edges: EdgeData[] = []

    scene.traverse((obj) => {
      if (obj instanceof Mesh && obj.visible) {
        // Skip measurement and helper objects
        if (obj.userData?.isMeasurement || obj.userData?.isHelper) return
        let parent = obj.parent
        let shouldSkip = false
        while (parent) {
          if (parent.userData?.isMeasurement || parent.userData?.isHelper) {
            shouldSkip = true
            break
          }
          parent = parent.parent
        }
        if (shouldSkip) return

        const geometry = obj.geometry as BufferGeometry
        if (!geometry) return

        // Create edges geometry with high threshold angle (only show sharp edges)
        const edgesGeometry = new EdgesGeometry(geometry, 30)

        // Get world transform
        const position = new Vector3()
        const quaternion = new Quaternion()
        const scale = new Vector3()
        obj.matrixWorld.decompose(position, quaternion, scale)

        // Convert quaternion to euler
        const euler = new Euler().setFromQuaternion(quaternion)

        edges.push({
          geometry: edgesGeometry,
          position: [position.x, position.y, position.z],
          rotation: [euler.x, euler.y, euler.z],
          scale: [scale.x, scale.y, scale.z],
        })
      }
    })

    return edges
  }, [scene, models])

  // Cleanup geometries when component unmounts or data changes
  useEffect(() => {
    return () => {
      edgeData.forEach(edge => {
        edge.geometry.dispose()
      })
    }
  }, [edgeData])

  return (
    <>
      {/* Model wireframe edges - shows when in measurement mode */}
      {isAddingMeasurement && edgeData.map((edge, index) => (
        <lineSegments
          key={index}
          geometry={edge.geometry}
          position={edge.position}
          rotation={edge.rotation}
          scale={edge.scale}
          userData={{ isHelper: true }}
        >
          <lineBasicMaterial color="#00ffff" transparent opacity={0.6} />
        </lineSegments>
      ))}

      {/* Render all measurements */}
      {measurements.map((measurement) => (
        <Measurement3D key={measurement.id} measurement={measurement} />
      ))}

      {/* Pending point indicator */}
      {pendingPoint && (
        <group userData={{ isMeasurement: true }}>
          <mesh position={pendingPoint}>
            <sphereGeometry args={[pointSize, 16, 16]} />
            <meshBasicMaterial color="#ff6600" />
          </mesh>
        </group>
      )}

      {/* Snap point indicator - bright green with pulsing ring */}
      {snapPoint && isAddingMeasurement && (
        <group userData={{ isMeasurement: true }}>
          {/* Center dot */}
          <mesh position={snapPoint}>
            <sphereGeometry args={[pointSize * 1.2, 16, 16]} />
            <meshBasicMaterial color="#00ff00" />
          </mesh>
          {/* Horizontal ring indicator */}
          <mesh position={snapPoint} rotation={[Math.PI / 2, 0, 0]}>
            <ringGeometry args={[pointSize * 2.5, pointSize * 3.5, 24]} />
            <meshBasicMaterial color="#00ff00" transparent opacity={0.7} />
          </mesh>
          {/* Vertical ring indicator for 3D effect */}
          <mesh position={snapPoint} rotation={[0, 0, 0]}>
            <ringGeometry args={[pointSize * 2.5, pointSize * 3.5, 24]} />
            <meshBasicMaterial color="#00ff00" transparent opacity={0.5} />
          </mesh>
        </group>
      )}
    </>
  )
}
