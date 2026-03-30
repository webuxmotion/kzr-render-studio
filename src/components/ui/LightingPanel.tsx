import { useLightingStore } from '@/store'
import type { LightConfig } from '@/types'
import styles from './Panel.module.css'

const LIGHT_TYPES: { value: LightConfig['type']; label: string }[] = [
  { value: 'ambient', label: 'Ambient' },
  { value: 'directional', label: 'Directional' },
  { value: 'point', label: 'Point' },
  { value: 'spot', label: 'Spot' },
]

export default function LightingPanel() {
  const { lights, selectedLightId, addLight, removeLight, updateLight, setSelectedLight, resetLights } =
    useLightingStore()

  const selectedLight = lights.find((l) => l.id === selectedLightId)

  return (
    <div>
      <div className={styles.list}>
        {lights.map((light) => (
          <div
            key={light.id}
            className={`${styles.listItem} ${selectedLightId === light.id ? styles.listItemActive : ''}`}
            onClick={() => setSelectedLight(light.id)}
          >
            <span style={{ opacity: light.visible ? 1 : 0.5 }}>
              {light.type === 'ambient' && '☀'}
              {light.type === 'directional' && '→'}
              {light.type === 'point' && '●'}
              {light.type === 'spot' && '◉'}
            </span>
            <span className={styles.listItemName}>{light.type}</span>
            <div className={styles.listItemActions}>
              <button
                className={styles.iconButton}
                onClick={(e) => {
                  e.stopPropagation()
                  updateLight(light.id, { visible: !light.visible })
                }}
                title={light.visible ? 'Hide' : 'Show'}
              >
                {light.visible ? '👁' : '👁‍🗨'}
              </button>
              <button
                className={styles.iconButton}
                onClick={(e) => {
                  e.stopPropagation()
                  removeLight(light.id)
                }}
                title="Remove"
              >
                ✕
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className={styles.field}>
        <label className={styles.label}>Add Light</label>
        <div className={styles.grid}>
          {LIGHT_TYPES.map((type) => (
            <button
              key={type.value}
              className={`${styles.presetButton}`}
              onClick={() => addLight(type.value)}
            >
              + {type.label}
            </button>
          ))}
        </div>
      </div>

      {selectedLight && (
        <>
          <div className={styles.field}>
            <label className={styles.label}>Color</label>
            <input
              type="color"
              className={styles.colorInput}
              value={selectedLight.color}
              onChange={(e) => updateLight(selectedLight.id, { color: e.target.value })}
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Intensity: {selectedLight.intensity.toFixed(2)}</label>
            <input
              type="range"
              className={styles.slider}
              min="0"
              max={selectedLight.type === 'ambient' ? 2 : 5}
              step="0.05"
              value={selectedLight.intensity}
              onChange={(e) => updateLight(selectedLight.id, { intensity: parseFloat(e.target.value) })}
            />
          </div>

          {selectedLight.type !== 'ambient' && (
            <>
              <div className={styles.field}>
                <label className={styles.label}>Position</label>
                <div className={styles.row}>
                  <input
                    type="number"
                    className={styles.inputSmall}
                    value={selectedLight.position[0]}
                    onChange={(e) =>
                      updateLight(selectedLight.id, {
                        position: [parseFloat(e.target.value), selectedLight.position[1], selectedLight.position[2]],
                      })
                    }
                    placeholder="X"
                  />
                  <input
                    type="number"
                    className={styles.inputSmall}
                    value={selectedLight.position[1]}
                    onChange={(e) =>
                      updateLight(selectedLight.id, {
                        position: [selectedLight.position[0], parseFloat(e.target.value), selectedLight.position[2]],
                      })
                    }
                    placeholder="Y"
                  />
                  <input
                    type="number"
                    className={styles.inputSmall}
                    value={selectedLight.position[2]}
                    onChange={(e) =>
                      updateLight(selectedLight.id, {
                        position: [selectedLight.position[0], selectedLight.position[1], parseFloat(e.target.value)],
                      })
                    }
                    placeholder="Z"
                  />
                </div>
              </div>

              <div className={styles.field}>
                <div className={styles.row}>
                  <label className={styles.label} style={{ marginBottom: 0, flex: 1 }}>
                    Cast Shadows
                  </label>
                  <button
                    className={`${styles.toggle} ${selectedLight.castShadow ? styles.toggleActive : ''}`}
                    onClick={() => updateLight(selectedLight.id, { castShadow: !selectedLight.castShadow })}
                  />
                </div>
              </div>
            </>
          )}
        </>
      )}

      <div className={styles.field} style={{ marginTop: 16 }}>
        <button className={`${styles.button} ${styles.buttonSecondary}`} onClick={resetLights}>
          Reset Lights
        </button>
      </div>
    </div>
  )
}
