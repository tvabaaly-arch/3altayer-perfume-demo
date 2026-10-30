/* Small DOM + formatting helpers shared by every component. */
(function (TA) {
  'use strict';
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const debounce = (fn, ms = 160) => { let t; return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), ms); }; };

  /* storage that never throws (private mode, blocked storage, file://) */
  const store = {
    get(k, fallback) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : fallback; } catch (e) { return fallback; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* ignore */ } },
    sget(k) { try { return sessionStorage.getItem(k); } catch (e) { return null; } },
    sset(k, v) { try { sessionStorage.setItem(k, v); } catch (e) { /* ignore */ } }
  };

  /* minimal event bus */
  const bus = new EventTarget();
  const on = (type, fn) => bus.addEventListener(type, e => fn(e.detail));
  const emit = (type, detail) => bus.dispatchEvent(new CustomEvent(type, { detail }));

  /* keep keyboard focus inside an open dialog */
  function trapFocus(root, e) {
    if (e.key !== 'Tab') return;
    const f = $$('a[href],button:not([disabled]),input,select,textarea,[tabindex]:not([tabindex="-1"])', root).filter(el => el.offsetParent !== null);
    if (!f.length) return;
    const first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }

  /* Arabic-aware normalisation for search */
  const norm = s => String(s || '').toLowerCase()
    .replace(/[ً-ْـ]/g, '')
    .replace(/[أإآ]/g, 'ا').replace(/ة/g, 'ه').replace(/ى/g, 'ي')
    .replace(/[^\p{L}\p{N}\s]/gu, ' ').replace(/\s+/g, ' ').trim();

  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const motion = () => !!window.gsap && !reduceMotion;

  /* asset path resolver (the standalone build swaps in embedded data URIs) */
  TA.asset = name => (window.__IMG && window.__IMG[name]) || 'assets/img/' + name;

  TA.util = { $, $$, esc, debounce, store, on, emit, trapFocus, norm, reduceMotion, motion };
})(window.TA = window.TA || {});
