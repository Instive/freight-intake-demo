export default function Topbar({ title, subtitle }) {
  return (
    <header className="topbar">
      <div className="topbar__inner">
        <div className="topbar__title">
          <h1>{title}</h1>
          {subtitle && <p>{subtitle}</p>}
        </div>

        <div className="topbar__right">
          <span className="conn">
            <span className="conn__dot" />
            ITS Dispatch connected
          </span>
        </div>
      </div>
    </header>
  )
}
