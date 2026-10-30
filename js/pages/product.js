/* Product detail — gallery, size/variant selector, quantity, add to bag, wishlist,
   sample nudge, notes, Scent DNA (secondary, inside an accordion), related products,
   and a sticky add-to-bag bar on mobile. */
(function (TA) {
  'use strict';
  const { $, $$, esc } = TA.util;
  const { t, tx, price, variantLabel } = TA.i18n;
  const C = TA.catalog, I = TA.icon;

  function view({ params, app }) {
    const p = C.byId(params[0]);
    if (!p) return TA.pages.notfound({ app });
    let v = p.bottle, qty = 1;
    const wished = TA.wish.has(p.id);
    const cat = C.bySlug(p.gender);

    app.innerHTML = `
    <div class="wrap pdp">
      <nav class="crumbs" aria-label="${t('breadcrumb')}"><a href="#/">${t('home')}</a>${I('chev')}<a href="#/c/${cat.slug}">${esc(tx(cat.name))}</a>${I('chev')}<span aria-current="page">${esc(tx(p.name))}</span></nav>
      <div class="pd" data-id="${p.id}">
        <div class="pd-gallery" aria-label="${t('gallery')}">
          <div class="pd-track" id="pdTrack" tabindex="0" role="region" aria-label="${t('gallery')}">${p.images.map((im, i) => `<figure class="pd-shot${im.product ? ' is-product' : ''}" id="shot${i}"><img src="${im.src}" alt="${esc(im.alt)}" ${im.pos ? `style="object-position:${im.pos}"` : ''} ${i ? 'loading="lazy"' : 'fetchpriority="high"'}></figure>`).join('')}</div>
          ${p.images.length > 1 ? `<div class="pd-dots" role="tablist">${p.images.map((_, i) => `<button role="tab" aria-selected="${!i}" aria-label="${t('imageN', { n: i + 1 })}" data-shot="${i}"></button>`).join('')}</div>` : ''}
        </div>
        <div class="pd-info">
          <div class="pd-sticky">
            <a class="pd-brand" href="#/c/all?brand=${p.brandSlug}">${esc(p.brand)}</a>
            <h1 class="display-sm pd-name">${esc(tx(p.name))}</h1>
            <p class="pd-sub">${esc(TA.i18n.lang === 'ar' ? p.sub.ar + ' · ' : '')}${esc(tx(p.mood))}</p>
            <p class="pd-price" aria-live="polite"><b id="pdPrice">${price(v.price)}</b><span id="pdSize">${variantLabel(v)}</span></p>
            <p class="pd-line">${esc(tx(p.line))}</p>

            <fieldset class="pd-variants"><legend>${t('chooseSize')}</legend>
              <div class="vgrid" role="radiogroup" aria-label="${t('chooseSize')}">${p.variants.map(x => `<button class="vopt${x.id === v.id ? ' on' : ''}" role="radio" aria-checked="${x.id === v.id}" data-vid="${x.id}">
                <span>${t('kind_' + x.kind)}</span><b>${x.ml} ${t('ml')}</b><em>${price(x.price)}</em></button>`).join('')}</div>
            </fieldset>
            <button class="pd-nudge" data-vid="${p.sample.id}" id="pdNudge">${I('vial')}<span>${t('trySample', { ml: p.sample.ml, p: price(p.sample.price) })}</span></button>

            <div class="pd-buy" id="pdBuy">
              <div class="qty qty-lg" role="group" aria-label="${t('qty')}"><button data-q="-1" aria-label="${t('dec')}">${I('minus')}</button><output id="pdQty" aria-live="polite">1</output><button data-q="1" aria-label="${t('inc')}">${I('plus')}</button></div>
              <button class="btn btn-primary pd-add" data-action="add" data-variant="${v.id}" data-qty="1" id="pdAdd">${I('bag')}${t('addToCart')}</button>
              <button class="icon-btn pd-wish pc-wish${wished ? ' on' : ''}" data-action="wish" data-id="${p.id}" aria-pressed="${wished}" aria-label="${t(wished ? 'wishRemove' : 'wishAdd')}">${I('heart')}</button>
            </div>
            <ul class="pd-trust"><li>${I('shield')}${t('original')}</li><li>${I('truck')}${t('fast')}</li><li>${I('vial')}${t('tryFirst')}</li></ul>

            <div class="acc">
              <details open><summary>${t('description')}${I('chevDown')}</summary><div class="acc-body">
                <p>${esc(tx(p.line))}</p>
                <dl class="facts"><div><dt>${t('mood')}</dt><dd>${esc(tx(p.mood))}</dd></div><div><dt>${t('season')}</dt><dd>${esc(tx(p.season))}</dd></div><div><dt>${t('occasion')}</dt><dd>${esc(tx(p.occasion))}</dd></div></dl></div></details>
              <details><summary>${t('notes')}${I('chevDown')}</summary><div class="acc-body">
                <dl class="pyr">${['top', 'heart', 'base'].map(k => `<div><dt>${t(k)}</dt><dd>${tx(p.notes[k]).map(n => `<span>${esc(n)}</span>`).join('')}</dd></div>`).join('')}</dl></div></details>
              <details id="pdDna"><summary>${t('scentDna')}${I('chevDown')}</summary><div class="acc-body dna-acc">${TA.ui.radarSVG(p)}${TA.ui.dnaBars(p)}<p class="note">${t('demoData')}</p></div></details>
              <details><summary>${t('delivery')}${I('chevDown')}</summary><div class="acc-body"><p>${t('deliveryTxt')}</p></div></details>
            </div>
            <p class="note">${t('demoPrices')}</p>
          </div>
        </div>
      </div>
    </div>
    ${TA.ui.rail(C.related(p, 6), { id: 'related', title: t('related') })}
    <div class="buybar" id="buybar" aria-hidden="true">
      <span class="buybar-img"><img src="${p.images[0].src}" alt=""></span>
      <span class="buybar-txt"><b>${esc(tx(p.name))}</b><em id="bbPrice">${price(v.price)} · ${v.ml} ${t('ml')}</em></span>
      <button class="btn btn-primary btn-sm" data-action="add" data-variant="${v.id}" data-qty="1" id="bbAdd" tabindex="-1">${t('add')}</button>
    </div>`;

    const setVariant = id => {
      v = p.variants.find(x => x.id === id);
      $$('.vopt', app).forEach(b => { const on = b.dataset.vid === id; b.classList.toggle('on', on); b.setAttribute('aria-checked', on); });
      $('#pdPrice').textContent = price(v.price * qty); $('#pdSize').textContent = variantLabel(v) + (qty > 1 ? ` × ${qty}` : '');
      ['#pdAdd', '#bbAdd'].forEach(s => { $(s).dataset.variant = v.id; $(s).dataset.qty = qty; });
      $('#bbPrice').textContent = `${price(v.price)} · ${v.ml} ${t('ml')}`;
      $('#pdNudge').hidden = v.kind !== 'bottle';
    };
    app.addEventListener('click', onClick);
    function onClick(e) {
      const vo = e.target.closest('.vopt, .pd-nudge'), q = e.target.closest('[data-q]'), dot = e.target.closest('[data-shot]');
      if (vo) { setVariant(vo.dataset.vid); if (vo.classList.contains('pd-nudge')) $('.vopt.on', app).focus(); }
      if (q) { qty = Math.max(1, Math.min(10, qty + +q.dataset.q)); $('#pdQty').textContent = qty; setVariant(v.id); }
      if (dot) { const sh = $('#shot' + dot.dataset.shot); $('#pdTrack').scrollTo({ left: sh.offsetLeft - $('#pdTrack').offsetLeft, behavior: 'smooth' }); }
    }
    $('.vgrid', app).addEventListener('keydown', e => {
      if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.key)) return; e.preventDefault();
      const all = $$('.vopt', app), i = all.findIndex(b => b.classList.contains('on')), fwd = (e.key === 'ArrowLeft') === (document.dir === 'rtl') || e.key === 'ArrowDown';
      const n = all[(i + (fwd ? 1 : -1) + all.length) % all.length]; setVariant(n.dataset.vid); n.focus();
    });
    /* gallery dots follow swipe */
    const track = $('#pdTrack'), dots = $$('[data-shot]', app);
    const io = dots.length && new IntersectionObserver(es => es.forEach(en => { if (en.isIntersecting && en.intersectionRatio > .6) { const i = $$('.pd-shot', app).indexOf(en.target); dots.forEach((d, k) => d.setAttribute('aria-selected', k === i)); } }), { root: track, threshold: [.6] });
    if (io) $$('.pd-shot', app).forEach(s => io.observe(s));
    /* sticky buy bar when the main buy row is out of view */
    const bar = $('#buybar');
    const io2 = new IntersectionObserver(([en]) => { const show = !en.isIntersecting && en.boundingClientRect.top < 0; bar.classList.toggle('on', show); bar.setAttribute('aria-hidden', !show); $('#bbAdd').tabIndex = show ? 0 : -1; });
    io2.observe($('#pdBuy'));
    /* animate radar when DNA opens */
    $('#pdDna').addEventListener('toggle', e => { if (e.target.open) TA.ui.animateRadar(e.target); });
    setVariant(v.id);
    return { title: `${p.brand} ${tx(p.name)}`, cleanup: () => { app.removeEventListener('click', onClick); io && io.disconnect(); io2.disconnect(); } };
  }
  TA.pages = Object.assign(TA.pages || {}, { product: view });
})(window.TA = window.TA || {});
