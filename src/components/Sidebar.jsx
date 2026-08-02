const NAV = [
  {
    key: 'dashboard',
    label: 'Dashboard',
    icon: (
      <>
        <rect x="2.5" y="2.5" width="5.5" height="5.5" rx="1" />
        <rect x="10" y="2.5" width="5.5" height="5.5" rx="1" />
        <rect x="2.5" y="10" width="5.5" height="5.5" rx="1" />
        <rect x="10" y="10" width="5.5" height="5.5" rx="1" />
      </>
    )
  },
  {
    key: 'queue',
    label: 'Load Queue',
    icon: (
      <>
        <path d="M2.5 4.5h13M2.5 9h13M2.5 13.5h8" />
      </>
    )
  },
  {
    key: 'insights',
    label: 'AI Insights',
    icon: (
      <>
        <path d="M3 13.5V8M7 13.5V4.5M11 13.5V10M15 13.5V6.5" />
      </>
    )
  },
  {
    key: 'integrations',
    label: 'Integrations',
    icon: (
      <>
        <rect x="2.5" y="5" width="5" height="8" rx="1" />
        <rect x="10.5" y="5" width="5" height="8" rx="1" />
        <path d="M7.5 9h3" />
      </>
    )
  }
]

export default function Sidebar({ view, onNavigate }) {
  return (
    <aside className="rail">
      <div className="rail__brand">
        <img className="rail__mark" src="/brand/instive-mark.png" alt="" />
        <img
          className="rail__wordmark"
          src="/brand/instive-wordmark-light.png"
          alt="Instive"
        />
        <span className="rail__product">Freight Intake</span>
      </div>

      <nav className="rail__nav">
        {NAV.map((item) => (
          <button
            key={item.key}
            className={`rail__link${view === item.key ? ' is-active' : ''}`}
            onClick={() => onNavigate(item.key)}
          >
            <svg
              className="rail__icon"
              viewBox="0 0 18 18"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
            >
              {item.icon}
            </svg>
            {item.label}
          </button>
        ))}
      </nav>

      <div className="rail__foot">
        <div className="rail__user">
          <span className="rail__avatar mono">DW</span>
          <span>
            <strong>D. Whitaker</strong>
            <em>Operations Manager</em>
          </span>
        </div>
        <span className="rail__demo mono">DEMO · SAMPLE DATA ONLY</span>
      </div>
    </aside>
  )
}
