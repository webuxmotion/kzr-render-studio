import { useScenePresetsStore, SCENE_PRESETS } from '@/store/scenePresetsStore'
import styles from './Panel.module.css'

export default function ScenePresetsPanel() {
  const { activePresetId, applyPreset } = useScenePresetsStore()

  return (
    <div>
      <div className={styles.field}>
        <label className={styles.label}>Choose a Scene Preset</label>
        <div className={styles.list}>
          {SCENE_PRESETS.map((preset) => (
            <button
              key={preset.id}
              className={`${styles.listItem} ${activePresetId === preset.id ? styles.listItemActive : ''}`}
              onClick={() => applyPreset(preset)}
              style={{ flexDirection: 'column', alignItems: 'flex-start', gap: 4 }}
            >
              <span className={styles.listItemName} style={{ fontWeight: 500 }}>
                {preset.name}
              </span>
              <span style={{ fontSize: 11, opacity: 0.7 }}>
                {preset.description}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
