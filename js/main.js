/* 3ALTAYER homepage demo — interactions & motion (frontend only) */
(() => {
  'use strict';
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const P = window.PERFUMES, byId = id => P.find(p => p.id === id);
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = matchMedia('(hover:hover) and (pointer:fine)').matches;
  const hasGsap = !!window.gsap;
  if (hasGsap && window.ScrollTrigger) gsap.registerPlugin(ScrollTrigger);

  let lang = 'ar';
  const t = o => (o && typeof o === 'object') ? (o[lang] ?? o.ar) : o;
  const num = n => lang === 'ar' ? Number(n).toLocaleString('ar-EG') : String(n);
  const L = (ar, en) => lang === 'ar' ? ar : en;

  /* ---------- toast ---------- */
  const toastEl = $('#toast'); let toastT;
  function toast(msg) { toastEl.textContent = msg; toastEl.classList.add('on'); clearTimeout(toastT); toastT = setTimeout(() => toastEl.classList.remove('on'), 2800); }

  /* ---------- word splitting for masked reveals ---------- */
  function split(el) {
    const words = el.textContent.trim().split(/\s+/);
    el.innerHTML = words.map(w => `<span class="mask"><span class="mi">${w}</span></span>`).join(' ');
    return $$('.mi', el);
  }
  $$('[data-split]').forEach(split);

  /* ---------- i18n ---------- */
  $$('[data-en]').forEach(el => { el.dataset.ar = el.innerHTML; });
  function setLang(next) {
    lang = next;
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    $$('[data-en]').forEach(el => {
      el.innerHTML = lang === 'en' ? el.dataset.en : el.dataset.ar;
      if (el.hasAttribute('data-split')) split(el);
    });
    $$('.lang button').forEach(b => { const on = b.dataset.lang === lang; b.classList.toggle('on', on); b.setAttribute('aria-pressed', on); });
    renderAll();
    if (hasGsap) { gsap.set('.mi', { yPercent: 0 }); ScrollTrigger.refresh(); }
  }
  $$('.lang button').forEach(b => b.addEventListener('click', () => b.dataset.lang !== lang && setLang(b.dataset.lang)));

  /* ---------- smooth scroll ---------- */
  let lenis = null;
  if (!reduce && window.Lenis) {
    lenis = new Lenis({ duration: 1.15, easing: x => 1 - Math.pow(1 - x, 3.2), smoothWheel: true });
    if (hasGsap) {
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add(time => lenis.raf(time * 1000));
      gsap.ticker.lagSmoothing(0);
    } else {
      const raf = time => { lenis.raf(time); requestAnimationFrame(raf); }; requestAnimationFrame(raf);
    }
  }
  const hdr = $('#hdr');
  function goTo(target) {
    const el = target === '#top' ? 0 : $(target);
    if (el === null) return;
    const off = -(hdr.offsetHeight - 1);
    if (lenis) lenis.scrollTo(el, { offset: el === 0 ? 0 : off, duration: 1.4 });
    else window.scrollTo({ top: el === 0 ? 0 : el.getBoundingClientRect().top + scrollY + off, behavior: reduce ? 'auto' : 'smooth' });
  }
  document.addEventListener('click', e => {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;
    const h = a.getAttribute('href');
    if (h === '#') { e.preventDefault(); return; }
    e.preventDefault();
    if (a.dataset.pick) setDna(a.dataset.pick);
    closeMenus();
    goTo(h);
  });

  /* ---------- header, mega menu, drawer ---------- */
  let lastY = 0;
  function onScroll(y) {
    hdr.classList.toggle('scrolled', y > 20);
    const anyOpen = hdr.classList.contains('open') || $('.has-mega.on');
    if (!anyOpen) hdr.classList.toggle('hide', y > innerHeight * .8 && y > lastY + 2);
    if (y < lastY - 2) hdr.classList.remove('hide');
    lastY = y;
  }
  if (lenis) lenis.on('scroll', ({ scroll }) => onScroll(scroll)); else addEventListener('scroll', () => onScroll(scrollY), { passive: true });

  const megas = $$('.has-mega');
  let megaT;
  function openMega(li) { megas.forEach(m => { const on = m === li; m.classList.toggle('on', on); $('.nav-btn', m).setAttribute('aria-expanded', on); }); hdr.classList.toggle('open-m', !!li); }
  megas.forEach(li => {
    const btn = $('.nav-btn', li);
    li.addEventListener('pointerenter', e => { if (e.pointerType === 'mouse') { clearTimeout(megaT); megaT = setTimeout(() => openMega(li), 90); } });
    li.addEventListener('pointerleave', e => { if (e.pointerType === 'mouse') { clearTimeout(megaT); megaT = setTimeout(() => openMega(null), 180); } });
    btn.addEventListener('click', () => openMega(li.classList.contains('on') ? null : li));
    if (hasGsap) {
      li.addEventListener('transitionrun', () => {}, { once: true });
      btn.addEventListener('mouseenter', () => { if (!li.classList.contains('on')) return; });
    }
  });
  const observer = new MutationObserver(muts => muts.forEach(m => {
    if (m.target.classList.contains('on') && hasGsap && !reduce) {
      gsap.fromTo($$('.mega-links a', m.target), { y: 14, opacity: 0 }, { y: 0, opacity: 1, stagger: .045, duration: .5, ease: 'power3.out', overwrite: true });
      gsap.fromTo($$('.mega-vis img', m.target), { y: 30, opacity: 0 }, { y: 0, opacity: 1, stagger: .08, duration: .7, ease: 'power3.out', overwrite: true });
    }
  }));
  megas.forEach(m => observer.observe(m, { attributes: true, attributeFilter: ['class'] }));

  const burger = $('#burger'), drawer = $('#drawer');
  function setDrawer(on) {
    drawer.classList.toggle('on', on); hdr.classList.toggle('open', on);
    burger.setAttribute('aria-expanded', on); drawer.setAttribute('aria-hidden', !on);
    if (lenis) on ? lenis.stop() : lenis.start();
    document.body.style.overflow = on ? 'hidden' : '';
  }
  burger.addEventListener('click', () => setDrawer(!drawer.classList.contains('on')));
  function closeMenus() { openMega(null); if (drawer.classList.contains('on')) setDrawer(false); }
  addEventListener('keydown', e => { if (e.key === 'Escape') closeMenus(); });
  document.addEventListener('click', e => { if (!e.target.closest('.has-mega')) openMega(null); });

  /* ---------- magnetic CTAs ---------- */
  function magnetic(el) {
    if (!finePointer || reduce || !hasGsap || el._mag) return; el._mag = 1;
    const xTo = gsap.quickTo(el, 'x', { duration: .5, ease: 'power3.out' });
    const yTo = gsap.quickTo(el, 'y', { duration: .5, ease: 'power3.out' });
    el.addEventListener('pointermove', e => { const r = el.getBoundingClientRect(); xTo((e.clientX - r.left - r.width / 2) * .22); yTo((e.clientY - r.top - r.height / 2) * .32); });
    el.addEventListener('pointerleave', () => { gsap.to(el, { x: 0, y: 0, duration: .9, ease: 'elastic.out(1,.45)' }); });
  }
  const bindMagnetic = () => $$('.magnetic').forEach(magnetic);

  /* ---------- scent ribbons (canvas) ---------- */
  function ribbons(canvas, opts = {}) {
    const ctx = canvas.getContext('2d'); if (!ctx) return;
    let w, h, dpr, mx = .3, my = .5, tmx = .3, tmy = .5, visible = true, raf;
    const lines = Array.from({ length: opts.count || 5 }, (_, i) => ({
      amp: 26 + i * 9, freq: .0022 + i * .00045, speed: .00016 + i * .00005, off: i * 1.7,
      y: (opts.y || .56) + (i - 2) * .035, col: i === 2 ? 'orange' : 'blue', a: i === 2 ? .5 : .22 + i * .05
    }));
    function size() { dpr = Math.min(devicePixelRatio || 1, 2); w = canvas.clientWidth; h = canvas.clientHeight; canvas.width = w * dpr; canvas.height = h * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0); }
    size(); addEventListener('resize', size);
    canvas.parentElement.addEventListener('pointermove', e => { const r = canvas.getBoundingClientRect(); tmx = (e.clientX - r.left) / r.width; tmy = (e.clientY - r.top) / r.height; });
    new IntersectionObserver(([en]) => { visible = en.isIntersecting; if (visible) loop(performance.now()); }).observe(canvas);
    function draw(time) {
      mx += (tmx - mx) * .04; my += (tmy - my) * .04;
      ctx.clearRect(0, 0, w, h);
      const span = opts.span || 1;
      lines.forEach(l => {
        const g = ctx.createLinearGradient(0, 0, w * span, 0);
        const c = l.col === 'orange' ? '244,122,32' : '12,87,166';
        g.addColorStop(0, `rgba(${c},0)`); g.addColorStop(.2, `rgba(${c},${l.a})`); g.addColorStop(.75, `rgba(${c},${l.a * .8})`); g.addColorStop(1, `rgba(${c},0)`);
        ctx.strokeStyle = g; ctx.lineWidth = l.col === 'orange' ? 1.2 : 1.1; ctx.beginPath();
        for (let x = 0; x <= w * span; x += 8) {
          const d = Math.exp(-Math.pow((x / w - mx) * 3.2, 2));
          const y = h * l.y + Math.sin(x * l.freq + time * l.speed + l.off) * l.amp + Math.sin(x * l.freq * 2.3 - time * l.speed * 1.4) * l.amp * .35 + d * (my - .5) * 120;
          x ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
        }
        ctx.stroke();
      });
    }
    function loop(time) { cancelAnimationFrame(raf); if (!visible) return; draw(time); if (!reduce) raf = requestAnimationFrame(loop); }
    loop(performance.now());
  }

  /* =========================================================
     RENDERERS
     ========================================================= */

  /* ---- 4. Find your Jawak ---- */
  let finderSel = null;
  function renderFinder() {
    const wrap = $('#moodPicker');
    wrap.innerHTML = FINDER.map(m => `<button class="mood-btn" role="radio" aria-checked="${finderSel === m.k}" data-k="${m.k}"><b>${lang === 'ar' ? m.ar : m.en}</b><small>${lang === 'ar' ? m.en : ''}</small></button>`).join('');
    $$('.mood-btn', wrap).forEach(b => b.addEventListener('click', () => pickMood(b.dataset.k)));
    if (finderSel) showResult(finderSel, true);
  }
  function pickMood(k) {
    finderSel = k;
    $$('.mood-btn').forEach(b => b.setAttribute('aria-checked', b.dataset.k === k));
    showResult(k);
  }
  function showResult(k, instant) {
    const m = FINDER.find(f => f.k === k), p = byId(m.pick);
    const res = $('#stageResult'), empty = $('#stageEmpty');
    const fill = () => {
      $('#stageImg').src = p.img; $('#stageImg').alt = `${p.house} ${p.name}`;
      $('#stageWhy').textContent = L(`لأن جوّك ${m.ar}`, `Because you feel ${m.en.toLowerCase()}`);
      $('#stageName').textContent = p.name; $('#stageHouse').textContent = p.house;
      const n = p.notes; $('#stageNotes').innerHTML = [...t(n.top), ...t(n.heart), ...t(n.base)].slice(0, 4).map(x => `<li>${x}</li>`).join('');
      $('#stageDna').dataset.pick = p.id;
      $('#stageAlt').innerHTML = `<span>${L('بدائل:', 'Also try:')}</span>` + m.alt.map(id => { const a = byId(id); return `<button data-id="${id}" aria-label="${a.name}" title="${a.house} ${a.name}"><img src="${a.img}" alt=""></button>`; }).join('');
      $$('#stageAlt button').forEach(b => b.addEventListener('click', () => { setDna(b.dataset.id); goTo('#dna'); }));
    };
    empty.hidden = true;
    if (instant || !hasGsap || reduce) { fill(); res.hidden = false; return; }
    const tl = gsap.timeline();
    if (!res.hidden) tl.to(res, { opacity: 0, y: -10, duration: .3, ease: 'power2.in' });
    tl.add(() => { fill(); res.hidden = false; })
      .fromTo(res, { opacity: 0, y: 0 }, { opacity: 1, duration: .01 })
      .fromTo('#stageImg', { yPercent: 18, opacity: 0, scale: .92, clipPath: 'inset(100% 0 0 0)' }, { yPercent: 0, opacity: 1, scale: 1, clipPath: 'inset(0% 0 0 0)', duration: 1, ease: 'expo.out' })
      .fromTo('.stage-info > *', { y: 22, opacity: 0 }, { y: 0, opacity: 1, stagger: .06, duration: .7, ease: 'power3.out' }, '<.15')
      .fromTo('.stage-ring', { rotate: 0 }, { rotate: 90, duration: 1.2, ease: 'power2.out' }, 0);
  }

  /* ---- 5. Shop by mood ---- */
  function renderMoods() {
    const rail = $('#moodRail');
    rail.innerHTML = MOODS.map((m, i) => {
      const ps = m.picks.map(byId);
      return `<div class="mpanel${i === 0 ? ' on' : ''}" style="--tint:${m.tint}" tabindex="0" role="button" aria-label="${lang === 'ar' ? m.ar : m.en}">
        <div class="vt"><b>${lang === 'ar' ? m.ar : m.en}</b><small>${m.en.toUpperCase()}</small></div>
        <span class="num">0${i + 1}</span>
        <div class="open">
          <div class="pv">
            <svg class="scent" viewBox="0 0 600 140" preserveAspectRatio="none" aria-hidden="true"><path class="sl b" d="M0 90 C 120 30, 220 130, 340 70 S 520 20, 600 60"/><path class="sl o" d="M0 104 C 140 60, 240 140, 360 90 S 540 50, 600 84"/></svg>
            ${ps.map(p => `<img src="${p.img}" alt="${p.house} ${p.name}" loading="lazy" data-depth="${ps.indexOf(p) ? 26 : 14}">`).join('')}
          </div>
          <div style="position:relative;z-index:2">
            <h3>${lang === 'ar' ? m.ar : m.en}<small>${lang === 'ar' ? m.en.toUpperCase() : ''}</small></h3>
            <p>${t(m.sub)}</p>
          </div>
          <div class="tags">${ps.map(p => `<span>${p.name}</span>`).join('')}</div>
        </div>
      </div>`;
    }).join('');
    $$('.mpanel', rail).forEach(pn => {
      const act = () => { $$('.mpanel', rail).forEach(x => x.classList.toggle('on', x === pn)); };
      pn.addEventListener('click', act);
      pn.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); act(); } });
      pn.addEventListener('pointerenter', e => { if (e.pointerType === 'mouse') act(); });
      if (finePointer && hasGsap && !reduce) {
        const imgs = $$('.pv img', pn);
        pn.addEventListener('pointermove', e => {
          const r = pn.getBoundingClientRect(), dx = (e.clientX - r.left) / r.width - .5, dy = (e.clientY - r.top) / r.height - .5;
          imgs.forEach(im => gsap.to(im, { x: dx * im.dataset.depth * 2, y: dy * im.dataset.depth, rotate: dx * 3, duration: .9, ease: 'power3.out' }));
        });
        pn.addEventListener('pointerleave', () => gsap.to(imgs, { x: 0, y: 0, rotate: 0, duration: 1.2, ease: 'power3.out' }));
      }
    });
  }

  /* ---- 6. Moment pyramid ---- */
  function renderMoment() {
    const p = byId('althair');
    const rows = [['top', L('القمة', 'Top')], ['heart', L('القلب', 'Heart')], ['base', L('القاعدة', 'Base')]];
    $('#momentPyr').innerHTML = rows.map(([k, lbl]) => `<div class="pyr"><span>${lbl}</span><div>${t(p.notes[k]).map(x => `<b>${x}</b>`).join('<i aria-hidden="true" style="color:var(--orange)">·</i>')}</div></div>`).join('');
  }

  /* ---- 7. Men's shelf ---- */
  function card(p, i) {
    return `<article class="pcard" data-id="${p.id}">
      <span class="no" aria-hidden="true">0${i + 1}</span>
      ${p.sample ? `<span class="tag-s">${L('مع عينة', 'Sample incl.')}</span>` : ''}
      <div class="ph"><img src="${p.img}" alt="${p.house} ${p.name}" loading="lazy"></div>
      <h3>${p.name}</h3><p class="house">${p.house}</p><p class="mo">${t(p.mood)}</p>
      <div class="acts"><a class="lnk" href="#dna" data-pick="${p.id}">DNA</a><button class="lnk" data-cmp="${p.id}">${L('قارن', 'Compare')}</button><button class="lnk" data-set="${p.id}">${L('للمجموعة', 'Add to set')}</button></div>
    </article>`;
  }
  function renderMens() {
    const s = $('#mensShelf');
    s.innerHTML = P.filter(p => p.gender === 'men').map(card).join('');
    bindCardActs(s);
    if (finePointer && hasGsap && !reduce) $$('.pcard', s).forEach(c => {
      const ph = $('.ph', c);
      c.addEventListener('pointermove', e => { const r = ph.getBoundingClientRect(); gsap.to(ph, { rotateY: ((e.clientX - r.left) / r.width - .5) * 14, rotateX: -((e.clientY - r.top) / r.height - .5) * 10, duration: .6, ease: 'power3.out' }); });
      c.addEventListener('pointerleave', () => gsap.to(ph, { rotateY: 0, rotateX: 0, duration: 1, ease: 'power3.out' }));
    });
  }
  function bindCardActs(root) {
    $$('[data-cmp]', root).forEach(b => b.addEventListener('click', () => { assignCompare(b.dataset.cmp); goTo('#compare'); }));
    $$('[data-set]', root).forEach(b => b.addEventListener('click', () => { if (!setSel.includes(b.dataset.set)) togglePick(b.dataset.set, null); goTo('#set'); }));
  }

  /* ---- 8. Women's ---- */
  let womanOn = 0;
  function renderWomens() {
    const W = P.filter(p => p.gender === 'women');
    $('#womensList').innerHTML = W.map((p, i) => `<li><button class="wli${i === womanOn ? ' on' : ''}" data-i="${i}"><em>0${i + 1}</em><span><b>${p.name}</b><small>${p.house} · ${t(p.mood)}</small></span><i></i></button></li>`).join('');
    const st = $('#womensStage');
    $$('.wimg', st).forEach(n => n.remove());
    W.forEach((p, i) => st.insertAdjacentHTML('beforeend', `<div class="wimg" data-i="${i}" style="${i === womanOn ? '' : 'opacity:0;visibility:hidden'}"><img src="${p.img}" alt="${p.house} ${p.name}" loading="lazy"><p>${t(p.line)}</p><div class="stage-act" style="justify-content:center"><a class="lnk" href="#dna" data-pick="${p.id}">DNA</a><button class="lnk" data-cmp="${p.id}">${L('قارن', 'Compare')}</button><button class="lnk" data-set="${p.id}">${L('للمجموعة', 'Add to set')}</button></div></div>`));
    bindCardActs(st);
    $$('.wli').forEach(b => {
      const go = () => showWoman(+b.dataset.i);
      b.addEventListener('click', go);
      b.addEventListener('pointerenter', e => { if (e.pointerType === 'mouse') go(); });
      b.addEventListener('focus', go);
    });
  }
  function showWoman(i) {
    if (i === womanOn) return;
    const prev = $(`.wimg[data-i="${womanOn}"]`), next = $(`.wimg[data-i="${i}"]`);
    womanOn = i;
    $$('.wli').forEach(b => b.classList.toggle('on', +b.dataset.i === i));
    if (!hasGsap || reduce) { prev.style.cssText = 'opacity:0;visibility:hidden'; next.style.cssText = ''; return; }
    gsap.killTweensOf([prev, next, $('img', next)]);
    gsap.to(prev, { autoAlpha: 0, y: -20, duration: .45, ease: 'power2.in' });
    gsap.fromTo(next, { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, duration: .9, ease: 'expo.out', delay: .15 });
    gsap.fromTo($('img', next), { clipPath: 'inset(100% 0 0 0)', scale: .94 }, { clipPath: 'inset(0% 0 0 0)', scale: 1, duration: 1.1, ease: 'expo.out', delay: .15 });
  }

  /* ---- 9. Scent DNA radar ---- */
  const R = 190, N = AXES.length;
  const ang = i => -Math.PI / 2 + i * 2 * Math.PI / N;
  const pt = (i, v) => [Math.cos(ang(i)) * R * v / 100, Math.sin(ang(i)) * R * v / 100];
  const dnaState = Object.fromEntries(AXES.map(a => [a.k, 0]));
  let dnaId = 'althair', ghostVals = null;
  function buildRadar() {
    const svg = $('#radar');
    let s = '';
    for (let r = 1; r <= 5; r++) s += `<polygon class="ring" points="${AXES.map((_, i) => pt(i, r * 20).join(',')).join(' ')}"/>`;
    AXES.forEach((a, i) => { const [x, y] = pt(i, 100); s += `<line class="axis" x1="0" y1="0" x2="${x}" y2="${y}"/>`; });
    s += `<polygon class="ghost" id="rGhost" points=""/><polygon class="shape" id="rShape" points=""/>`;
    AXES.forEach((a, i) => { s += `<circle class="pt" r="5" id="rp${i}"/>`; });
    AXES.forEach((a, i) => { const [x, y] = pt(i, 122); s += `<text x="${x}" y="${y - 8}" class="lbl" data-i="${i}">${t(a)}</text><text x="${x}" y="${y + 12}" class="v" id="rv${i}">0</text>`; });
    svg.innerHTML = s;
    drawRadar();
  }
  function drawRadar() {
    const pts = AXES.map((a, i) => pt(i, dnaState[a.k]));
    $('#rShape').setAttribute('points', pts.map(p => p.join(',')).join(' '));
    pts.forEach(([x, y], i) => { const c = $('#rp' + i); c.setAttribute('cx', x); c.setAttribute('cy', y); $('#rv' + i).textContent = num(Math.round(dnaState[AXES[i].k])); });
    $('#rGhost').setAttribute('points', ghostVals ? AXES.map((a, i) => pt(i, ghostVals[a.k]).join(',')).join(' ') : '');
  }
  function renderDnaPick() {
    $('#dnaPick').innerHTML = P.map(p => `<button class="dp" role="tab" aria-selected="${p.id === dnaId}" data-id="${p.id}" title="${p.house} ${p.name}" aria-label="${p.name}"><img src="${p.img}" alt="" loading="lazy"></button>`).join('');
    $$('.dp').forEach(b => b.addEventListener('click', () => setDna(b.dataset.id)));
    $$('#radar .lbl').forEach(el => { el.textContent = t(AXES[+el.dataset.i]); });
    readDna(); drawRadar();
  }
  function readDna() {
    const p = byId(dnaId);
    $('#dnaName').textContent = p.name;
    $('#dnaMood').textContent = `${p.house} · ${t(p.mood)}`;
    $('#dnaStats').innerHTML = AXES.map(a => `<div><span>${t(a)}</span><b>${num(p.dna[a.k])}</b></div>`).join('');
  }
  let radarShown = false;
  function setDna(id, first) {
    const prev = byId(dnaId);
    dnaId = id;
    $$('.dp').forEach(b => b.setAttribute('aria-selected', b.dataset.id === id));
    readDna();
    if (!radarShown && !first) return; // will animate on reveal
    ghostVals = first ? null : { ...prev.dna };
    const target = byId(id).dna;
    if (!hasGsap || reduce) { Object.assign(dnaState, target); drawRadar(); return; }
    gsap.to(dnaState, { ...target, duration: 1.2, ease: 'elastic.out(1,.75)', onUpdate: drawRadar, overwrite: true });
    gsap.fromTo('.dna-read', { opacity: .3, y: 8 }, { opacity: 1, y: 0, duration: .6, ease: 'power3.out' });
  }

  /* ---- 10. Compare ---- */
  let cmp = ['isfarkand', 'devotion'], cmpNext = 0;
  function assignCompare(id) {
    if (cmp.includes(id)) { cmpNext = cmp.indexOf(id) === 0 ? 1 : 0; return renderCompare(true); }
    cmp[cmpNext] = id; cmpNext = cmpNext ? 0 : 1;
    renderCompare(true);
  }
  function renderCompare(anim) {
    $('#cmpStrip').innerHTML = P.map(p => `<button class="cs${p.id === cmp[0] ? ' a' : ''}${p.id === cmp[1] ? ' b' : ''}" data-id="${p.id}" title="${p.house} ${p.name}" aria-label="${p.name}"><img src="${p.img}" alt="" loading="lazy"></button>`).join('');
    $$('.cs').forEach(b => b.addEventListener('click', () => assignCompare(b.dataset.id)));
    ['A', 'B'].forEach((ab, i) => {
      const p = byId(cmp[i]), slot = $('#slot' + ab);
      slot.classList.toggle('full', !!p);
      slot.innerHTML = p ? `<span class="ab">${ab}</span><img src="${p.img}" alt="${p.house} ${p.name}"><span class="cap">${p.name}</span>` : `<span class="empty">${L('اختر عطراً', 'Pick a scent')}</span>`;
    });
    const [a, b] = cmp.map(byId);
    const txt = (lbl, fa, fb) => `<div class="crow"><div class="cell a">${fa}</div><div class="lbl">${lbl}</div><div class="cell b">${fb}</div></div>`;
    const bar = (v, n) => `${num(n)}<div class="bw"><i data-v="${v}"></i></div>`;
    const notes = p => [...t(p.notes.top), ...t(p.notes.heart), ...t(p.notes.base)].slice(0, 3).join('، '.replace('، ', lang === 'ar' ? '، ' : ', '));
    $('#cmpTable').innerHTML =
      txt(L('المزاج', 'Mood'), t(a.mood), t(b.mood)) +
      txt(L('الملاحظات', 'Notes'), notes(a), notes(b)) +
      txt(L('الثبات', 'Longevity'), bar(a.dna.longevity, (a.dna.longevity / 10).toFixed(1)), bar(b.dna.longevity, (b.dna.longevity / 10).toFixed(1))) +
      txt(L('الفوحان', 'Projection'), bar(a.dna.projection, (a.dna.projection / 10).toFixed(1)), bar(b.dna.projection, (b.dna.projection / 10).toFixed(1))) +
      txt(L('الموسم', 'Season'), t(a.season), t(b.season)) +
      txt(L('المناسبة', 'Occasion'), t(a.occasion), t(b.occasion));
    const bars = $$('#cmpTable .bw i');
    if (!hasGsap || reduce) { bars.forEach(i => i.style.width = i.dataset.v + '%'); return; }
    bars.forEach(i => gsap.to(i, { width: i.dataset.v + '%', duration: 1.1, ease: 'power3.out', delay: .1 }));
    if (anim) {
      gsap.fromTo('.slot img', { y: 30, opacity: 0, scale: .94 }, { y: 0, opacity: 1, scale: 1, duration: .9, ease: 'expo.out', stagger: .08 });
      gsap.fromTo('#cmpTable .cell', { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: .5, stagger: .025, ease: 'power2.out' });
    }
  }

  /* ---- 12. Discovery set ---- */
  let setSel = [];
  function renderSet() {
    $('#setPick').innerHTML = P.map(p => `<button class="sp" data-id="${p.id}" aria-pressed="${setSel.includes(p.id)}" title="${p.house} ${p.name}" aria-label="${p.name}"><img src="${p.img}" alt="" loading="lazy"></button>`).join('');
    $$('.sp').forEach(b => b.addEventListener('click', () => togglePick(b.dataset.id, b)));
    syncSet();
  }
  function syncSet() {
    const n = setSel.length;
    $('#setCount').textContent = `${num(n)} / ${num(3)}`;
    $('#setMsg').textContent = n === 0 ? L('اختر أول عطر', 'Pick your first scent') : n < 3 ? L(`باقي ${num(3 - n)}`, `${3 - n} to go`) : L('مجموعتك جاهزة', 'Your set is ready');
    $('#setGo').disabled = n < 3;
    $$('.sp').forEach(b => { const on = setSel.includes(b.dataset.id); b.setAttribute('aria-pressed', on); b.classList.toggle('dim', n >= 3 && !on); });
    $('#box').classList.toggle('closed', n === 3);
  }
  function togglePick(id, srcBtn) {
    const i = setSel.indexOf(id);
    if (i > -1) {
      setSel.splice(i, 1);
      $$('.bslot').forEach(s => { const im = $('img', s); if (im) im.remove(); });
      setSel.forEach((pid, k) => { const s = $(`.bslot[data-i="${k}"]`); s.insertAdjacentHTML('beforeend', `<img src="${byId(pid).img}" alt="${byId(pid).name}">`); });
      return syncSet();
    }
    if (setSel.length >= 3) return;
    setSel.push(id);
    const slot = $(`.bslot[data-i="${setSel.length - 1}"]`), p = byId(id);
    const place = () => slot.insertAdjacentHTML('beforeend', `<img src="${p.img}" alt="${p.name}">`);
    const src = srcBtn ? $('img', srcBtn) : $(`.sp[data-id="${id}"] img`);
    if (hasGsap && !reduce && src && src.getBoundingClientRect().width) {
      const a = src.getBoundingClientRect(), b = slot.getBoundingClientRect();
      const fly = document.createElement('img'); fly.src = p.img; fly.className = 'fly';
      Object.assign(fly.style, { left: a.left + 'px', top: a.top + 'px', width: a.width + 'px', height: a.height + 'px', objectFit: 'contain' });
      document.body.appendChild(fly);
      const tw = b.width * .8, th = b.height * .84;
      gsap.to(fly, { x: b.left + b.width * .1 - a.left + (tw - a.width) / 2, y: b.top + b.height * .08 - a.top + (th - a.height) / 2, scale: Math.min(tw / a.width, th / a.height), duration: .9, ease: 'power3.inOut',
        onComplete: () => { fly.remove(); place(); gsap.fromTo($('img', slot), { scale: 1.08 }, { scale: 1, duration: .5, ease: 'back.out(2)' }); syncSet(); } });
      gsap.to(fly, { rotate: 8, yoyo: true, repeat: 1, duration: .45, ease: 'sine.inOut' });
      $$('.sp').forEach(b2 => b2.setAttribute('aria-pressed', setSel.includes(b2.dataset.id)));
    } else { place(); syncSet(); }
  }
  $('#setReset').addEventListener('click', () => { setSel = []; $$('.bslot img').forEach(i => i.remove()); syncSet(); });
  $('#setGo').addEventListener('click', () => toast(L('تم تجهيز مجموعتك — عرض تجريبي بدون طلب فعلي', 'Your set is ready — demo only, no real order')));

  /* ---- 13. Stations ---- */
  let locOn = 0;
  function renderLocs() {
    $('#locs').innerHTML = LOCS.map((l, i) => `<li><button class="loc${i === locOn ? ' on' : ''}${l.ok ? '' : ' soon'}" data-i="${i}"><i class="pin"></i><b>${t(l)}</b><span>${t(l.state)}</span></button></li>`).join('');
    $$('.loc').forEach(b => b.addEventListener('click', () => setLoc(+b.dataset.i)));
    setLoc(locOn, true);
  }
  function setLoc(i, instant) {
    locOn = i; const l = LOCS[i];
    $$('.loc').forEach(b => b.classList.toggle('on', +b.dataset.i === i));
    $('#mLoc').textContent = t(l);
    $('#mState').textContent = t(l.state);
    $('#machine').classList.toggle('off', !l.ok);
    $('#mGlass').innerHTML = l.slots.map((id, k) => `<div class="ms" data-k="${k}"><img src="${byId(id).img}" alt="" loading="lazy"></div>`).join('');
    $('#mTicket').textContent = '';
    if (!instant && hasGsap && !reduce) gsap.fromTo('.ms', { opacity: 0, y: 14 }, { opacity: 1, y: 0, stagger: { each: .03, from: 'random' }, duration: .5, ease: 'power3.out' });
  }
  $('#mGo').addEventListener('click', () => {
    const l = LOCS[locOn];
    if (!l.ok) return toast(L('هذه المحطة قريباً — موقع تجريبي', 'This station is coming soon — demo site'));
    const slots = $$('.ms'); slots.forEach(s => s.classList.remove('hit'));
    const k = Math.floor(Math.random() * slots.length), p = byId(l.slots[k]);
    const tk = $('#mTicket');
    const done = () => { slots[k].classList.add('hit'); tk.textContent = L(`عينة ${p.name} جاهزة في الدرج · تجريبي`, `${p.name} sample ready in the tray · demo`); };
    if (!hasGsap || reduce) return done();
    const tl = gsap.timeline();
    tl.to(tk, { yPercent: 120, duration: .2 })
      .to(slots, { opacity: .45, duration: .15, stagger: { each: .02, from: 'random' } })
      .add(done)
      .to(slots, { opacity: 1, duration: .3 })
      .fromTo(tk, { yPercent: 120 }, { yPercent: 0, duration: .7, ease: 'expo.out' });
  });

  /* ---- brands ---- */
  function renderBrands() {
    const s = BRANDS.map(b => `<span>${b}</span>`).join('');
    $('#brandTrack').innerHTML = s + s;
  }

  /* ---- newsletter ---- */
  $('#news').addEventListener('submit', e => {
    e.preventDefault();
    $('#newsMsg').textContent = L('تم الاشتراك (تجريبي) — شكراً لك.', 'Subscribed (demo) — thank you.');
    e.target.reset();
  });

  function renderAll() {
    renderFinder(); renderMoods(); renderMoment(); renderMens(); renderWomens();
    if ($('#radar').childElementCount) renderDnaPick(); else { buildRadar(); renderDnaPick(); }
    renderCompare(false); renderSet(); renderLocs(); renderBrands(); bindMagnetic();
    // restore set slots
    $$('.bslot img').forEach(i => i.remove());
    setSel.forEach((pid, k) => $(`.bslot[data-i="${k}"]`).insertAdjacentHTML('beforeend', `<img src="${byId(pid).img}" alt="${byId(pid).name}">`));
  }
  renderAll();

  /* =========================================================
     MOTION
     ========================================================= */
  ribbons($('#heroCanvas'), { count: 5, y: .88, span: .7 });
  ribbons($('#closeCanvas'), { count: 5, y: .5, span: 1 });

  function heroIn() {
    if (!hasGsap || reduce) return;
    const tl = gsap.timeline();
    tl.fromTo('#heroMedia img', { scale: 1.14 }, { scale: 1.04, duration: 2.2, ease: 'expo.out' }, 0)
      .fromTo('.hero-copy .eyebrow', { y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: .8, ease: 'power3.out' }, .1)
      .fromTo('.hero-h .mi', { yPercent: 115 }, { yPercent: 0, duration: 1.1, stagger: .08, ease: 'expo.out' }, .2)
      .fromTo(['.hero-p', '.hero-cta'], { y: 22, opacity: 0 }, { y: 0, opacity: 1, stagger: .1, duration: .9, ease: 'power3.out' }, .6)
      .fromTo('.scroll-cue', { opacity: 0 }, { opacity: 1, duration: .8 }, 1);
  }

  function setupScroll() {
    if (!hasGsap || reduce) { $$('.bar i').forEach(i => i.style.width = i.dataset.v + '%'); Object.assign(dnaState, byId(dnaId).dna); radarShown = true; drawRadar(); return; }

    // masked headings
    $$('[data-split]').forEach(el => {
      if (el.closest('.hero')) return;
      gsap.fromTo($$('.mi', el), { yPercent: 115 }, { yPercent: 0, duration: 1.1, stagger: .07, ease: 'expo.out', scrollTrigger: { trigger: el, start: 'top 88%', once: true } });
    });
    // soft fade-ups
    const fades = '.sec .eyebrow,.sec .lead,.moods,.jawak-stage,.mood-rail,.pcard,.wli,.womens-stage,.dna-pick,.dna-read,.cmp-slots,.cmp-strip,.cmp-table,.sp,.box,.set-status,.loc,.machine,.pillars li,.quotes figure,.samples-copy .eyebrow,.samples-copy .lead,.samples-copy .hero-cta,.moment-copy > *:not(.moment-name),.ftr-grid > *';
    ScrollTrigger.batch(fades, {
      start: 'top 90%', once: true,
      onEnter: els => gsap.fromTo(els, { y: 34, opacity: 0 }, { y: 0, opacity: 1, duration: 1, stagger: .07, ease: 'power3.out', overwrite: true })
    });
    gsap.set(fades, { opacity: 0 });

    // hero parallax on scroll + mouse
    gsap.to('#heroMedia', { yPercent: 10, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
    gsap.to('.hero-copy', { yPercent: -18, opacity: .2, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
    if (finePointer) {
      const img = $('#heroMedia img'), xTo = gsap.quickTo(img, 'x', { duration: 1.4, ease: 'power3.out' }), yTo = gsap.quickTo(img, 'y', { duration: 1.4, ease: 'power3.out' });
      $('.hero').addEventListener('pointermove', e => { xTo((e.clientX / innerWidth - .5) * -22); yTo((e.clientY / innerHeight - .5) * -14); });
    }

    // scent line drawing
    $$('.scent-svg .sl').forEach(p => {
      const len = p.getTotalLength(); gsap.set(p, { strokeDasharray: len, strokeDashoffset: len });
      gsap.to(p, { strokeDashoffset: 0, ease: 'none', scrollTrigger: { trigger: p.closest('section'), start: 'top 80%', end: 'center 40%', scrub: 1 } });
    });

    // moment
    gsap.fromTo('.moment-img', { yPercent: 8, scale: .94 }, { yPercent: -4, scale: 1, ease: 'none', scrollTrigger: { trigger: '.moment', start: 'top bottom', end: 'bottom top', scrub: 1 } });
    gsap.fromTo('.orb', { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, stagger: .12, duration: .8, ease: 'back.out(2)', scrollTrigger: { trigger: '.moment-vis', start: 'top 75%', once: true } });
    gsap.fromTo('.moment-name .mi', { yPercent: 115 }, { yPercent: 0, duration: 1.2, ease: 'expo.out', scrollTrigger: { trigger: '.moment-name', start: 'top 88%', once: true } });
    $$('.meters .bar i').forEach(i => gsap.to(i, { width: i.dataset.v + '%', duration: 1.6, ease: 'power3.out', scrollTrigger: { trigger: i, start: 'top 92%', once: true } }));

    // radar reveal
    ScrollTrigger.create({ trigger: '#radar', start: 'top 80%', once: true, onEnter: () => { radarShown = true; setDna(dnaId, true); } });
    gsap.fromTo('#radar .ring', { scale: 0, transformOrigin: '0px 0px' }, { scale: 1, stagger: .08, duration: 1, ease: 'expo.out', scrollTrigger: { trigger: '#radar', start: 'top 80%', once: true } });

    // samples
    gsap.fromTo('.samples-media img', { scale: 1.08 }, { scale: 1, ease: 'none', scrollTrigger: { trigger: '.samples', start: 'top bottom', end: 'bottom top', scrub: 1 } });
    gsap.fromTo('.flow .line', { scaleX: 0 }, { scaleX: 1, stagger: .3, ease: 'none', scrollTrigger: { trigger: '.flow', start: 'top 85%', end: 'top 55%', scrub: 1 } });
    gsap.fromTo('.flow i', { scale: .6, opacity: 0 }, { scale: 1, opacity: 1, stagger: .25, duration: .8, ease: 'back.out(2)', scrollTrigger: { trigger: '.flow', start: 'top 88%', once: true } });

    // closing — scroll-linked word reveal
    $$('[data-cl]').forEach(el => {
      el.innerHTML = el.innerHTML.split(/\s+(?![^<]*>)/).map(w => `<span>${w}</span>`).join(' ');
    });
    const ctl = gsap.timeline({ scrollTrigger: { trigger: '.closing', start: 'top 75%', end: 'center 55%', scrub: 1 } });
    ctl.fromTo('.cl-line > span', { yPercent: 110, opacity: 0 }, { yPercent: 0, opacity: 1, stagger: .12, ease: 'power2.out' })
      .fromTo(['.cl-ar', '.closing-copy .btn'], { y: 20, opacity: 0 }, { y: 0, opacity: 1, stagger: .1 }, '-=.2');
    gsap.fromTo('#closingMedia', { scale: 1.15, yPercent: -4 }, { scale: 1, yPercent: 4, ease: 'none', scrollTrigger: { trigger: '.closing', start: 'top bottom', end: 'bottom top', scrub: true } });

    // section color breath between sections
    gsap.fromTo('.stations .machine', { rotate: -2 }, { rotate: 1.5, ease: 'none', scrollTrigger: { trigger: '.stations', start: 'top bottom', end: 'bottom top', scrub: 1 } });
  }

  /* ---------- 1. Opening ---------- */
  const intro = $('#intro'), introLogo = $('#introLogo'), hdrLogo = $('#hdrLogo');
  function finishIntro() {
    intro.remove(); hdr.classList.add('ready'); document.body.classList.remove('is-loading');
    if (lenis) lenis.start();
    heroIn(); setupScroll();
  }
  if (!hasGsap || reduce) { finishIntro(); }
  else {
    if (lenis) lenis.stop();
    history.scrollRestoration = 'manual'; scrollTo(0, 0);
    const blue = $('.lg-blue', introLogo), orange = $('.lg-orange', introLogo);
    const tl = gsap.timeline({ delay: .15, onComplete: finishIntro });
    tl.fromTo(orange, { opacity: 1, clipPath: 'inset(0 0 0 100%)', x: 40 }, { clipPath: 'inset(0 0 0 0%)', x: 0, duration: .55, ease: 'power3.out' })
      .fromTo(blue, { '--p': 0 }, { '--p': 1, duration: 1.0, ease: 'power2.inOut' }, .3)
      .set(blue, { webkitMaskImage: 'none', maskImage: 'none' })
      .fromTo(introLogo, { scale: 1 }, { scale: 1.03, duration: .2, yoyo: true, repeat: 1, ease: 'sine.inOut' }, 1.25)
      .add(() => {
        const a = introLogo.getBoundingClientRect(), b = hdrLogo.getBoundingClientRect();
        const s = b.width / a.width;
        gsap.to(introLogo, { x: `+=${(b.left + b.width / 2) - (a.left + a.width / 2)}`, y: `+=${(b.top + b.height / 2) - (a.top + a.height / 2)}`, scale: s, duration: .7, ease: 'expo.inOut' });
        gsap.to(intro, { backgroundColor: 'rgba(251,251,249,0)', duration: .6, ease: 'power2.inOut' });
      }, 1.55)
      .to({}, { duration: .72 });
  }
  addEventListener('resize', () => hasGsap && ScrollTrigger.refresh());
})();
