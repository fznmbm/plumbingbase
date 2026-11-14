import { SITE } from '../site.config.mjs';
import { SERVICES } from '../content/services.mjs';
import { ICONS, WHATSAPP_PATH } from './icons.mjs';

export const esc = (s = '') =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export const icon = (name, cls = 'i') =>
  `<svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[name] || ''}</svg>`;

export const waIcon = (cls = 'i') =>
  `<svg class="${cls}" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="${WHATSAPP_PATH}"/></svg>`;

export const waLink = (msg = SITE.whatsappGreeting) =>
  `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(msg)}`;

export const telLink = `tel:${SITE.phoneE164}`;

export const btnWA = (label = 'WhatsApp Us', extra = '', msg) =>
  `<a class="btn btn-wa ${extra}" href="${waLink(msg)}" target="_blank" rel="noopener" data-track="whatsapp">${waIcon()}<span>${label}</span></a>`;
export const btnCall = (label = `Call ${SITE.phoneDisplay}`, extra = '') =>
  `<a class="btn btn-call ${extra}" href="${telLink}" data-track="call">${icon('phone')}<span>${label}</span></a>`;
export const btnBook = (label = 'Book Online', extra = '') =>
  `<a class="btn btn-primary ${extra}" href="/book">${icon('calendar-check')}<span>${label}</span></a>`;

const addr = SITE.address;
export const addressLine = `${addr.street}, ${addr.locality}, ${addr.postcode}`;

function businessSchema() {
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return {
    '@context': 'https://schema.org',
    '@type': 'Plumber',
    '@id': `${SITE.url}/#business`,
    name: SITE.name,
    url: SITE.url,
    logo: `${SITE.url}/img/logo-full.png`,
    image: `${SITE.url}/img/og-image.jpg`,
    telephone: SITE.phoneE164,
    email: SITE.email,
    priceRange: '££',
    address: {
      '@type': 'PostalAddress',
      streetAddress: addr.street,
      addressLocality: addr.locality,
      addressRegion: addr.region,
      postalCode: addr.postcode,
      addressCountry: addr.country,
    },
    openingHoursSpecification: SITE.hours.map((h) => ({
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: h.days.map((d) => dayNames[d]),
      opens: h.open,
      closes: h.close,
    })),
    areaServed: ['Crawley', 'Horley', 'Gatwick', 'Horsham', 'East Grinstead', 'Reigate', 'Redhill'].map((n) => ({ '@type': 'City', name: n })),
    sameAs: [SITE.facebookUrl, SITE.instagramUrl].filter(Boolean),
  };
}

function head({ title, desc, path, schema = [], noindex = false }) {
  const canonical = SITE.url + (path === '/' ? '' : path);
  const schemas = [businessSchema(), ...schema]
    .map((s) => `<script type="application/ld+json">${JSON.stringify(s)}</script>`)
    .join('\n');
  return `<!DOCTYPE html>
<html lang="en-GB">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
<link rel="canonical" href="${canonical}">
${noindex ? '<meta name="robots" content="noindex">' : ''}
<meta name="theme-color" content="#042f53">
<meta property="og:type" content="website">
<meta property="og:site_name" content="${SITE.name}">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:url" content="${canonical}">
<meta property="og:image" content="${SITE.url}/img/og-image.jpg">
<meta property="og:locale" content="en_GB">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="/favicon.ico" sizes="any">
<link rel="icon" type="image/png" sizes="32x32" href="/img/favicon-32.png">
<link rel="apple-touch-icon" href="/img/apple-touch-icon.png">
<link rel="manifest" href="/site.webmanifest">
<link rel="preload" href="/fonts/montserrat.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="/fonts/inter.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="/css/styles.css?v=__V__">
${schemas}
</head>`;
}

function header(path) {
  const active = (p) => (path === p || (p !== '/' && path.startsWith(p)) ? ' aria-current="page"' : '');
  const svcLinks = SERVICES.map((s) => `<li><a href="/services/${s.slug}">${icon(s.icon)}${s.name}</a></li>`).join('');
  return `
<a class="skip" href="#main">Skip to content</a>
<div class="topbar">
  <div class="wrap topbar-in">
    <span class="status" data-status>${icon('clock')}<span data-status-text>${SITE.hoursText}</span></span>
    <span class="topbar-links">
      <a href="mailto:${SITE.email}">${icon('mail')}${SITE.email}</a>
      <a href="${telLink}">${icon('phone')}${SITE.phoneDisplay}</a>
    </span>
  </div>
</div>
<header class="site-header" data-header>
  <div class="wrap header-in">
    <a class="logo" href="/" aria-label="${SITE.name} home">
      <picture><source srcset="/img/logo.webp" type="image/webp"><img src="/img/logo.png" alt="${SITE.name}" width="402" height="128"></picture>
    </a>
    <nav class="nav" aria-label="Main" data-nav>
      <ul>
        <li><a href="/"${path === '/' ? ' aria-current="page"' : ''}>Home</a></li>
        <li class="has-dd">
          <a href="/services"${active('/services')}>Services ${icon('chevron-down', 'i dd-i')}</a>
          <ul class="dd">${svcLinks}<li class="dd-all"><a href="/services">View all services ${icon('arrow-right')}</a></li></ul>
        </li>
        <li><a href="/areas"${active('/areas')}>Areas</a></li>
        <li><a href="/about"${active('/about')}>About</a></li>
        <li><a href="/faq"${active('/faq')}>FAQ</a></li>
        <li><a href="/contact"${active('/contact')}>Contact</a></li>
      </ul>
      <div class="nav-cta">${btnCall(SITE.phoneDisplay, 'btn-sm')}${btnBook('Book Online', 'btn-sm')}</div>
    </nav>
    <div class="header-actions">
      <a class="header-phone" href="${telLink}">${icon('phone')}<span><small>Call us</small>${SITE.phoneDisplay}</span></a>
      ${btnBook('Book Online', 'btn-sm hide-sm')}
      <button class="burger" type="button" aria-label="Open menu" aria-expanded="false" data-burger>${icon('menu', 'i i-open')}${icon('x', 'i i-close')}</button>
    </div>
  </div>
</header>`;
}

function footer() {
  const svc = SERVICES.map((s) => `<li><a href="/services/${s.slug}">${s.name}</a></li>`).join('');
  const hours = SITE.hoursLong.map(([d, t]) => `<li><span>${d}</span><span>${t}</span></li>`).join('');
  const year = new Date().getFullYear();
  return `
<footer class="site-footer">
  <div class="wrap footer-grid">
    <div class="f-brand">
      <img src="/img/logo-white.png" alt="${SITE.name}" width="314" height="100">
      <p>Friendly, reliable plumbers serving Crawley and the surrounding towns. Book by WhatsApp, phone or online.</p>
      <div class="f-cta">${btnWA('WhatsApp', 'btn-sm')}${btnCall('Call Now', 'btn-sm btn-ghost-light')}</div>
    </div>
    <div>
      <h3>Services</h3>
      <ul class="f-links">${svc}</ul>
    </div>
    <div>
      <h3>Company</h3>
      <ul class="f-links">
        <li><a href="/about">About Us</a></li>
        <li><a href="/areas">Areas We Cover</a></li>
        <li><a href="/book">Book Online</a></li>
        <li><a href="/faq">FAQ</a></li>
        <li><a href="/contact">Contact</a></li>
        <li><a href="/privacy">Privacy &amp; Cookies</a></li>
        <li><a href="/terms">Terms</a></li>
      </ul>
    </div>
    <div>
      <h3>Get in touch</h3>
      <ul class="f-contact">
        <li>${icon('phone')}<a href="${telLink}">${SITE.phoneDisplay}</a></li>
        <li>${waIcon()}<a href="${waLink()}" target="_blank" rel="noopener">WhatsApp ${SITE.phoneDisplay}</a></li>
        <li>${icon('mail')}<a href="mailto:${SITE.email}">${SITE.email}</a></li>
        <li>${icon('map-pin')}<span>${addr.street}<br>${addr.locality}, ${addr.region} ${addr.postcode}</span></li>
      </ul>
      <h3 class="mt">Opening hours</h3>
      <ul class="f-hours">${hours}</ul>
    </div>
  </div>
  <div class="wrap f-bottom">
    <p>&copy; ${year} ${SITE.legalName}. All rights reserved.</p>
    <p>We do not carry out gas, boiler, drainage or guttering work.</p>
  </div>
</footer>

<a class="wa-float" href="${waLink()}" target="_blank" rel="noopener" aria-label="Chat with us on WhatsApp" data-track="whatsapp-float">
  ${waIcon('wa-float-i')}
  <span class="wa-float-label">Chat with us</span>
</a>

<nav class="mobile-bar" aria-label="Quick contact">
  <a href="${telLink}" data-track="call">${icon('phone')}<span>Call</span></a>
  <a class="mb-wa" href="${waLink()}" target="_blank" rel="noopener" data-track="whatsapp">${waIcon()}<span>WhatsApp</span></a>
  <a class="mb-book" href="/book">${icon('calendar-check')}<span>Book</span></a>
</nav>

<script>window.PB=${JSON.stringify({ wa: SITE.whatsapp, hours: SITE.hours, turnstile: SITE.turnstileSiteKey })};</script>
<script src="/js/main.js?v=__V__" defer></script>
${SITE.turnstileSiteKey ? '<script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer></script>' : ''}
</body>
</html>`;
}

export function page({ title, desc, path, body, schema, noindex }) {
  return `${head({ title, desc, path, schema, noindex })}
<body>
${header(path)}
<main id="main">
${body}
</main>
${footer()}`;
}

export function pageHero({ eyebrow, h1, lead, crumbs = [], actions = true }) {
  const bc = crumbs.length
    ? `<nav class="crumbs" aria-label="Breadcrumb"><a href="/">Home</a>${crumbs
        .map(([n, u]) => (u ? ` / <a href="${u}">${n}</a>` : ` / <span>${n}</span>`))
        .join('')}</nav>`
    : '';
  return `
<section class="page-hero">
  <div class="wrap">
    ${bc}
    ${eyebrow ? `<p class="eyebrow">${eyebrow}</p>` : ''}
    <h1>${h1}</h1>
    ${lead ? `<p class="lead">${lead}</p>` : ''}
    ${actions ? `<div class="btn-row">${btnWA()}${btnCall()}${btnBook('Book Online', 'btn-light')}</div>` : ''}
  </div>
</section>`;
}

export function breadcrumbSchema(items) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map(([name, path], i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name,
      item: SITE.url + path,
    })),
  };
}

export function faqSchema(faqs) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(([q, a]) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: { '@type': 'Answer', text: a },
    })),
  };
}

export function faqList(faqs) {
  return `<div class="faq">${faqs
    .map(
      ([q, a]) => `<details><summary>${q}${icon('chevron-down', 'i faq-i')}</summary><div class="faq-a"><p>${a}</p></div></details>`
    )
    .join('')}</div>`;
}

export const ctaBand = (h = 'Need a plumber in Crawley?', p = 'Send us a WhatsApp, give us a call or book online — we\'ll get back to you quickly with a time that suits you.') => `
<section class="cta-band">
  <div class="wrap cta-in">
    <div><h2>${h}</h2><p>${p}</p></div>
    <div class="btn-row">${btnWA()}${btnCall()}${btnBook('Book Online', 'btn-light')}</div>
  </div>
</section>`;
