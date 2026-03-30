import { useState, type ReactNode } from 'react'
import Sidebar from './Sidebar'
import FileUploader from './FileUploader'
import styles from './Layout.module.css'

interface LayoutProps {
  children: ReactNode
}

export default function Layout({ children }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true)

  return (
    <div className={styles.layout}>
      <header className={styles.header}>
        <div className={styles.logo}>
          <span className={styles.logoText}>KZR Render Studio</span>
        </div>
        <div className={styles.headerActions}>
          <FileUploader />
          <button
            className={styles.toggleSidebar}
            onClick={() => setSidebarOpen(!sidebarOpen)}
            title={sidebarOpen ? 'Hide sidebar' : 'Show sidebar'}
          >
            {sidebarOpen ? '→' : '←'}
          </button>
        </div>
      </header>
      <div className={styles.main}>
        <div className={styles.canvas}>{children}</div>
        {sidebarOpen && <Sidebar />}
      </div>
    </div>
  )
}
