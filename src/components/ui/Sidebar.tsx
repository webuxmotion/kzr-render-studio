import { useState } from 'react'
import ModelsPanel from './ModelsPanel'
import MeasurementsPanel from './MeasurementsPanel'
import ScenePresetsPanel from './ScenePresetsPanel'
import MaterialPanel from './MaterialPanel'
import LightingPanel from './LightingPanel'
import EnvironmentPanel from './EnvironmentPanel'
import RenderPanel from './RenderPanel'
import ExportPanel from './ExportPanel'
import styles from './Sidebar.module.css'

type PanelId = 'models' | 'measurements' | 'scenes' | 'materials' | 'lighting' | 'environment' | 'render' | 'export'

export default function Sidebar() {
  const [openPanels, setOpenPanels] = useState<Set<PanelId>>(
    new Set(['models', 'scenes', 'materials'])
  )

  const togglePanel = (id: PanelId) => {
    setOpenPanels((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  return (
    <aside className={styles.sidebar}>
      <div className={styles.content}>
        <Panel
          id="models"
          title="Models"
          isOpen={openPanels.has('models')}
          onToggle={() => togglePanel('models')}
        >
          <ModelsPanel />
        </Panel>

        <Panel
          id="measurements"
          title="Measurements"
          isOpen={openPanels.has('measurements')}
          onToggle={() => togglePanel('measurements')}
        >
          <MeasurementsPanel />
        </Panel>

        <Panel
          id="scenes"
          title="Scene Presets"
          isOpen={openPanels.has('scenes')}
          onToggle={() => togglePanel('scenes')}
        >
          <ScenePresetsPanel />
        </Panel>

        <Panel
          id="materials"
          title="Materials"
          isOpen={openPanels.has('materials')}
          onToggle={() => togglePanel('materials')}
        >
          <MaterialPanel />
        </Panel>

        <Panel
          id="lighting"
          title="Lighting"
          isOpen={openPanels.has('lighting')}
          onToggle={() => togglePanel('lighting')}
        >
          <LightingPanel />
        </Panel>

        <Panel
          id="environment"
          title="Environment"
          isOpen={openPanels.has('environment')}
          onToggle={() => togglePanel('environment')}
        >
          <EnvironmentPanel />
        </Panel>

        <Panel
          id="render"
          title="Render Settings"
          isOpen={openPanels.has('render')}
          onToggle={() => togglePanel('render')}
        >
          <RenderPanel />
        </Panel>

        <Panel
          id="export"
          title="Export"
          isOpen={openPanels.has('export')}
          onToggle={() => togglePanel('export')}
        >
          <ExportPanel />
        </Panel>
      </div>
    </aside>
  )
}

interface PanelProps {
  id: string
  title: string
  isOpen: boolean
  onToggle: () => void
  children: React.ReactNode
}

function Panel({ title, isOpen, onToggle, children }: PanelProps) {
  return (
    <div className={styles.panel}>
      <button className={styles.panelHeader} onClick={onToggle}>
        <span className={styles.panelTitle}>{title}</span>
        <span className={`${styles.chevron} ${isOpen ? styles.chevronOpen : ''}`}>
          ▼
        </span>
      </button>
      {isOpen && <div className={styles.panelContent}>{children}</div>}
    </div>
  )
}
