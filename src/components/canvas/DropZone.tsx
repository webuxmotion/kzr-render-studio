import { useEffect } from 'react'
import { Html } from '@react-three/drei'
import { useSceneStore } from '@/store'

export default function DropZone() {
  const { models, addModel, setLoading, setError } = useSceneStore()

  useEffect(() => {
    const handleDragOver = (e: DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
    }

    const handleDrop = async (e: DragEvent) => {
      e.preventDefault()
      e.stopPropagation()

      const files = e.dataTransfer?.files
      if (!files || files.length === 0) return

      const validExtensions = ['.gltf', '.glb', '.stl']

      // Process all dropped files
      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        const ext = file.name.toLowerCase().slice(file.name.lastIndexOf('.'))

        if (!validExtensions.includes(ext)) {
          if (files.length === 1) {
            setError('Please drop a GLTF, GLB, or STL file')
          }
          continue
        }

        setLoading(true)
        setError(null)

        try {
          const url = URL.createObjectURL(file)
          addModel({
            gltf: null as never,
            url,
            name: file.name,
            fileType: ext.slice(1) as 'gltf' | 'glb' | 'stl',
          })
        } catch (err) {
          setError(err instanceof Error ? err.message : 'Failed to load file')
          setLoading(false)
        }
      }
    }

    window.addEventListener('dragover', handleDragOver)
    window.addEventListener('drop', handleDrop)

    return () => {
      window.removeEventListener('dragover', handleDragOver)
      window.removeEventListener('drop', handleDrop)
    }
  }, [addModel, setLoading, setError])

  if (models.length > 0) return null

  return (
    <Html center>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 16,
          padding: 40,
          color: '#888',
          textAlign: 'center',
          pointerEvents: 'none',
        }}
      >
        <div style={{ fontSize: 48, opacity: 0.5 }}>📦</div>
        <div style={{ fontSize: 18, fontWeight: 500 }}>Drop GLTF/GLB/STL files here</div>
        <div style={{ fontSize: 14, opacity: 0.7 }}>You can drop multiple files at once</div>
      </div>
    </Html>
  )
}
