import { carrierById } from './master.js'

/* ---------------------------------------------------------------------------
   Ten loads sitting in the intake queue.

   `extract` carries what the AI read out of the document and how sure it is.
   confidence === null means the AI would not guess — a human has to map it.
   --------------------------------------------------------------------------- */

const hi = (n) => ({ confidence: n })

export const LOADS = [
  /* ---- A. the normal flow: clean read, carrier left unmapped on purpose ---- */
  {
    id: 'LD-48219',
    status: 'review',
    receivedAt: 'Today · 7:42 AM',
    customer: 'Rio Grande Produce',
    pickupCity: 'Laredo',
    pickupState: 'TX',
    pickupZip: '78045',
    pickupDate: '2026-08-04',
    pickupWindow: '07:00 – 13:00',
    deliveryCity: 'Chicago',
    deliveryState: 'IL',
    deliveryZip: '60632',
    deliveryDate: '2026-08-06',
    deliveryWindow: '06:00 – 11:00',
    commodity: 'Fresh produce — mixed bell peppers',
    weight: 41600,
    equipment: 'Reefer',
    customerRate: 3184,
    carrierRate: 2615,
    carrierId: null, // ← deliberately unmapped
    docContact: '(956) 555-0142',
    fromEmail: 'tenders@riograndeproduce.com',
    poRef: 'PO-771208',
    pieces: '24 pallets',
    tempSpec: 'set 34°F continuous',
    extract: {
      customer: hi(99),
      pickup: hi(99),
      pickupDate: hi(98),
      delivery: hi(99),
      deliveryDate: hi(97),
      commodity: hi(96),
      weight: hi(99),
      equipment: hi(98),
      customerRate: hi(99)
    },
    notes: {
      carrier:
        'No carrier suggested. Two carriers ran Laredo → Chicago in the last 90 days at rates within $40 of each other, so neither is a clear default. Pick one and it will be remembered for this lane.'
    }
  },

  /* ---- B. the fraud-flagged load ------------------------------------------ */
  {
    id: 'LD-48226',
    status: 'hold',
    receivedAt: 'Today · 8:15 AM',
    customer: 'Halstead Consumer Goods',
    pickupCity: 'Fontana',
    pickupState: 'CA',
    pickupZip: '92337',
    pickupDate: '2026-08-05',
    pickupWindow: '09:00 – 15:00',
    deliveryCity: 'Phoenix',
    deliveryState: 'AZ',
    deliveryZip: '85043',
    deliveryDate: '2026-08-06',
    deliveryWindow: '08:00 – 12:00',
    commodity: 'Household paper goods, palletized',
    weight: 28940,
    equipment: 'Dry Van',
    customerRate: 1476,
    carrierRate: 1185,
    carrierId: 'swiftline',
    docContact: '(909) 555-0271',
    fromEmail: 'dispatch@swiftline-inc.com',
    poRef: 'PO-330914',
    pieces: '18 pallets',
    extract: {
      customer: hi(98),
      pickup: hi(99),
      pickupDate: hi(98),
      delivery: hi(99),
      deliveryDate: hi(98),
      commodity: hi(95),
      weight: hi(99),
      equipment: hi(97),
      customerRate: hi(99)
    },
    flags: [
      {
        title: 'Sender email domain does not match FMCSA registration',
        detail:
          'The tender naming this carrier came from swiftline-inc.com. The domain registered to MC-556214 with FMCSA is swiftlineinc.com. One character apart — a common double-brokering setup.'
      },
      {
        title: 'Certificate of insurance expires in 3 days',
        detail:
          'COI on file for Swiftline Inc lapses 08/06/2026. Delivery is scheduled 08/06/2026, so this load would run uninsured.'
      },
      {
        title: 'Contact phone number does not match the MC record',
        detail:
          'Document lists (909) 555-0271. The number on file for MC-556214 is (901) 555-0339. No change request was filed on this carrier profile.'
      }
    ]
  },

  /* ---- C. the thin-margin load -------------------------------------------- */
  {
    id: 'LD-48231',
    status: 'review',
    receivedAt: 'Today · 8:51 AM',
    customer: 'Auburn Steel Supply',
    pickupCity: 'Atlanta',
    pickupState: 'GA',
    pickupZip: '30336',
    pickupDate: '2026-08-04',
    pickupWindow: '06:00 – 12:00',
    deliveryCity: 'Charlotte',
    deliveryState: 'NC',
    deliveryZip: '28208',
    deliveryDate: '2026-08-05',
    deliveryWindow: '07:00 – 14:00',
    commodity: 'Structural steel tubing, banded bundles',
    weight: 44180,
    equipment: 'Flatbed',
    customerRate: 1892,
    carrierRate: 1763,
    carrierId: 'trinity-lane',
    docContact: '(704) 555-0117',
    fromEmail: 'ops@auburnsteelsupply.com',
    poRef: 'PO-559023',
    pieces: '11 bundles',
    extract: {
      customer: hi(99),
      pickup: hi(99),
      pickupDate: hi(99),
      delivery: hi(98),
      deliveryDate: hi(97),
      commodity: hi(94),
      weight: hi(99),
      equipment: hi(99),
      customerRate: hi(99)
    }
  },

  /* ---- the rest of the queue ---------------------------------------------- */
  {
    id: 'LD-48208',
    status: 'cleared',
    receivedAt: 'Today · 6:20 AM',
    customer: 'Kellerman Auto Parts',
    pickupCity: 'Dallas',
    pickupState: 'TX',
    pickupZip: '75212',
    pickupDate: '2026-08-04',
    pickupWindow: '08:00 – 16:00',
    deliveryCity: 'Memphis',
    deliveryState: 'TN',
    deliveryZip: '38118',
    deliveryDate: '2026-08-05',
    deliveryWindow: '07:00 – 12:00',
    commodity: 'Auto parts in returnable racks',
    weight: 22310,
    equipment: 'Dry Van',
    customerRate: 1734,
    carrierRate: 1382,
    carrierId: 'pinnacle-road',
    docContact: '(214) 555-0163',
    fromEmail: 'shipping@kellermanauto.com',
    poRef: 'PO-118455',
    pieces: '14 racks',
    extract: {
      customer: hi(99),
      pickup: hi(99),
      pickupDate: hi(98),
      delivery: hi(99),
      deliveryDate: hi(98),
      commodity: hi(96),
      weight: hi(99),
      equipment: hi(99),
      customerRate: hi(99)
    }
  },
  {
    id: 'LD-48212',
    status: 'cleared',
    receivedAt: 'Today · 6:47 AM',
    customer: 'Vertex Packaging',
    pickupCity: 'Savannah',
    pickupState: 'GA',
    pickupZip: '31408',
    pickupDate: '2026-08-04',
    pickupWindow: '07:00 – 15:00',
    deliveryCity: 'Nashville',
    deliveryState: 'TN',
    deliveryZip: '37210',
    deliveryDate: '2026-08-05',
    deliveryWindow: '06:00 – 13:00',
    commodity: 'Corrugated packaging stock',
    weight: 26750,
    equipment: 'Dry Van',
    customerRate: 2103,
    carrierRate: 1690,
    carrierId: 'blue-ridge',
    docContact: '(912) 555-0198',
    fromEmail: 'logistics@vertexpackaging.com',
    poRef: 'PO-620117',
    pieces: '22 pallets',
    extract: {
      customer: hi(98),
      pickup: hi(99),
      pickupDate: hi(99),
      delivery: hi(99),
      deliveryDate: hi(96),
      commodity: hi(95),
      weight: hi(99),
      equipment: hi(98),
      customerRate: hi(99)
    }
  },
  {
    id: 'LD-48235',
    status: 'cleared',
    receivedAt: 'Today · 9:03 AM',
    customer: 'Marlin Foods Distribution',
    pickupCity: 'Laredo',
    pickupState: 'TX',
    pickupZip: '78045',
    pickupDate: '2026-08-05',
    pickupWindow: '08:00 – 14:00',
    deliveryCity: 'Chicago',
    deliveryState: 'IL',
    deliveryZip: '60638',
    deliveryDate: '2026-08-07',
    deliveryWindow: '05:00 – 11:00',
    commodity: 'Frozen poultry, palletized',
    weight: 42900,
    equipment: 'Reefer',
    customerRate: 3427,
    carrierRate: 2818,
    carrierId: 'gulf-star',
    docContact: '(713) 555-0188',
    fromEmail: 'tenders@marlinfoods.com',
    poRef: 'PO-884201',
    pieces: '24 pallets',
    tempSpec: 'set 10°F continuous',
    extract: {
      customer: hi(99),
      pickup: hi(99),
      pickupDate: hi(98),
      delivery: hi(98),
      deliveryDate: hi(97),
      commodity: hi(97),
      weight: hi(99),
      equipment: hi(99),
      customerRate: hi(99)
    }
  },
  {
    id: 'LD-48240',
    status: 'cleared',
    receivedAt: 'Today · 9:28 AM',
    customer: 'Delta Plastics Inc',
    pickupCity: 'Fontana',
    pickupState: 'CA',
    pickupZip: '92335',
    pickupDate: '2026-08-05',
    pickupWindow: '10:00 – 16:00',
    deliveryCity: 'Phoenix',
    deliveryState: 'AZ',
    deliveryZip: '85009',
    deliveryDate: '2026-08-06',
    deliveryWindow: '07:00 – 13:00',
    commodity: 'Resin pellets in supersacks',
    weight: 39480,
    equipment: 'Dry Van',
    customerRate: 1358,
    carrierRate: 1074,
    carrierId: 'silver-spur',
    docContact: '(909) 555-0144',
    fromEmail: 'traffic@deltaplastics.com',
    poRef: 'PO-402876',
    pieces: '20 supersacks',
    extract: {
      customer: hi(99),
      pickup: hi(98),
      pickupDate: hi(99),
      delivery: hi(99),
      deliveryDate: hi(98),
      commodity: hi(93),
      weight: hi(99),
      equipment: hi(97),
      customerRate: hi(99)
    }
  },
  {
    id: 'LD-48244',
    status: 'cleared',
    receivedAt: 'Yesterday · 4:11 PM',
    customer: 'Cortez Building Products',
    pickupCity: 'Dallas',
    pickupState: 'TX',
    pickupZip: '75247',
    pickupDate: '2026-08-06',
    pickupWindow: '07:00 – 12:00',
    deliveryCity: 'Memphis',
    deliveryState: 'TN',
    deliveryZip: '38116',
    deliveryDate: '2026-08-07',
    deliveryWindow: '06:00 – 14:00',
    commodity: 'Prefabricated roof trusses',
    weight: 31260,
    equipment: 'Step Deck',
    customerRate: 2265,
    carrierRate: 1847,
    carrierId: 'redstone',
    docContact: '(469) 555-0125',
    fromEmail: 'dispatch@cortezbuilding.com',
    poRef: 'PO-717340',
    pieces: '9 bundles',
    extract: {
      customer: hi(98),
      pickup: hi(99),
      pickupDate: hi(97),
      delivery: hi(99),
      deliveryDate: hi(99),
      commodity: hi(92),
      weight: hi(99),
      equipment: hi(96),
      customerRate: hi(99)
    }
  },
  {
    id: 'LD-48249',
    status: 'cleared',
    receivedAt: 'Yesterday · 2:36 PM',
    customer: 'Nordic Cold Chain',
    pickupCity: 'Atlanta',
    pickupState: 'GA',
    pickupZip: '30349',
    pickupDate: '2026-08-06',
    pickupWindow: '05:00 – 11:00',
    deliveryCity: 'Charlotte',
    deliveryState: 'NC',
    deliveryZip: '28217',
    deliveryDate: '2026-08-07',
    deliveryWindow: '06:00 – 12:00',
    commodity: 'Chilled dairy, mixed SKUs',
    weight: 33540,
    equipment: 'Reefer',
    customerRate: 1647,
    carrierRate: 1298,
    carrierId: 'copper-creek',
    docContact: '(770) 555-0182',
    fromEmail: 'loads@nordiccoldchain.com',
    poRef: 'PO-905612',
    pieces: '16 pallets',
    tempSpec: 'set 36°F continuous',
    extract: {
      customer: hi(99),
      pickup: hi(99),
      pickupDate: hi(99),
      delivery: hi(98),
      deliveryDate: hi(98),
      commodity: hi(94),
      weight: hi(99),
      equipment: hi(99),
      customerRate: hi(99)
    }
  },
  {
    id: 'LD-48253',
    status: 'cleared',
    receivedAt: 'Yesterday · 11:52 AM',
    customer: 'Harborline Retail Group',
    pickupCity: 'Savannah',
    pickupState: 'GA',
    pickupZip: '31415',
    pickupDate: '2026-08-06',
    pickupWindow: '08:00 – 17:00',
    deliveryCity: 'Nashville',
    deliveryState: 'TN',
    deliveryZip: '37207',
    deliveryDate: '2026-08-08',
    deliveryWindow: '07:00 – 12:00',
    commodity: 'Seasonal retail goods, floor-loaded',
    weight: 24880,
    equipment: 'Dry Van',
    customerRate: 2019,
    carrierRate: 1655,
    carrierId: 'anchor-point',
    docContact: '(912) 555-0109',
    fromEmail: 'inbound@harborlineretail.com',
    poRef: 'PO-238471',
    pieces: 'Floor loaded',
    extract: {
      customer: hi(97),
      pickup: hi(99),
      pickupDate: hi(98),
      delivery: hi(99),
      deliveryDate: hi(96),
      commodity: hi(91),
      weight: hi(99),
      equipment: hi(98),
      customerRate: hi(99)
    }
  }
]

export const loadById = (id) => LOADS.find((l) => l.id === id) || null

/* ---------------------------------------------------------------------------
   Direct upload.

   A tender that never went through the inbox — someone dropped the PDF in by
   hand. It runs the identical read-and-review flow; only the source differs.
   --------------------------------------------------------------------------- */

const UPLOAD_BASE = {
  source: 'upload',
  status: 'review',
  customer: 'Southern Grain Partners',
  pickupCity: 'Savannah',
  pickupState: 'GA',
  pickupZip: '31408',
  pickupDate: '2026-08-07',
  pickupWindow: '06:00 – 14:00',
  deliveryCity: 'Nashville',
  deliveryState: 'TN',
  deliveryZip: '37211',
  deliveryDate: '2026-08-08',
  deliveryWindow: '07:00 – 13:00',
  commodity: 'Bagged rice, palletized',
  weight: 44120,
  equipment: 'Dry Van',
  customerRate: 2278,
  carrierRate: 1834,
  carrierId: 'cardinal-haul',
  docContact: '(912) 555-0173',
  fromEmail: 'ops@southerngrainpartners.com',
  poRef: 'PO-664019',
  pieces: '21 pallets',
  extract: {
    customer: hi(98),
    pickup: hi(99),
    pickupDate: hi(99),
    delivery: hi(99),
    deliveryDate: hi(97),
    commodity: hi(96),
    weight: hi(99),
    equipment: hi(98),
    customerRate: hi(99)
  }
}

let uploadSeq = 0

export function makeUploadedLoad(file) {
  uploadSeq += 1
  return {
    ...UPLOAD_BASE,
    id: `LD-${48261 + (uploadSeq - 1) * 3}`,
    fileName: file.name,
    fileSize: file.size,
    receivedAt: 'Just now'
  }
}

export const fileSize = (bytes) =>
  bytes >= 1024 * 1024
    ? `${(bytes / (1024 * 1024)).toFixed(1)} MB`
    : `${Math.max(1, Math.round(bytes / 1024))} KB`

/* --- formatting helpers ---------------------------------------------------- */

export const money = (n) =>
  n === '' || n === null || Number.isNaN(Number(n))
    ? '—'
    : `$${Number(n).toLocaleString('en-US', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      })}`

export const money2 = (n) =>
  `$${Number(n).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })}`

export const lbs = (n) => `${Number(n).toLocaleString('en-US')} lbs`

export const shortDate = (iso) => {
  const [y, m, d] = iso.split('-')
  return `${m}/${d}/${y}`
}

export const prettyDate = (iso) => {
  const dt = new Date(`${iso}T12:00:00`)
  return dt.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  })
}

export const marginOf = (customerRate, carrierRate) => {
  const cust = Number(customerRate) || 0
  const carr = Number(carrierRate) || 0
  const dollars = cust - carr
  const percent = cust > 0 ? (dollars / cust) * 100 : 0
  return { dollars, percent }
}

/* ---------------------------------------------------------------------------
   1. INBOUND — the load tender.

   This is what the customer sends. It describes the freight and what they will
   pay. It does NOT name a carrier and it never shows what a carrier gets paid —
   picking and pricing the carrier is the broker's job.

   Returns lines of parts. A part is either a plain string or
   { f: <fieldKey>, t: <text> } — the spans the AI read values from, which the
   detail view highlights and cross-links to the form beside it.
   --------------------------------------------------------------------------- */

const L = (...parts) => parts
const BLANK = null

const equipLine = (load) =>
  (load.equipment === 'Reefer'
    ? "53' Reefer"
    : load.equipment === 'Dry Van'
      ? "53' Dry Van"
      : `48' ${load.equipment}`) + (load.tempSpec ? `  (${load.tempSpec})` : '')

export function buildDocument(load) {
  const origin =
    load.source === 'upload'
      ? [L(`File:     ${load.fileName}`), L(`Uploaded: ${load.receivedAt} · by D. Whitaker`)]
      : [L(`From:     ${load.fromEmail}`), L(`Received: ${load.receivedAt}`)]

  return [
    L('LOAD TENDER — SHEET 1 OF 1'),
    L('────────────────────────────────────────────────────────'),
    ...origin,
    L(
      `Subject:  TENDER // ${load.pickupCity.toUpperCase()} ${load.pickupState} -> ${load.deliveryCity.toUpperCase()} ${load.deliveryState}`
    ),
    BLANK,
    L(`Tender #:     ${load.poRef.replace('PO-', 'TND-')}`),
    L(`Customer PO:  ${load.poRef}`),
    BLANK,
    L('SHIPPER / CUSTOMER'),
    L('  ', { f: 'customer', t: load.customer }),
    L(`  Attn: Load Planning   ${load.docContact}`),
    BLANK,
    L('PICKUP'),
    L('  ', { f: 'pickup', t: `${load.pickupCity}, ${load.pickupState} ${load.pickupZip}` }),
    L('  Date: ', { f: 'pickupDate', t: shortDate(load.pickupDate) }, `    Window: ${load.pickupWindow}`),
    BLANK,
    L('DELIVERY'),
    L('  ', { f: 'delivery', t: `${load.deliveryCity}, ${load.deliveryState} ${load.deliveryZip}` }),
    L('  Date: ', { f: 'deliveryDate', t: shortDate(load.deliveryDate) }, `    Window: ${load.deliveryWindow}`),
    BLANK,
    L('FREIGHT'),
    L('  Commodity:  ', { f: 'commodity', t: load.commodity }),
    L('  Weight:     ', { f: 'weight', t: `${Number(load.weight).toLocaleString('en-US')} lbs` }),
    L('  Equipment:  ', { f: 'equipment', t: equipLine(load) }),
    L(`  Pieces:     ${load.pieces}`),
    BLANK,
    L('RATE'),
    L('  Customer, linehaul all-in:  ', { f: 'customerRate', t: money2(load.customerRate) }),
    L('  Detention after 2 hrs:      $45.00/hr'),
    BLANK,
    L('Accept in writing before dispatching. Carrier selection'),
    L("is at the broker's discretion.")
  ]
}

/* ---------------------------------------------------------------------------
   2. OUTBOUND — the rate confirmation.

   Nothing is read here. Every line is written from the load record the user
   just approved, so it cannot disagree with what is in ITS Dispatch.

   Note what is absent: the customer's rate. The carrier is shown what the
   carrier is paid and nothing else.
   --------------------------------------------------------------------------- */

export const carrierEmail = (carrier) =>
  carrier ? `dispatch@${carrier.name.toLowerCase().replace(/[^a-z]/g, '')}.com` : ''

export function buildRateCon(load, values, carrier) {
  const today = new Date().toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })

  return [
    L('RATE CONFIRMATION — SHEET 1 OF 1'),
    L('────────────────────────────────────────────────────────'),
    L(`To:       ${carrierEmail(carrier)}`),
    L('From:     D. Whitaker · Whitaker Logistics'),
    L(`Date:     ${today}`),
    BLANK,
    L(`Load #:       ${load.id}`),
    L(`Customer PO:  ${load.poRef}`),
    BLANK,
    L('CARRIER'),
    L(`  ${carrier ? carrier.name : '—'}`),
    L(`  ${carrier ? carrier.mc : '—'}`),
    BLANK,
    L('PICKUP'),
    L(`  ${values.pickupCity}, ${values.pickupState} ${load.pickupZip}`),
    L(`  ${safeLong(values.pickupDate)}    ${load.pickupWindow}`),
    BLANK,
    L('DELIVERY'),
    L(`  ${values.deliveryCity}, ${values.deliveryState} ${load.deliveryZip}`),
    L(`  ${safeLong(values.deliveryDate)}    ${load.deliveryWindow}`),
    BLANK,
    L('FREIGHT'),
    L(`  Commodity:  ${values.commodity}`),
    L(`  Weight:     ${Number(values.weight || 0).toLocaleString('en-US')} lbs`),
    L(`  Equipment:  ${values.equipment}`),
    L(`  Pieces:     ${load.pieces}`),
    BLANK,
    L('CARRIER PAY'),
    L(`  Linehaul, all-in:       ${money2(values.carrierRate || 0)}`),
    L('  Detention after 2 hrs:  $45.00/hr'),
    BLANK,
    L('TERMS'),
    L('  Invoice with the signed BOL and this confirmation.'),
    L('  No double-brokering. No reconsignment without written'),
    L('  approval. Insurance must stay current through delivery.'),
    BLANK,
    L('  Signature: ____________________   Date: __________')
  ]
}

const safeLong = (iso) =>
  /^\d{4}-\d{2}-\d{2}$/.test(iso)
    ? new Date(`${iso}T12:00:00`).toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric'
      })
    : '—'
