import { useCallback, useEffect, useState } from 'react'
import Sidebar from './components/Sidebar.jsx'
import Topbar from './components/Topbar.jsx'
import Toast from './components/Toast.jsx'
import Dashboard from './views/Dashboard.jsx'
import LoadQueue from './views/LoadQueue.jsx'
import LoadDetail from './views/LoadDetail.jsx'
import Insights from './views/Insights.jsx'
import Integrations from './views/Integrations.jsx'
import { LOADS, loadById } from './data/loads.js'

const TITLES = {
  dashboard: {
    title: 'Dashboard',
    subtitle: 'What the intake agent handled for you today'
  },
  queue: {
    title: 'Load Queue',
    subtitle: 'Every load read out of the inbox, newest first'
  },
  insights: {
    title: 'AI Insights',
    subtitle: 'What the numbers say after eight weeks of running this'
  },
  integrations: {
    title: 'Integrations',
    subtitle: 'Where approved loads go, and what stays under your control'
  }
}

export default function App() {
  const [view, setView] = useState('dashboard')
  const [activeId, setActiveId] = useState(null)
  const [records, setRecords] = useState({})
  const [toast, setToast] = useState(null)
  const [autoPost, setAutoPost] = useState(false)

  const activeLoad = activeId ? loadById(activeId) : null

  const navigate = useCallback((next) => {
    setView(next)
    setActiveId(null)
    window.scrollTo({ top: 0 })
  }, [])

  const openLoad = useCallback((id) => {
    setActiveId(id)
    setView('detail')
    window.scrollTo({ top: 0 })
  }, [])

  const backToQueue = useCallback(() => {
    setActiveId(null)
    setView('queue')
    window.scrollTo({ top: 0 })
  }, [])

  const saveRecord = useCallback((id, patch) => {
    setRecords((prev) => ({ ...prev, [id]: { ...prev[id], ...patch } }))
  }, [])

  const dismissToast = useCallback(() => setToast(null), [])

  // Esc always gets you out of the detail view.
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape' && view === 'detail') backToQueue()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [view, backToQueue])

  const statusOf = (load) => records[load.id]?.status || load.status
  const queue = LOADS.map((l) => ({ ...l, status: statusOf(l) }))

  const head =
    view === 'detail' && activeLoad
      ? {
          title: `Load ${activeLoad.id}`,
          subtitle: `${activeLoad.pickupCity}, ${activeLoad.pickupState} → ${activeLoad.deliveryCity}, ${activeLoad.deliveryState}`
        }
      : TITLES[view]

  return (
    <div className="shell">
      <Sidebar view={view} onNavigate={navigate} />

      <div className="main">
        <Topbar title={head.title} subtitle={head.subtitle} />

        <main className="page">
          {view === 'dashboard' && (
            <Dashboard loads={queue} onOpenLoad={openLoad} onNavigate={navigate} />
          )}
          {view === 'queue' && <LoadQueue loads={queue} onOpenLoad={openLoad} />}
          {view === 'detail' && activeLoad && (
            <LoadDetail
              key={activeLoad.id}
              load={activeLoad}
              record={records[activeLoad.id]}
              onSave={saveRecord}
              onBack={backToQueue}
              onToast={setToast}
            />
          )}
          {view === 'insights' && <Insights />}
          {view === 'integrations' && (
            <Integrations autoPost={autoPost} onToggleAutoPost={setAutoPost} />
          )}
        </main>
      </div>

      <Toast toast={toast} onDismiss={dismissToast} />
    </div>
  )
}
