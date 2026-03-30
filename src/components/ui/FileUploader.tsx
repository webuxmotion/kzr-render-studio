import { useRef } from 'react'
import { useSceneStore } from '@/store'
import styles from './FileUploader.module.css'

export default function FileUploader() {
  const inputRef = useRef<HTMLInputElement>(null)
  const { models, isLoading, addModel, setLoading, setError, clearScene } = useSceneStore()

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    const validExtensions = ['.gltf', '.glb']

    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      const ext = file.name.toLowerCase().slice(file.name.lastIndexOf('.'))

      if (!validExtensions.includes(ext)) {
        if (files.length === 1) {
          setError('Please select a GLTF or GLB file')
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
        })
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load file')
      } finally {
        setLoading(false)
      }
    }

    if (inputRef.current) {
      inputRef.current.value = ''
    }
  }

  return (
    <div className={styles.uploader}>
      <input
        ref={inputRef}
        type="file"
        accept=".gltf,.glb"
        onChange={handleFileSelect}
        className={styles.input}
        id="file-upload"
        multiple
      />
      <label htmlFor="file-upload" className={styles.button}>
        {isLoading ? 'Loading...' : models.length > 0 ? 'Add Model' : 'Load Model'}
      </label>
      {models.length > 0 && (
        <button className={styles.clearButton} onClick={clearScene} title="Clear all models">
          Clear All
        </button>
      )}
    </div>
  )
}
