/* Category / listing page — filters and sort live in the URL query so a listing can be shared,
   and so a server-side listing (pagination, live filters) can replace the client filter later. */
(function (TA) {
  'use strict';
  const { $, $$, esc } = TA.util;
  const { t, tx } = TA.i18n;
  const C = TA.catalog, I = TA.icon;

  const SORTS = { featured: (a, b) => a.featured - b.featured, asc: (a, b) => a.bottle.price - b.bottle.price, desc: (a, b) => b.bottle.price - a.bottle.price, name: (a, b) => a.name.en.localeCompare(b.name.en) };

  function state(q) { return { brand: (q.brand || '').split(',').filter(Boolean), g: q.g || '', type: q.type || '', sort: SORTS[q.sort] ? q.sort : 'featured' }; }
  function apply(base, s, kind) {
    const cmp = kind === 'sample' && s.sort !== 'featured' && s.sort !== 'name' ? (s.sort === 'asc' ? (a, b) => a.sample.price - b.sample.price : (a, b) => b.sample.price - a.sample.price) : SORTS[s.sort];
    return base.filter(p => (!s.brand.length || s.brand.includes(p.brandSlug)) && (!s.g || p.gender === s.g) && (!s.type || (s.type === 'niche') === p.niche)).sort(cmp);
  }

  function filtersHTML(base, s, cat, idp) {
    const opt = (name, value, label, checked, n) => `<label class="fopt"><input type="checkbox" name="${name}" value="${value}" ${checked ? 'checked' : ''}><span>${esc(label)}</span><small>${n}</small></label>`;
    const brands = [...new Set(base.map(p => p.brand))];
    return `<fieldset><legend>${t('brand_f')}</legend>${brands.map(b => { const slug = C.brands.find(x => x.name === b).slug; return opt('brand', slug, b, s.brand.includes(slug), base.filter(p => p.brand === b).length); }).join('')}</fieldset>
      ${['men', 'women'].includes(cat.slug) ? '' : `<fieldset><legend>${t('gender_f')}</legend>${['men', 'women'].map(g => opt('g', g, t(g), s.g === g, base.filter(p => p.gender === g).length)).join('')}</fieldset>`}
      ${cat.slug === 'niche' ? '' : `<fieldset><legend>${t('family_f')}</legend>${opt('type', 'niche', t('niche'), s.type === 'niche', base.filter(p => p.niche).length)}${opt('type', 'designer', t('designer'), s.type === 'designer', base.filter(p => !p.niche).length)}</fieldset>`}
      <button type="button" class="btn-text" data-clear>${t('clearAll')}</button>`.replace(/name="/g, `data-f="${idp}" name="`);
  }

  function view({ params, query, app }) {
    const cat = C.bySlug(params[0]);
    if (!cat) return TA.pages.notfound({ app });
    const base = C.products.filter(cat.filter);
    let s = state(query);

    app.innerHTML = `
    <div class="wrap plp">
      <nav class="crumbs" aria-label="${t('breadcrumb')}"><a href="#/">${t('home')}</a>${I('chev')}<span aria-current="page">${esc(tx(cat.name))}</span></nav>
      <header class="plp-head">
        <h1 class="display-sm">${esc(tx(cat.name))}</h1>
        <p class="lead">${esc(tx(cat.desc))}</p>
      </header>
      <div class="plp-cats" role="list">${C.categories.map(c => `<a role="listitem" class="chip${c.slug === cat.slug ? ' on' : ''}" href="#/c/${c.slug}" ${c.slug === cat.slug ? 'aria-current="page"' : ''}>${esc(tx(c.name))}</a>`).join('')}</div>
      <div class="plp-bar">
        <button class="btn btn-ghost btn-sm plp-fbtn" data-ffilter>${I('filter')}${t('filter')} <i class="fcount" hidden></i></button>
        <p class="plp-count" aria-live="polite"></p>
        <label class="sel"><span class="sr">${t('sort')}</span><select id="sortSel">${Object.keys(SORTS).map(k => `<option value="${k}" ${s.sort === k ? 'selected' : ''}>${t('s_' + k)}</option>`).join('')}</select>${I('chevDown')}</label>
      </div>
      ${cat.kind === 'sample' ? `<p class="note plp-note">${I('vial')} ${t('showingSamples')}</p>` : ''}
      <div class="plp-body">
        <aside class="plp-side" aria-label="${t('filters')}"><form class="ffilters" id="fSide">${filtersHTML(base, s, cat, 'side')}</form></aside>
        <div class="plp-grid" id="plpGrid"></div>
      </div>
    </div>
    <div class="sheet" id="dFilter" role="dialog" aria-modal="true" aria-labelledby="fsheet-h" hidden>
      <div class="sheet-head"><h2 id="fsheet-h">${t('filters')}</h2><button class="icon-btn" data-close aria-label="${t('close')}">${I('close')}</button></div>
      <form class="ffilters sheet-body" id="fSheet">${filtersHTML(base, s, cat, 'sheet')}</form>
      <div class="sheet-foot"><button class="btn btn-primary btn-block" data-close id="fShow"></button></div>
    </div>`;

    function draw() {
      const list = apply(base, s, cat.kind);
      $('#plpGrid').innerHTML = list.length ? TA.ui.grid(list, { kind: cat.kind }) : `<div class="empty"><p>${t('noResults')}</p><button class="btn btn-ghost" data-clear>${t('clearAll')}</button></div>`;
      $('.plp-count').textContent = t('results', { n: list.length });
      $('#fShow').textContent = t('showN', { n: list.length });
      const n = s.brand.length + (s.g ? 1 : 0) + (s.type ? 1 : 0), fc = $('.fcount'); fc.hidden = !n; fc.textContent = n;
      ['#fSide', '#fSheet'].forEach(f => $$('input', $(f)).forEach(i => { i.checked = i.name === 'brand' ? s.brand.includes(i.value) : s[i.name] === i.value; }));
      TA.router.replaceQuery({ brand: s.brand.join(','), g: s.g, type: s.type, sort: s.sort === 'featured' ? '' : s.sort });
      TA.reveal(app);
    }
    const onChange = e => {
      const i = e.target; if (!i.matches('input[type=checkbox]')) return;
      if (i.name === 'brand') s.brand = i.checked ? [...s.brand, i.value] : s.brand.filter(b => b !== i.value);
      else s[i.name] = i.checked ? i.value : '';
      draw();
    };
    $('#fSide').addEventListener('change', onChange); $('#fSheet').addEventListener('change', onChange);
    $('#sortSel').addEventListener('change', e => { s.sort = e.target.value; draw(); });
    app.addEventListener('click', clearAll);
    function clearAll(e) { if (e.target.closest('[data-clear]')) { s = { brand: [], g: '', type: '', sort: s.sort }; draw(); } if (e.target.closest('[data-ffilter]')) TA.drawer.open('filters', '#dFilter'); }
    draw();
    return { title: tx(cat.name), cleanup: () => { const d = $('#dFilter'); if (d) { if (TA.drawer.name === 'filters') TA.drawer.close(true); } app.removeEventListener('click', clearAll); } };
  }
  TA.pages = Object.assign(TA.pages || {}, { category: view });
})(window.TA = window.TA || {});
