// ─────────────────────────────────────────────────────────────
//  PlumbingBase — central business details.
//  Edit here, run `npm run build`, and every page updates.
// ─────────────────────────────────────────────────────────────
export const SITE = {
  name: 'PlumbingBase',
  legalName: 'PlumbingBase', // TODO: Ltd company name if registered
  url: 'https://plumbingbase.co.uk',
  tagline: 'Local Plumbers in Crawley',

  phoneDisplay: '07780 330558',
  phoneE164: '+447780330558',
  whatsapp: '447780330558', // international format, no + or spaces
  whatsappGreeting: "Hi PlumbingBase, I'd like to book a plumber.",
  email: 'plumbingbasecrawley@gmail.com',

  address: {
    street: '66 Forester Road',
    locality: 'Crawley',
    region: 'West Sussex',
    postcode: 'RH10 6EG',
    country: 'GB',
  },

  // 24h clock, Europe/London. Days: 0 = Sunday … 6 = Saturday
  hours: [
    { days: [1, 2, 3, 4, 5, 6], open: '08:00', close: '17:00' },
  ],
  hoursText: 'Mon–Sat 8am–5pm',
  hoursLong: [
    ['Monday – Friday', '8:00am – 5:00pm'],
    ['Saturday', '8:00am – 5:00pm'],
    ['Sunday', 'Closed'],
  ],

  // Optional — leave '' to hide
  googleReviewsUrl: '', // e.g. https://g.page/r/XXXX/review
  facebookUrl: '',
  instagramUrl: '',

  // Cloudflare Turnstile public site key — leave '' to disable the widget
  turnstileSiteKey: '',

  // Add genuine customer reviews here (shown on home page when present)
  // { name: 'Sarah, Pound Hill', text: '...', rating: 5 }
  reviews: [],
};

export const AREAS = {
  crawley: [
    'Three Bridges', 'Pound Hill', 'Maidenbower', 'Furnace Green', 'Tilgate',
    'Southgate', 'Broadfield', 'Bewbush', 'Ifield', 'Gossops Green',
    'Langley Green', 'Northgate', 'West Green', 'Forge Wood', 'Kilnwood Vale',
    'Crawley Town Centre',
  ],
  nearby: [
    'Horley', 'Gatwick', 'Copthorne', 'Crawley Down', 'Turners Hill',
    'East Grinstead', 'Horsham', 'Faygate', 'Rusper', 'Handcross',
    'Reigate', 'Redhill',
  ],
};
