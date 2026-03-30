import { useEnvironmentStore, ENVIRONMENT_PRESETS } from '@/store'
import styles from './Panel.module.css'

export default function EnvironmentPanel() {
  const {
    preset,
    intensity,
    background,
    backgroundBlur,
    backgroundColor,
    backgroundType,
    setPreset,
    setIntensity,
    setBackground,
    setBackgroundBlur,
    setBackgroundColor,
    setBackgroundType,
    reset,
  } = useEnvironmentStore()

  return (
    <div>
      <div className={styles.field}>
        <label className={styles.label}>Environment Preset</label>
        <div className={styles.grid}>
          {ENVIRONMENT_PRESETS.map((env) => (
            <button
              key={env.id}
              className={`${styles.presetButton} ${preset === env.preset ? styles.presetButtonActive : ''}`}
              onClick={() => setPreset(env.preset)}
            >
              {env.name}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.field}>
        <label className={styles.label}>Environment Intensity: {intensity.toFixed(2)}</label>
        <input
          type="range"
          className={styles.slider}
          min="0"
          max="3"
          step="0.05"
          value={intensity}
          onChange={(e) => setIntensity(parseFloat(e.target.value))}
        />
      </div>

      <div className={styles.field}>
        <label className={styles.label}>Background Type</label>
        <select
          className={styles.select}
          value={backgroundType}
          onChange={(e) => setBackgroundType(e.target.value as typeof backgroundType)}
        >
          <option value="environment">Environment Map</option>
          <option value="solid">Solid Color</option>
          <option value="transparent">Transparent</option>
        </select>
      </div>

      {backgroundType === 'environment' && (
        <>
          <div className={styles.field}>
            <div className={styles.row}>
              <label className={styles.label} style={{ marginBottom: 0, flex: 1 }}>
                Show Background
              </label>
              <button
                className={`${styles.toggle} ${background ? styles.toggleActive : ''}`}
                onClick={() => setBackground(!background)}
              />
            </div>
          </div>

          {background && (
            <div className={styles.field}>
              <label className={styles.label}>Background Blur: {backgroundBlur.toFixed(2)}</label>
              <input
                type="range"
                className={styles.slider}
                min="0"
                max="1"
                step="0.01"
                value={backgroundBlur}
                onChange={(e) => setBackgroundBlur(parseFloat(e.target.value))}
              />
            </div>
          )}
        </>
      )}

      {backgroundType === 'solid' && (
        <div className={styles.field}>
          <label className={styles.label}>Background Color</label>
          <div className={styles.row}>
            <input
              type="color"
              className={styles.colorInput}
              value={backgroundColor}
              onChange={(e) => setBackgroundColor(e.target.value)}
            />
            <input
              type="text"
              className={styles.input}
              value={backgroundColor}
              onChange={(e) => setBackgroundColor(e.target.value)}
            />
          </div>
        </div>
      )}

      <div className={styles.field} style={{ marginTop: 16 }}>
        <button className={`${styles.button} ${styles.buttonSecondary}`} onClick={reset}>
          Reset Environment
        </button>
      </div>
    </div>
  )
}
