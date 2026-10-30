/* App shell: <Header> <MegaMenu> <SearchOverlay> <MenuDrawer> <CartDrawer> <TabBar> <Footer> <Toast>
   Static skeleton lives in index.html; inner content is rendered here so it follows the language. */
(function (TA) {
  'use strict';
  const { $, $$, esc, on, trapFocus, debounce, motion } = TA.util;
  const { t, tx, price, variantLabel } = TA.i18n;
  const C = TA.catalog, I = TA.icon;

  /* ---------- toast ---------- */
  let toastTimer;
  TA.toast = (msg) => {
    const el = $('#toast'); el.textContent = msg; el.classList.add('on');
    clearTimeout(toastTimer); toastTimer = setTimeout(() => el.classList.remove('on'), 2600);
  };

  /* ---------- header ---------- */
  function renderHeader() {
    const r = TA.router.current;
    const active = slug => r && r.name === 'category' && r.params[0] === slug ? ' aria-current="page"' : '';
    $('#navList').innerHTML = `
      <li class="has-mega"><button class="nav-a" data-mega aria-expanded="false" aria-controls="mega">${t('perfumes')}${I('chevDown')}</button></li>
      <li><a class="nav-a" href="#/c/men"${active('men')}>${t('men')}</a></li>
      <li><a class="nav-a" href="#/c/women"${active('women')}>${t('women')}</a></li>
      <li><a class="nav-a" href="#/c/niche"${active('niche')}>${t('niche')}</a></li>
      <li><a class="nav-a" href="#/c/samples"${active('samples')}>${t('samples')}</a></li>
      <li><a class="nav-a" href="#/brands"${r && r.name === 'brands' ? ' aria-current="page"' : ''}>${t('brands')}</a></li>
      <li><a class="nav-a nav-discover" href="#/discover"${r && r.name === 'discover' ? ' aria-current="page"' : ''}>${I('spark')}${t('discover')}</a></li>`;
    const feat = C.byId('althair');
    $('#mega').innerHTML = `<div class="mega-in wrap">
      <div class="mega-col"><p class="mega-h">${t('shop')}</p>${C.categories.map(c => `<a href="#/c/${c.slug}">${esc(tx(c.name))}</a>`).join('')}</div>
      <div class="mega-col"><p class="mega-h">${t('brands')}</p>${C.brands.map(b => `<a href="#/c/all?brand=${b.slug}">${esc(b.name)}</a>`).join('')}</div>
      <div class="mega-col"><p class="mega-h">${t('discover')}</p>
        <a href="#/discover?s=jawak">${t('jawak')}<small>${t('jawakSub')}</small></a>
        <a href="#/discover?s=dna">${t('dna')}<small>${t('dnaSub')}</small></a>
        <a href="#/discover?s=set">${t('set')}<small>${t('setSub')}</small></a>
        <a href="#/discover?s=stations">${t('stations')}<small>${t('stationsSub')}</small></a></div>
      <a class="mega-feat" href="${feat.url}"><span class="mega-feat-img"><img src="${feat.images[0].src}" ${feat.images[0].studio ? 'data-studio' : ''} alt="" loading="lazy"></span>
        <span><small>${t('momentEyebrow')}</small><b>${esc(tx(feat.name))}</b><em>${esc(feat.brand)}</em></span></a>
    </div>`;
    $('#hdrSearchLabel').textContent = t('searchPh');
    $('#langBtn').textContent = t('langShort');
    $('#langBtn').setAttribute('aria-label', t('lang'));
    updateBadges();
  }
  function updateBadges() {
    const c = TA.cart.summary().count, w = TA.wish.count();
    $$('[data-badge="cart"]').forEach(b => { b.textContent = c; b.hidden = !c; });
    $$('[data-badge="wish"]').forEach(b => { b.textContent = w; b.hidden = !w; });
    $$('[data-cart-label]').forEach(b => b.setAttribute('aria-label', `${t('cart')} (${c})`));
  }

  /* mega menu: hover on desktop, click/keyboard everywhere */
  let megaTimer;
  const mega = () => $('#mega');
  function setMega(open) {
    const btn = $('[data-mega]'); if (!btn) return;
    btn.setAttribute('aria-expanded', open); mega().classList.toggle('on', open); $('#hdr').classList.toggle('mega-open', open);
    if (open && motion()) gsap.fromTo($$('.mega-col a, .mega-feat', mega()), { y: 8, opacity: 0 }, { y: 0, opacity: 1, duration: .45, stagger: .015, ease: 'power3.out', overwrite: true });
  }

  /* ---------- drawers (menu, cart, search, filters) ---------- */
  let openName = null, opener = null;
  const panels = { menu: '#dMenu', cart: '#dCart', search: '#dSearch' };
  function openDrawer(name, panelSel) {
    if (openName) closeDrawer(true);
    opener = document.activeElement; openName = name;
    const panel = $(panelSel || panels[name]);
    if (name === 'cart') renderCart(); if (name === 'menu') renderMenu(); if (name === 'search') renderSearch();
    panel.hidden = false; requestAnimationFrame(() => { panel.classList.add('on'); $('#scrim').classList.add('on'); });
    document.documentElement.classList.add('locked');
    const f = panel.querySelector('[autofocus]') || panel.querySelector('input, button, a'); if (f) setTimeout(() => f.focus(), 60);
    panel._sel = panelSel || panels[name];
  }
  function closeDrawer(instant) {
    if (!openName) return;
    const panel = $('.drawer.on, .search-ov.on, .sheet.on') || $(panels[openName]);
    openName = null;
    if (panel) { panel.classList.remove('on'); setTimeout(() => { if (!panel.classList.contains('on')) panel.hidden = true; }, instant === true ? 0 : 420); }
    $('#scrim').classList.remove('on'); document.documentElement.classList.remove('locked');
    if (opener && instant !== true && document.contains(opener)) opener.focus();
  }
  TA.drawer = { open: openDrawer, close: closeDrawer, get name() { return openName; } };

  /* ---------- menu drawer ---------- */
  function renderMenu() {
    $('#dMenu .drawer-body').innerHTML = `
      <nav aria-label="${t('menu')}"><ul class="m-cats">${C.categories.map(c => `<li><a href="#/c/${c.slug}"><span>${esc(tx(c.name))}</span><img src="${C.byId(c.cover).images[0].src}" ${C.byId(c.cover).images[0].studio ? 'data-studio' : ''} alt="" loading="lazy"></a></li>`).join('')}
        <li><a href="#/brands"><span>${t('brands')}</span>${I('chev')}</a></li></ul></nav>
      <p class="m-h">${t('discover')}</p>
      <ul class="m-links"><li><a href="#/discover?s=jawak">${I('spark')}${t('jawak')}</a></li><li><a href="#/discover?s=dna">${I('radar')}${t('dna')}</a></li>
        <li><a href="#/discover?s=set">${I('vial')}${t('set')}</a></li><li><a href="#/discover?s=stations">${I('pin')}${t('stations')}</a></li></ul>
      <div class="m-foot"><button class="btn btn-ghost btn-sm" data-lang-toggle>${I('globe')}${t('lang')}</button><a class="btn btn-ghost btn-sm" href="#/wishlist">${I('heart')}${t('wishlist')}</a></div>`;
    $('#dMenu .drawer-title').textContent = t('menu');
  }

  /* ---------- cart drawer ---------- */
  function renderCart() {
    const ls = TA.cart.lines(), s = TA.cart.summary();
    $('#dCart .drawer-title').innerHTML = `${t('cartTitle')} <small>${s.count ? t('items', { n: s.count }) : ''}</small>`;
    $('#dCart .drawer-body').innerHTML = ls.length ? `<ul class="cart-lines">${ls.map(l => `<li class="cl" data-v="${l.v}">
        <a class="cl-img" href="${l.product.url}"><img src="${l.product.images[0].src}" ${l.product.images[0].studio ? 'data-studio' : ''} alt="" loading="lazy"></a>
        <div class="cl-info"><small>${esc(l.product.brand)}</small><a href="${l.product.url}"><b>${esc(tx(l.product.name))}</b></a><span>${variantLabel(l.variant)}</span>
          <div class="cl-row"><div class="qty" role="group" aria-label="${t('qty')}"><button data-action="qty" data-v="${l.v}" data-d="-1" aria-label="${t('dec')}">${I('minus')}</button><output aria-live="polite">${l.qty}</output><button data-action="qty" data-v="${l.v}" data-d="1" aria-label="${t('inc')}">${I('plus')}</button></div>
          <b class="cl-price">${price(l.qty * l.variant.price)}</b></div></div>
        <button class="cl-rm" data-action="remove" data-v="${l.v}" aria-label="${t('remove')}: ${esc(tx(l.product.name))}">${I('trash')}</button></li>`).join('')}</ul>`
      : `<div class="cart-empty">${I('bag', 'ic-xl')}<p>${t('cartEmpty')}</p><a class="btn btn-primary" href="#/c/all">${t('startShopping')}</a></div>`;
    $('#dCart .drawer-foot').innerHTML = ls.length ? `<div class="sum"><span>${t('subtotal')}</span><b>${price(s.subtotal)}</b></div><p class="note">${t('cartNote')}</p>
      <button class="btn btn-primary btn-block" data-action="checkout">${t('checkout')}</button><p class="note center">${t('demoPrices')}</p>` : '';
  }

  /* ---------- search overlay ---------- */
  const POPULAR = ['Althair', 'Ormonde Jayne', 'فانيلا', 'ورد', 'منعش', 'Devotion'];
  function renderSearch() {
    const box = $('#dSearch');
    if (!box.dataset.built) {
      box.dataset.built = '1';
      box.innerHTML = `<div class="so-in wrap">
        <form class="so-form" role="search" action="#/search"><label class="sr" for="soInput"></label>
          ${I('search')}<input id="soInput" type="search" autocomplete="off" autofocus enterkeyhint="search">
          <button type="button" class="icon-btn" data-close>${I('close')}</button></form>
        <div class="so-body" id="soBody" aria-live="polite"></div></div>`;
      const input = $('#soInput'), body = $('#soBody');
      const run = debounce(() => drawResults(input.value), 120);
      input.addEventListener('input', run);
      $('.so-form', box).addEventListener('submit', e => { e.preventDefault(); if (input.value.trim()) { closeDrawer(true); TA.router.go('#/search?q=' + encodeURIComponent(input.value.trim())); } });
      box.addEventListener('click', e => { const chip = e.target.closest('[data-q]'); if (chip) { input.value = chip.dataset.q; drawResults(input.value); input.focus(); } });
      function drawResults(q) {
        const res = C.search(q);
        body.innerHTML = !q.trim() ? `<p class="so-h">${t('popular')}</p><div class="chips">${POPULAR.map(p => `<button class="chip" data-q="${esc(p)}">${esc(p)}</button>`).join('')}</div>
            <p class="so-h">${t('bestTitle')}</p><div class="so-grid">${C.products.slice(0, 4).map(TA.ui.mini).join('')}</div>`
          : res.length ? `<div class="so-grid">${res.slice(0, 6).map(TA.ui.mini).join('')}</div>${res.length ? `<a class="link-arrow" href="#/search?q=${encodeURIComponent(q.trim())}">${t('seeAllResults', { n: res.length })} ${I('arrow')}</a>` : ''}`
            : `<p class="so-none">${esc(t('searchNone', { q }))}</p><div class="chips">${POPULAR.map(p => `<button class="chip" data-q="${esc(p)}">${esc(p)}</button>`).join('')}</div>`;
      }
      box._draw = drawResults;
    }
    $('#soInput').placeholder = t('searchPh'); $('label[for="soInput"]').textContent = t('search');
    $('#soInput').value = TA.router.current && TA.router.current.name === 'search' ? (TA.router.current.query.q || '') : '';
    box._draw($('#soInput').value);
  }

  /* ---------- tab bar + footer ---------- */
  function renderTabbar() {
    const r = TA.router.current || { name: 'home' };
    const cur = n => r.name === n ? ' aria-current="page"' : '';
    $('#tabbar').innerHTML = `
      <a href="#/"${cur('home')}>${I('home')}<span>${t('home')}</span></a>
      <a href="#/c/all"${r.name === 'category' ? ' aria-current="page"' : ''}>${I('grid')}<span>${t('shop')}</span></a>
      <button data-open="search">${I('search')}<span>${t('search')}</span></button>
      <a href="#/wishlist"${cur('wishlist')}>${I('heart')}<span>${t('wishlist')}</span><i class="badge" data-badge="wish" hidden></i></a>
      <button data-open="cart" data-cart-label>${I('bag')}<span>${t('cart')}</span><i class="badge" data-badge="cart" hidden></i></button>`;
    updateBadges();
  }
  function renderFooter() {
    $('#footer').innerHTML = `<div class="wrap ftr-grid">
        <div class="ftr-brand"><a class="logo logo-lg" href="#/" aria-label="${t('brand')}"><img class="lg-orange" src="${TA.asset('logo-orange.png')}" alt=""><img class="lg-blue" src="${TA.asset('logo-blue.png')}" alt=""></a><p>${t('footerAbout')}</p>
          <div class="social">${['instagram', 'x', 'tiktok', 'whatsapp'].map(n => `<a href="#/" data-demo-link aria-label="${n}">${I(n)}</a>`).join('')}</div></div>
        <nav class="ftr-col" aria-label="${t('shop')}"><h2>${t('shop')}</h2>${C.categories.map(c => `<a href="#/c/${c.slug}">${esc(tx(c.name))}</a>`).join('')}</nav>
        <nav class="ftr-col" aria-label="${t('discover')}"><h2>${t('discover')}</h2><a href="#/discover?s=jawak">${t('jawak')}</a><a href="#/discover?s=dna">${t('dna')}</a><a href="#/discover?s=set">${t('set')}</a><a href="#/discover?s=stations">${t('stations')}</a><a href="#/brands">${t('brands')}</a></nav>
        <nav class="ftr-col" aria-label="${t('help')}"><h2>${t('help')}</h2>${['shipping', 'returns', 'faq', 'contact'].map(k => `<a href="#/" data-demo-link>${t(k)}</a>`).join('')}</nav>
        <form class="news" id="news"><h2>${t('newsTitle')}</h2><p>${t('newsText')}</p>
          <div class="news-row"><label class="sr" for="newsEmail">${t('email')}</label><input id="newsEmail" type="email" required placeholder="name@email.com" dir="ltr"><button class="btn btn-primary btn-sm" type="submit">${t('subscribe')}</button></div>
          <p class="news-msg" role="status"></p></form>
      </div>
      <div class="wrap ftr-bot"><small>${t('rights')}</small><small>${t('demoPrices')}</small></div>`;
  }

  function renderAll() { renderHeader(); renderTabbar(); renderFooter(); TA.i18n.apply(); if (openName === 'cart') renderCart(); if (openName === 'menu') renderMenu(); }

  /* ---------- fly-to-bag micro-interaction ---------- */
  function flyToBag(fromEl) {
    if (!motion() || !fromEl) return;
    const target = [...$$('[data-open="cart"]')].find(b => b.offsetParent && b.getBoundingClientRect().width);
    if (!target) return;
    const a = fromEl.getBoundingClientRect(), b = target.getBoundingClientRect();
    if (!a.width) return;
    const img = document.createElement('img'); img.src = fromEl.src; img.className = 'fly'; img.alt = '';
    Object.assign(img.style, { left: a.left + 'px', top: a.top + 'px', width: a.width + 'px', height: a.height + 'px' });
    document.body.appendChild(img);
    gsap.to(img, { x: b.left + b.width / 2 - (a.left + a.width / 2), y: b.top + b.height / 2 - (a.top + a.height / 2), scale: .12, opacity: .4, duration: .8, ease: 'power3.in', onComplete: () => { img.remove(); gsap.fromTo(target, { scale: .85 }, { scale: 1, duration: .5, ease: 'back.out(3)' }); } });
  }

  /* ---------- global delegated actions ---------- */
  function bind() {
    document.addEventListener('click', e => {
      const a = e.target.closest('[data-action],[data-open],[data-close],[data-lang-toggle],[data-mega],[data-demo-link],a[href^="#/"]');
      if (!a) { if (!e.target.closest('#mega,[data-mega]')) setMega(false); return; }
      if (a.matches('a[href^="#/"]')) { setMega(false); if (!a.hasAttribute('data-demo-link') && a.getAttribute('href') === location.hash) { e.preventDefault(); TA.router.refresh(); } if (openName && !a.closest('.drawer-foot')) closeDrawer(true); if (a.hasAttribute('data-demo-link')) { e.preventDefault(); TA.toast(t('demoLink')); } return; }
      if (a.hasAttribute('data-mega')) { setMega(a.getAttribute('aria-expanded') !== 'true'); return; }
      if (a.hasAttribute('data-open')) { e.preventDefault(); openDrawer(a.dataset.open); return; }
      if (a.hasAttribute('data-close')) { closeDrawer(); return; }
      if (a.hasAttribute('data-lang-toggle')) { TA.i18n.setLang(TA.i18n.lang === 'ar' ? 'en' : 'ar'); return; }
      if (a.hasAttribute('data-demo-link')) { e.preventDefault(); TA.toast(t('demoLink')); return; }
      const act = a.dataset.action;
      if (act === 'add') {
        const v = C.variant(a.dataset.variant); TA.cart.add(a.dataset.variant, +(a.dataset.qty || 1));
        const card = a.closest('.pc, .jw-result, .pd'); flyToBag(card && card.querySelector('img'));
        TA.toast(`${t('added')} — ${tx(v.product.name)} · ${variantLabel(v.variant)}`);
        a.classList.add('done'); setTimeout(() => a.classList.remove('done'), 1200);
      } else if (act === 'wish') {
        const onNow = TA.wish.toggle(a.dataset.id);
        $$(`[data-action="wish"][data-id="${a.dataset.id}"]`).forEach(b => { b.classList.toggle('on', onNow); b.setAttribute('aria-pressed', onNow); b.setAttribute('aria-label', t(onNow ? 'wishRemove' : 'wishAdd')); });
        TA.toast(t(onNow ? 'wishAdded' : 'wishRemoved'));
        if (onNow && motion()) gsap.fromTo(a.querySelector('svg'), { scale: .6 }, { scale: 1, duration: .5, ease: 'back.out(3)' });
      } else if (act === 'qty') { const l = TA.cart.lines().find(x => x.v === a.dataset.v); TA.cart.setQty(a.dataset.v, l.qty + +a.dataset.d); }
      else if (act === 'remove') TA.cart.remove(a.dataset.v);
      else if (act === 'checkout') TA.toast(t('checkoutDemo'));
      else if (act === 'rail') { const tr = a.closest('[data-rail]').querySelector('.rail-track'); const dir = +a.dataset.dir * (document.dir === 'rtl' ? -1 : 1); tr.scrollBy({ left: dir * tr.clientWidth * .8, behavior: 'smooth' }); }
    });
    document.addEventListener('pointerover', e => { if (e.pointerType !== 'mouse') return; if (e.target.closest('.has-mega, #mega')) { clearTimeout(megaTimer); megaTimer = setTimeout(() => setMega(true), 120); } });
    document.addEventListener('pointerout', e => { if (e.pointerType !== 'mouse') return; if (e.target.closest('.has-mega, #mega') && !(e.relatedTarget && e.relatedTarget.closest && e.relatedTarget.closest('.has-mega, #mega'))) { clearTimeout(megaTimer); megaTimer = setTimeout(() => setMega(false), 200); } });
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') { if (openName) closeDrawer(); else if ($('#mega.on')) { setMega(false); $('[data-mega]').focus(); } }
      const open = $('.drawer.on, .search-ov.on, .sheet.on'); if (open) trapFocus(open, e);
    });
    $('#scrim').addEventListener('click', () => closeDrawer());
    document.addEventListener('submit', e => {
      if (e.target.id !== 'news') return; e.preventDefault();
      $('.news-msg', e.target).textContent = t('subscribed'); e.target.reset();
    });
    addEventListener('scroll', () => $('#hdr').classList.toggle('scrolled', scrollY > 8), { passive: true });
    on('cart', () => { updateBadges(); if (openName === 'cart') renderCart(); });
    on('wish', updateBadges);
    on('lang', renderAll);
    on('route', () => { renderHeader(); renderTabbar(); setMega(false); document.body.dataset.route = TA.router.current.name; });
    /* announcement bar: rotate messages */
    let k = 0; const msgs = () => $$('#ann p');
    if (!TA.util.reduceMotion) setInterval(() => { const m = msgs(); if (!m.length || document.hidden) return; m[k].classList.remove('on'); k = (k + 1) % m.length; m[k].classList.add('on'); }, 4200);
  }

  TA.shell = { renderAll, bind, updateBadges };
})(window.TA = window.TA || {});
