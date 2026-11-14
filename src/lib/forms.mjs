import { SITE } from '../site.config.mjs';
import { SERVICES } from '../content/services.mjs';
import { icon, waIcon } from './layout.mjs';

const serviceOptions = (selected = '') =>
  [...SERVICES.map((s) => s.name), 'Other / not sure']
    .map((n) => `<option${n === selected ? ' selected' : ''}>${n}</option>`)
    .join('');

const honeypot = `<div class="hp" aria-hidden="true"><label>Company website<input type="text" name="company_website" tabindex="-1" autocomplete="off"></label></div>`;
const turnstile = SITE.turnstileSiteKey
  ? `<div class="cf-turnstile" data-sitekey="${SITE.turnstileSiteKey}" data-theme="light"></div>`
  : '';
const consent = (id) => `
<label class="check" for="${id}">
  <input type="checkbox" id="${id}" name="consent" value="yes" required>
  <span>I agree to PlumbingBase using these details to respond to my enquiry, as set out in the <a href="/privacy" target="_blank">privacy policy</a>.</span>
</label>`;

export function bookingForm(preselect = '') {
  return `
<form class="form card" data-form="booking" novalidate>
  <input type="hidden" name="form" value="booking">
  <div class="form-head">
    <h2>Book a plumber</h2>
    <p>Fill in the details below and we'll confirm your appointment by phone, WhatsApp or email.</p>
  </div>

  <fieldset>
    <legend>Your details</legend>
    <div class="grid-2">
      <div class="field"><label for="b-name">Full name <b>*</b></label><input id="b-name" name="name" type="text" autocomplete="name" required></div>
      <div class="field"><label for="b-phone">Phone number <b>*</b></label><input id="b-phone" name="phone" type="tel" autocomplete="tel" inputmode="tel" required placeholder="07..."></div>
      <div class="field"><label for="b-email">Email</label><input id="b-email" name="email" type="email" autocomplete="email" placeholder="For your confirmation email"></div>
      <div class="field"><label for="b-postcode">Postcode <b>*</b></label><input id="b-postcode" name="postcode" type="text" autocomplete="postal-code" required placeholder="RH10 ..." style="text-transform:uppercase"></div>
    </div>
    <div class="field"><label for="b-address">Address of the job</label><input id="b-address" name="address" type="text" autocomplete="street-address"></div>
  </fieldset>

  <fieldset>
    <legend>The job</legend>
    <div class="grid-2">
      <div class="field"><label for="b-service">Service needed <b>*</b></label>
        <select id="b-service" name="service" required><option value="">Choose a service…</option>${serviceOptions(preselect)}</select></div>
      <div class="field"><label for="b-urgency">How urgent is it? <b>*</b></label>
        <select id="b-urgency" name="urgency" required>
          <option value="">Choose…</option>
          <option>Emergency — as soon as possible</option>
          <option>Within the next few days</option>
          <option>Flexible — any time that suits</option>
          <option>Just after a quote</option>
        </select></div>
      <div class="field"><label for="b-date">Preferred date</label><input id="b-date" name="date" type="date" data-min-today></div>
      <div class="field"><label for="b-time">Preferred time</label>
        <select id="b-time" name="time">
          <option value="">Any time</option>
          <option>Morning (8am – 12pm)</option>
          <option>Afternoon (12pm – 5pm)</option>
        </select></div>
    </div>
    <div class="field"><label for="b-details">Describe the problem <b>*</b></label>
      <textarea id="b-details" name="details" rows="5" required placeholder="e.g. Kitchen tap has been dripping for a week and the cupboard underneath is damp."></textarea></div>
    <div class="field">
      <label for="b-photo">Add a photo <span class="muted">(optional — helps us quote accurately)</span></label>
      <label class="file" for="b-photo">${icon('camera')}<span data-file-label>Choose a photo</span></label>
      <input id="b-photo" name="photo" type="file" accept="image/*" class="sr-only">
    </div>
  </fieldset>

  ${honeypot}
  ${consent('b-consent')}
  ${turnstile}
  <div class="form-msg" role="alert" aria-live="polite" data-form-msg></div>
  <div class="form-actions">
    <button class="btn btn-primary btn-lg" type="submit">${icon('send')}<span>Send booking request</span></button>
    <button class="btn btn-wa btn-lg" type="button" data-send-wa>${waIcon()}<span>Send via WhatsApp instead</span></button>
  </div>
  <p class="form-note">${icon('info')}We'll confirm your booking during opening hours (${SITE.hoursText}). For urgent leaks, please call or WhatsApp.</p>
</form>`;
}

export function callbackForm({ title = 'Request a call back', sub = 'Leave your number and we\'ll call you back during opening hours.', dark = false } = {}) {
  return `
<form class="form form-compact card${dark ? ' card-dark' : ''}" data-form="callback" novalidate>
  <input type="hidden" name="form" value="callback">
  <h3>${title}</h3>
  <p class="muted">${sub}</p>
  <div class="field"><label for="c-name-${dark ? 'd' : 'l'}">Name <b>*</b></label><input id="c-name-${dark ? 'd' : 'l'}" name="name" type="text" autocomplete="name" required></div>
  <div class="field"><label for="c-phone-${dark ? 'd' : 'l'}">Phone <b>*</b></label><input id="c-phone-${dark ? 'd' : 'l'}" name="phone" type="tel" autocomplete="tel" required></div>
  <div class="field"><label for="c-service-${dark ? 'd' : 'l'}">What do you need?</label>
    <select id="c-service-${dark ? 'd' : 'l'}" name="service"><option value="">Choose a service…</option>${serviceOptions()}</select></div>
  ${honeypot}
  ${consent(`c-consent-${dark ? 'd' : 'l'}`)}
  ${turnstile}
  <div class="form-msg" role="alert" aria-live="polite" data-form-msg></div>
  <button class="btn btn-primary btn-block" type="submit">${icon('phone')}<span>Call me back</span></button>
</form>`;
}
