import { useState, useEffect } from 'react'
import { useSceneStore } from '@/store'
import styles from './ModelsPanel.module.css'

export default function ModelsPanel() {
  const {
    models,
    selectedModelId,
    removeModel,
    selectModel,
    updateModel,
  } = useSceneStore()

  const selectedModel = models.find((m) => m.id === selectedModelId)

  // Local state for input fields to allow free editing
  const [posX, setPosX] = useState('')
  const [posY, setPosY] = useState('')
  const [posZ, setPosZ] = useState('')
  const [rotX, setRotX] = useState('')
  const [rotY, setRotY] = useState('')
  const [rotZ, setRotZ] = useState('')
  const [scale, setScale] = useState('')

  // Sync local state when selected model changes
  useEffect(() => {
    if (selectedModel) {
      setPosX(selectedModel.position[0].toString())
      setPosY(selectedModel.position[1].toString())
      setPosZ(selectedModel.position[2].toString())
      setRotX(Math.round((selectedModel.rotation[0] * 180) / Math.PI).toString())
      setRotY(Math.round((selectedModel.rotation[1] * 180) / Math.PI).toString())
      setRotZ(Math.round((selectedModel.rotation[2] * 180) / Math.PI).toString())
      setScale(selectedModel.scale.toString())
    }
  }, [selectedModel?.id, selectedModel?.position, selectedModel?.rotation, selectedModel?.scale])

  const applyPosition = (axis: 'x' | 'y' | 'z', value: string) => {
    if (!selectedModel) return
    const num = parseFloat(value)
    if (isNaN(num)) return
    const newPosition: [number, number, number] = [...selectedModel.position]
    const index = axis === 'x' ? 0 : axis === 'y' ? 1 : 2
    newPosition[index] = num
    updateModel(selectedModel.id, { position: newPosition })
  }

  const applyRotation = (axis: 'x' | 'y' | 'z', value: string) => {
    if (!selectedModel) return
    const num = parseFloat(value)
    if (isNaN(num)) return
    const newRotation: [number, number, number] = [...selectedModel.rotation]
    const index = axis === 'x' ? 0 : axis === 'y' ? 1 : 2
    newRotation[index] = (num * Math.PI) / 180
    updateModel(selectedModel.id, { rotation: newRotation })
  }

  const applyScale = (value: string) => {
    if (!selectedModel) return
    const num = parseFloat(value)
    if (isNaN(num) || num <= 0) return
    updateModel(selectedModel.id, { scale: num })
  }

  if (models.length === 0) {
    return (
      <div className={styles.empty}>
        <p>No models loaded</p>
        <p className={styles.hint}>Drop GLTF/GLB files or use "Load Model"</p>
      </div>
    )
  }

  return (
    <div className={styles.panel}>
      <div className={styles.modelList}>
        {models.map((model) => (
          <div
            key={model.id}
            className={`${styles.modelItem} ${model.id === selectedModelId ? styles.modelItemSelected : ''}`}
            onClick={() => selectModel(model.id)}
          >
            <button
              className={styles.visibilityBtn}
              onClick={(e) => {
                e.stopPropagation()
                updateModel(model.id, { visible: !model.visible })
              }}
              title={model.visible ? 'Hide' : 'Show'}
            >
              {model.visible ? (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              ) : (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                  <line x1="1" y1="1" x2="23" y2="23" />
                </svg>
              )}
            </button>
            <span className={styles.modelName} title={model.name}>
              {model.name.length > 18 ? model.name.slice(0, 18) + '...' : model.name}
            </span>
            <button
              className={styles.removeBtn}
              onClick={(e) => {
                e.stopPropagation()
                removeModel(model.id)
              }}
              title="Remove model"
            >
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        ))}
      </div>

      {selectedModel && (
        <div className={styles.transformControls}>
          <div className={styles.transformSection}>
            <label className={styles.transformLabel}>Position</label>
            <div className={styles.transformRow}>
              <div className={styles.transformField}>
                <span className={styles.axisLabel}>X</span>
                <input
                  type="text"
                  value={posX}
                  onChange={(e) => setPosX(e.target.value)}
                  onBlur={() => applyPosition('x', posX)}
                  onKeyDown={(e) => e.key === 'Enter' && applyPosition('x', posX)}
                  className={styles.transformInput}
                />
              </div>
              <div className={styles.transformField}>
                <span className={styles.axisLabel}>Y</span>
                <input
                  type="text"
                  value={posY}
                  onChange={(e) => setPosY(e.target.value)}
                  onBlur={() => applyPosition('y', posY)}
                  onKeyDown={(e) => e.key === 'Enter' && applyPosition('y', posY)}
                  className={styles.transformInput}
                />
              </div>
              <div className={styles.transformField}>
                <span className={styles.axisLabel}>Z</span>
                <input
                  type="text"
                  value={posZ}
                  onChange={(e) => setPosZ(e.target.value)}
                  onBlur={() => applyPosition('z', posZ)}
                  onKeyDown={(e) => e.key === 'Enter' && applyPosition('z', posZ)}
                  className={styles.transformInput}
                />
              </div>
            </div>
          </div>

          <div className={styles.transformSection}>
            <label className={styles.transformLabel}>Rotation</label>
            <div className={styles.transformRow}>
              <div className={styles.transformField}>
                <span className={styles.axisLabel}>X</span>
                <input
                  type="text"
                  value={rotX}
                  onChange={(e) => setRotX(e.target.value)}
                  onBlur={() => applyRotation('x', rotX)}
                  onKeyDown={(e) => e.key === 'Enter' && applyRotation('x', rotX)}
                  className={styles.transformInput}
                />
              </div>
              <div className={styles.transformField}>
                <span className={styles.axisLabel}>Y</span>
                <input
                  type="text"
                  value={rotY}
                  onChange={(e) => setRotY(e.target.value)}
                  onBlur={() => applyRotation('y', rotY)}
                  onKeyDown={(e) => e.key === 'Enter' && applyRotation('y', rotY)}
                  className={styles.transformInput}
                />
              </div>
              <div className={styles.transformField}>
                <span className={styles.axisLabel}>Z</span>
                <input
                  type="text"
                  value={rotZ}
                  onChange={(e) => setRotZ(e.target.value)}
                  onBlur={() => applyRotation('z', rotZ)}
                  onKeyDown={(e) => e.key === 'Enter' && applyRotation('z', rotZ)}
                  className={styles.transformInput}
                />
              </div>
            </div>
          </div>

          <div className={styles.transformSection}>
            <label className={styles.transformLabel}>Scale</label>
            <div className={styles.scaleRow}>
              <input
                type="range"
                min="0.1"
                max="5"
                step="0.1"
                value={parseFloat(scale) || 1}
                onChange={(e) => {
                  setScale(e.target.value)
                  applyScale(e.target.value)
                }}
                className={styles.scaleSlider}
              />
              <input
                type="text"
                value={scale}
                onChange={(e) => setScale(e.target.value)}
                onBlur={() => applyScale(scale)}
                onKeyDown={(e) => e.key === 'Enter' && applyScale(scale)}
                className={styles.scaleInput}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
