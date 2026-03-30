import { useSceneStore } from '@/store'
import styles from './Panel.module.css'
import type { MaterialOverride } from '@/types'

const MATERIAL_PRESETS: { name: string; values: Partial<MaterialOverride> }[] = [
  // Metals
  { name: 'Chrome', values: { color: '#ffffff', metalness: 1, roughness: 0.05, envMapIntensity: 1.5, clearcoat: 0, transmission: 0 } },
  { name: 'Gold', values: { color: '#ffd700', metalness: 1, roughness: 0.1, envMapIntensity: 1.2, clearcoat: 0, transmission: 0 } },
  { name: 'Copper', values: { color: '#b87333', metalness: 1, roughness: 0.2, envMapIntensity: 1.2, clearcoat: 0, transmission: 0 } },
  { name: 'Brushed Metal', values: { color: '#888888', metalness: 0.9, roughness: 0.4, envMapIntensity: 1, clearcoat: 0, transmission: 0 } },
  // 3D Printing Materials
  { name: 'PLA', values: { color: '#ffffff', metalness: 0, roughness: 0.45, envMapIntensity: 0.4, clearcoat: 0.1, clearcoatRoughness: 0.3, transmission: 0, transparent: false } },
  { name: 'PLA Silk', values: { color: '#e8e8e8', metalness: 0.3, roughness: 0.25, envMapIntensity: 0.8, clearcoat: 0.4, clearcoatRoughness: 0.1, transmission: 0, transparent: false } },
  { name: 'PETG', values: { color: '#ffffff', metalness: 0, roughness: 0.15, envMapIntensity: 0.6, clearcoat: 0.3, clearcoatRoughness: 0.1, transmission: 0.2, ior: 1.57, transparent: true, opacity: 0.95 } },
  { name: 'PETG Clear', values: { color: '#f0f8ff', metalness: 0, roughness: 0.05, envMapIntensity: 0.8, clearcoat: 0.5, transmission: 0.7, ior: 1.57, transparent: true, opacity: 1 } },
  // Other Plastics
  { name: 'ABS', values: { color: '#f5f5f5', metalness: 0, roughness: 0.5, envMapIntensity: 0.3, clearcoat: 0, transmission: 0, transparent: false } },
  { name: 'Glossy Plastic', values: { color: '#ffffff', metalness: 0, roughness: 0.15, envMapIntensity: 0.6, clearcoat: 0.6, clearcoatRoughness: 0.05, transmission: 0 } },
  { name: 'Matte Plastic', values: { color: '#ffffff', metalness: 0, roughness: 0.7, envMapIntensity: 0.3, clearcoat: 0, transmission: 0 } },
  // Glass & Transparent
  { name: 'Glass', values: { color: '#ffffff', metalness: 0, roughness: 0, transmission: 1, ior: 1.5, transparent: true, opacity: 1, clearcoat: 0 } },
  { name: 'Frosted Glass', values: { color: '#ffffff', metalness: 0, roughness: 0.3, transmission: 0.9, ior: 1.5, transparent: true, clearcoat: 0 } },
  // Other
  { name: 'Car Paint', values: { color: '#cc0000', metalness: 0.5, roughness: 0.2, clearcoat: 1, clearcoatRoughness: 0.1, envMapIntensity: 1.5, transmission: 0 } },
  { name: 'Ceramic', values: { color: '#ffffff', metalness: 0, roughness: 0.1, envMapIntensity: 0.8, clearcoat: 0.3, transmission: 0 } },
  { name: 'Rubber', values: { color: '#222222', metalness: 0, roughness: 0.9, envMapIntensity: 0.2, clearcoat: 0, transmission: 0 } },
  { name: 'Wood', values: { color: '#8b4513', metalness: 0, roughness: 0.6, envMapIntensity: 0.3, clearcoat: 0, transmission: 0 } },
  { name: 'Concrete', values: { color: '#808080', metalness: 0, roughness: 0.95, envMapIntensity: 0.2, clearcoat: 0, transmission: 0 } },
]

export default function MaterialPanel() {
  const { materials, selectedMaterialId, setSelectedMaterial, updateMaterial } = useSceneStore()

  const selectedMaterial = materials.find((m) => m.id === selectedMaterialId)

  const applyPreset = (preset: typeof MATERIAL_PRESETS[0]) => {
    if (selectedMaterial) {
      updateMaterial(selectedMaterial.id, preset.values)
    }
  }

  if (materials.length === 0) {
    return <div className={styles.empty}>Load a model to edit materials</div>
  }

  return (
    <div>
      <div className={styles.field}>
        <label className={styles.label}>Select Material</label>
        <select
          className={styles.select}
          value={selectedMaterialId || ''}
          onChange={(e) => setSelectedMaterial(e.target.value || null)}
        >
          <option value="">Choose material...</option>
          {materials.map((m) => (
            <option key={m.id} value={m.id}>
              {m.name}
            </option>
          ))}
        </select>
      </div>

      {selectedMaterial && (
        <>
          <div className={styles.field}>
            <label className={styles.label}>Material Presets</label>
            <div className={styles.grid} style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
              {MATERIAL_PRESETS.map((preset) => (
                <button
                  key={preset.name}
                  className={styles.presetButton}
                  onClick={() => applyPreset(preset)}
                  title={preset.name}
                >
                  {preset.name}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Color</label>
            <div className={styles.row}>
              <input
                type="color"
                className={styles.colorInput}
                value={selectedMaterial.color}
                onChange={(e) => updateMaterial(selectedMaterial.id, { color: e.target.value })}
              />
              <input
                type="text"
                className={styles.input}
                value={selectedMaterial.color}
                onChange={(e) => updateMaterial(selectedMaterial.id, { color: e.target.value })}
              />
            </div>
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Metalness: {selectedMaterial.metalness.toFixed(2)}</label>
            <input
              type="range"
              className={styles.slider}
              min="0"
              max="1"
              step="0.01"
              value={selectedMaterial.metalness}
              onChange={(e) => updateMaterial(selectedMaterial.id, { metalness: parseFloat(e.target.value) })}
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Roughness: {selectedMaterial.roughness.toFixed(2)}</label>
            <input
              type="range"
              className={styles.slider}
              min="0"
              max="1"
              step="0.01"
              value={selectedMaterial.roughness}
              onChange={(e) => updateMaterial(selectedMaterial.id, { roughness: parseFloat(e.target.value) })}
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Environment Intensity: {selectedMaterial.envMapIntensity.toFixed(2)}</label>
            <input
              type="range"
              className={styles.slider}
              min="0"
              max="3"
              step="0.05"
              value={selectedMaterial.envMapIntensity}
              onChange={(e) => updateMaterial(selectedMaterial.id, { envMapIntensity: parseFloat(e.target.value) })}
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Emissive</label>
            <div className={styles.row}>
              <input
                type="color"
                className={styles.colorInput}
                value={selectedMaterial.emissive}
                onChange={(e) => updateMaterial(selectedMaterial.id, { emissive: e.target.value })}
              />
              <input
                type="range"
                className={styles.slider}
                min="0"
                max="2"
                step="0.05"
                value={selectedMaterial.emissiveIntensity}
                onChange={(e) => updateMaterial(selectedMaterial.id, { emissiveIntensity: parseFloat(e.target.value) })}
              />
              <span style={{ minWidth: 40, textAlign: 'right', fontSize: 12 }}>
                {selectedMaterial.emissiveIntensity.toFixed(2)}
              </span>
            </div>
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Clearcoat: {selectedMaterial.clearcoat.toFixed(2)}</label>
            <input
              type="range"
              className={styles.slider}
              min="0"
              max="1"
              step="0.01"
              value={selectedMaterial.clearcoat}
              onChange={(e) => updateMaterial(selectedMaterial.id, { clearcoat: parseFloat(e.target.value) })}
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Transmission: {selectedMaterial.transmission.toFixed(2)}</label>
            <input
              type="range"
              className={styles.slider}
              min="0"
              max="1"
              step="0.01"
              value={selectedMaterial.transmission}
              onChange={(e) => updateMaterial(selectedMaterial.id, { transmission: parseFloat(e.target.value) })}
            />
          </div>

          {selectedMaterial.transmission > 0 && (
            <div className={styles.field}>
              <label className={styles.label}>IOR: {selectedMaterial.ior.toFixed(2)}</label>
              <input
                type="range"
                className={styles.slider}
                min="1"
                max="2.5"
                step="0.01"
                value={selectedMaterial.ior}
                onChange={(e) => updateMaterial(selectedMaterial.id, { ior: parseFloat(e.target.value) })}
              />
            </div>
          )}

          <div className={styles.field}>
            <div className={styles.row}>
              <label className={styles.label} style={{ marginBottom: 0, flex: 1 }}>
                Transparency
              </label>
              <button
                className={`${styles.toggle} ${selectedMaterial.transparent ? styles.toggleActive : ''}`}
                onClick={() => updateMaterial(selectedMaterial.id, { transparent: !selectedMaterial.transparent })}
              />
            </div>
          </div>

          {selectedMaterial.transparent && (
            <div className={styles.field}>
              <label className={styles.label}>Opacity: {selectedMaterial.opacity.toFixed(2)}</label>
              <input
                type="range"
                className={styles.slider}
                min="0"
                max="1"
                step="0.01"
                value={selectedMaterial.opacity}
                onChange={(e) => updateMaterial(selectedMaterial.id, { opacity: parseFloat(e.target.value) })}
              />
            </div>
          )}
        </>
      )}
    </div>
  )
}
