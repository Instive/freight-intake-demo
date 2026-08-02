import { useRef, useState } from 'react'

/* Two ways a tender gets in: the watched inbox, or a PDF dropped in by hand.
   Both feed the identical read-and-review flow. */

export default function IntakeBar({ emailCount, onUpload }) {
  const inputRef = useRef(null)
  const [dragging, setDragging] = useState(false)
  const [error, setError] = useState(null)

  const accept = (file) => {
    if (!file) return
    const isPdf =
      file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')
    if (!isPdf) {
      setError(`"${file.name}" is not a PDF. Load tenders must be PDF files.`)
      return
    }
    setError(null)
    onUpload(file)
  }

  const onDrop = (e) => {
    e.preventDefault()
    setDragging(false)
    accept(e.dataTransfer.files?.[0])
  }

  return (
    <section className="intake">
      {/* --- source 1: the inbox --- */}
      <article className="intake__source">
        <div className="intake__icon" aria-hidden="true">
          <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2.4" y="4.4" width="15.2" height="11.2" rx="1.6" />
            <path d="m2.8 5.6 7.2 5 7.2-5" />
          </svg>
        </div>
        <div className="intake__body">
          <div className="intake__titlerow">
            <h3>Email inbox</h3>
            <span className="pill pill--cleared">Watching</span>
          </div>
          <p className="intake__sub mono">TENDERS@WHITAKERLOGISTICS.COM</p>
          <p className="intake__note">
            <strong className="num">{emailCount}</strong> load tenders read
            automatically today. Nothing to do — they arrive already filled in.
          </p>
        </div>
      </article>

      {/* --- source 2: direct upload --- */}
      <article
        className={`intake__source intake__drop${dragging ? ' is-dragging' : ''}${error ? ' is-error' : ''}`}
        onDragOver={(e) => {
          e.preventDefault()
          setDragging(true)
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
      >
        <div className="intake__icon intake__icon--accent" aria-hidden="true">
          <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10 13.2V3.6" />
            <path d="m6.2 7.2 3.8-3.6 3.8 3.6" />
            <path d="M3.6 12.4v2.6a1.6 1.6 0 0 0 1.6 1.6h9.6a1.6 1.6 0 0 0 1.6-1.6v-2.6" />
          </svg>
        </div>
        <div className="intake__body">
          <div className="intake__titlerow">
            <h3>Upload a load tender</h3>
          </div>
          <p className="intake__sub mono">PDF · DROP OR BROWSE</p>
          <p className="intake__note">
            Got one outside the inbox? Drop the PDF here and it is read the same way,
            in the same few seconds.
          </p>
          <div className="intake__actions">
            <button className="btn btn--primary intake__btn" onClick={() => inputRef.current?.click()}>
              Choose a PDF
            </button>
            <span className="intake__hint">or drag one onto this card</span>
          </div>
          {error && <p className="intake__error">{error}</p>}
        </div>

        <input
          ref={inputRef}
          type="file"
          accept="application/pdf,.pdf"
          className="intake__input"
          onChange={(e) => {
            accept(e.target.files?.[0])
            e.target.value = '' // let the same file be picked twice
          }}
        />

        {dragging && (
          <div className="intake__overlay">
            <span className="mono">RELEASE TO READ</span>
          </div>
        )}
      </article>
    </section>
  )
}
