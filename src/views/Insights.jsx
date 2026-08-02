import { INSIGHTS } from '../data/insights.js'

export default function Insights() {
  const i = INSIGHTS
  const maxSaved = Math.max(...i.savingsTrend.map((s) => s.hours))

  return (
    <div className="view">
      {/* ---- headline row ---- */}
      <section className="insight-top">
        <article className="card insight-hero">
          <span className="label">Time to enter one load</span>
          <div className="hero__pair">
            <div className="hero__side">
              <span className="hero__num num hero__num--before">{i.timeBefore}</span>
              <em>by hand</em>
            </div>
            <span className="hero__arrow" aria-hidden="true">
              →
            </span>
            <div className="hero__side">
              <span className="hero__num num">{i.timeAfter}</span>
              <em>reviewing what the agent prepared</em>
            </div>
          </div>
          <p className="hero__foot">
            Measured across {i.processed} loads. The 40 seconds is time a person actually
            spends reading and approving — the agent's own work is not counted against you.
          </p>
        </article>

        <article className="card insight-stat">
          <span className="label">Loads handled this week</span>
          <span className="insight-stat__num num">{i.processed}</span>
          <span className="insight-stat__delta">{i.processedDelta}</span>
        </article>
      </section>

      {/* ---- fields filled ---- */}
      <section className="card fillcard">
        <header className="sec__head sec__head--tight">
          <h3>How much of the form fills itself</h3>
          <p>Out of the eleven fields on a load record.</p>
        </header>
        <div className="fillcard__body">
          <div className="donutish">
            <div className="donutish__bar">
              <span className="donutish__fill" style={{ width: `${i.autoFilled}%` }} />
            </div>
            <div className="donutish__legend">
              <span>
                <strong className="num">{i.autoFilled}%</strong> filled by the agent
                <em>{i.autoFilledNote}</em>
              </span>
              <span>
                <strong className="num">{i.touched}%</strong> corrected by a person
                <em>Mostly commodity wording on scanned documents</em>
              </span>
            </div>
          </div>
          <ul className="accuracy">
            {i.fieldAccuracy.map((f) => (
              <li key={f.field}>
                <span className="accuracy__name">{f.field}</span>
                <span className="accuracy__track">
                  <span className="accuracy__fill" style={{ width: `${(f.pct - 90) * 10}%` }} />
                </span>
                <span className="accuracy__pct num">{f.pct}%</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ---- exceptions ---- */}
      <section className="excep">
        <header className="sec__head">
          <h2>What it stopped before it reached a customer</h2>
          <p>
            The agent never books around a problem. It halts and tells you what it found.
          </p>
        </header>
        <div className="excep__grid">
          <article className="card excep__card excep__card--hold">
            <span className="label">Suspect carriers</span>
            <span className="excep__num num">{i.fraudFlags}</span>
            <p>
              Email domains that did not match FMCSA, lapsed insurance certificates, and
              phone numbers that had quietly changed. Each one held until a person cleared
              it.
            </p>
          </article>
          <article className="card excep__card excep__card--warn">
            <span className="label">Loads under your margin floor</span>
            <span className="excep__num num">{i.marginFlags}</span>
            <p>
              Priced below 12%. All eleven were still approved — the point is that nobody
              found out after the fact.
            </p>
          </article>
          <article className="card excep__card">
            <span className="label">Cumulative hours saved</span>
            <div className="trend">
              {i.savingsTrend.map((s) => (
                <span key={s.month} className="trend__col">
                  <span
                    className="trend__bar"
                    style={{ height: `${Math.max(4, (s.hours / maxSaved) * 100)}%` }}
                    title={`${s.month}: ${s.hours} hours`}
                  />
                  <em className="mono">{s.month}</em>
                </span>
              ))}
            </div>
            <p className="excep__trendfoot">
              <strong className="num">126 hrs</strong> back in July — roughly three weeks
              of one person's time.
            </p>
          </article>
        </div>
      </section>

      {/* ---- recommendations ---- */}
      <section className="recs">
        <header className="sec__head">
          <h2>Two things worth doing next</h2>
          <p>Based on what the agent has seen in your inbox, not on general advice.</p>
        </header>
        <div className="recs__grid">
          {i.recommendations.map((r, n) => (
            <article key={r.title} className="card rec">
              <span className="rec__num mono">{String(n + 1).padStart(2, '0')}</span>
              <div>
                <h3>{r.title}</h3>
                <p>{r.body}</p>
                <button className="linkbtn">{r.action} →</button>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  )
}
