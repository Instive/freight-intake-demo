import { ACTIVITY, BEFORE_AFTER, KPIS, ROUND_TRIP, WEEKLY_HOURS } from '../data/insights.js'

export default function Dashboard({ loads, onOpenLoad, onNavigate }) {
  const needsYou = loads.filter((l) => l.status !== 'cleared')

  return (
    <div className="view">
      {/* ---- what needs a person right now ---- */}
      {needsYou.length > 0 && (
        <section className="callout">
          <div className="callout__left">
            <span className="callout__count num">{needsYou.length}</span>
            <div>
              <h3>loads are waiting on you</h3>
              <p>
                Everything else was read, filled in and checked. These three need a decision
                only you can make.
              </p>
            </div>
          </div>
          <div className="callout__chips">
            {needsYou.map((l) => (
              <button key={l.id} className="minicard" onClick={() => onOpenLoad(l.id)}>
                <span className="mono minicard__id">{l.id}</span>
                <span className="minicard__why">
                  {l.status === 'hold'
                    ? 'Carrier failed 3 checks'
                    : !l.carrierId
                      ? 'Carrier needs mapping'
                      : 'Margin under your floor'}
                </span>
                <span className="minicard__go">→</span>
              </button>
            ))}
          </div>
        </section>
      )}

      {/* ---- KPIs ---- */}
      <section className="kpis">
        {KPIS.map((k) => (
          <article key={k.key} className="card kpi">
            <span className="label">{k.label}</span>
            <span className="kpi__value num">
              {k.value}
              <em>{k.unit}</em>
            </span>
            <p className="kpi__sub">{k.sub}</p>
          </article>
        ))}
      </section>

      {/* ---- before / after ---- */}
      <section className="ba">
        <header className="sec__head">
          <h2>Where the seventeen minutes went</h2>
          <p>The same load, handled the old way and the new way.</p>
        </header>
        <div className="ba__grid">
          <BaCard data={BEFORE_AFTER.before} tone="before" />
          <div className="ba__arrow" aria-hidden="true">
            →
          </div>
          <BaCard data={BEFORE_AFTER.after} tone="after" />
        </div>
      </section>

      {/* ---- chart ---- */}
      <section className="card chartcard">
        <header className="chartcard__head">
          <div>
            <h3>Hours spent typing loads into ITS Dispatch</h3>
            <p>Per week, across the whole intake desk.</p>
          </div>
          <div className="legend">
            <span className="legend__item">
              <span className="legend__swatch legend__swatch--before" />
              By hand
            </span>
            <span className="legend__item">
              <span className="legend__swatch legend__swatch--after" />
              With Instive
            </span>
          </div>
        </header>
        <HoursChart data={WEEKLY_HOURS} />
        <p className="chartcard__foot">
          Intake was switched on the week of Jun 23. The desk still reviews every load —
          it just stopped retyping them.
        </p>
      </section>

      {/* ---- activity ---- */}
      <section className="feedcard card">
        <header className="feedcard__head">
          <div>
            <h3>What happened today</h3>
            <p>Every action the agent took, in order.</p>
          </div>
          <button className="linkbtn" onClick={() => onNavigate('queue')}>
            Open the queue →
          </button>
        </header>
        <ul className="feed">
          {ACTIVITY.map((a) => (
            <li key={a.load + a.time} className="feed__row">
              <span className={`feed__dot feed__dot--${a.tone}`} />
              <span className="feed__time mono">{a.time}</span>
              <button className="feed__load mono" onClick={() => onOpenLoad(a.load)}>
                {a.load}
              </button>
              <span className="feed__text">{a.text}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* ---- the round trip, as the closing note ---- */}
      <section className="trip">
        <header className="sec__head">
          <h2>One load, start to finish</h2>
          <p>
            Three automations on the same screen: a document comes in, a decision gets
            made, a document goes out.
          </p>
        </header>
        <div className="trip__grid">
          {ROUND_TRIP.map((t, i) => (
            <article key={t.step} className="trip__card">
              <div className="trip__top">
                <span className="trip__step mono">{t.step}</span>
                <span className="trip__kind mono">{t.kind}</span>
              </div>
              <h3>{t.title}</h3>
              <p>{t.body}</p>
              {i < ROUND_TRIP.length - 1 && (
                <span className="trip__arrow" aria-hidden="true">
                  →
                </span>
              )}
            </article>
          ))}
        </div>
      </section>
    </div>
  )
}

function BaCard({ data, tone }) {
  return (
    <article className={`bacard bacard--${tone}`}>
      <span className="label">{data.title}</span>
      <div className="bacard__time">
        <span className="num">{data.time}</span>
        <em>{data.timeLabel}</em>
      </div>
      <ol className="bacard__steps">
        {data.steps.map((s, i) => (
          <li key={s}>
            <span className="bacard__num mono">{i + 1}</span>
            {s}
          </li>
        ))}
      </ol>
    </article>
  )
}

/* --------------------------------------------------------------------------
   Hand-written SVG bar chart. One measure, one axis. Colour encodes the
   before/after regime and every bar carries its value, so identity never
   rests on colour alone.
   -------------------------------------------------------------------------- */
function HoursChart({ data }) {
  const W = 720
  const H = 250
  const padL = 40
  const padR = 12
  const padT = 24
  const padB = 44
  const plotW = W - padL - padR
  const plotH = H - padT - padB
  const max = 40
  const ticks = [0, 10, 20, 30, 40]

  const slot = plotW / data.length
  const barW = Math.min(46, slot - 26)

  const yOf = (v) => padT + plotH - (v / max) * plotH

  // where the regime changes, for the divider
  const switchIndex = data.findIndex((d) => d.era === 'after')
  const switchX = padL + switchIndex * slot

  const roundedTop = (x, y, w, h, r = 4) => {
    const rr = Math.min(r, h)
    return `M${x},${y + h} L${x},${y + rr} Q${x},${y} ${x + rr},${y} L${x + w - rr},${y} Q${x + w},${y} ${x + w},${y + rr} L${x + w},${y + h} Z`
  }

  return (
    <div className="chart">
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Weekly hours spent entering loads, falling from 38 hours to under 6 after Instive was switched on">
        {/* gridlines */}
        {ticks.map((t) => (
          <g key={t}>
            <line
              className="chart__grid"
              x1={padL}
              x2={W - padR}
              y1={yOf(t)}
              y2={yOf(t)}
            />
            <text className="chart__ytick" x={padL - 10} y={yOf(t) + 4} textAnchor="end">
              {t}
            </text>
          </g>
        ))}

        {/* regime divider */}
        <line
          className="chart__divider"
          x1={switchX}
          x2={switchX}
          y1={padT - 8}
          y2={padT + plotH}
        />
        <text className="chart__dividerlabel" x={switchX + 8} y={padT - 12}>
          Instive switched on
        </text>

        {/* bars */}
        {data.map((d, i) => {
          const x = padL + i * slot + (slot - barW) / 2
          const y = yOf(d.hours)
          const h = padT + plotH - y
          return (
            <g key={d.week} className={`bar bar--${d.era}`}>
              <title>{`${d.week}: ${d.hours} hours`}</title>
              <rect
                className="bar__hit"
                x={padL + i * slot}
                y={padT}
                width={slot}
                height={plotH}
              />
              <path className="bar__fill" d={roundedTop(x, y, barW, h)} />
              <text className="bar__value" x={x + barW / 2} y={y - 8} textAnchor="middle">
                {d.hours}
              </text>
              <text
                className="bar__label"
                x={x + barW / 2}
                y={padT + plotH + 20}
                textAnchor="middle"
              >
                {d.week}
              </text>
            </g>
          )
        })}

        {/* baseline */}
        <line className="chart__axis" x1={padL} x2={W - padR} y1={padT + plotH} y2={padT + plotH} />
        <text className="chart__unit" x={padL - 10} y={padT + plotH + 34} textAnchor="end">
          HRS
        </text>
      </svg>
    </div>
  )
}
