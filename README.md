# Instive · Freight Intake — sales demo

An interactive demo of automated load intake for a US freight brokerage. Rate
confirmations arrive in an inbox; the agent reads them, fills in the load record,
checks the carrier, works out the margin, and hands a draft to a human to approve.

Everything is hardcoded. No backend, no API calls, no network requests.

```bash
npm install
npm run dev
```

## Two ways a tender gets in

The top of **Load Queue** shows both intake sources side by side:

- **Email inbox** — watched, reads tenders as they arrive.
- **Upload a rate confirmation** — drop a PDF onto the card or click *Choose a PDF*.

An uploaded PDF creates a load and goes straight to the same read-and-review screen an
emailed tender lands on. The real filename and size are shown throughout; the extracted
values come from a fixture, since the demo has no backend and no parser.

## The three loads to demo

Open **Load Queue** and click into these in order. Each one opens full-screen and
runs a visible ~1.8s read of the document before the form appears.

| Load | What it shows |
|---|---|
| `LD-48219` | The normal flow. Everything reads cleanly except the carrier, which the agent refuses to guess. Pick one from the ITS Dispatch list — the chip turns green and the push unlocks. |
| `LD-48226` | The fraud catch. Three specific checks failed on Swiftline Inc. Push is blocked until you press **Mark as reviewed**. |
| `LD-48231` | The thin margin. 6.8% against a 12% floor, flagged right beside the figure. Still pushable, but never a surprise. |

On the left of every detail view is the original rate confirmation with the
extracted text highlighted. Hover or click a highlight to jump to the field it
filled — that link is the proof the numbers were not invented.

`Esc` returns to the queue from any load.

## Structure

```
src/
  styles/tokens.css     design tokens — colour, type, shape, motion
  styles/app.css        all component styling
  data/master.js        customers, carriers + MC numbers, equipment, margin floor
  data/loads.js         the 10 loads + the rate-confirmation document builder
  data/insights.js      dashboard and insights aggregates
  views/LoadDetail.jsx  the centrepiece
```

## Design

Instive light theme. Warehouse Paper `#F5F2EA` ground, Freight Slate `#0E1A24`
rail, and Hi-Vis Amber `#FFB23E` as the only accent — spent on primary action and
signal, nothing else. Green and red are reserved for status and never used for
decoration. Space Grotesk for display, Inter for body, JetBrains Mono for IDs,
codes and figures.

The dashboard chart is hand-written SVG. There are no chart libraries, no UI
libraries, and no CSS frameworks in this project — React and Vite only.
