import { useEffect } from 'react'

export default function Toast({ toast, onDismiss }) {
  useEffect(() => {
    if (!toast) return undefined
    const t = setTimeout(onDismiss, 8000)
    return () => clearTimeout(t)
  }, [toast, onDismiss])

  if (!toast) return null

  return (
    <div className="toast" role="status">
      <span className="toast__check" aria-hidden="true">
        <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3.5 8.5 6.5 11.5 12.5 5" />
        </svg>
      </span>
      <div className="toast__body">
        <strong>{toast.title}</strong>
        <p>{toast.body}</p>
        {toast.audit && <span className="toast__audit mono">{toast.audit}</span>}
      </div>
      <button className="toast__close" onClick={onDismiss} aria-label="Dismiss">
        ×
      </button>
    </div>
  )
}
