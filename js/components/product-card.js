/* <ProductCard> + <ProductRail> + <ProductGrid>
   Pure render functions: (product, options) -> HTML string.
   Interactions are handled by delegated listeners in js/app.js via data-action attributes,
   so cards can be re-rendered (language switch, filters) without re-binding. */
(function (TA) {
  'use strict';
  const { esc } = TA.util;
  const { t, tx, price } = TA.i18n;

  function card(p, { kind = 'bottle', eager = false } = {}) {
    const v = kind === 'sample' ? p.sample : p.bottle;
    const wished = TA.wish.has(p.id);
    const tag = p.niche ? t('niche') : '';
    return `<article class="pc" data-id="${p.id}">
      <a class="pc-media" href="${p.url}" aria-label="${esc(p.brand + ' ' + tx(p.name))}">
        <img src="${p.images[0].src}" alt="${esc(p.images[0].alt)}" ${eager ? '' : 'loading="lazy"'} decoding="async" width="400" height="500">
        ${tag ? `<span class="pc-tag">${tag}</span>` : ''}
      </a>
      <button class="pc-wish${wished ? ' on' : ''}" data-action="wish" data-id="${p.id}" aria-pressed="${wished}" aria-label="${esc(t(wished ? 'wishRemove' : 'wishAdd'))}">${TA.icon('heart')}</button>
      <div class="pc-body">
        <p class="pc-brand">${esc(p.brand)}</p>
        <h3 class="pc-name"><a href="${p.url}">${esc(tx(p.name))}</a></h3>
        <p class="pc-sub">${esc(TA.i18n.lang === 'ar' ? p.sub.ar + ' · ' + tx(p.mood) : tx(p.mood))}</p>
        <div class="pc-foot">
          <p class="pc-price"><b>${price(v.price)}</b><span>${kind === 'sample' ? `${v.ml} ${t('ml')}` : `${v.ml} ${t('ml')} · ${t('sampleFrom', { p: price(p.sample.price) })}`}</span></p>
          <button class="pc-add" data-action="add" data-variant="${v.id}" aria-label="${esc(t('addToCart') + ': ' + tx(p.name) + ' ' + v.ml + ' ' + t('ml'))}">${TA.icon('plus')}<span>${t('add')}</span></button>
        </div>
      </div>
    </article>`;
  }

  const grid = (products, opts) => `<div class="pgrid">${products.map((p, i) => card(p, { ...opts, eager: i < 4 })).join('')}</div>`;

  function rail(products, { id, title, sub, link, kind } = {}) {
    return `<section class="rail-sec" ${id ? `id="${id}"` : ''} aria-labelledby="${id || 'r'}-h">
      <div class="wrap sec-head">
        <div><h2 class="h2" id="${id || 'r'}-h">${title}</h2>${sub ? `<p class="sec-sub">${sub}</p>` : ''}</div>
        ${link ? `<a class="link-arrow" href="${link}">${t('viewAll')} ${TA.icon('arrow')}</a>` : ''}
      </div>
      <div class="rail" data-rail>
        <div class="rail-track">${products.map(p => card(p, { kind })).join('')}</div>
        <button class="rail-btn prev" data-action="rail" data-dir="-1" aria-label="‹">${TA.icon('chev')}</button>
        <button class="rail-btn next" data-action="rail" data-dir="1" aria-label="›">${TA.icon('chev')}</button>
      </div>
    </section>`;
  }

  /* compact horizontal card (search results, jawak result, cart suggestions) */
  const mini = p => `<a class="pmini" href="${p.url}">
      <span class="pmini-img"><img src="${p.images[0].src}" alt="" loading="lazy"></span>
      <span class="pmini-txt"><small>${esc(p.brand)}</small><b>${esc(tx(p.name))}</b><em>${price(p.bottle.price)}</em></span>
    </a>`;

  TA.ui = Object.assign(TA.ui || {}, { card, grid, rail, mini });
})(window.TA = window.TA || {});
