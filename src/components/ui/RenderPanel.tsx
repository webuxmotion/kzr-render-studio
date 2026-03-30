import { useRenderStore } from '@/store'
import styles from './Panel.module.css'

const SHADOW_PRESETS = [
  { label: 'Low', value: 512 },
  { label: 'Medium', value: 1024 },
  { label: 'High', value: 2048 },
  { label: 'Ultra', value: 4096 },
]

export default function RenderPanel() {
  const { config, updateConfig, resetConfig } = useRenderStore()

  return (
    <div>
      <div className={styles.field}>
        <div className={styles.row}>
          <label className={styles.label} style={{ marginBottom: 0, flex: 1 }}>
            Shadows
          </label>
          <button
            className={`${styles.toggle} ${config.shadows ? styles.toggleActive : ''}`}
            onClick={() => updateConfig({ shadows: !config.shadows })}
          />
        </div>
      </div>

      {config.shadows && (
        <div className={styles.field}>
          <label className={styles.label}>Shadow Quality</label>
          <div className={styles.grid}>
            {SHADOW_PRESETS.map((preset) => (
              <button
                key={preset.value}
                className={`${styles.presetButton} ${
                  config.shadowMapSize === preset.value ? styles.presetButtonActive : ''
                }`}
                onClick={() => updateConfig({ shadowMapSize: preset.value })}
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className={styles.field}>
        <div className={styles.row}>
          <label className={styles.label} style={{ marginBottom: 0, flex: 1 }}>
            Tone Mapping
          </label>
          <button
            className={`${styles.toggle} ${config.toneMapping ? styles.toggleActive : ''}`}
            onClick={() => updateConfig({ toneMapping: !config.toneMapping })}
          />
        </div>
      </div>

      {config.toneMapping && (
        <div className={styles.field}>
          <label className={styles.label}>Exposure: {config.toneMappingExposure.toFixed(2)}</label>
          <input
            type="range"
            className={styles.slider}
            min="0"
            max="3"
            step="0.05"
            value={config.toneMappingExposure}
            onChange={(e) => updateConfig({ toneMappingExposure: parseFloat(e.target.value) })}
          />
        </div>
      )}

      <div className={styles.field}>
        <div className={styles.row}>
          <label className={styles.label} style={{ marginBottom: 0, flex: 1 }}>
            SSAO (Ambient Occlusion)
          </label>
          <button
            className={`${styles.toggle} ${config.ssao ? styles.toggleActive : ''}`}
            onClick={() => updateConfig({ ssao: !config.ssao })}
          />
        </div>
      </div>

      {config.ssao && (
        <div className={styles.field}>
          <label className={styles.label}>SSAO Intensity: {config.ssaoIntensity.toFixed(0)}</label>
          <input
            type="range"
            className={styles.slider}
            min="0"
            max="50"
            step="1"
            value={config.ssaoIntensity}
            onChange={(e) => updateConfig({ ssaoIntensity: parseFloat(e.target.value) })}
          />
        </div>
      )}

      <div className={styles.field}>
        <div className={styles.row}>
          <label className={styles.label} style={{ marginBottom: 0, flex: 1 }}>
            Bloom
          </label>
          <button
            className={`${styles.toggle} ${config.bloom ? styles.toggleActive : ''}`}
            onClick={() => updateConfig({ bloom: !config.bloom })}
          />
        </div>
      </div>

      {config.bloom && (
        <>
          <div className={styles.field}>
            <label className={styles.label}>Bloom Intensity: {config.bloomIntensity.toFixed(2)}</label>
            <input
              type="range"
              className={styles.slider}
              min="0"
              max="2"
              step="0.05"
              value={config.bloomIntensity}
              onChange={(e) => updateConfig({ bloomIntensity: parseFloat(e.target.value) })}
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Bloom Threshold: {config.bloomThreshold.toFixed(2)}</label>
            <input
              type="range"
              className={styles.slider}
              min="0"
              max="1"
              step="0.01"
              value={config.bloomThreshold}
              onChange={(e) => updateConfig({ bloomThreshold: parseFloat(e.target.value) })}
            />
          </div>
        </>
      )}

      <div className={styles.field} style={{ marginTop: 16 }}>
        <button className={`${styles.button} ${styles.buttonSecondary}`} onClick={resetConfig}>
          Reset Settings
        </button>
      </div>
    </div>
  )
}
