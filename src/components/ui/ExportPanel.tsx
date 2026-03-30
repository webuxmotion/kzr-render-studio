import { useRenderStore, useEnvironmentStore } from '@/store'
import styles from './Panel.module.css'

const FORMATS = [
  { value: 'png', label: 'PNG' },
  { value: 'jpeg', label: 'JPEG' },
  { value: 'webp', label: 'WebP' },
] as const

const SCALES = [
  { value: 1, label: '1x' },
  { value: 2, label: '2x' },
  { value: 4, label: '4x' },
]

export default function ExportPanel() {
  const { exportOptions, updateExportOptions } = useRenderStore()
  const { backgroundType } = useEnvironmentStore()

  const handleExport = () => {
    const canvas = document.querySelector('canvas')
    if (!canvas) {
      alert('No canvas found')
      return
    }

    const link = document.createElement('a')
    link.download = `render.${exportOptions.format}`

    if (exportOptions.scale > 1) {
      // Create high-res export
      const scaledCanvas = document.createElement('canvas')
      scaledCanvas.width = canvas.width * exportOptions.scale
      scaledCanvas.height = canvas.height * exportOptions.scale
      const ctx = scaledCanvas.getContext('2d')
      if (ctx) {
        ctx.scale(exportOptions.scale, exportOptions.scale)
        ctx.drawImage(canvas, 0, 0)
        link.href = scaledCanvas.toDataURL(
          `image/${exportOptions.format}`,
          exportOptions.format === 'png' ? undefined : exportOptions.quality
        )
      }
    } else {
      link.href = canvas.toDataURL(
        `image/${exportOptions.format}`,
        exportOptions.format === 'png' ? undefined : exportOptions.quality
      )
    }

    link.click()
  }

  return (
    <div>
      <div className={styles.field}>
        <label className={styles.label}>Format</label>
        <div className={styles.grid}>
          {FORMATS.map((format) => (
            <button
              key={format.value}
              className={`${styles.presetButton} ${
                exportOptions.format === format.value ? styles.presetButtonActive : ''
              }`}
              onClick={() => updateExportOptions({ format: format.value })}
            >
              {format.label}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.field}>
        <label className={styles.label}>Resolution Scale</label>
        <div className={styles.grid}>
          {SCALES.map((scale) => (
            <button
              key={scale.value}
              className={`${styles.presetButton} ${
                exportOptions.scale === scale.value ? styles.presetButtonActive : ''
              }`}
              onClick={() => updateExportOptions({ scale: scale.value })}
            >
              {scale.label}
            </button>
          ))}
        </div>
      </div>

      {exportOptions.format !== 'png' && (
        <div className={styles.field}>
          <label className={styles.label}>
            Quality: {Math.round(exportOptions.quality * 100)}%
          </label>
          <input
            type="range"
            className={styles.slider}
            min="0.1"
            max="1"
            step="0.01"
            value={exportOptions.quality}
            onChange={(e) => updateExportOptions({ quality: parseFloat(e.target.value) })}
          />
        </div>
      )}

      {exportOptions.format === 'png' && backgroundType === 'transparent' && (
        <div className={styles.field}>
          <div className={styles.row}>
            <label className={styles.label} style={{ marginBottom: 0, flex: 1 }}>
              Transparent Background
            </label>
            <button
              className={`${styles.toggle} ${exportOptions.transparentBackground ? styles.toggleActive : ''}`}
              onClick={() =>
                updateExportOptions({ transparentBackground: !exportOptions.transparentBackground })
              }
            />
          </div>
        </div>
      )}

      <div className={styles.field} style={{ marginTop: 16 }}>
        <button className={styles.button} onClick={handleExport}>
          Export Image
        </button>
      </div>
    </div>
  )
}
