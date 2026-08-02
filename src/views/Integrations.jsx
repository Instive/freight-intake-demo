const READS = [
  'Customer list — 12 accounts',
  'Carrier list — 15 carriers with MC numbers',
  'Equipment types — 4',
  'Your 12% margin floor',
  'Lane history, to suggest a carrier you have used before'
]

const WRITES = [
  'A new load record, once you press approve',
  'The carrier assignment you confirmed',
  'The rate confirmation, once you press send',
  'An audit line naming who approved it and when'
]

export default function Integrations({ autoPost, onToggleAutoPost }) {
  return (
    <div className="view">
      <section className="card intcard">
        <div className="intcard__head">
          <div className="intcard__mark mono">ITS</div>
          <div className="intcard__title">
            <h2>ITS Dispatch</h2>
            <p>Your transportation management system — where approved loads land.</p>
          </div>
          <span className="pill pill--cleared">Connected</span>
        </div>

        <dl className="intmeta">
          <div>
            <dt className="label">Account</dt>
            <dd className="mono">WHITAKER-LOGISTICS-4471</dd>
          </div>
          <div>
            <dt className="label">Connected</dt>
            <dd className="mono">JUN 21, 2026</dd>
          </div>
          <div>
            <dt className="label">Last write</dt>
            <dd className="mono">TODAY · 6:47 AM</dd>
          </div>
          <div>
            <dt className="label">Loads written</dt>
            <dd className="mono">284</dd>
          </div>
        </dl>

        <div className="perms">
          <div className="perms__col">
            <span className="label">What it reads from ITS Dispatch</span>
            <ul className="perms__list">
              {READS.map((r) => (
                <li key={r}>
                  <span className="perms__tick" aria-hidden="true">
                    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M3.5 8.5 6.5 11.5 12.5 5" />
                    </svg>
                  </span>
                  {r}
                </li>
              ))}
            </ul>
          </div>
          <div className="perms__col">
            <span className="label">What it writes back</span>
            <ul className="perms__list">
              {WRITES.map((w) => (
                <li key={w}>
                  <span className="perms__tick" aria-hidden="true">
                    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M3.5 8.5 6.5 11.5 12.5 5" />
                    </svg>
                  </span>
                  {w}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ---- the toggle that stays off ---- */}
      <section className="card toggcard">
        <div className="toggcard__row">
          <div className="toggcard__text">
            <h3>Post approved loads automatically</h3>
            <p>
              Turning this on would let the agent write a load into ITS Dispatch without a
              person pressing approve. It ships off, and we recommend leaving it off.
            </p>
          </div>
          <button
            className={`switch${autoPost ? ' is-on' : ''}`}
            role="switch"
            aria-checked={autoPost}
            onClick={() => onToggleAutoPost(!autoPost)}
          >
            <span className="switch__track">
              <span className="switch__knob" />
            </span>
            <span className="switch__state mono">{autoPost ? 'ON' : 'OFF'}</span>
          </button>
        </div>
        <div className={`toggcard__state${autoPost ? ' is-on' : ''}`}>
          {autoPost ? (
            <>
              <strong>Auto-post is on.</strong> Loads that pass every check will be written
              without review. Anything with a carrier flag or a margin below 12% still stops
              and waits for you.
            </>
          ) : (
            <>
              <strong>Human approval required.</strong> Every load stops at the review screen.
              Nothing reaches ITS Dispatch until someone reads it and presses approve.
            </>
          )}
        </div>
      </section>

      <section className="card srccard">
        <div className="srccard__row">
          <div>
            <h3>Intake inbox</h3>
            <p className="srccard__sub mono">TENDERS@WHITAKERLOGISTICS.COM</p>
          </div>
          <span className="pill pill--cleared">Watching</span>
        </div>
        <p className="srccard__body">
          Load tenders are read the moment they arrive — PDF
          attachments and plain email both. Nothing else in the mailbox is touched, and
          the agent never replies to anyone on your behalf.
        </p>
      </section>

      <section className="card srccard">
        <div className="srccard__row">
          <div>
            <h3>Direct PDF upload</h3>
            <p className="srccard__sub mono">FROM THE LOAD QUEUE · PDF ONLY</p>
          </div>
          <span className="pill pill--cleared">Available</span>
        </div>
        <p className="srccard__body">
          Not every tender arrives by email. Anyone on the desk can drop one straight onto
          the load queue and it is read the same way, in the same few seconds, and stops at
          the same review screen. Useful for tenders that came in by text, by portal, or
          from a customer who insists on calling first.
        </p>
      </section>

      <section className="card srccard srccard--muted">
        <div className="srccard__row">
          <div>
            <h3>FMCSA carrier records</h3>
            <p className="srccard__sub mono">READ ONLY · REFRESHED NIGHTLY</p>
          </div>
          <span className="pill pill--cleared">Connected</span>
        </div>
        <p className="srccard__body">
          Used to check MC numbers, registered domains, insurance certificates and contact
          details against what a tender claims. This is what caught the six
          suspect carriers this month.
        </p>
      </section>
    </div>
  )
}
