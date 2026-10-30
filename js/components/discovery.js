/* Discovery components (kept secondary to the shopping journey):
   <ScentRadar>  · <JawakFinder>  · <DiscoverySet>  · <Stations>
   Each mount(el) returns an optional cleanup and re-renders on language change via the page. */
(function (TA) {
  'use strict';
  const { $, $$, esc, motion } = TA.util;
  const { t, tx, price } = TA.i18n;
  const C = TA.catalog;

  /* ---------- Scent radar ---------- */
  const R = 150;
  function radarSVG(p, { compact = false } = {}) {
    const N = C.axes.length, ang = i => -Math.PI / 2 + i * 2 * Math.PI / N;
    const pt = (i, v) => [Math.cos(ang(i)) * R * v / 100, Math.sin(ang(i)) * R * v / 100];
    let s = '';
    for (let r = 1; r <= 4; r++) s += `<polygon class="rd-ring" points="${C.axes.map((_, i) => pt(i, r * 25).join(',')).join(' ')}"/>`;
    C.axes.forEach((a, i) => { const [x, y] = pt(i, 100); s += `<line class="rd-axis" x1="0" y1="0" x2="${x}" y2="${y}"/>`; });
    const shape = C.axes.map((a, i) => pt(i, p.dna[a.k]).join(',')).join(' ');
    s += `<polygon class="rd-shape" points="${shape}" data-target="${shape}"/>`;
    C.axes.forEach((a, i) => { const [x, y] = pt(i, p.dna[a.k]); s += `<circle class="rd-pt" r="3.5" cx="${x}" cy="${y}"/>`; });
    if (!compact) C.axes.forEach((a, i) => { const [x, y] = pt(i, 124); s += `<text x="${x.toFixed(1)}" y="${y.toFixed(1)}">${esc(tx(a))}</text>`; });
    return `<svg class="radar" viewBox="-200 -190 400 380" role="img" aria-label="${esc(t('scentDna') + ': ' + C.axes.map(a => tx(a) + ' ' + p.dna[a.k]).join('، '))}">${s}</svg>`;
  }
  const dnaBars = p => `<dl class="dna-bars">${C.axes.map(a => `<div><dt>${esc(tx(a))}</dt><dd><span class="bar"><i style="--v:${p.dna[a.k]}%"></i></span><b>${p.dna[a.k]}</b></dd></div>`).join('')}</dl>`;
  function animateRadar(root) {
    if (!motion()) return;
    $$('.rd-shape', root).forEach(el => gsap.fromTo(el, { scale: .2, transformOrigin: '0px 0px', opacity: 0 }, { scale: 1, opacity: 1, duration: 1.1, ease: 'expo.out' }));
    $$('.rd-pt', root).forEach((el, i) => gsap.fromTo(el, { opacity: 0 }, { opacity: 1, delay: .4 + i * .04, duration: .4 }));
  }

  /* ---------- Find Your Jawak ---------- */
  function jawak(el, { compact = false } = {}) {
    let sel = el.dataset.sel || null;
    const draw = (animate) => {
      const m = sel && C.finder.find(f => f.k === sel), p = m && C.byId(m.pick);
      el.innerHTML = `<div class="jw-moods" role="radiogroup" aria-label="${esc(t('jawakTitle'))}">
          ${C.finder.map(f => `<button class="jw-mood" role="radio" aria-checked="${f.k === sel}" data-k="${f.k}"><b>${TA.i18n.lang === 'ar' ? f.ar : f.en}</b>${TA.i18n.lang === 'ar' ? `<small>${f.en}</small>` : ''}</button>`).join('')}
        </div>
        <div class="jw-result" aria-live="polite">${p ? `
          <a class="jw-img" href="${p.url}"><img src="${p.images[0].src}" ${p.images[0].studio ? 'data-studio' : ''} alt="${esc(p.images[0].alt)}"></a>
          <div class="jw-info">
            <p class="eyebrow">${esc(t('because', { m: TA.i18n.lang === 'ar' ? m.ar : m.en.toLowerCase() }))}</p>
            <p class="jw-brand">${esc(p.brand)}</p>
            <h3 class="jw-name"><a href="${p.url}">${esc(tx(p.name))}</a></h3>
            <p class="jw-line">${esc(tx(p.line))}</p>
            <p class="jw-price">${price(p.bottle.price)} <span>· ${t('sampleFrom', { p: price(p.sample.price) })}</span></p>
            <div class="btn-row">
              <button class="btn btn-primary" data-action="add" data-variant="${p.sample.id}">${t('kind_sample')} · ${p.sample.ml} ${t('ml')}</button>
              <a class="btn btn-ghost" href="${p.url}">${t('viewProduct')}</a>
            </div>
            ${compact ? '' : `<p class="jw-alt">${t('alsoTry')}: ${m.alt.map(id => { const a = C.byId(id); return `<a href="${a.url}">${esc(tx(a.name))}</a>`; }).join(' · ')}</p>`}
          </div>` : `<p class="jw-empty">${t('jawakText')}</p>`}
        </div>`;
      if (animate && p && motion()) {
        gsap.fromTo($('.jw-img img', el), { y: 24, opacity: 0, scale: .96 }, { y: 0, opacity: 1, scale: 1, duration: .9, ease: 'expo.out' });
        gsap.fromTo($$('.jw-info > *', el), { y: 14, opacity: 0 }, { y: 0, opacity: 1, duration: .6, stagger: .05, ease: 'power3.out' });
      }
    };
    el.addEventListener('click', e => { const b = e.target.closest('.jw-mood'); if (!b) return; sel = el.dataset.sel = b.dataset.k; draw(true); $(`.jw-mood[data-k="${sel}"]`, el).focus(); });
    el.addEventListener('keydown', e => {
      const b = e.target.closest('.jw-mood'); if (!b || !['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.key)) return;
      e.preventDefault(); const all = $$('.jw-mood', el), i = all.indexOf(b), fwd = (e.key === 'ArrowLeft') === (document.dir === 'rtl') || e.key === 'ArrowDown';
      all[(i + (fwd ? 1 : -1) + all.length) % all.length].click();
    });
    draw(false);
  }

  /* ---------- Discovery set ---------- */
  function discoverySet(el) {
    let slots = (el.dataset.slots || 'althair,devotion,verano').split(',').map(x => x || null), focus = +(el.dataset.focus || 0);
    const save = () => { el.dataset.slots = slots.map(x => x || '').join(','); el.dataset.focus = focus; };
    const filled = () => slots.filter(Boolean).length;
    const draw = () => {
      const n = filled(), target = n === 3 ? focus : slots.indexOf(null), total = slots.filter(Boolean).reduce((s, id) => s + C.byId(id).sample.price, 0);
      el.innerHTML = `<div class="ds">
        <div class="ds-pick">${C.products.map(p => { const k = slots.indexOf(p.id); return `<button class="ds-opt" data-id="${p.id}" aria-pressed="${k > -1}" title="${esc(p.brand + ' ' + tx(p.name))}"><img src="${p.images[0].src}" ${p.images[0].studio ? 'data-studio' : ''} alt="${esc(tx(p.name))}" loading="lazy">${k > -1 ? `<em>${k + 1}</em>` : ''}</button>`; }).join('')}</div>
        <div class="ds-tray${n === 3 ? ' ready' : ''}">
          <div class="ds-head"><span>3ALTAYER · Discovery Set</span><span>${n} / 3</span></div>
          <div class="ds-slots">${slots.map((id, i) => { const p = id && C.byId(id); return `<button class="ds-slot${i === target ? ' focus' : ''}" data-i="${i}" aria-label="${i + 1}">
            <span class="ds-img">${p ? `<img src="${p.images[0].src}" ${p.images[0].studio ? 'data-studio' : ''} alt="${esc(tx(p.name))}">` : `<span class="ds-empty">${t('chooseScent')}</span>`}</span>
            <span class="ds-cap"><em>0${i + 1}</em><b>${p ? esc(tx(p.name)) : '—'}</b><small>${p ? esc(p.brand) : ''}</small></span></button>`; }).join('')}</div>
          <div class="ds-base"><i></i></div>
        </div>
        <p class="ds-hint" aria-live="polite">${n === 3 ? t('setReady') : t('setLeft', { n: 3 - n })}</p>
        <div class="btn-row center"><button class="btn btn-primary" data-ds-add ${n < 3 ? 'disabled' : ''}>${t('setAdd')} · ${price(total)}</button></div>
      </div>`;
    };
    el.addEventListener('click', e => {
      const opt = e.target.closest('.ds-opt'), slot = e.target.closest('.ds-slot'), add = e.target.closest('[data-ds-add]');
      if (opt) {
        const id = opt.dataset.id, k = slots.indexOf(id);
        if (k > -1) { slots[k] = null; focus = k; }
        else { let i = slots.indexOf(null); if (i < 0) { i = focus; focus = (focus + 1) % 3; } slots[i] = id; }
        save(); draw();
        const img = $(`.ds-slot[data-i="${slots.indexOf(id)}"] img`, el);
        if (img && motion()) gsap.fromTo(img, { y: -16, opacity: 0 }, { y: 0, opacity: 1, duration: .6, ease: 'power3.out' });
        const again = $(`.ds-opt[data-id="${id}"]`, el); if (again) again.focus();
      } else if (slot && filled() === 3) { focus = +slot.dataset.i; save(); draw(); $(`.ds-slot[data-i="${focus}"]`, el).focus(); }
      else if (add) { slots.forEach(id => id && TA.cart.add(C.byId(id).sample.id)); TA.toast(t('setAdded')); TA.drawer && TA.drawer.open('cart'); }
    });
    draw();
  }

  /* ---------- Stations (demo) ---------- */
  function stations(el) {
    let on = +(el.dataset.on || 0);
    const draw = () => {
      const l = C.locations[on];
      el.innerHTML = `<div class="st">
        <ul class="st-locs">${C.locations.map((x, i) => `<li><button class="st-loc${i === on ? ' on' : ''}${x.ok ? '' : ' soon'}" data-i="${i}" aria-pressed="${i === on}">${TA.icon('pin')}<b>${esc(tx(x))}</b><span>${esc(tx(x.state))}</span></button></li>`).join('')}</ul>
        <div class="st-machine${l.ok ? '' : ' off'}">
          <div class="st-crown"><span>3ALTAYER STATION</span><i></i></div>
          <p class="st-screen">${esc(tx(l))}</p>
          <div class="st-glass">${l.slots.map(id => `<span><img src="${C.byId(id).images[0].src}" ${C.byId(id).images[0].studio ? 'data-studio' : ''} alt="" loading="lazy"></span>`).join('')}</div>
          <p class="st-tray" aria-live="polite"></p>
          <div class="st-plinth"></div>
        </div>
        <div class="btn-row center"><button class="btn btn-ghost" data-st-go>${t('tryNow')}</button></div>
        <p class="note center">${t('demoLocations')}</p>
      </div>`;
    };
    el.addEventListener('click', e => {
      const b = e.target.closest('.st-loc'), go = e.target.closest('[data-st-go]');
      if (b) { on = +b.dataset.i; el.dataset.on = on; draw(); $(`.st-loc[data-i="${on}"]`, el).focus(); }
      if (go) {
        const l = C.locations[on]; if (!l.ok) return TA.toast(t('soon'));
        const cells = $$('.st-glass span', el); cells.forEach(c => c.classList.remove('hit'));
        const k = Math.floor(Math.random() * cells.length); cells[k].classList.add('hit');
        $('.st-tray', el).textContent = t('ready', { n: tx(C.byId(l.slots[k]).name) });
      }
    });
    draw();
  }

  TA.ui = Object.assign(TA.ui || {}, { radarSVG, dnaBars, animateRadar, jawak, discoverySet, stations });
})(window.TA = window.TA || {});
