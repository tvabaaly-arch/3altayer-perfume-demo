/* Search results · Wishlist · Brands · Discover · 404 */
(function (TA) {
  'use strict';
  const { $, $$, esc } = TA.util;
  const { t, tx } = TA.i18n;
  const C = TA.catalog, I = TA.icon, ui = TA.ui;

  function search({ query, app }) {
    const q = (query.q || '').trim(), res = q ? C.search(q) : [];
    app.innerHTML = `<div class="wrap plp">
      <header class="plp-head"><h1 class="display-sm">${q ? esc(t('searchResults', { q })) : t('search')}</h1>
        <form class="inline-search" role="search" id="pageSearch"><label class="sr" for="psq">${t('search')}</label>${I('search')}<input id="psq" type="search" value="${esc(q)}" placeholder="${esc(t('searchPh'))}" enterkeyhint="search"><button class="btn btn-primary btn-sm">${t('search')}</button></form>
        ${q ? `<p class="plp-count">${t('results', { n: res.length })}</p>` : ''}</header>
      ${res.length ? ui.grid(res) : `<div class="empty"><p>${q ? esc(t('searchNone', { q })) : t('typeToSearch')}</p></div>
        <h2 class="h3">${t('bestTitle')}</h2>${ui.grid(C.products.slice(0, 4))}`}
    </div>`;
    $('#pageSearch').addEventListener('submit', e => { e.preventDefault(); const v = $('#psq').value.trim(); if (v) TA.router.go('#/search?q=' + encodeURIComponent(v)); });
    return { title: q ? t('searchResults', { q }) : t('search') };
  }

  function wishlist({ app }) {
    const list = TA.wish.ids().map(C.byId).filter(Boolean);
    app.innerHTML = `<div class="wrap plp"><header class="plp-head"><h1 class="display-sm">${t('wishTitle')}</h1>${list.length ? `<p class="plp-count">${t('results', { n: list.length })}</p>` : ''}</header>
      ${list.length ? ui.grid(list) : `<div class="empty">${I('heart', 'ic-xl')}<p>${t('wishEmpty')}</p><a class="btn btn-primary" href="#/c/all">${t('startShopping')}</a></div>`}</div>`;
    return { title: t('wishTitle') };
  }

  function brands({ app }) {
    app.innerHTML = `<div class="wrap plp"><nav class="crumbs" aria-label="${t('breadcrumb')}"><a href="#/">${t('home')}</a>${I('chev')}<span aria-current="page">${t('brands')}</span></nav>
      <header class="plp-head"><h1 class="display-sm">${t('brands')}</h1><p class="lead">${t('brandsText')}</p></header>
      <ul class="brand-grid">${C.brands.map(b => `<li><a class="brand-card" href="#/c/all?brand=${b.slug}" data-rv><span class="brand-img"><img src="${C.byId(b.cover).images[0].src}" ${C.byId(b.cover).images[0].studio ? 'data-studio' : ''} alt="" loading="lazy"></span><b>${esc(b.name)}</b><small>${t('results', { n: b.count })}</small></a></li>`).join('')}</ul></div>`;
    return { title: t('brands') };
  }

  function discover({ app, query }) {
    let dnaId = query.p && C.byId(query.p) ? query.p : 'althair';
    app.innerHTML = `<div class="disc">
      <header class="wrap plp-head disc-head"><p class="eyebrow">Find Your Jawak · Scent DNA</p><h1 class="display-sm">${t('discoverTitle')}</h1><p class="lead">${t('discoverText')}</p>
        <nav class="chips" aria-label="${t('discover')}"><a class="chip" href="#/discover?s=jawak">${t('jawak')}</a><a class="chip" href="#/discover?s=dna">${t('dna')}</a><a class="chip" href="#/discover?s=set">${t('set')}</a><a class="chip" href="#/discover?s=stations">${t('stations')}</a></nav></header>
      <section class="disc-sec" id="jawak" aria-labelledby="dj-h"><div class="wrap jw-grid"><div class="jw-head"><p class="eyebrow">${t('jawakEyebrow')}</p><h2 class="h2" id="dj-h">${t('jawakTitle')}</h2><p class="lead">${t('jawakText')}</p></div><div class="jw" id="discJawak" data-sel="calm"></div></div></section>
      <section class="disc-sec alt" id="dna" aria-labelledby="dd-h"><div class="wrap dna-grid">
        <div><p class="eyebrow">${t('dna')}</p><h2 class="h2" id="dd-h">${t('dnaSub')}</h2><p class="lead">${t('dnaPick')}</p>
          <div class="dna-pick" role="radiogroup" aria-label="${t('dnaPick')}">${C.products.map(p => `<button role="radio" class="dna-opt" data-id="${p.id}" aria-checked="${p.id === dnaId}" title="${esc(p.brand + ' ' + tx(p.name))}"><img src="${p.images[0].src}" ${p.images[0].studio ? 'data-studio' : ''} alt="${esc(tx(p.name))}" loading="lazy"></button>`).join('')}</div>
          <div id="dnaRead"></div></div>
        <div class="dna-chart" id="dnaChart"></div></div></section>
      <section class="disc-sec" id="set" aria-labelledby="ds-h"><div class="wrap"><div class="center-head"><p class="eyebrow">${t('set')}</p><h2 class="h2" id="ds-h">${t('setTitle')}</h2><p class="lead">${t('setText')}</p></div><div id="discSet"></div></div></section>
      <section class="disc-sec alt" id="stations" aria-labelledby="dst-h"><div class="wrap"><div class="center-head"><p class="eyebrow">${t('stations')}</p><h2 class="h2" id="dst-h">${t('stationsTitle')}</h2><p class="lead">${t('stationsText')}</p></div><div id="discSt"></div></div></section>
    </div>`;
    ui.jawak($('#discJawak'));
    ui.discoverySet($('#discSet'));
    ui.stations($('#discSt'));
    const drawDna = (animate) => {
      const p = C.byId(dnaId);
      $('#dnaChart').innerHTML = ui.radarSVG(p);
      $('#dnaRead').innerHTML = `<div class="dna-read"><p class="pc-brand">${esc(p.brand)}</p><h3 class="h3"><a href="${p.url}">${esc(tx(p.name))}</a></h3>${ui.dnaBars(p)}<p class="note">${t('demoData')}</p>
        <div class="btn-row"><a class="btn btn-ghost btn-sm" href="${p.url}">${t('viewProduct')}</a><button class="btn btn-primary btn-sm" data-action="add" data-variant="${p.sample.id}">${t('kind_sample')} · ${p.sample.ml} ${t('ml')}</button></div></div>`;
      $$('.dna-opt', app).forEach(b => b.setAttribute('aria-checked', b.dataset.id === dnaId));
      if (animate) ui.animateRadar($('#dnaChart'));
    };
    $('.dna-pick', app).addEventListener('click', e => { const b = e.target.closest('.dna-opt'); if (b) { dnaId = b.dataset.id; drawDna(true); } });
    drawDna(false);
    return { title: t('discoverTitle') };
  }

  function notfound({ app }) {
    app.innerHTML = `<div class="wrap empty nf"><h1 class="display-sm">${t('notFound')}</h1><a class="btn btn-primary" href="#/">${t('backHome')}</a></div>`;
    return { title: t('notFound') };
  }

  TA.pages = Object.assign(TA.pages || {}, { search, wishlist, brands, discover, notfound });
})(window.TA = window.TA || {});
