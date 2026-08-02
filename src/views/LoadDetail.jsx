import { useEffect, useMemo, useState } from 'react'
import {
  buildDocument,
  buildRateCon,
  carrierEmail,
  fileSize,
  marginOf,
  money,
  prettyDate,
  shortDate
} from '../data/loads.js'
import { CARRIERS, CUSTOMERS, EQUIPMENT, MARGIN_THRESHOLD, carrierById } from '../data/master.js'

/* --------------------------------------------------------------------------
   The processing sequence. Four stages, ~1.8s in total, then the form fades in.
   -------------------------------------------------------------------------- */
const stagesFor = (uploaded) => [
  {
    label: 'Reading the load tender',
    detail: uploaded
      ? 'Opening the PDF you uploaded'
      : 'Opening the PDF attached to the email'
  },
  { label: 'Extracting fields', detail: 'Pulling lane, dates, freight and rates off the page' },
  { label: 'Matching carrier to ITS Dispatch', detail: 'Checking the name and MC against your carrier list' },
  { label: 'Scoring confidence', detail: 'Marking anything it is not sure about' }
]
const STAGE_COUNT = 4
const STAGE_MS = 450

const STEPS = [
  { key: 'received', label: 'Tender received', plain: 'Document in' },
  { key: 'extracted', label: 'Extracted', plain: 'Document read' },
  { key: 'carrier', label: 'Carrier assigned', plain: 'You decide' },
  { key: 'review', label: 'Review', plain: 'Your check' },
  { key: 'pushed', label: 'Pushed to TMS', plain: 'In ITS Dispatch' },
  { key: 'sent', label: 'Rate con sent', plain: 'Document out' }
]

/* --------------------------------------------------------------------------
   Helpers
   -------------------------------------------------------------------------- */

function initialValues(load) {
  return {
    customer: load.customer,
    pickupCity: load.pickupCity,
    pickupState: load.pickupState,
    pickupDate: load.pickupDate,
    deliveryCity: load.deliveryCity,
    deliveryState: load.deliveryState,
    deliveryDate: load.deliveryDate,
    commodity: load.commodity,
    weight: String(load.weight),
    equipment: load.equipment,
    customerRate: String(load.customerRate),
    carrierId: load.carrierId || '',
    carrierRate: String(load.carrierRate)
  }
}

/* how many of the last 10 loads on this lane the suggested carrier ran —
   deterministic so the number never changes between renders */
const lanePriors = (load) => 4 + (Number(load.id.replace(/\D/g, '')) % 5)

/* what the AI says it read, per field — shown under every control */
function aiNote(load, key) {
  const conf = load.extract[key]?.confidence
  const pct = conf ? `${conf}% match` : null
  switch (key) {
    case 'customer':
      return `Read "${load.customer}" — matched to your ITS Dispatch customer list · ${pct}`
    case 'pickup':
      return `Read "${load.pickupCity}, ${load.pickupState} ${load.pickupZip}" from the pickup block · ${pct}`
    case 'pickupDate':
      return `Read "${shortDate(load.pickupDate)}" from the pickup block · ${pct}`
    case 'delivery':
      return `Read "${load.deliveryCity}, ${load.deliveryState} ${load.deliveryZip}" from the delivery block · ${pct}`
    case 'deliveryDate':
      return `Read "${shortDate(load.deliveryDate)}" from the delivery block · ${pct}`
    case 'commodity':
      return `Read "${load.commodity}" from the freight block · ${pct}`
    case 'weight':
      return `Read "${Number(load.weight).toLocaleString('en-US')} lbs" from the freight block · ${pct}`
    case 'equipment':
      return `Read the trailer line and mapped it to ${load.equipment} · ${pct}`
    case 'customerRate':
      return `Read "${money(load.customerRate)}" from the rate block · ${pct}`

    /* The two fields below are not on the tender at all — the broker decides
       them. The agent suggests, it never assigns. */
    case 'carrier': {
      const c = carrierById(load.carrierId)
      return c
        ? `Suggested from your lane history — ${c.name} ran ${lanePriors(load)} of your last 10 loads on ${load.pickupCity} → ${load.deliveryCity}. Confirm or change it.`
        : load.notes?.carrier || 'No carrier suggested. Pick one from your ITS Dispatch list.'
    }
    case 'carrierRate': {
      const c = carrierById(load.carrierId)
      return c
        ? `The rate you agreed with ${c.name}. Not from the tender — the customer never sees this number.`
        : 'What you pay the carrier. Set this once a carrier is assigned.'
    }
    default:
      return ''
  }
}

const ASSIGNED = new Set(['carrier', 'carrierRate'])

function chipFor(load, key, source) {
  if (source === 'manual') {
    return { tone: 'ok', text: key === 'carrier' ? 'You assigned this' : 'You set this' }
  }
  if (key === 'carrier') {
    return load.carrierId
      ? { tone: 'warn', text: 'Suggested · confirm' }
      : { tone: 'bad', text: 'Needs your input' }
  }
  if (key === 'carrierRate') return { tone: 'ok', text: 'Agreed rate' }

  const conf = load.extract[key]?.confidence
  if (conf === null || conf === undefined) return { tone: 'bad', text: 'Needs your input' }
  if (conf >= 95) return { tone: 'ok', text: `Confident · ${conf}%` }
  return { tone: 'warn', text: `Double-check · ${conf}%` }
}

const manualNote = (key) =>
  ASSIGNED.has(key)
    ? 'Set by you · remembered for this lane'
    : 'Manually corrected · remembered for this customer'

/* digits in state, thousands separators on screen */
const grouped = (s) => (s === '' ? '' : Number(s).toLocaleString('en-US'))
const digitsOnly = (s) => s.replace(/[^\d]/g, '')

const safePretty = (iso) => (/^\d{4}-\d{2}-\d{2}$/.test(iso) ? prettyDate(iso) : 'No date set')

/* --------------------------------------------------------------------------
   Component
   -------------------------------------------------------------------------- */

export default function LoadDetail({ load, record, onSave, onBack, onToast }) {
  const alreadyOpened = Boolean(record?.opened)

  const [stage, setStage] = useState(alreadyOpened ? STAGE_COUNT : -1)
  const [values, setValues] = useState(() => record?.values || initialValues(load))
  const [sources, setSources] = useState(() => record?.sources || {})
  const [flagsReviewed, setFlagsReviewed] = useState(Boolean(record?.flagsReviewed))
  const [pushed, setPushed] = useState(Boolean(record?.pushed))
  const [pushing, setPushing] = useState(false)
  const [sent, setSent] = useState(Boolean(record?.sent))
  const [sending, setSending] = useState(false)
  const [activeField, setActiveField] = useState(null)

  const uploaded = load.source === 'upload'
  const stages = useMemo(() => stagesFor(uploaded), [uploaded])
  const doneProcessing = stage >= STAGE_COUNT

  /* --- the visible processing sequence ---------------------------------- */
  useEffect(() => {
    if (alreadyOpened) return undefined
    const timers = []
    for (let i = 0; i <= STAGE_COUNT; i += 1) {
      timers.push(setTimeout(() => setStage(i), i * STAGE_MS))
    }
    return () => timers.forEach(clearTimeout)
  }, [alreadyOpened])

  /* Keep the record in sync so leaving and coming back does not replay the
     sequence or throw away an edit the presenter just made. */
  useEffect(() => {
    if (!doneProcessing) return
    onSave(load.id, { opened: true, values, sources, flagsReviewed })
  }, [doneProcessing, values, sources, flagsReviewed, load.id, onSave])

  const doc = useMemo(() => buildDocument(load), [load])
  const margin = marginOf(values.customerRate, values.carrierRate)
  const thinMargin = margin.percent > 0 && margin.percent < MARGIN_THRESHOLD
  const carrier = values.carrierId ? carrierById(values.carrierId) : null

  const flags = load.flags || []
  const flagsBlocking = flags.length > 0 && !flagsReviewed

  const unmapped = []
  if (!values.carrierId) unmapped.push('carrier')
  if (!values.customer) unmapped.push('customer')

  const blockReason = flagsBlocking
    ? 'Review flags before pushing'
    : unmapped.length > 0
      ? 'Pick a carrier before pushing'
      : null

  const setValue = (key, patch, fieldKey) => {
    setValues((v) => ({ ...v, ...patch }))
    if (fieldKey) setSources((s) => ({ ...s, [fieldKey]: 'manual' }))
  }

  const stepState = (index) => {
    if (index === 5) return sent ? 'done' : pushed ? 'active' : 'idle'
    if (index === 4) return pushed ? 'done' : 'idle'
    if (pushed) return 'done'
    if (index === 0) return 'done'
    if (index === 1) return doneProcessing ? 'done' : 'active'
    if (index === 2) return values.carrierId ? 'done' : doneProcessing ? 'active' : 'idle'
    return doneProcessing && values.carrierId ? 'active' : 'idle'
  }

  const handlePush = () => {
    if (blockReason || pushing || pushed) return
    setPushing(true)
    setTimeout(() => {
      setPushing(false)
      setPushed(true)
      onSave(load.id, {
        opened: true,
        values,
        sources,
        flagsReviewed,
        pushed: true,
        status: 'cleared'
      })
      const stamp = new Date().toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit'
      })
      onToast({
        title: `${load.id} is in ITS Dispatch`,
        body: `${values.pickupCity}, ${values.pickupState} → ${values.deliveryCity}, ${values.deliveryState} · ${carrier ? carrier.name : 'carrier'} · ${money(margin.dollars)} margin.`,
        audit: `AUDIT · ${load.id} · APPROVED BY D. WHITAKER · ${stamp} · 11 FIELDS WRITTEN`
      })
    }, 900)
  }

  const handleSend = () => {
    if (!pushed || sending || sent || !carrier) return
    setSending(true)
    setTimeout(() => {
      setSending(false)
      setSent(true)
      onSave(load.id, { sent: true })
      const stamp = new Date().toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit'
      })
      onToast({
        title: `Rate con sent to ${carrier.name}`,
        body: `Written from ${load.id} — nobody typed it. ${carrierEmail(carrier)} at ${stamp}.`,
        audit: `AUDIT · ${load.id} · RATE CON SENT BY D. WHITAKER · ${stamp} · AWAITING SIGNATURE`
      })
    }, 900)
  }

  const markReviewed = () => setFlagsReviewed(true)

  /* --- the processing curtain ------------------------------------------- */
  if (!doneProcessing) {
    return (
      <div className="detail">
        <button className="backlink" onClick={onBack}>
          ← Back to queue
        </button>
        <div className="processing card">
          <div className="processing__head">
            <span className="processing__pulse" />
            <div>
              <h2>
                {uploaded ? `Reading ${load.fileName}` : `Reading the tender for ${load.id}`}
              </h2>
              <p>
                Nothing is written to ITS Dispatch during this step. The agent only reads
                the document and prepares a draft for you.
              </p>
            </div>
          </div>
          <ol className="processing__stages">
            {stages.map((s, i) => (
              <li
                key={s.label}
                className={`pstage${i < stage ? ' is-done' : ''}${i === stage ? ' is-running' : ''}`}
              >
                <span className="pstage__marker">
                  {i < stage ? (
                    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M3.5 8.5 6.5 11.5 12.5 5" />
                    </svg>
                  ) : i === stage ? (
                    <span className="spinner" />
                  ) : null}
                </span>
                <span className="pstage__text">
                  <strong>{s.label}</strong>
                  <em>{s.detail}</em>
                </span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    )
  }

  /* --- the working view -------------------------------------------------- */
  const linked = (key) => (activeField === key ? ' is-linked' : '')

  const focusField = (key) => {
    setActiveField(key)
    const el = document.querySelector(`[data-field="${key}"] .ctl`)
    if (el) el.focus()
  }

  return (
    <div className="detail detail--ready">
      <button className="backlink" onClick={onBack}>
        ← Back to queue
      </button>

      {/* ---- header ---- */}
      <div className="detail__head">
        <div>
          <div className="detail__idrow">
            <span className="mono detail__id">{load.id}</span>
            <StatusPill status={pushed ? 'cleared' : load.status} />
            <span className="detail__meta">
              {uploaded
                ? `Uploaded ${load.receivedAt.toLowerCase()} from ${load.fileName}`
                : `Tender received ${load.receivedAt}`}
            </span>
          </div>
          <h2 className="detail__lane">
            {load.pickupCity}, {load.pickupState}
            <span className="detail__arrow">→</span>
            {load.deliveryCity}, {load.deliveryState}
          </h2>
        </div>
        <div className="detail__headright">
          <span className="label">Draft prepared in</span>
          <span className="num detail__timing">1.8s</span>
        </div>
      </div>

      {/* ---- stepper ---- */}
      <ol className="stepper">
        {STEPS.map((s, i) => {
          const state = stepState(i)
          return (
            <li key={s.key} className={`step is-${state}`}>
              <span className="step__dot">
                {state === 'done' ? (
                  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3.5 8.5 6.5 11.5 12.5 5" />
                  </svg>
                ) : (
                  <span className="step__num mono">{i + 1}</span>
                )}
              </span>
              <span className="step__text">
                <strong>{s.label}</strong>
                <em>{s.plain}</em>
              </span>
            </li>
          )
        })}
      </ol>

      {/* ---- fraud panel ---- */}
      {flags.length > 0 && (
        <section className={`flags${flagsReviewed ? ' is-reviewed' : ''}`}>
          <div className="flags__head">
            <span className="flags__icon" aria-hidden="true">
              <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round">
                <path d="M10 3.2 18 17H2z" />
                <path d="M10 8.2v3.6M10 14.4h.01" />
              </svg>
            </span>
            <div>
              <h3>
                {flagsReviewed
                  ? 'Carrier checks reviewed by you'
                  : 'This load is on hold — 3 carrier checks failed'}
              </h3>
              <p>
                {flagsReviewed
                  ? 'You cleared these flags. The load can be pushed, and the decision is recorded against your name.'
                  : 'The agent stopped before doing anything else. These are the exact checks that did not pass.'}
              </p>
            </div>
            {!flagsReviewed && (
              <button className="btn btn--ghost flags__action" onClick={markReviewed}>
                Mark as reviewed
              </button>
            )}
          </div>
          <ol className="flags__list">
            {flags.map((f, i) => (
              <li key={f.title}>
                <span className="flags__num mono">{String(i + 1).padStart(2, '0')}</span>
                <div>
                  <strong>{f.title}</strong>
                  <p>{f.detail}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>
      )}

      {/* ---- the two panels ---- */}
      <div className="panels">
        {/* LEFT — the document */}
        <section className="panel panel--doc">
          <div className="panel__head">
            <div>
              <span className="label">Step 1 · Document in</span>
              <h3>{uploaded ? 'The load tender you uploaded' : 'The load tender that arrived'}</h3>
              <p>
                Sent by your customer. Highlighted text is what the agent used — click any
                highlight to jump to the field it filled.
              </p>
              {uploaded && (
                <span className="filetag mono">
                  <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round">
                    <path d="M8 1.4H3.9a1.2 1.2 0 0 0-1.2 1.2v8.8a1.2 1.2 0 0 0 1.2 1.2h6.2a1.2 1.2 0 0 0 1.2-1.2V4.6z" />
                    <path d="M8 1.4v3.2h3.3" />
                  </svg>
                  {load.fileName} · {fileSize(load.fileSize)}
                </span>
              )}
            </div>
          </div>
          <div className="doc">
            <div className="doc__paper mono">
              {doc.map((line, i) =>
                line === null ? (
                  <div key={i} className="doc__blank" />
                ) : (
                  <div key={i} className="doc__line">
                    {line.map((part, j) =>
                      typeof part === 'string' ? (
                        <span key={j}>{part}</span>
                      ) : (
                        <button
                          key={j}
                          type="button"
                          className={`span${linked(part.f)}${
                            load.extract[part.f]?.confidence === null ? ' span--unmapped' : ''
                          }`}
                          onMouseEnter={() => setActiveField(part.f)}
                          onMouseLeave={() => setActiveField(null)}
                          onClick={() => focusField(part.f)}
                          title="Jump to the field this filled"
                        >
                          {part.t}
                        </button>
                      )
                    )}
                  </div>
                )
              )}
            </div>
          </div>
          <div className="doc__legend">
            <span className="doc__key" />
            Amber = text the agent lifted into the form. Everything else was ignored.
          </div>
        </section>

        {/* RIGHT — the mapped record */}
        <section className="panel panel--form">
          <div className="panel__head">
            <div>
              <span className="label">Step 2 · Your decision</span>
              <h3>The draft load record</h3>
              <p>
                This is what will be created in ITS Dispatch. Change anything you disagree
                with — your edit wins.
              </p>
            </div>
          </div>

          <div className="fillbar">
            <span className="fillbar__stat">
              <strong className="num">9</strong> of <strong className="num">9</strong>{' '}
              tender fields read for you · <strong className="num">2</strong> for you to set
            </span>
            {!values.carrierId && (
              <span className="fillbar__need mono">CARRIER NEEDED</span>
            )}
          </div>

          <div className="form">
            <Field
              fieldKey="customer"
              label="Customer"
              help="Who is paying for this load"
              load={load}
              sources={sources}
              onFocusField={setActiveField}
            >
              <select
                className="ctl"
                value={values.customer}
                onChange={(e) => setValue('customer', { customer: e.target.value }, 'customer')}
              >
                {CUSTOMERS.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </Field>

            <div className="row">
              <Field
                fieldKey="pickup"
                label="Pick up from"
                help="City and state"
                load={load}
                sources={sources}
                onFocusField={setActiveField}
              >
                <div className="citystate">
                  <input
                    className="ctl"
                    value={values.pickupCity}
                    onChange={(e) => setValue('pickup', { pickupCity: e.target.value }, 'pickup')}
                  />
                  <input
                    className="ctl ctl--state mono"
                    value={values.pickupState}
                    maxLength={2}
                    onChange={(e) =>
                      setValue('pickup', { pickupState: e.target.value.toUpperCase() }, 'pickup')
                    }
                  />
                </div>
              </Field>

              <Field
                fieldKey="pickupDate"
                label="Pickup date"
                help={safePretty(values.pickupDate)}
                load={load}
                sources={sources}
                onFocusField={setActiveField}
              >
                <input
                  className="ctl mono"
                  type="date"
                  value={values.pickupDate}
                  onChange={(e) => setValue('pickupDate', { pickupDate: e.target.value }, 'pickupDate')}
                />
              </Field>
            </div>

            <div className="row">
              <Field
                fieldKey="delivery"
                label="Deliver to"
                help="City and state"
                load={load}
                sources={sources}
                onFocusField={setActiveField}
              >
                <div className="citystate">
                  <input
                    className="ctl"
                    value={values.deliveryCity}
                    onChange={(e) => setValue('delivery', { deliveryCity: e.target.value }, 'delivery')}
                  />
                  <input
                    className="ctl ctl--state mono"
                    value={values.deliveryState}
                    maxLength={2}
                    onChange={(e) =>
                      setValue('delivery', { deliveryState: e.target.value.toUpperCase() }, 'delivery')
                    }
                  />
                </div>
              </Field>

              <Field
                fieldKey="deliveryDate"
                label="Delivery date"
                help={safePretty(values.deliveryDate)}
                load={load}
                sources={sources}
                onFocusField={setActiveField}
              >
                <input
                  className="ctl mono"
                  type="date"
                  value={values.deliveryDate}
                  onChange={(e) =>
                    setValue('deliveryDate', { deliveryDate: e.target.value }, 'deliveryDate')
                  }
                />
              </Field>
            </div>

            <Field
              fieldKey="commodity"
              label="What is on the truck"
              help="Commodity description"
              load={load}
              sources={sources}
              onFocusField={setActiveField}
            >
              <input
                className="ctl"
                value={values.commodity}
                onChange={(e) => setValue('commodity', { commodity: e.target.value }, 'commodity')}
              />
            </Field>

            <div className="row">
              <Field
                fieldKey="weight"
                label="Weight"
                help="Pounds"
                load={load}
                sources={sources}
                onFocusField={setActiveField}
              >
                <div className="suffixed">
                  <input
                    className="ctl mono"
                    inputMode="numeric"
                    value={grouped(values.weight)}
                    onChange={(e) =>
                      setValue('weight', { weight: digitsOnly(e.target.value) }, 'weight')
                    }
                  />
                  <span className="suffixed__unit mono">LBS</span>
                </div>
              </Field>

              <Field
                fieldKey="equipment"
                label="Trailer type"
                help="Equipment needed"
                load={load}
                sources={sources}
                onFocusField={setActiveField}
              >
                <select
                  className="ctl"
                  value={values.equipment}
                  onChange={(e) => setValue('equipment', { equipment: e.target.value }, 'equipment')}
                >
                  {EQUIPMENT.map((e) => (
                    <option key={e}>{e}</option>
                  ))}
                </select>
              </Field>
            </div>

            <Field
              fieldKey="customerRate"
              label="What the customer pays you"
              help="Linehaul, all in — straight off the tender"
              load={load}
              sources={sources}
              onFocusField={setActiveField}
            >
              <div className="prefixed">
                <span className="prefixed__unit mono">$</span>
                <input
                  className="ctl mono"
                  inputMode="numeric"
                  value={grouped(values.customerRate)}
                  onChange={(e) =>
                    setValue(
                      'customerRate',
                      { customerRate: digitsOnly(e.target.value) },
                      'customerRate'
                    )
                  }
                />
              </div>
            </Field>

            <div className="formsplit">
              <span className="label">You assign these — not on the tender</span>
              <p className="formsplit__note">
                The customer tells you what the load is worth. Who hauls it and what they
                get paid is your call.
              </p>
            </div>

            <Field
              fieldKey="carrier"
              label="Carrier hauling it"
              help="Picked from your ITS Dispatch carrier list"
              load={load}
              sources={sources}
              onFocusField={setActiveField}
              invalid={!values.carrierId}
            >
              <select
                className={`ctl${!values.carrierId ? ' ctl--invalid' : ''}`}
                value={values.carrierId}
                onChange={(e) => setValue('carrier', { carrierId: e.target.value }, 'carrier')}
              >
                <option value="">— Pick a carrier —</option>
                {CARRIERS.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} · {c.mc}
                  </option>
                ))}
              </select>
            </Field>

            <Field
              fieldKey="carrierRate"
              label="What you pay the carrier"
              help="Linehaul, all in"
              load={load}
              sources={sources}
              onFocusField={setActiveField}
            >
              <div className="prefixed">
                <span className="prefixed__unit mono">$</span>
                <input
                  className="ctl mono"
                  inputMode="numeric"
                  value={grouped(values.carrierRate)}
                  onChange={(e) =>
                    setValue(
                      'carrierRate',
                      { carrierRate: digitsOnly(e.target.value) },
                      'carrierRate'
                    )
                  }
                />
              </div>
            </Field>
          </div>

          {/* ---- margin ---- */}
          <div className={`margin${thinMargin ? ' margin--thin' : ''}`}>
            <div className="margin__label">
              <span className="label">What you keep on this load</span>
              <span className="margin__sum mono">
                {money(values.customerRate)} in − {money(values.carrierRate)} out
              </span>
            </div>
            <div className="margin__figures">
              <span className="margin__dollars num">{money(margin.dollars)}</span>
              <span className="margin__pct num">{margin.percent.toFixed(1)}%</span>
              {thinMargin && (
                <span className="margin__warn">
                  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
                    <path d="M8 2.6 14.4 13.8H1.6z" />
                    <path d="M8 6.6v3M8 11.4h.01" />
                  </svg>
                  Below {MARGIN_THRESHOLD}% threshold
                </span>
              )}
            </div>
            {thinMargin && (
              <p className="margin__note">
                You can still book this. It is flagged so the number is never a surprise
                later.
              </p>
            )}
          </div>

          {/* ---- commit ---- */}
          <div className="commit">
            <div className="commit__row">
              <button
                className="btn btn--primary commit__btn"
                onClick={handlePush}
                disabled={Boolean(blockReason) || pushing || pushed}
              >
                {pushing && <span className="spinner" />}
                {pushing
                  ? 'Pushing to ITS Dispatch…'
                  : pushed
                    ? 'Pushed to ITS Dispatch'
                    : 'Approve & Push to ITS Dispatch'}
              </button>
              {blockReason && <span className="commit__block mono">{blockReason}</span>}
              {pushed && (
                <span className="commit__done mono">
                  WRITTEN {new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                </span>
              )}
            </div>
            <p className="commit__promise">
              <span className="commit__lock" aria-hidden="true">
                <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="3.2" y="7" width="9.6" height="6.4" rx="1.4" />
                  <path d="M5.6 7V5.2a2.4 2.4 0 0 1 4.8 0V7" />
                </svg>
              </span>
              Nothing posts to ITS Dispatch until you approve.
            </p>
          </div>
        </section>
      </div>

      {/* ---- 3. document out: the rate con, written not read ---- */}
      <section className={`ratecon${sent ? ' is-sent' : ''}`}>
        <div className="ratecon__head">
          <div className="ratecon__title">
            <span className="label">Step 3 · Document out</span>
            <h3>Rate confirmation for the carrier</h3>
            <p>
              No reading, no guessing. Every line below is written from the record you
              just checked, so the two can never disagree.
            </p>
          </div>
          <span className="ratecon__typed mono">0 FIELDS TYPED BY HAND</span>
        </div>

        {!carrier ? (
          <div className="ratecon__empty">
            <strong>Assign a carrier and this writes itself.</strong>
            <p>
              There is nobody to send a rate confirmation to yet. Pick a carrier above and
              the document below fills in.
            </p>
          </div>
        ) : (
          <div className="ratecon__body">
            <div className="ratecon__paper mono">
              {buildRateCon(load, values, carrier).map((line, i) =>
                line === null ? (
                  <div key={i} className="doc__blank" />
                ) : (
                  <div key={i} className="doc__line">
                    {line.map((part, j) => (
                      <span key={j}>{part}</span>
                    ))}
                  </div>
                )
              )}
            </div>

            <aside className="ratecon__side">
              <div className="ratecon__to">
                <span className="label">Goes to</span>
                <strong>{carrier.name}</strong>
                <span className="mono ratecon__mc">{carrier.mc}</span>
                <span className="mono ratecon__email">{carrierEmail(carrier)}</span>
              </div>

              <p className="ratecon__guard">
                <span className="commit__lock" aria-hidden="true">
                  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <rect x="3.2" y="7" width="9.6" height="6.4" rx="1.4" />
                    <path d="M5.6 7V5.2a2.4 2.4 0 0 1 4.8 0V7" />
                  </svg>
                </span>
                The customer's rate is not on this document. The carrier sees{' '}
                {money(values.carrierRate)} and nothing else.
              </p>

              <button
                className="btn btn--primary ratecon__btn"
                onClick={handleSend}
                disabled={!pushed || sending || sent}
              >
                {sending && <span className="spinner" />}
                {sending ? 'Sending…' : sent ? 'Sent to carrier' : 'Send to carrier'}
              </button>

              {!pushed && (
                <span className="ratecon__block mono">APPROVE THE LOAD FIRST</span>
              )}

              {sent && (
                <div className="ratecon__after">
                  <strong>Waiting on the signed copy.</strong>
                  <p>
                    When {carrier.name} signs and sends it back, it is matched to {load.id}{' '}
                    and the carrier is marked confirmed. Nobody files it by hand.
                  </p>
                </div>
              )}
            </aside>
          </div>
        )}
      </section>
    </div>
  )
}

/* --------------------------------------------------------------------------
   One mapped control: label, control, confidence chip, and the hint line
   showing what the AI matched.
   -------------------------------------------------------------------------- */
function Field({ fieldKey, label, help, load, sources, children, onFocusField, invalid }) {
  const source = sources[fieldKey] === 'manual' ? 'manual' : 'ai'
  const chip = chipFor(load, fieldKey, source)
  const note = source === 'manual' ? manualNote(fieldKey) : aiNote(load, fieldKey)

  return (
    <div
      className={`field${invalid ? ' field--invalid' : ''}`}
      data-field={fieldKey}
      onMouseEnter={() => onFocusField(fieldKey)}
      onMouseLeave={() => onFocusField(null)}
      onFocus={() => onFocusField(fieldKey)}
    >
      <div className="field__top">
        <span className="field__label">{label}</span>
        <span className={`chip chip--${chip.tone}`}>{chip.text}</span>
      </div>
      {help && <span className="field__help">{help}</span>}
      {children}
      <p className={`hint${source === 'manual' ? ' hint--manual' : ''}${chip.tone === 'bad' ? ' hint--bad' : ''}`}>
        {note}
      </p>
    </div>
  )
}

function StatusPill({ status }) {
  const map = {
    cleared: ['pill--cleared', 'Cleared'],
    review: ['pill--review', 'In review'],
    hold: ['pill--hold', 'On hold']
  }
  const [cls, text] = map[status] || map.review
  return <span className={`pill ${cls}`}>{text}</span>
}
