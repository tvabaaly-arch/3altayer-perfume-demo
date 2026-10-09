(() => {
  const M = window.MENU;
  const $ = (s, r = document) => r.querySelector(s);
  const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const cur = M.brand.currency;
  const countAr = (n) => `${n} ${n === 1 ? 'صنف' : n === 2 ? 'صنفان' : n <= 10 ? 'أصناف' : 'صنفًا'}`;
  const byId = new Map();

  // ---------- logo: shown only if the original file exists ----------
  const logo = $('#logo');
  if (logo) {
    const show = () => { if (logo.naturalWidth) logo.hidden = false; };
    logo.complete ? show() : logo.addEventListener('load', show, { once: true });
  }

  // ---------- render ----------
  const priceHTML = (it) => {
    if (it.sizes) {
      const min = Math.min(...it.sizes.map((s) => s.price));
      return `<span class="price"><span class="from">من</span>${min}<small>${cur}</small></span>`;
    }
    return `<span class="price">${it.price}<small>${cur}</small></span>`;
  };
  const kcalOf = (it) => (it.kcal != null ? it.kcal : it.sizes && it.sizes[0].kcal != null
    ? `${Math.min(...it.sizes.map((s) => s.kcal))}–${Math.max(...it.sizes.map((s) => s.kcal))}` : null);

  const cardHTML = (it, sec) => {
    byId.set(it.id, { it, sec });
    const k = kcalOf(it);
    const pic = it.img
      ? `<span class="card-pic"><img src="${it.img}" alt="" loading="lazy" decoding="async"></span>`
      : `<span class="card-strip" aria-hidden="true"></span>`;
    const wide = (it.wide ? ' card--wide' : '') + (it.img ? '' : ' card--text');
    return `<li class="${it.wide ? 'is-wide' : ''}" data-id="${it.id}"><button class="card${wide}" type="button" data-id="${it.id}" aria-haspopup="dialog">
      ${pic}
      <span class="card-body">
        <span class="card-name" data-t>${esc(it.ar)}</span>
        ${it.en ? `<span class="card-en" data-t>${esc(it.en)}</span>` : ''}
        <span class="card-foot">${priceHTML(it)}${k != null ? `<span class="kcal">${k} سعرة</span>` : ''}</span>
      </span></button></li>`;
  };

  const sectionsEl = $('#sections');
  sectionsEl.innerHTML = M.sections.map((s) => {
    const art = s.art ? `<img class="sec-art" src="${s.art}" alt="" width="${s.artW}" height="${s.artH}">` : `<span class="sec-art sec-art--none" aria-hidden="true"></span>`;
    const count = s.items.length + (s.addons ? s.addons.items.length : 0);
    const addons = s.addons ? `
      <div class="sub-head" id="${s.id}-addons"><h3>${esc(s.addons.ar)}</h3><span>${esc(s.addons.en)}</span></div>
      <ul class="grid" data-sub="addons">${s.addons.items.map((it) => cardHTML(it, s)).join('')}</ul>` : '';
    return `<section class="sec" id="${s.id}" data-accent="${s.accent}" aria-labelledby="${s.id}-t">
      <header class="sec-head">
        <div><h2 class="sec-title" id="${s.id}-t">${esc(s.ar)}</h2><span class="sec-en">${esc(s.en)}</span>
        <p class="sec-meta">${countAr(count)}</p></div>
        ${art}
      </header>
      <ul class="grid">${s.items.map((it) => cardHTML(it, s)).join('')}</ul>
      ${addons}
    </section>`;
  }).join('');
  // wide cards span two columns via the li
  document.querySelectorAll('li.is-wide').forEach((li) => (li.style.gridColumn = 'span 2'));

  $('#branchList').innerHTML = M.branches.map((b) => `<li class="branch">
    <img src="${b.img}" alt="" loading="lazy">
    <div><h3>${esc(b.ar)}</h3><p class="en">${esc(b.en)}</p><p>${b.line.map(esc).join('<br>')}</p>
    ${b.map ? `<a href="${esc(b.map)}" target="_blank" rel="noopener">الموقع على الخريطة</a>` : ''}</div></li>`).join('');

  // ---------- tabs + scroll spy ----------
  const tabs = $('#tabs');
  tabs.innerHTML = M.sections.map((s) => `<button class="tab" type="button" data-target="${s.id}">${esc(s.ar)}</button>`).join('');
  const tabBtns = [...tabs.querySelectorAll('.tab')];
  const bar = $('#bar');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let spyLock = 0;

  const setActive = (id) => {
    tabBtns.forEach((b) => {
      const on = b.dataset.target === id;
      if (on && b.getAttribute('aria-current') !== 'true') {
        const r = b.getBoundingClientRect(), tr = tabs.getBoundingClientRect();
        if (r.left < tr.left || r.right > tr.right) tabs.scrollBy({ left: r.left - tr.left - 12, behavior: reduce ? 'auto' : 'smooth' });
      }
      b.setAttribute('aria-current', on ? 'true' : 'false');
    });
  };

  tabs.addEventListener('click', (e) => {
    const b = e.target.closest('.tab'); if (!b) return;
    const sec = document.getElementById(b.dataset.target);
    if (sec.hidden) return;
    spyLock = Date.now() + 900;
    const y = sec.getBoundingClientRect().top + scrollY - bar.offsetHeight + 1;
    scrollTo({ top: y, behavior: reduce ? 'auto' : 'smooth' });
    setActive(b.dataset.target);
    history.replaceState(null, '', '#' + b.dataset.target);
  });

  const spy = () => {
    if (Date.now() < spyLock) return;
    const line = bar.offsetHeight + 40;
    let id = M.sections[0].id;
    for (const s of M.sections) {
      const el = document.getElementById(s.id);
      if (!el.hidden && el.getBoundingClientRect().top <= line) id = s.id;
    }
    setActive(id);
  };
  let raf = 0;
  addEventListener('scroll', () => { if (!raf) raf = requestAnimationFrame(() => { raf = 0; spy(); }); }, { passive: true });
  spy();

  // ---------- search ----------
  const box = $('#searchBox'), q = $('#q'), toggle = $('#searchToggle'), results = $('#results');
  const norm = (s) => String(s || '').toLowerCase()
    .replace(/[ً-ْـ]/g, '')
    .replace(/[أإآ]/g, 'ا').replace(/ة/g, 'ه').replace(/ى/g, 'ي').trim();
  const items = [...document.querySelectorAll('.grid > li')].map((li) => {
    const { it } = byId.get(li.dataset.id);
    return { li, hay: norm(`${it.ar} ${it.en}`), texts: [...li.querySelectorAll('[data-t]')].map((n) => [n, n.textContent]) };
  });
  let preSearchY = null;

  const hl = (text, term) => {
    if (!term) return esc(text);
    const n = norm(text); const i = n.indexOf(term);
    // only highlight when normalised indices map 1:1 (no stripped diacritics)
    if (i < 0 || n.length !== text.length) return esc(text);
    return esc(text.slice(0, i)) + '<mark>' + esc(text.slice(i, i + term.length)) + '</mark>' + esc(text.slice(i + term.length));
  };

  const runSearch = () => {
    const term = norm(q.value);
    if (term && preSearchY === null) preSearchY = scrollY;
    let n = 0;
    items.forEach(({ li, hay, texts }) => {
      const hit = !term || hay.includes(term);
      li.hidden = !hit; if (hit) n++;
      texts.forEach(([node, t]) => (node.innerHTML = hl(t, term)));
    });
    document.querySelectorAll('.sec').forEach((sec) => {
      sec.hidden = !!term && !sec.querySelector('.grid > li:not([hidden])');
      sec.querySelectorAll('.sub-head').forEach((h) => (h.hidden = !!term && !h.nextElementSibling.querySelector('li:not([hidden])')));
      sec.querySelector('.sec-meta').hidden = !!term;
    });
    tabBtns.forEach((b) => (b.disabled = document.getElementById(b.dataset.target).hidden));
    const empty = $('#emptyState'); if (empty) empty.remove();
    if (!term) {
      results.textContent = '';
      if (preSearchY !== null) { const y = preSearchY; preSearchY = null; scrollTo(0, y); requestAnimationFrame(() => scrollTo(0, y)); }
    } else if (!n) {
      results.textContent = '';
      $('#sections').insertAdjacentHTML('beforebegin', `<div class="empty" id="emptyState"><p>لا يوجد صنف باسم «${esc(q.value.trim())}». جرّب اسمًا آخر أو تصفّح الأقسام.</p><button type="button" id="clearQ">مسح البحث</button></div>`);
      $('#clearQ').onclick = () => { q.value = ''; runSearch(); q.focus(); };
    } else {
      results.textContent = countAr(n);
      const top = $('#menu').getBoundingClientRect().top + scrollY - bar.offsetHeight;
      if (scrollY > top) scrollTo(0, top);
    }
    spy();
  };
  let t; q.addEventListener('input', () => { clearTimeout(t); t = setTimeout(runSearch, 90); });
  q.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeSearch(); });

  const openSearch = () => { box.hidden = false; toggle.setAttribute('aria-expanded', 'true'); q.focus({ preventScroll: true }); };
  const closeSearch = () => {
    box.hidden = true; toggle.setAttribute('aria-expanded', 'false');
    if (q.value) { q.value = ''; runSearch(); }
    toggle.focus({ preventScroll: true });
  };
  toggle.addEventListener('click', () => (box.hidden ? openSearch() : closeSearch()));
  $('#searchClose').addEventListener('click', closeSearch);

  // ---------- detail sheet ----------
  const sheet = $('#sheet'), body = $('#sheetBody');
  let opener = null;

  const detailHTML = ({ it, sec }) => {
    const parts = [];
    if (it.img) parts.push(`<div class="sh-pic"><img src="${it.img}" alt="${esc(it.ar)}"></div>`);
    parts.push(`<p class="sh-sec">${esc(sec.ar)}</p><h2 class="sh-title" id="sheetTitle">${esc(it.ar)}</h2>`);
    if (it.en) parts.push(`<p class="sh-en">${esc(it.en)}</p>`);
    if (it.sizes) {
      parts.push(`<ul class="sh-list" aria-label="الأحجام والأسعار">${it.sizes.map((s) => `<li><span>${esc(s.label)}${s.kcal != null ? ` <span class="kcal">· ${s.kcal} سعرة</span>` : ''}</span><span class="price">${s.price}<small>${cur}</small></span></li>`).join('')}</ul>`);
    } else {
      parts.push(`<ul class="sh-list"><li><span>السعر</span><span class="price">${it.price}<small>${cur}</small></span></li></ul>`);
    }
    const facts = [];
    if (it.kcal != null) facts.push(`<div class="fact"><dt>السعرات</dt><dd>${it.kcal} سعرة</dd></div>`);
    if (it.allergens != null) facts.push(`<div class="fact"><dt>مسببات الحساسية</dt><dd>${it.allergens ? 'يوجد' : 'لا يوجد'}</dd></div>`);
    if (facts.length) parts.push(`<dl class="sh-facts">${facts.join('')}</dl>`);
    if (it.kcalTable) parts.push(`<ul class="sh-list" aria-label="السعرات حسب الحشوة">${it.kcalTable.map(([n, k]) => `<li><span>${esc(n)}</span><span class="kcal">${k} سعرة</span></li>`).join('')}</ul>`);
    if (it.note) parts.push(`<p class="sh-note">${esc(it.note)}</p>`);
    return parts.join('');
  };

  const openSheet = (id, btn) => {
    const rec = byId.get(id); if (!rec) return;
    opener = btn;
    sheet.dataset.accent = rec.sec.accent;
    body.innerHTML = detailHTML(rec);
    document.documentElement.style.overflow = 'hidden';
    sheet.showModal();
    sheet.querySelector('.sheet-card').scrollTop = 0;
  };
  const closeSheet = () => {
    if (!sheet.open || sheet.classList.contains('closing')) return;
    const done = () => { sheet.classList.remove('closing'); sheet.close(); };
    if (reduce) done(); else { sheet.classList.add('closing'); setTimeout(done, 200); }
  };
  sheet.addEventListener('close', () => {
    document.documentElement.style.overflow = '';
    if (opener) opener.focus({ preventScroll: true });
  });
  sheet.addEventListener('cancel', (e) => { e.preventDefault(); closeSheet(); });
  sheet.addEventListener('click', (e) => { if (e.target === sheet) closeSheet(); });
  $('#sheetClose').addEventListener('click', closeSheet);
  sectionsEl.addEventListener('click', (e) => {
    const c = e.target.closest('.card'); if (c) openSheet(c.dataset.id, c);
  });

  // swipe down to close (mobile)
  const card = sheet.querySelector('.sheet-card');
  let y0 = null;
  card.addEventListener('touchstart', (e) => { y0 = card.scrollTop <= 0 ? e.touches[0].clientY : null; }, { passive: true });
  card.addEventListener('touchmove', (e) => {
    if (y0 == null) return; const dy = e.touches[0].clientY - y0;
    if (dy > 0) card.style.transform = `translateY(${dy}px)`;
  }, { passive: true });
  card.addEventListener('touchend', (e) => {
    if (y0 == null) return; const dy = e.changedTouches[0].clientY - y0; y0 = null;
    card.style.transform = '';
    if (dy > 90) closeSheet();
  });
})();
