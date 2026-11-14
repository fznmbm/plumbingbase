/* PlumbingBase — site script */
(function () {
  'use strict';
  var PB = window.PB || {};
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var waUrl = function (msg) { return 'https://wa.me/' + PB.wa + '?text=' + encodeURIComponent(msg); };

  /* Header shadow + compact WhatsApp float on scroll */
  var header = $('[data-header]');
  var waFloat = $('.wa-float');
  var onScroll = function () {
    var y = window.scrollY;
    if (header) header.classList.toggle('scrolled', y > 10);
    if (waFloat) waFloat.classList.toggle('compact', y > 400);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* Mobile nav */
  var burger = $('[data-burger]');
  if (burger) {
    var setNav = function (open) {
      document.body.classList.toggle('nav-open', open);
      burger.setAttribute('aria-expanded', open);
      burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    };
    burger.addEventListener('click', function () { setNav(!document.body.classList.contains('nav-open')); });
    document.addEventListener('click', function (e) {
      if (document.body.classList.contains('nav-open') && !e.target.closest('[data-nav]') && !e.target.closest('[data-burger]')) setNav(false);
    });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setNav(false); });
    $$('.has-dd > a').forEach(function (a) {
      a.addEventListener('click', function (e) {
        if (window.matchMedia('(max-width:1024px)').matches) {
          e.preventDefault();
          a.parentElement.classList.toggle('open');
        }
      });
    });
  }

  /* Open / closed status (Europe/London) */
  function londonNow() {
    var parts = new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/London', weekday: 'short', hour: '2-digit', minute: '2-digit', hour12: false }).formatToParts(new Date());
    var get = function (t) { return (parts.find(function (p) { return p.type === t; }) || {}).value; };
    var days = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
    return { day: days[get('weekday')], mins: (+get('hour') % 24) * 60 + +get('minute') };
  }
  var toMins = function (s) { var p = s.split(':'); return +p[0] * 60 + +p[1]; };
  var fmt = function (s) { var h = +s.split(':')[0]; var m = s.split(':')[1]; return (h % 12 || 12) + (m !== '00' ? ':' + m : '') + (h < 12 ? 'am' : 'pm'); };
  function status() {
    var now = londonNow();
    var hours = PB.hours || [];
    var today = hours.find(function (h) { return h.days.indexOf(now.day) > -1; });
    if (today && now.mins >= toMins(today.open) && now.mins < toMins(today.close)) {
      return { open: true, text: 'Open now · until ' + fmt(today.close) };
    }
    var names = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    for (var i = 0; i < 8; i++) {
      var d = (now.day + i) % 7;
      var h = hours.find(function (x) { return x.days.indexOf(d) > -1; });
      if (!h) continue;
      if (i === 0 && now.mins >= toMins(h.open)) continue;
      var when = i === 0 ? 'today' : i === 1 ? 'tomorrow' : names[d];
      return { open: false, text: 'Closed now · opens ' + fmt(h.open) + ' ' + when };
    }
    return { open: false, text: 'Closed now' };
  }
  try {
    var st = status();
    $$('[data-status],[data-status-pill],[data-status-line]').forEach(function (el) {
      el.classList.add(st.open ? 'is-open' : 'is-closed');
      var t = el.querySelector('[data-status-text]');
      if (t) t.textContent = st.text; else el.textContent = st.text + (st.open ? '' : ' — WhatsApp or book online and we\'ll reply when we open.');
    });
  } catch (e) { /* keep static hours text */ }

  /* Date min = today */
  $$('[data-min-today]').forEach(function (el) {
    var d = new Date(); d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
    el.min = d.toISOString().slice(0, 10);
  });

  /* Preselect service from ?service= */
  var qs = new URLSearchParams(location.search).get('service');
  var sel = $('#b-service');
  if (qs && sel) $$('option', sel).forEach(function (o) { if (o.textContent === qs) o.selected = true; });

  /* File label + photo compression */
  var photoData = null;
  var fileInput = $('#b-photo');
  if (fileInput) {
    fileInput.addEventListener('change', function () {
      var f = fileInput.files[0];
      var label = $('[data-file-label]');
      photoData = null;
      if (!f) { label.textContent = 'Choose a photo'; return; }
      label.textContent = 'Processing ' + f.name + '…';
      compress(f, 1600, 0.8).then(function (d) {
        photoData = d; label.textContent = f.name + ' ✓';
      }).catch(function () { label.textContent = 'Couldn\'t read that image — please try another'; });
    });
  }
  function compress(file, max, q) {
    return new Promise(function (resolve, reject) {
      var img = new Image();
      var url = URL.createObjectURL(file);
      img.onload = function () {
        var s = Math.min(1, max / Math.max(img.width, img.height));
        var c = document.createElement('canvas');
        c.width = Math.round(img.width * s); c.height = Math.round(img.height * s);
        c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
        URL.revokeObjectURL(url);
        resolve({ name: (file.name.replace(/\.[^.]+$/, '') || 'photo') + '.jpg', content: c.toDataURL('image/jpeg', q).split(',')[1] });
      };
      img.onerror = reject;
      img.src = url;
    });
  }

  /* Forms */
  function validate(form) {
    var ok = true, first = null;
    $$('[required]', form).forEach(function (el) {
      var bad = el.type === 'checkbox' ? !el.checked : !el.value.trim();
      if (!bad && el.type === 'email' && el.value) bad = !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(el.value);
      if (!bad && el.type === 'tel') bad = el.value.replace(/\D/g, '').length < 10;
      el.classList.toggle('invalid', bad);
      if (bad) { ok = false; first = first || el; }
    });
    var email = $('[type=email]', form);
    if (email && email.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) { email.classList.add('invalid'); ok = false; first = first || email; }
    if (first) first.focus();
    return ok;
  }
  function data(form) {
    var o = {};
    new FormData(form).forEach(function (v, k) { if (typeof v === 'string') o[k] = v.trim(); });
    return o;
  }
  function waMessage(d) {
    var lines = ['Hi PlumbingBase, I\'d like to book a plumber.', ''];
    var add = function (l, v) { if (v) lines.push(l + ': ' + v); };
    add('Name', d.name); add('Phone', d.phone); add('Postcode', d.postcode ? d.postcode.toUpperCase() : '');
    add('Address', d.address); add('Service', d.service); add('Urgency', d.urgency);
    add('Preferred date', d.date ? new Date(d.date).toLocaleDateString('en-GB') : ''); add('Preferred time', d.time);
    if (d.details) { lines.push(''); lines.push(d.details); }
    return lines.join('\n');
  }

  $$('[data-form]').forEach(function (form) {
    var msg = $('[data-form-msg]', form);
    var show = function (t, cls) { msg.textContent = t; msg.className = 'form-msg ' + cls; };
    $$('input,select,textarea', form).forEach(function (el) {
      el.addEventListener('input', function () { el.classList.remove('invalid'); });
      el.addEventListener('change', function () { el.classList.remove('invalid'); });
    });

    var waBtn = $('[data-send-wa]', form);
    if (waBtn) waBtn.addEventListener('click', function () {
      var d = data(form);
      if (!d.name || !d.details) {
        show('Please add at least your name and a short description of the problem.', 'err');
        return;
      }
      msg.className = 'form-msg';
      window.open(waUrl(waMessage(d)), '_blank', 'noopener');
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!validate(form)) { show('Please complete the highlighted fields.', 'err'); return; }
      var d = data(form);
      if (form.dataset.form === 'booking' && photoData) d.photo = photoData;
      var ts = $('[name="cf-turnstile-response"]', form);
      if (ts) d.turnstile = ts.value;
      var btn = $('[type=submit]', form);
      var label = btn.querySelector('span').textContent;
      btn.disabled = true; btn.querySelector('span').textContent = 'Sending…';
      msg.className = 'form-msg';

      fetch('/api/book', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(d) })
        .then(function (r) { return r.json().catch(function () { return {}; }).then(function (j) { return { ok: r.ok, j: j }; }); })
        .then(function (res) {
          if (!res.ok) throw new Error(res.j.error || 'Something went wrong.');
          try {
            sessionStorage.setItem('pb_last', JSON.stringify({ wa: waMessage(d), name: d.name, type: form.dataset.form }));
          } catch (x) {}
          location.href = '/thank-you';
        })
        .catch(function (err) {
          show(err.message + ' Please try again, or contact us on WhatsApp / ' + 'phone instead.', 'err');
          btn.disabled = false; btn.querySelector('span').textContent = label;
          if (window.turnstile) try { window.turnstile.reset(); } catch (x) {}
        });
    });
  });

  /* Thank-you page personalisation */
  var tWa = $('[data-thanks-wa]');
  if (tWa) {
    try {
      var last = JSON.parse(sessionStorage.getItem('pb_last') || 'null');
      if (last) {
        tWa.href = waUrl(last.wa);
        var t = $('[data-thanks-text]');
        if (t && last.name) t.textContent = 'Thanks ' + last.name.split(' ')[0] + '! ' + (last.type === 'callback' ? 'We\'ll call you back' : 'We\'ll be in touch to confirm your booking') + ' as soon as possible during opening hours. If you gave an email, check your inbox for a confirmation.';
      }
    } catch (x) {}
  }

  /* Click-to-load map */
  var mapBtn = $('[data-load-map]');
  if (mapBtn) mapBtn.addEventListener('click', function () {
    var box = mapBtn.closest('[data-map]');
    box.innerHTML = '<iframe src="' + box.dataset.map + '" loading="lazy" referrerpolicy="no-referrer-when-downgrade" title="Map showing PlumbingBase location"></iframe>';
  });
})();
