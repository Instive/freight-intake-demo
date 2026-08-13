/* Aggregates behind the Dashboard and AI Insights views. */

export const KPIS = [
  {
    key: 'hours',
    value: '31.5',
    unit: 'hrs',
    label: 'Hours given back each week'
  },
  {
    key: 'loads',
    value: '284',
    unit: 'loads',
    label: 'Loads entered this month'
  },
  {
    key: 'exceptions',
    value: '17',
    unit: 'caught',
    label: 'Caught before booking',
    sub: '6 suspect carriers · 11 thin margins'
  },
  {
    key: 'accuracy',
    value: '98.6',
    unit: '%',
    label: 'Fields read correctly'
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
    time: '17 min',
    timeLabel: 'per load, by hand',
    steps: [
      'Open the load tender in the inbox and read it',
      'Retype 9 fields into ITS Dispatch, tabbing between screens',
      'Look up the carrier and check the MC number by hand',
      'Work out the margin on a calculator or a sticky note',
      'Fill in the rate con template again, retyping the same 9 fields',
      'Catch the typo two days later when the invoice does not match'
    ]
  },
  after: {
    title: 'The way it works with Instive',
    time: '40 sec',
    timeLabel: 'per load, reviewing',
    steps: [
      'The tender is read the moment it lands in the inbox',
      'All 9 fields arrive filled in, each one showing where it came from',
      'A carrier is suggested from your lane history and checked against FMCSA',
      'Margin is calculated and flagged if it falls under your 12% floor',
      'The rate con writes itself from the record and waits for you to send it',
      'You read it, fix anything you disagree with, and approve'
    ]
  }
}

/* The three automations, in the order they fire on a load. */
export const ROUND_TRIP = [
  {
    step: '01',
    kind: 'Extraction',
    title: 'Tender in',
    body: 'The customer sends a load tender. Nine fields are read off it and filled in.'
  },
  {
    step: '02',
    kind: 'Validation',
    title: 'Decision made',
    body: 'You assign the carrier. FMCSA and insurance checks fire, margin is calculated.'
  },
  {
    step: '03',
    kind: 'Generation',
    title: 'Rate con out',
    body: 'The rate confirmation writes itself from the record. No reading, nothing to get wrong.'
  }
]

export const ACTIVITY = [
  {
    time: '9:28 AM',
    load: 'LD-48240',
    text: 'Read the tender, filled 9 of 9 fields, rate con sent',
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
    text: 'No carrier suggested — two ran this lane at the same rate',
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
  autoFilledNote: '8.5 of 9 tender fields on an average load',
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
      title: 'Two customers keep sending tenders as scanned images',
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
