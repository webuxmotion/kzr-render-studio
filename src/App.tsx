import { Suspense } from 'react'
import Layout from '@/components/ui/Layout'
import RenderCanvas from '@/components/canvas/RenderCanvas'

function App() {
  return (
    <Layout>
      <Suspense fallback={<div className="loading">Loading 3D Engine...</div>}>
        <RenderCanvas />
      </Suspense>
    </Layout>
  )
}

export default App
