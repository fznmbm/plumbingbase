// PlumbingBase static site builder — no dependencies. Run: node build.mjs
import {
  mkdirSync,
  writeFileSync,
  cpSync,
  rmSync,
  readFileSync,
} from "node:fs";
import { dirname, join } from "node:path";
import { SITE, AREAS } from "./src/site.config.mjs";
import { SERVICES } from "./src/content/services.mjs";
import {
  page,
  pageHero,
  icon,
  waIcon,
  btnWA,
  btnCall,
  btnBook,
  waLink,
  telLink,
  addressLine,
  faqList,
  faqSchema,
  breadcrumbSchema,
  ctaBand,
  esc,
} from "./src/lib/layout.mjs";
import { bookingForm, callbackForm } from "./src/lib/forms.mjs";

const OUT = "public";
const VERSION = Date.now().toString(36);
const pages = [];

rmSync(OUT, { recursive: true, force: true });
mkdirSync(OUT, { recursive: true });
cpSync("src/assets", OUT, { recursive: true });
cpSync("src/assets/img/favicon.ico", join(OUT, "favicon.ico"));

function write(path, html, { sitemap = true, priority = "0.7" } = {}) {
  const file =
    path === "/"
      ? "index.html"
      : path === "/404"
        ? "404.html"
        : `${path.slice(1)}.html`;
  const full = join(OUT, file);
  mkdirSync(dirname(full), { recursive: true });
  writeFileSync(full, html.replaceAll("__V__", VERSION));
  if (sitemap) pages.push({ path, priority });
}

// ── Shared blocks ───────────────────────────────────────────
const promoCards = `
<a class="svc-card svc-promo wa" href="${waLink("Hi PlumbingBase, can you help with this? ")}" target="_blank" rel="noopener">
  <span class="svc-ic">${waIcon()}</span>
  <h3>Get a free quote</h3>
  <p>Send us a photo of the problem on WhatsApp and we'll often quote straight away. No call-out charge.</p>
  <span class="more">Send a photo ${icon("arrow-right")}</span>
</a>
<a class="svc-card svc-promo" href="${telLink}">
  <span class="svc-ic">${icon("siren")}</span>
  <h3>Plumbing emergency?</h3>
  <p>Burst pipe or major leak? Turn off your stopcock and call us. Urgent jobs are prioritised — with no call-out charge.</p>
  <span class="more">Call ${SITE.phoneDisplay} ${icon("arrow-right")}</span>
</a>`;
const serviceCards = (list = SERVICES, promos = list === SERVICES) =>
  `<div class="svc-grid${promos ? " svc-grid-full" : ""}">${list
    .map(
      (s) => `<a class="svc-card" href="/services/${s.slug}">
  <span class="svc-ic">${icon(s.icon)}</span>
  <h3>${s.name}</h3>
  <p>${s.short}</p>
  <span class="more">Learn more ${icon("arrow-right")}</span>
</a>`,
    )
    .join("")}${promos ? promoCards : ""}</div>`;

const steps = `
<div class="steps">
  <div class="step"><span class="step-n">1</span>${icon("message-circle", "i step-i")}<h3>Tell us what's wrong</h3><p>WhatsApp us a photo, call, or fill in the online booking form. It only takes a minute.</p></div>
  <div class="step"><span class="step-n">2</span>${icon("calendar-check", "i step-i")}<h3>We confirm a time</h3><p>We'll reply with a clear price guide and a time slot that suits you — including same-day for urgent jobs where we can.</p></div>
  <div class="step"><span class="step-n">3</span>${icon("thumbs-up", "i step-i")}<h3>Job done properly</h3><p>Your plumber arrives on time, fixes the problem, tests everything and leaves your home clean and tidy.</p></div>
</div>`;

const whyUs = `
<div class="why-grid">
  <div class="why">${icon("map-pin")}<div><h3>Genuinely local</h3><p>Based on Forester Road in Crawley, so we're never far away from you.</p></div></div>
  <div class="why">${icon("badge-pound-sterling")}<div><h3>Free quotes, no call-out charge</h3><p>You'll get a clear price before any work starts — and we never charge just to turn up.</p></div></div>
  <div class="why">${icon("clock")}<div><h3>On time, every time</h3><p>We turn up when we say we will — and keep you updated if anything changes.</p></div></div>
  <div class="why">${icon("sparkles")}<div><h3>Clean and respectful</h3><p>Dust sheets down, shoes covered and everything tidied before we leave.</p></div></div>
  <div class="why">${waIcon()}<div><h3>Easy WhatsApp booking</h3><p>Send a photo of the problem and get a quick, friendly reply.</p></div></div>
  <div class="why">${icon("shield-check")}<div><h3>Work done right</h3><p>Quality parts, careful workmanship and every job tested before we go.</p></div></div>
</div>`;

const areaChips = (list) =>
  `<ul class="chips">${list.map((a) => `<li>${icon("map-pin")}${a}</li>`).join("")}</ul>`;

const GENERAL_FAQS = [
  [
    "How do I book a plumber?",
    `The quickest way is to WhatsApp us on ${SITE.phoneDisplay} — send a photo of the problem if you can. You can also call us or use our online booking form, and we'll confirm a time with you.`,
  ],
  [
    "What are your opening hours?",
    `We're open Monday to Friday, 8am to 6pm, and Saturday, 8am to 5pm. We're closed on Sundays. Messages sent outside these hours are answered first thing the next working morning.`,
  ],
  [
    "Do you handle emergencies?",
    "Yes. We prioritise urgent jobs such as burst pipes and major leaks during our opening hours. We don't currently offer a 24-hour service.",
  ],
  [
    "Which areas do you cover?",
    "We cover all of Crawley — including Three Bridges, Pound Hill, Maidenbower, Tilgate, Broadfield, Bewbush, Ifield and Forge Wood — plus nearby towns such as Horley, Gatwick, Horsham, East Grinstead, Reigate and Redhill.",
  ],
  [
    "Are your quotes free?",
    "Yes, always. Send us a photo on WhatsApp and we can often quote straight away. For bigger jobs we'll arrange a visit to quote, which is also free and with no obligation.",
  ],
  [
    "Do you charge a call-out fee?",
    "No. There's no call-out charge for any job. You only pay for the work you agree to.",
  ],
  [
    "Do you work on boilers or gas appliances?",
    "No. We don't carry out any gas or boiler work, and we don't offer drainage or guttering services. We focus on water plumbing — leaks, pipework, taps, toilets, showers, hot water cylinders, pumps, radiators, bathrooms and kitchens.",
  ],
  [
    "How do I pay?",
    "Payment is due when the job is complete. We accept bank transfer and card payments, and we'll provide an invoice for every job.",
  ],
  [
    "Can I send photos before booking?",
    "Yes — please do! A photo or short video on WhatsApp helps us understand the problem, bring the right parts and give you a more accurate price.",
  ],
];

// ── HOME ────────────────────────────────────────────────────
const reviewDate = (d) => {
  if (!d) return "";
  const [y, m] = String(d).split("-");
  return m
    ? new Date(Date.UTC(+y, +m - 1, 1)).toLocaleDateString("en-GB", {
        month: "long",
        year: "numeric",
        timeZone: "UTC",
      })
    : y;
};
const reviewSourceUrl = (src) =>
  src === "Google" ? SITE.googleReviewsUrl : SITE.myBuilderUrl;

const reviewCard = (r) => `
<figure class="review">
  <div class="review-top">
    ${r.rating ? `<div class="stars" aria-label="${r.rating} out of 5 stars">${icon("star").repeat(Math.round(r.rating))}</div>` : "<span></span>"}
    ${icon("quote", "i review-q")}
  </div>
  ${r.job ? `<p class="review-job">${esc(r.job)}</p>` : ""}
  <blockquote>${esc(r.text)}</blockquote>
  <figcaption>
    <span><b>${esc(r.name)}</b>${r.area ? `, ${esc(r.area)}` : ""}<small>${reviewDate(r.date)}</small></span>
    ${
      reviewSourceUrl(r.source)
        ? `<a class="review-src" href="${reviewSourceUrl(r.source)}" target="_blank" rel="noopener">${icon("badge-check")}${esc(r.source || "MyBuilder")}</a>`
        : `<span class="review-src">${icon("badge-check")}${esc(r.source || "MyBuilder")}</span>`
    }
  </figcaption>
</figure>`;

const reviewButtons = () => `<div class="btn-row center mt">
  ${SITE.myBuilderUrl ? `<a class="btn btn-outline" href="${SITE.myBuilderUrl}" target="_blank" rel="noopener">Read all our reviews on MyBuilder ${icon("external-link")}</a>` : ""}
  ${SITE.googleReviewsUrl ? `<a class="btn btn-outline" href="${SITE.googleReviewsUrl}" target="_blank" rel="noopener">Read our Google reviews ${icon("external-link")}</a>` : ""}
</div>`;

const reviewsBlock = `
<section class="section reviews-sec" id="reviews">
  <div class="wrap">
    <div class="sec-head">
      <p class="eyebrow">Customer reviews</p>
      <h2>What our customers say</h2>
      <p>Genuine feedback from customers we've worked for, shown exactly as it was posted.</p>
    </div>
    ${
      SITE.reviews.length
        ? `<div class="reviews">${SITE.reviews.map(reviewCard).join("")}</div>`
        : `<div class="reviews-empty card">${icon("badge-check")}<p>See verified feedback from our customers on our MyBuilder profile.</p></div>`
    }
    ${reviewButtons()}
  </div>
</section>`;

write(
  "/",
  page({
    path: "/",
    title:
      "Plumber in Crawley | Free Quotes, No Call-Out Charge | PlumbingBase",
    desc: `Local plumbers in Crawley, West Sussex. Free quotes and no call-out charge. Leaks, showers, hot water cylinders, radiators and more. WhatsApp or call ${SITE.phoneDisplay}.`,
    schema: [faqSchema(GENERAL_FAQS.slice(0, 6))],
    body: `
<section class="hero">
  <div class="hero-bg" aria-hidden="true"></div>
  <div class="wrap hero-in">
    <div class="hero-copy">
      <p class="pill" data-status-pill>${icon("clock")}<span data-status-text>${SITE.hoursText}</span></p>
      <h1>Reliable Local <span>Plumbers</span> in Crawley</h1>
      <p class="lead">From dripping taps to burst pipes, PlumbingBase delivers fast, tidy and honestly priced plumbing across Crawley and the surrounding towns. Free quotes and no call-out charge.</p>
      <div class="btn-row">
        ${btnWA("Free Quote on WhatsApp", "btn-lg")}
        ${btnCall(`Call ${SITE.phoneDisplay}`, "btn-lg btn-light")}
      </div>
      <ul class="hero-ticks">
        <li>${icon("check")}Free quotes</li>
        <li>${icon("check")}No call-out charge</li>
        <li>${icon("check")}Open 6 days a week</li>
      </ul>
    </div>
    <div class="hero-form">${callbackForm({ title: "Get a quick call back", sub: "Tell us what you need and we'll ring you back." })}</div>
  </div>
</section>

<section class="trust-strip">
  <div class="wrap trust-in">
    <div>${icon("map-pin")}<span><b>Crawley based</b>Local, nearby team</span></div>
    <div>${icon("siren")}<span><b>Emergency call-outs</b>Urgent jobs prioritised</span></div>
    <div>${icon("badge-pound-sterling")}<span><b>No call-out charge</b>Free quotes on every job</span></div>
    <div>${waIcon()}<span><b>WhatsApp booking</b>Quick, easy replies</span></div>
  </div>
</section>

<section class="section" id="services">
  <div class="wrap">
    <div class="sec-head">
      <p class="eyebrow">Our services</p>
      <h2>Everyday plumbing, done properly</h2>
      <p>Whatever the problem, our plumbers get it sorted with care — first time wherever possible.</p>
    </div>
    ${serviceCards()}
  </div>
</section>

<section class="section alt">
  <div class="wrap">
    <div class="sec-head"><p class="eyebrow">How it works</p><h2>Booking a plumber is simple</h2></div>
    ${steps}
    <div class="btn-row center mt">${btnWA()}${btnBook("Book Online")}</div>
  </div>
</section>

<section class="emergency">
  <div class="wrap emergency-in">
    <div class="em-ic">${icon("siren")}</div>
    <div>
      <h2>Burst pipe or major leak?</h2>
      <p>Turn off your stopcock, then call or WhatsApp us now. Urgent jobs are prioritised during opening hours (${SITE.hoursText}) — with no call-out charge.</p>
    </div>
    <div class="btn-row">${btnCall("Call Now", "btn-lg btn-light")}${btnWA("WhatsApp", "btn-lg", "Hi PlumbingBase, I have a plumbing emergency: ")}</div>
  </div>
</section>

<section class="section">
  <div class="wrap split">
    <div>
      <p class="eyebrow">Why choose us</p>
      <h2>A plumber you can trust in your home</h2>
      <p class="lead-sm">We know letting someone into your home matters. That's why we focus on clear communication, fair prices and tidy, careful work on every job — big or small.</p>
      ${btnBook("Book Your Plumber")}
    </div>
    ${whyUs}
  </div>
</section>

<section class="section alt">
  <div class="wrap">
    <div class="sec-head"><p class="eyebrow">Areas we cover</p><h2>Serving Crawley &amp; surrounding towns</h2>
    <p>Based at ${addressLine}, we cover every part of Crawley and nearby towns.</p></div>
    ${areaChips([...AREAS.crawley.slice(0, 10), ...AREAS.nearby.slice(0, 6)])}
    <p class="center mt"><a class="link-arrow" href="/areas">See all areas we cover ${icon("arrow-right")}</a></p>
  </div>
</section>

${reviewsBlock}

<section class="section alt">
  <div class="wrap narrow">
    <div class="sec-head"><p class="eyebrow">FAQ</p><h2>Common questions</h2></div>
    ${faqList(GENERAL_FAQS.slice(0, 6))}
    <p class="center mt"><a class="link-arrow" href="/faq">More questions answered ${icon("arrow-right")}</a></p>
  </div>
</section>

${ctaBand()}`,
  }),
  { priority: "1.0" },
);

// ── SERVICES INDEX ──────────────────────────────────────────
write(
  "/services",
  page({
    path: "/services",
    title: "Plumbing Services in Crawley | PlumbingBase",
    desc: "Plumbing services in Crawley: emergency plumbing, leaks, pipework, taps, toilets, electric showers, hot water cylinders, pumps and radiators. Free quotes, no call-out charge.",
    schema: [
      breadcrumbSchema([
        ["Home", "/"],
        ["Services", "/services"],
      ]),
    ],
    body: `
${pageHero({ eyebrow: "Our services", h1: "Plumbing Services in Crawley", lead: "Domestic plumbing for homes, landlords and small businesses across Crawley — fixed properly, priced fairly. Free quotes and no call-out charge on every job.", crumbs: [["Services"]] })}
<section class="section">
  <div class="wrap">${serviceCards()}
    <div class="note-box mt">${icon("info")}<p><b>Please note:</b> we don't carry out gas, boiler, drainage or guttering work. Not sure if we can help? <a href="${waLink("Hi PlumbingBase, can you help with: ")}" target="_blank" rel="noopener">Just ask on WhatsApp</a>.</p></div>
  </div>
</section>
<section class="section alt"><div class="wrap"><div class="sec-head"><h2>How booking works</h2></div>${steps}</div></section>
${ctaBand()}`,
  }),
  { priority: "0.9" },
);

// ── SERVICE PAGES ───────────────────────────────────────────
for (const s of SERVICES) {
  const path = `/services/${s.slug}`;
  const others = SERVICES.filter((x) => x.slug !== s.slug);
  const pick = [
    others[SERVICES.indexOf(s) % others.length],
    others[(SERVICES.indexOf(s) + 3) % others.length],
    others[(SERVICES.indexOf(s) + 6) % others.length],
  ];
  write(
    path,
    page({
      path,
      title: s.title,
      desc: s.desc,
      schema: [
        breadcrumbSchema([
          ["Home", "/"],
          ["Services", "/services"],
          [s.name, path],
        ]),
        {
          "@context": "https://schema.org",
          "@type": "Service",
          name: s.name,
          serviceType: s.name,
          provider: { "@id": `${SITE.url}/#business` },
          areaServed: { "@type": "City", name: "Crawley" },
          description: s.desc,
        },
        faqSchema(s.faqs),
      ],
      body: `
${pageHero({ eyebrow: s.name, h1: s.h1, lead: s.lead, crumbs: [["Services", "/services"], [s.name]] })}
<section class="section">
  <div class="wrap with-aside">
    <article class="prose">
      ${s.body.map((p) => `<p>${p}</p>`).join("")}
      <h2>What we can help with</h2>
      <ul class="ticks">${s.includes.map((x) => `<li>${icon("check-circle")}${x}</li>`).join("")}</ul>
      ${s.tips ? `<div class="tip-box"><h3>${icon("info")}${s.tipsTitle}</h3><ul>${s.tips.map((t) => `<li>${t}</li>`).join("")}</ul></div>` : ""}
      <h2>Why book with PlumbingBase?</h2>
      <ul class="ticks">
        <li>${icon("check-circle")}Local Crawley plumbers — ${SITE.hoursText}</li>
        <li>${icon("check-circle")}Free quote and no call-out charge</li>
        <li>${icon("check-circle")}Tidy, respectful and on time</li>
        <li>${icon("check-circle")}Easy booking by WhatsApp, phone or online</li>
      </ul>
      <h2>Questions about ${s.name.toLowerCase()}</h2>
      ${faqList(s.faqs)}
    </article>
    <aside class="aside">
      <div class="card aside-card">
        <h3>Book this service</h3>
        <p class="aside-offer">${icon("badge-pound-sterling")}Free quote · No call-out charge</p>
<p class="muted">Send us a photo on WhatsApp for a quick quote, or book online.</p>
        ${btnWA("WhatsApp Us", "btn-block", `Hi PlumbingBase, I'd like to book: ${s.name}. `)}
        ${btnCall(`Call ${SITE.phoneDisplay}`, "btn-block btn-outline")}
        <a class="btn btn-primary btn-block" href="/book?service=${encodeURIComponent(s.name)}">${icon("calendar-check")}<span>Book Online</span></a>
        <ul class="aside-meta">
          <li>${icon("clock")}${SITE.hoursText}</li>
          <li>${icon("map-pin")}Crawley &amp; surrounding areas</li>
        </ul>
      </div>
      <div class="card aside-card">
        <h3>Other services</h3>
        <ul class="aside-links">${others.map((o) => `<li><a href="/services/${o.slug}">${icon(o.icon)}${o.name}</a></li>`).join("")}</ul>
      </div>
    </aside>
  </div>
</section>
<section class="section alt"><div class="wrap"><div class="sec-head"><h2>Related services</h2></div>${serviceCards(pick)}</div></section>
${ctaBand(`Need ${s.name.toLowerCase()} in Crawley?`)}`,
    }),
    { priority: "0.8" },
  );
}

// ── AREAS ───────────────────────────────────────────────────
write(
  "/areas",
  page({
    path: "/areas",
    title:
      "Areas We Cover | Plumber Crawley, Horley, Horsham & More | PlumbingBase",
    desc: "PlumbingBase covers all of Crawley — Three Bridges, Pound Hill, Maidenbower, Tilgate, Broadfield, Ifield and more — plus Horley, Gatwick, Horsham, East Grinstead, Reigate and Redhill.",
    schema: [
      breadcrumbSchema([
        ["Home", "/"],
        ["Areas", "/areas"],
      ]),
    ],
    body: `
${pageHero({ eyebrow: "Areas we cover", h1: "Local Plumbers Across Crawley &amp; Beyond", lead: "We're based in Crawley, so we can reach most homes in the town quickly — and we regularly travel to nearby towns and villages too.", crumbs: [["Areas"]] })}
<section class="section">
  <div class="wrap">
    <div class="area-block">
      <h2>${icon("map-pin")}Crawley neighbourhoods</h2>
      <p>We cover every neighbourhood in Crawley, including:</p>
      ${areaChips(AREAS.crawley)}
    </div>
    <div class="area-block">
      <h2>${icon("map-pin")}Nearby towns &amp; villages</h2>
      <p>We also travel to these surrounding areas in West Sussex and Surrey:</p>
      ${areaChips(AREAS.nearby)}
    </div>
    <div class="note-box">${icon("info")}<p>Not sure if we cover your area? <a href="${waLink("Hi PlumbingBase, do you cover my area? My postcode is ")}" target="_blank" rel="noopener">Send us your postcode on WhatsApp</a> and we'll let you know straight away.</p></div>
  </div>
</section>
${ctaBand()}`,
  }),
);

// ── ABOUT ───────────────────────────────────────────────────
write(
  "/about",
  page({
    path: "/about",
    title: "About PlumbingBase | Local Plumbers in Crawley",
    desc: "PlumbingBase is a local Crawley plumbing company focused on reliable, tidy and honestly priced plumbing for homes across the area.",
    schema: [
      breadcrumbSchema([
        ["Home", "/"],
        ["About", "/about"],
      ]),
    ],
    body: `
${pageHero({ eyebrow: "About us", h1: "Plumbing the Way It Should Be Done", lead: "PlumbingBase is a local plumbing company based in Crawley, built on a simple idea: turn up on time, be honest about the price and do the job properly.", crumbs: [["About"]] })}
<section class="section">
  <div class="wrap split">
    <div class="prose">
      <h2>Your local Crawley plumbers</h2>
      <p>We started PlumbingBase because we believe getting a plumber shouldn't be stressful. Too many people have stories about missed appointments, vague prices and jobs left half-finished. We wanted to offer the opposite.</p>
      <p>Based on Forester Road in Crawley, we look after homes, landlords and small businesses across the town and surrounding areas. From a dripping tap to a complete bathroom, every job gets the same care and attention.</p>
      <p>We've also made booking as easy as possible. Most of our customers simply send us a WhatsApp message with a photo of the problem — and we take it from there.</p>
    </div>
    <div class="values">
      <div class="value">${icon("clock")}<h3>Reliable</h3><p>We arrive when we say we will and keep you informed.</p></div>
      <div class="value">${icon("badge-pound-sterling")}<h3>Honest</h3><p>Free quotes, no call-out charge and a clear price before we start.</p></div>
      <div class="value">${icon("sparkles")}<h3>Tidy</h3><p>We treat your home with respect and clean up after ourselves.</p></div>
      <div class="value">${icon("thumbs-up")}<h3>Thorough</h3><p>Every repair is tested before we leave, so it's done right.</p></div>
    </div>
  </div>
</section>
<section class="section alt">
  <div class="wrap narrow center">
    <h2>What we do — and what we don't</h2>
    <p>We specialise in domestic plumbing: leaks, pipework, taps, toilets, electric and mixer showers, hot water cylinders, water pumps, radiators, bathrooms and kitchens.</p>
    <p class="muted">To be clear and upfront: we don't carry out gas, boiler, drainage or guttering work.</p>
    <div class="btn-row center mt"><a class="btn btn-outline" href="/services">View our services</a></div>
  </div>
</section>
${reviewsBlock}
${ctaBand()}`,
  }),
);

// ── BOOK ────────────────────────────────────────────────────
write(
  "/book",
  page({
    path: "/book",
    title: "Book a Plumber or Get a Free Quote | Crawley | PlumbingBase",
    desc: `Book a plumber or get a free quote in Crawley and surrounding areas — online or via WhatsApp. No call-out charge. ${SITE.hoursText}.`,
    schema: [
      breadcrumbSchema([
        ["Home", "/"],
        ["Book Online", "/book"],
      ]),
    ],
    body: `
${pageHero({ eyebrow: "Book online", h1: "Book a Plumber or Get a Free Quote", lead: "No call-out charge, ever. Choose the way that suits you best — WhatsApp, phone or the booking form below.", crumbs: [["Book Online"]], actions: false })}
<section class="section book-section">
  <div class="wrap with-aside">
    <div>
      <div class="book-options">
        <a class="book-opt book-opt-wa" href="${waLink()}" target="_blank" rel="noopener">${waIcon()}<span><b>WhatsApp</b>Fastest — send a photo</span></a>
        <a class="book-opt" href="${telLink}">${icon("phone")}<span><b>Call us</b>${SITE.phoneDisplay}</span></a>
      </div>
      ${bookingForm()}
    </div>
    <aside class="aside">
      <div class="card aside-card">
        <h3>What happens next?</h3>
        <ol class="next">
          <li><b>We review your request</b> — usually within a couple of hours during opening times.</li>
          <li><b>We contact you</b> to confirm the details, price guide and appointment.</li>
          <li><b>Your plumber arrives</b> at the agreed time and gets the job done.</li>
        </ol>
      </div>
      <div class="card aside-card">
        <h3>Opening hours</h3>
        <ul class="hours">${SITE.hoursLong.map(([d, t]) => `<li><span>${d}</span><span>${t}</span></li>`).join("")}</ul>
        <p class="status-line" data-status-line></p>
      </div>
      <div class="card aside-card card-alert">
        <h3>${icon("siren")}Emergency?</h3>
        <p>For burst pipes or major leaks, please call or WhatsApp us rather than using the form.</p>
        ${btnCall("Call Now", "btn-block")}
      </div>
    </aside>
  </div>
</section>`,
  }),
  { priority: "0.9" },
);

// ── CONTACT ─────────────────────────────────────────────────
const mapQuery = encodeURIComponent(
  `${SITE.address.street}, ${SITE.address.locality} ${SITE.address.postcode}`,
);
write(
  "/contact",
  page({
    path: "/contact",
    title: "Contact PlumbingBase | Plumber in Crawley | 07780 330558",
    desc: `Contact PlumbingBase, plumbers in Crawley. Call or WhatsApp ${SITE.phoneDisplay}, email ${SITE.email}. ${addressLine}. Open ${SITE.hoursText}.`,
    schema: [
      breadcrumbSchema([
        ["Home", "/"],
        ["Contact", "/contact"],
      ]),
    ],
    body: `
${pageHero({ eyebrow: "Contact us", h1: "Get in Touch", lead: "Questions, quotes or bookings — we're happy to help. WhatsApp is usually the quickest way to reach us.", crumbs: [["Contact"]], actions: false })}
<section class="section">
  <div class="wrap contact-grid">
    <div class="contact-cards">
      <a class="c-card c-wa" href="${waLink()}" target="_blank" rel="noopener">${waIcon()}<span><b>WhatsApp</b>${SITE.phoneDisplay}</span></a>
      <a class="c-card" href="${telLink}">${icon("phone")}<span><b>Phone</b>${SITE.phoneDisplay}</span></a>
      <a class="c-card" href="mailto:${SITE.email}">${icon("mail")}<span><b>Email</b>${SITE.email}</span></a>
      <div class="c-card">${icon("map-pin")}<span><b>Address</b>${SITE.address.street}, ${SITE.address.locality}<br>${SITE.address.region} ${SITE.address.postcode}</span></div>
      <div class="card hours-card">
        <h3>${icon("clock")}Opening hours</h3>
        <ul class="hours">${SITE.hoursLong.map(([d, t]) => `<li><span>${d}</span><span>${t}</span></li>`).join("")}</ul>
        <p class="status-line" data-status-line></p>
      </div>
    </div>
    <div>
      ${callbackForm({ title: "Send us a quick message", sub: 'Leave your details and we\'ll call you back. For a full booking, use our <a href="/book">booking form</a>.' })}
      <div class="map" data-map="https://www.google.com/maps?q=${mapQuery}&output=embed">
        <div class="map-ph">
          ${icon("map-pin")}
          <p><b>${addressLine}</b></p>
          <div class="btn-row center">
            <button class="btn btn-outline btn-sm" type="button" data-load-map>Show map</button>
            <a class="btn btn-sm btn-primary" href="https://www.google.com/maps/search/?api=1&query=${mapQuery}" target="_blank" rel="noopener">Open in Google Maps</a>
          </div>
          <small class="muted">Loading the map shares data with Google.</small>
        </div>
      </div>
    </div>
  </div>
</section>`,
  }),
  { priority: "0.8" },
);

// ── FAQ ─────────────────────────────────────────────────────
const allFaqs = [...GENERAL_FAQS, ...SERVICES.flatMap((s) => s.faqs)];
write(
  "/faq",
  page({
    path: "/faq",
    title: "Plumbing FAQs | PlumbingBase Crawley",
    desc: "Answers to common questions about booking a plumber in Crawley with PlumbingBase — hours, emergencies, pricing, areas and services.",
    schema: [
      breadcrumbSchema([
        ["Home", "/"],
        ["FAQ", "/faq"],
      ]),
      faqSchema(allFaqs),
    ],
    body: `
${pageHero({ eyebrow: "FAQ", h1: "Frequently Asked Questions", lead: "Can't find your answer? Send us a quick WhatsApp — we're happy to help.", crumbs: [["FAQ"]] })}
<section class="section"><div class="wrap narrow">
  <h2>Booking &amp; general</h2>${faqList(GENERAL_FAQS)}
  <h2 class="mt-lg">Our services</h2>${faqList(SERVICES.flatMap((s) => s.faqs))}
</div></section>
${ctaBand("Still have a question?", "Message us on WhatsApp or give us a call — we'll give you a straight answer.")}`,
  }),
);

// ── THANK YOU ───────────────────────────────────────────────
write(
  "/thank-you",
  page({
    path: "/thank-you",
    noindex: true,
    title: "Thank You | PlumbingBase",
    desc: "Thanks for contacting PlumbingBase.",
    body: `
<section class="section thanks">
  <div class="wrap narrow center">
    <div class="thanks-ic">${icon("check")}</div>
    <h1>Thank you — we've got your request</h1>
    <p class="lead-sm" data-thanks-text>We'll be in touch shortly during opening hours (${SITE.hoursText}) to confirm the details.</p>
    <div class="card thanks-card">
      <h2>Want an even faster reply?</h2>
      <p>Send the same details to us on WhatsApp — and attach a photo of the problem if you can.</p>
      <a class="btn btn-wa btn-lg" href="${waLink()}" target="_blank" rel="noopener" data-thanks-wa>${waIcon()}<span>Also send via WhatsApp</span></a>
    </div>
    <p class="mt"><a class="link-arrow" href="/">Back to the homepage ${icon("arrow-right")}</a></p>
  </div>
</section>`,
  }),
  { sitemap: false },
);

// ── LEGAL ───────────────────────────────────────────────────
const legal = (path, title, h1, html) =>
  write(
    path,
    page({
      path,
      title,
      desc: `${h1} for ${SITE.name}, plumbers in Crawley.`,
      body: `${pageHero({ h1, crumbs: [[h1]], actions: false })}<section class="section"><div class="wrap narrow prose legal">${html}</div></section>`,
    }),
    { priority: "0.3" },
  );

const updated = new Date().toLocaleDateString("en-GB", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

legal(
  "/privacy",
  "Privacy & Cookie Policy | PlumbingBase",
  "Privacy &amp; Cookie Policy",
  `
<p class="muted">Last updated: ${updated}</p>
<p>${SITE.legalName} ("we", "us") respects your privacy. This policy explains what personal information we collect when you use this website or contact us, and how we use it. We are the data controller for this information.</p>
<h2>Who we are</h2>
<p>${SITE.legalName}, ${addressLine}. Email: <a href="mailto:${SITE.email}">${SITE.email}</a>. Phone: ${SITE.phoneDisplay}.</p>
<h2>Information we collect</h2>
<ul>
  <li><b>Booking and contact forms:</b> your name, phone number, email address, postcode, address of the job, details of the work and any photo you choose to upload.</li>
  <li><b>WhatsApp, phone and email:</b> the information you send us when you contact us directly.</li>
  <li><b>Technical data:</b> basic information such as your IP address, collected by our hosting provider and spam protection for security purposes.</li>
</ul>
<h2>How we use your information</h2>
<ul>
  <li>To respond to your enquiry, provide quotes and arrange appointments.</li>
  <li>To carry out the work you've asked for, and to invoice and take payment.</li>
  <li>To keep records as required by law (for example, tax and accounting records).</li>
  <li>To protect our website from spam and misuse.</li>
</ul>
<p>Our lawful bases are: taking steps at your request before entering into a contract, performing a contract with you, complying with legal obligations, and our legitimate interest in running and protecting our business. We never sell your data, and we don't use it for marketing without your consent.</p>
<h2>Who we share it with</h2>
<p>We only share your information with trusted service providers who help us run our business, such as our website host (Vercel), our email delivery provider (Resend), our email provider (Google) and WhatsApp (Meta) if you choose to message us that way. These providers may process data outside the UK under appropriate safeguards.</p>
<h2>How long we keep it</h2>
<p>We keep enquiries that don't lead to a booking for up to 12 months. Records relating to work we carry out are kept for up to 6 years for legal and accounting purposes.</p>
<h2>Your rights</h2>
<p>You have the right to access, correct or delete your personal information, to object to or restrict how we use it, and to data portability. To make a request, email <a href="mailto:${SITE.email}">${SITE.email}</a>. If you're unhappy with how we've handled your data, you can complain to the Information Commissioner's Office (ICO) at <a href="https://ico.org.uk" target="_blank" rel="noopener">ico.org.uk</a>.</p>
<h2>Cookies</h2>
<p>This website does not use advertising or analytics cookies. We use only what's strictly necessary for the site to work and to protect our forms from spam${SITE.turnstileSiteKey ? " (Cloudflare Turnstile)" : ""}. The map on our contact page is only loaded from Google if you choose to show it; Google may then set its own cookies.</p>
<h2>Changes to this policy</h2>
<p>We may update this policy from time to time. The latest version will always be on this page.</p>`,
);

legal(
  "/terms",
  "Terms & Conditions | PlumbingBase",
  "Terms &amp; Conditions",
  `
<p class="muted">Last updated: ${updated}</p>
<p>These terms apply to plumbing work carried out by ${SITE.legalName} ("we", "us") for you, the customer. By booking with us you agree to these terms.</p>
<h2>1. Quotes and estimates</h2>
<p>Quotes are free and there's no obligation to go ahead. We'll give you a price or estimate before starting work. A <b>quote</b> is a fixed price for the work described. An <b>estimate</b> is our best guide and may change if the job turns out to be different from what was described, or if hidden problems are found. We'll always discuss any change with you and get your agreement before continuing.</p>
<h2>2. Bookings and cancellations</h2>
<p>We don't charge a call-out fee, and our quotes are free. Bookings are confirmed once we've agreed a date and time with you. If you need to cancel or rearrange, please give us at least 24 hours' notice. If we arrive at a confirmed appointment and can't access the property, we may charge a missed-appointment fee, which we'll tell you about when you book.</p>
<h2>3. Payment</h2>
<p>Payment is due on completion of the work unless agreed otherwise in writing. For larger jobs we may ask for a deposit to cover materials. We accept bank transfer and card payments.</p>
<h2>4. Materials and parts</h2>
<p>Parts we supply are covered by the manufacturer's guarantee. If you supply your own parts or fittings, we can't be responsible for their quality, suitability or any failure of those items.</p>
<h2>5. Our workmanship</h2>
<p>We carry out all work with reasonable care and skill. If you have a problem with work we've done, please contact us as soon as possible and we'll put it right.</p>
<h2>6. Your rights</h2>
<p>Nothing in these terms affects your statutory rights under the Consumer Rights Act 2015. If you book with us away from our premises, you may have the right to cancel within 14 days under the Consumer Contracts Regulations 2013. If you ask us to start work within that period, you may need to pay for work already done.</p>
<h2>7. Services we don't provide</h2>
<p>We do not carry out gas, boiler, drainage or guttering work.</p>
<h2>8. Contact</h2>
<p>${SITE.legalName}, ${addressLine}. <a href="mailto:${SITE.email}">${SITE.email}</a> · ${SITE.phoneDisplay}</p>`,
);

// ── 404 ─────────────────────────────────────────────────────
write(
  "/404",
  page({
    path: "/404",
    noindex: true,
    title: "Page Not Found | PlumbingBase",
    desc: "Page not found.",
    body: `
<section class="section thanks"><div class="wrap narrow center">
  <div class="thanks-ic err">${icon("droplet")}</div>
  <h1>Sorry, this page has gone down the drain</h1>
  <p class="lead-sm">The page you're looking for doesn't exist or has moved.</p>
  <div class="btn-row center">${btnBook("Book a Plumber")}<a class="btn btn-outline" href="/">Go to homepage</a></div>
</div></section>`,
  }),
  { sitemap: false },
);

// ── SITEMAP, ROBOTS, MANIFEST ───────────────────────────────
const today = new Date().toISOString().slice(0, 10);
writeFileSync(
  join(OUT, "sitemap.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${pages
    .map(
      (p) =>
        `  <url><loc>${SITE.url}${p.path === "/" ? "/" : p.path}</loc><lastmod>${today}</lastmod><priority>${p.priority}</priority></url>`,
    )
    .join("\n")}\n</urlset>\n`,
);
writeFileSync(
  join(OUT, "robots.txt"),
  `User-agent: *\nAllow: /\nDisallow: /thank-you\n\nSitemap: ${SITE.url}/sitemap.xml\n`,
);
writeFileSync(
  join(OUT, "site.webmanifest"),
  JSON.stringify(
    {
      name: SITE.name,
      short_name: SITE.name,
      start_url: "/",
      display: "standalone",
      background_color: "#ffffff",
      theme_color: "#042f53",
      icons: [
        { src: "/img/icon-192.png", sizes: "192x192", type: "image/png" },
        { src: "/img/icon-512.png", sizes: "512x512", type: "image/png" },
      ],
    },
    null,
    2,
  ),
);

console.log(`Built ${pages.length + 2} pages → ${OUT}/`);
