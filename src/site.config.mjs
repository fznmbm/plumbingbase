// ─────────────────────────────────────────────────────────────
//  PlumbingBase — central business details.
//  Edit here, run `npm run build`, and every page updates.
// ─────────────────────────────────────────────────────────────
export const SITE = {
  name: "PlumbingBase",
  legalName: "PlumbingBase", // TODO: Ltd company name if registered
  url: "https://plumbingbase.co.uk",
  tagline: "Local Plumbers in Crawley",

  phoneDisplay: "07780 330558",
  phoneE164: "+447780330558",
  whatsapp: "447780330558", // international format, no + or spaces
  whatsappGreeting: "Hi PlumbingBase, I'd like a free quote.",
  offerShort: "Free quotes · No call-out charge",
  email: "plumbingbasecrawley@gmail.com",

  address: {
    street: "66 Forester Road",
    locality: "Crawley",
    region: "West Sussex",
    postcode: "RH10 6EG",
    country: "GB",
  },

  // 24h clock, Europe/London. Days: 0 = Sunday … 6 = Saturday
  hours: [
    { days: [1, 2, 3, 4, 5], open: "08:00", close: "18:00" },
    { days: [6], open: "08:00", close: "17:00" },
  ],
  hoursText: "Mon–Fri 8am–6pm · Sat 8am–5pm",
  hoursLong: [
    ["Monday – Friday", "8:00am – 6:00pm"],
    ["Saturday", "8:00am – 5:00pm"],
    ["Sunday", "Closed"],
  ],

  // Optional — leave '' to hide
  googleReviewsUrl: "", // e.g. https://g.page/r/XXXX/review
  facebookUrl: "",
  instagramUrl: "",

  // Cloudflare Turnstile public site key — leave '' to disable the widget
  turnstileSiteKey: "",

  // Add genuine customer reviews here (shown on home page when present)

  // Review sources
  myBuilderUrl: "https://www.mybuilder.com/profile/plumbingbase",

  // Genuine customer reviews — copy word for word from the source.
  // { name: 'Sarah', area: 'Pound Hill', date: '2026-10', rating: 5,
  //   job: 'Replace leaking kitchen tap', text: '...', source: 'MyBuilder' }
  // source: 'MyBuilder' or 'Google'. rating and job are optional.
  reviews: [
    {
      name: "Zeeshan",
      area: "Crawley",
      date: "2026-10-03",
      rating: 5,
      job: "Hot and cold shower bidet",
      text: "Amazing plumber, he did an amazing job to the point that I will be hiring him for other jobs that need doing around my house, as well as family friends’ house, please do hire him as he is very hardworking",
      source: "MyBuilder",
    },
    {
      name: "Joel Richards",
      area: "Crawley",
      date: "2026-09-30",
      rating: 5,
      job: "Dishwasher install",
      text: "He understood exactly what needed to be done and was very helpful. Arrived early and wrapped up really quickly. Installed my dishwasher & washing machine with 0 issues",
      source: "MyBuilder",
    },
    {
      name: "Asim",
      area: "Crawley",
      date: "2026-08-26",
      rating: 5,
      job: "Dishwasher - Setup",
      text: "Excellent, reliable service Arrived promptly, very professional and courteous. Installed the dishwasher efficiently, ensured all pipework and drainage were correctly fitted, and demonstrated it was fully operational. Left the area spotless and provided clear pricing upfront. Highly recommend for any plumbing or appliance installation!",
      source: "MyBuilder",
    },
    {
      name: "M",
      area: "Crawley",
      date: "2026-06-29",
      rating: 5,
      job: "Bidet Spray Installation & Dishwasher Plumbing Connection Required",
      text: "Aroos provided an excellent service installing our dishwasher. He adjusted the kitchen cabinet with precision to ensure the appliance fitted perfectly. The workmanship was tidy, efficient, and completed to a high standard. Highly recommended.",
      source: "MyBuilder",
    },
    {
      name: "Andrew",
      area: "Horsham",
      date: "2026-06-19",
      rating: 5,
      job: "Run hot and cold tap feeds from existing piping",
      text: "Great job by Aroos. A couple of pipe runs soldered up nicely for us. Tidy and friendly. Recommended!",
      source: "MyBuilder",
    },
    {
      name: "Victor Yusuf",
      area: "Burgess Hill",
      date: "2026-06-10",
      rating: 5,
      job: "Washing machine installation",
      text: "What a legend of a man. Will highly recommend.",
      source: "MyBuilder",
    },
  ],
};

export const AREAS = {
  crawley: [
    "Three Bridges",
    "Pound Hill",
    "Maidenbower",
    "Furnace Green",
    "Tilgate",
    "Southgate",
    "Broadfield",
    "Bewbush",
    "Ifield",
    "Gossops Green",
    "Langley Green",
    "Northgate",
    "West Green",
    "Forge Wood",
    "Kilnwood Vale",
    "Crawley Town Centre",
  ],
  nearby: [
    "Horley",
    "Gatwick",
    "Copthorne",
    "Crawley Down",
    "Turners Hill",
    "East Grinstead",
    "Horsham",
    "Faygate",
    "Rusper",
    "Handcross",
    "Billingshurst",
    "Burgess Hill",
    "Haywards Heath",
    "Reigate",
    "Redhill",
  ],
};
