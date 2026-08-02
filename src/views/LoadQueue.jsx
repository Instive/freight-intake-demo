import { useState } from 'react'
import { marginOf, money } from '../data/loads.js'
import { carrierById, MARGIN_THRESHOLD } from '../data/master.js'

const FILTERS = [
  { key: 'all', label: 'All loads' },
  { key: 'needs', label: 'Needs you' },
  { key: 'cleared', label: 'Cleared' }
]

const STATUS = {
  cleared: ['pill--cleared', 'Cleared'],
  review: ['pill--review', 'In review'],
  hold: ['pill--hold', 'On hold']
}

export default function LoadQueue({ loads, onOpenLoad }) {
  const [filter, setFilter] = useState('all')

  const counts = {
    all: loads.length,
    needs: loads.filter((l) => l.status !== 'cleared').length,
    cleared: loads.filter((l) => l.status === 'cleared').length
  }

  const rows = loads.filter((l) =>
    filter === 'all' ? true : filter === 'cleared' ? l.status === 'cleared' : l.status !== 'cleared'
  )

  return (
    <div className="view">
      <div className="queuebar">
        <div className="segments">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              className={`segment${filter === f.key ? ' is-active' : ''}`}
              onClick={() => setFilter(f.key)}
            >
              {f.label}
              <span className="segment__count mono">{counts[f.key]}</span>
            </button>
          ))}
        </div>
        <p className="queuebar__note">
          Every one of these was read and filled in automatically. None of them are in ITS
          Dispatch yet.
        </p>
      </div>

      <div className="card tablewrap">
        <table className="table">
          <thead>
            <tr>
              <th className="label">Load</th>
              <th className="label">Lane</th>
              <th className="label">Customer</th>
              <th className="label">Carrier</th>
              <th className="label ta-r">Customer pays</th>
              <th className="label ta-r">You keep</th>
              <th className="label">Status</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {rows.map((l) => {
              const m = marginOf(l.customerRate, l.carrierRate)
              const carrier = carrierById(l.carrierId)
              const [cls, text] = STATUS[l.status] || STATUS.review
              const thin = m.percent < MARGIN_THRESHOLD
              return (
                <tr key={l.id} className="table__row" onClick={() => onOpenLoad(l.id)} tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') onOpenLoad(l.id)
                  }}
                >
                  <td>
                    <span className="mono td-id">{l.id}</span>
                    <span className="td-sub">{l.receivedAt}</span>
                  </td>
                  <td>
                    <span className="td-lane">
                      {l.pickupCity}, {l.pickupState} <span className="td-arrow">→</span>{' '}
                      {l.deliveryCity}, {l.deliveryState}
                    </span>
                    <span className="td-sub">
                      {l.equipment} · {Number(l.weight).toLocaleString('en-US')} lbs
                    </span>
                  </td>
                  <td>{l.customer}</td>
                  <td>
                    {carrier ? (
                      <>
                        <span>{carrier.name}</span>
                        <span className="td-sub mono">{carrier.mc}</span>
                      </>
                    ) : (
                      <span className="td-none mono">NOT MAPPED</span>
                    )}
                  </td>
                  <td className="ta-r num">{money(l.customerRate)}</td>
                  <td className="ta-r">
                    <span className="num td-margin">{money(m.dollars)}</span>
                    <span className={`td-sub num${thin ? ' td-sub--warn' : ''}`}>
                      {m.percent.toFixed(1)}%
                    </span>
                  </td>
                  <td>
                    <span className={`pill ${cls}`}>{text}</span>
                  </td>
                  <td className="ta-r td-go">→</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
