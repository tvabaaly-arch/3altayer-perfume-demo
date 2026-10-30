/* Home — shopping first, discovery second.
   Order: hero → categories → most loved → try-before-the-bottle → niche → fragrance of the moment
          → Find Your Jawak (compact) → houses → trust → stations → closing */
(function (TA) {
  'use strict';
  const { $, esc } = TA.util;
  const { t, tx, price } = TA.i18n;
  const C = TA.catalog, I = TA.icon, ui = TA.ui;

  function view({ app }) {
    const best = C.products.slice(0, 8);
    const niche = C.products.filter(p => p.niche);
    const m = C.byId('althair'), al = C.byId('alexandre');
    app.innerHTML = `
    <section class="hero" aria-labelledby="hero-h">
      <div class="hero-media"><img src="${TA.asset('hero-alexandre.webp')}" alt="${esc(al.images[0].alt)}" fetchpriority="high"></div>
      <div class="hero-copy">
        <div class="hero-txt">
          <p class="eyebrow" data-rv>${t('heroEyebrow')}</p>
          <h1 class="display" id="hero-h" data-rv>${t('heroTitle')}</h1>
          <p class="hero-en" data-rv>Find Your Jawak</p>
          <p class="lead" data-rv>${t('heroText')}</p>
          <div class="btn-row" data-rv><a class="btn btn-light" href="#/c/all">${t('shopNow')}</a><a class="btn btn-outline-light" href="#/c/samples">${t('trySamples')}</a></div>
          <a class="hero-tag" href="${al.url}" data-rv><span>${esc(al.brand)}</span><b>${esc(tx(al.name))}</b><em>${price(al.bottle.price)} · ${t('sampleFrom', { p: price(al.sample.price) })}</em></a>
        </div>
      </div>
    </section>

    <section class="cats" aria-labelledby="cats-h">
      <div class="wrap sec-head"><h2 class="h2" id="cats-h">${t('catTitle')}</h2></div>
      <div class="wrap cat-grid">${C.categories.map(c => { const p = C.byId(c.cover); return `<a class="cat cat-${c.slug}" href="#/c/${c.slug}" data-rv>
          <span class="cat-img"><img src="${p.images[0].src}" ${p.images[0].studio ? 'data-studio' : ''} alt="" loading="lazy"></span>
          <span class="cat-txt"><b>${esc(tx(c.name))}</b><small>${C.products.filter(c.filter).length} · ${t('viewAll')}</small></span>${I('arrow')}</a>`; }).join('')}</div>
    </section>

    ${ui.rail(best, { id: 'best', title: t('bestTitle'), sub: t('bestSub'), link: '#/c/all' })}

    <section class="sampl" aria-labelledby="sampl-h">
      <div class="sampl-media"><img src="${TA.asset('samples.webp')}" alt="${esc(t('samplesEyebrow'))}" loading="lazy"></div>
      <div class="sampl-copy wrap"><div class="sampl-box">
        <p class="eyebrow" data-rv>${t('samplesEyebrow')}</p>
        <h2 class="h2" id="sampl-h" data-rv>${t('samplesTitle')}</h2>
        <p class="lead" data-rv>${t('samplesText')}</p>
        <ol class="steps" data-rv><li>${I('bottle')}<span>${t('step1')}</span></li><li>${I('vial')}<span>${t('step2')}</span></li><li>${I('check')}<span>${t('step3')}</span></li></ol>
        <div class="btn-row" data-rv><a class="btn btn-primary" href="#/c/samples">${t('shopSamples')} · ${t('from')} ${price(Math.min(...C.products.map(p => p.sample.price)))}</a><a class="btn btn-ghost" href="#/discover?s=set">${t('set')}</a></div>
      </div></div>
    </section>

    <section class="niche-banner" aria-labelledby="nb-h">
      <div class="wrap nb-in">
        <div class="nb-media" data-rv><img src="${TA.asset('niche-banner.webp')}" alt="${esc(al.brand + ' · Dolce & Gabbana Devotion · Diesel Fuel for Life')}" loading="lazy"></div>
        <div class="nb-copy">
          <p class="eyebrow" data-rv>${t('niche')}</p>
          <h2 class="display-sm" id="nb-h" data-rv>${t('nicheTitle')}</h2>
          <p class="lead" data-rv>${t('nicheText')}</p>
          <div class="btn-row" data-rv><a class="btn btn-primary" href="#/c/niche">${t('shopNiche')}</a><a class="btn btn-ghost" href="#/brands">${t('brands')}</a></div>
        </div>
      </div>
    </section>
    ${ui.rail(niche, { id: 'niche', title: t('nicheSub'), link: '#/c/niche' })}

    <section class="moment" aria-labelledby="moment-h">
      <div class="wrap moment-grid">
        <a class="moment-img" href="${m.url}" data-rv><img src="${m.images[0].src}" ${m.images[0].studio ? 'data-studio' : ''} alt="${esc(m.images[0].alt)}" loading="lazy"></a>
        <div class="moment-copy">
          <p class="eyebrow" data-rv>${t('momentEyebrow')}</p>
          <p class="brand-line" data-rv>${esc(m.brand)}</p>
          <h2 class="display" id="moment-h" data-rv>${esc(tx(m.name))}</h2>
          <p class="lead" data-rv>${esc(tx(m.line))}</p>
          <dl class="notes-mini" data-rv>${['top', 'heart', 'base'].map(k => `<div><dt>${t(k)}</dt><dd>${tx(m.notes[k]).join(' · ')}</dd></div>`).join('')}</dl>
          <p class="moment-price" data-rv><b>${price(m.bottle.price)}</b> <span>${m.bottle.ml} ${t('ml')} · ${t('sampleFrom', { p: price(m.sample.price) })}</span></p>
          <div class="btn-row" data-rv><button class="btn btn-primary" data-action="add" data-variant="${m.bottle.id}">${t('addToCart')}</button><a class="btn btn-ghost" href="${m.url}">${t('viewProduct')}</a></div>
        </div>
      </div>
    </section>

    <section class="jw-sec" aria-labelledby="jw-h">
      <div class="wrap jw-grid">
        <div class="jw-head"><p class="eyebrow" data-rv>${t('jawakEyebrow')} · Find Your Jawak</p><h2 class="h2" id="jw-h" data-rv>${t('jawakTitle')}</h2><p class="lead" data-rv>${t('jawakText')}</p>
          <a class="link-arrow" href="#/discover" data-rv>${t('exploreMore')} ${I('arrow')}</a></div>
        <div class="jw" id="homeJawak" data-sel="fresh"></div>
      </div>
    </section>

    <section class="houses" aria-labelledby="houses-h">
      <div class="wrap sec-head"><h2 class="h2" id="houses-h">${t('brandsTitle')}</h2><a class="link-arrow" href="#/brands">${t('viewAll')} ${I('arrow')}</a></div>
      <ul class="wrap house-list">${C.brands.map(b => `<li><a href="#/c/all?brand=${b.slug}">${esc(b.name)}</a></li>`).join('')}</ul>
    </section>

    <section class="trust" aria-labelledby="trust-h">
      <div class="wrap"><h2 class="h2 center" id="trust-h">${t('trustTitle')}</h2>
        <ul class="pillars">${[['shield', 't1'], ['check', 't2'], ['truck', 't3'], ['vial', 't4']].map(([ic, k]) => `<li data-rv>${I(ic)}<b>${t(k)}</b><p>${t(k + 'd')}</p></li>`).join('')}</ul>
        <div class="quotes">${['q1', 'q2', 'q3'].map(k => `<figure data-rv><blockquote>${t(k)}</blockquote><figcaption>${t('demoClient')} <em class="tag-demo">${t('demoContent')}</em></figcaption></figure>`).join('')}</div>
      </div>
    </section>

    <section class="st-band" aria-labelledby="st-h">
      <div class="wrap st-band-in">
        <div><p class="eyebrow">${t('stations')}</p><h2 class="h2" id="st-h">${t('stationsTitle')}</h2><p class="lead">${t('stationsText')}</p></div>
        <a class="btn btn-ghost" href="#/discover?s=stations">${I('pin')}${t('findStation')}</a>
      </div>
    </section>

    <section class="closing" aria-label="${esc(t('closingTitle'))}">
      <div class="closing-media"><img src="${TA.asset('closing.webp')}" alt="" loading="lazy"></div>
      <div class="closing-copy wrap"><p class="closing-en" data-rv>Don’t just find a perfume.<br><em>Find your Jawak.</em></p>
        ${TA.i18n.lang === 'ar' ? `<p class="closing-ar" data-rv>${t('closingTitle')}</p>` : ''}
        <a class="btn btn-primary" href="#/c/all" data-rv>${t('shopNow')}</a></div>
    </section>`;
    ui.jawak($('#homeJawak'), { compact: true });
    return { title: t('heroTitle') };
  }
  TA.pages = Object.assign(TA.pages || {}, { home: view });
})(window.TA = window.TA || {});
