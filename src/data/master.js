/* Master data as it would exist inside ITS Dispatch.
   These are the lists the AI matches extracted text against. */

export const CUSTOMERS = [
  'Auburn Steel Supply',
  'Cortez Building Products',
  'Delta Plastics Inc',
  'Halstead Consumer Goods',
  'Harborline Retail Group',
  'Kellerman Auto Parts',
  'Marlin Foods Distribution',
  'Nordic Cold Chain',
  'Pemberton Paper Co',
  'Rio Grande Produce',
  'Southern Grain Partners',
  'Vertex Packaging'
]

export const CARRIERS = [
  { id: 'anchor-point', name: 'Anchor Point Trucking', mc: 'MC-460712' },
  { id: 'bayou-freight', name: 'Bayou Freight Systems', mc: 'MC-651093' },
  { id: 'blue-ridge', name: 'Blue Ridge Haulers', mc: 'MC-967224' },
  { id: 'cardinal-haul', name: 'Cardinal Haul Co', mc: 'MC-733420' },
  { id: 'copper-creek', name: 'Copper Creek Transport', mc: 'MC-885031' },
  { id: 'gulf-star', name: 'Gulf Star Trucking', mc: 'MC-847156' },
  { id: 'northbound', name: 'Northbound Logistics', mc: 'MC-418876' },
  { id: 'pinnacle-road', name: 'Pinnacle Road Express', mc: 'MC-390845' },
  { id: 'redstone', name: 'Redstone Motor Freight', mc: 'MC-612903' },
  { id: 'ridgeline', name: 'Ridgeline Transport LLC', mc: 'MC-784512' },
  { id: 'silver-spur', name: 'Silver Spur Freight', mc: 'MC-518339' },
  { id: 'sunbelt', name: 'Sunbelt Carriers Inc', mc: 'MC-902337' },
  { id: 'swiftline', name: 'Swiftline Inc', mc: 'MC-556214' },
  { id: 'trinity-lane', name: 'Trinity Lane Carriers', mc: 'MC-729164' },
  { id: 'vantage-fleet', name: 'Vantage Fleet Services', mc: 'MC-304558' }
]

export const EQUIPMENT = ['Dry Van', 'Reefer', 'Flatbed', 'Step Deck']

export const MARGIN_THRESHOLD = 12 // percent — the floor this brokerage prices to

export const carrierById = (id) => CARRIERS.find((c) => c.id === id) || null
