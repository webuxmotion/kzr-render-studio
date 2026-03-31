import { useMeasurementStore } from '@/store'
import styles from './MeasurementsPanel.module.css'

export default function MeasurementsPanel() {
  const {
    measurements,
    isAddingMeasurement,
    measurementType,
    snapEnabled,
    unit,
    setIsAddingMeasurement,
    setMeasurementType,
    setSnapEnabled,
    removeMeasurement,
    updateMeasurement,
    clearMeasurements,
    setUnit,
  } = useMeasurementStore()

  return (
    <div className={styles.panel}>
      <div className={styles.controls}>
        <button
          className={`${styles.addButton} ${isAddingMeasurement ? styles.addButtonActive : ''}`}
          onClick={() => setIsAddingMeasurement(!isAddingMeasurement)}
        >
          {isAddingMeasurement ? 'Cancel' : 'Add Measurement'}
        </button>

        {measurements.length > 0 && (
          <button className={styles.clearButton} onClick={clearMeasurements}>
            Clear All
          </button>
        )}
      </div>

      {/* Measurement Type Selector */}
      <div className={styles.typeSelector}>
        <label className={styles.label}>Type</label>
        <div className={styles.typeButtons}>
          <button
            className={`${styles.typeButton} ${measurementType === 'linear' ? styles.typeButtonActive : ''}`}
            onClick={() => setMeasurementType('linear')}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="4" y1="20" x2="20" y2="4" />
              <line x1="4" y1="20" x2="4" y2="16" />
              <line x1="4" y1="20" x2="8" y2="20" />
              <line x1="20" y1="4" x2="20" y2="8" />
              <line x1="20" y1="4" x2="16" y2="4" />
            </svg>
            Linear
          </button>
          <button
            className={`${styles.typeButton} ${measurementType === 'diameter' ? styles.typeButtonActive : ''}`}
            onClick={() => setMeasurementType('diameter')}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="8" />
              <line x1="4" y1="12" x2="20" y2="12" />
              <circle cx="4" cy="12" r="1.5" fill="currentColor" />
              <circle cx="20" cy="12" r="1.5" fill="currentColor" />
            </svg>
            Diameter
          </button>
        </div>
      </div>

      {/* Snap Toggle */}
      <div className={styles.snapToggle}>
        <label className={styles.checkboxLabel}>
          <input
            type="checkbox"
            checked={snapEnabled}
            onChange={(e) => setSnapEnabled(e.target.checked)}
            className={styles.checkbox}
          />
          <span className={styles.checkmark}></span>
          Snap to geometry
        </label>
      </div>

      {isAddingMeasurement && (
        <div className={styles.hint}>
          {measurementType === 'linear'
            ? 'Click two points on the model to create a measurement'
            : 'Click center point, then edge point for diameter'}
        </div>
      )}

      <div className={styles.unitSelector}>
        <label className={styles.label}>Unit</label>
        <select
          value={unit}
          onChange={(e) => setUnit(e.target.value as 'mm' | 'cm' | 'm' | 'in')}
          className={styles.select}
        >
          <option value="mm">Millimeters (mm)</option>
          <option value="cm">Centimeters (cm)</option>
          <option value="m">Meters (m)</option>
          <option value="in">Inches (in)</option>
        </select>
      </div>

      {measurements.length === 0 ? (
        <div className={styles.empty}>
          <p>No measurements</p>
          <p className={styles.emptyHint}>Add measurements to annotate your model</p>
        </div>
      ) : (
        <div className={styles.list}>
          {measurements.map((measurement, index) => (
            <div key={measurement.id} className={styles.item}>
              <button
                className={styles.visibilityBtn}
                onClick={() =>
                  updateMeasurement(measurement.id, { visible: !measurement.visible })
                }
                title={measurement.visible ? 'Hide' : 'Show'}
              >
                {measurement.visible ? (
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

              <span className={styles.itemType} title={measurement.type === 'diameter' ? 'Diameter' : 'Linear'}>
                {measurement.type === 'diameter' ? 'Ø' : 'L'}
              </span>
              <span className={styles.itemLabel}>
                {measurement.label}
              </span>

              <input
                type="color"
                value={measurement.color}
                onChange={(e) =>
                  updateMeasurement(measurement.id, { color: e.target.value })
                }
                className={styles.colorPicker}
                title="Change color"
              />

              <button
                className={styles.removeBtn}
                onClick={() => removeMeasurement(measurement.id)}
                title="Remove"
              >
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
