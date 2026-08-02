/* Aggregates behind the Dashboard and AI Insights views. */

export const KPIS = [
  {
    key: 'hours',
    value: '31.5',
    unit: 'hrs',
    label: 'Hours given back each week',
    sub: 'Time your team no longer spends retyping documents'
  },
  {
    key: 'loads',
    value: '284',
    unit: 'loads',
    label: 'Loads entered this month',
    sub: 'Read, filled in, and checked before anyone opened them'
  },
  {
    key: 'exceptions',
    value: '17',
    unit: 'caught',
    label: 'Problems caught before booking',
    sub: '6 suspect carriers · 11 loads priced under your floor'
  },
  {
    key: 'accuracy',
    value: '98.6',
    unit: '%',
    label: 'Fields read correctly',
    sub: 'Measured against what your team approved'
  }
]

/* Weekly hours spent keying loads into ITS Dispatch.
   Weeks 1–3 are the old way; week 4 is when intake was switched on. */
export const WEEKLY_HOURS = [
  { week: 'Jun 2', hours: 36.5, era: 'before' },
  { week: 'Jun 9', hours: 38.2, era: 'before' },
  { week: 'Jun 16', hours: 35.1, era: 'before' },
  { week: 'Jun 23', hours: 14.8, era: 'after' },
  { week: 'Jun 30', hours: 9.4, era: 'after' },
  { week: 'Jul 7', hours: 7.1, era: 'after' },
  { week: 'Jul 14', hours: 6.3, era: 'after' },
  { week: 'Jul 21', hours: 5.8, era: 'after' }
]

export const BEFORE_AFTER = {
  before: {
    title: 'The way it works today',
    time: '11 min',
    timeLabel: 'per load, by hand',
    steps: [
      'Open the rate con in the inbox and read it',
      'Retype 11 fields into ITS Dispatch, tabbing between screens',
      'Look up the carrier and check the MC number by hand',
      'Work out the margin on a calculator or a sticky note',
      'Catch the typo two days later when the invoice does not match'
    ]
  },
  after: {
    title: 'The way it works with Instive',
    time: '40 sec',
    timeLabel: 'per load, reviewing',
    steps: [
      'The document is read the moment it lands in the inbox',
      'All 11 fields arrive filled in, each one showing where it came from',
      'The carrier is matched to your ITS Dispatch list and checked against FMCSA',
      'Margin is calculated and flagged if it falls under your 12% floor',
      'You read it, fix anything you disagree with, and approve'
    ]
  }
}

export const ACTIVITY = [
  {
    time: '9:28 AM',
    load: 'LD-48240',
    text: 'Read the rate con and filled in 11 of 11 fields',
    tone: 'cleared'
  },
  {
    time: '8:51 AM',
    load: 'LD-48231',
    text: 'Margin came in at 6.8% — under your 12% floor',
    tone: 'review'
  },
  {
    time: '8:15 AM',
    load: 'LD-48226',
    text: 'Held for review — 3 carrier checks failed',
    tone: 'hold'
  },
  {
    time: '7:42 AM',
    load: 'LD-48219',
    text: 'Carrier name on the document does not match any MC on file',
    tone: 'review'
  },
  {
    time: '6:47 AM',
    load: 'LD-48212',
    text: 'Approved by D. Whitaker and pushed to ITS Dispatch',
    tone: 'cleared'
  },
  {
    time: '6:20 AM',
    load: 'LD-48208',
    text: 'Approved by D. Whitaker and pushed to ITS Dispatch',
    tone: 'cleared'
  }
]

export const INSIGHTS = {
  processed: 284,
  processedDelta: '+38 vs last week',
  timeBefore: '11 min 20 sec',
  timeAfter: '40 sec',
  autoFilled: 94,
  autoFilledNote: '10.3 of 11 fields on an average load',
  touched: 6,
  fraudFlags: 6,
  marginFlags: 11,
  savingsTrend: [
    { month: 'Mar', hours: 0 },
    { month: 'Apr', hours: 42 },
    { month: 'May', hours: 88 },
    { month: 'Jun', hours: 106 },
    { month: 'Jul', hours: 126 }
  ],
  fieldAccuracy: [
    { field: 'Pickup & delivery city', pct: 99.4 },
    { field: 'Rates', pct: 99.1 },
    { field: 'Weight', pct: 98.9 },
    { field: 'Dates', pct: 98.2 },
    { field: 'Equipment type', pct: 97.6 },
    { field: 'Commodity description', pct: 94.3 }
  ],
  recommendations: [
    {
      title: 'Two customers keep sending rate cons as scanned images',
      body:
        'Rio Grande Produce and Cortez Building Products send flattened scans instead of text PDFs. Those two take about 40% longer to read and account for 5 of the 6 low-confidence commodity fields this month. Ask them to send the original PDF and both go to full confidence.',
      action: 'Draft the request'
    },
    {
      title: 'Your 12% margin floor caught 11 loads this month',
      body:
        'All 11 were approved anyway, most of them on the Atlanta to Charlotte flatbed lane where spot rates ran hot in July. Either the floor is too high for that lane or those loads are worth repricing. Reviewing the lane is likely the faster win.',
      action: 'Open the lane breakdown'
    }
  ]
}
