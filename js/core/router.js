/* Hash router — works from file:// and any static host.
   Routes:  #/  ·  #/c/:slug  ·  #/p/:id  ·  #/search?q=  ·  #/wishlist  ·  #/brands  ·  #/discover  */
(function (TA) {
  'use strict';
  const routes = [];
  let current = null, cleanup = null;

  function parse(hash) {
    const raw = (hash || '#/').replace(/^#/, '') || '/';
    const [path, qs = ''] = raw.split('?');
    return { path: path.replace(/\/+$/, '') || '/', query: Object.fromEntries(new URLSearchParams(qs)) };
  }
  function match(path) {
    for (const r of routes) {
      const m = path.match(r.re);
      if (m) return { route: r, params: m.slice(1).map(decodeURIComponent) };
    }
    return null;
  }

  function render() {
    if (location.hash && !location.hash.startsWith('#/')) return; // in-page anchors (#main etc.)
    const { path, query } = parse(location.hash);
    const found = match(path) || { route: routes.find(r => r.name === 'notfound'), params: [] };
    if (cleanup) { try { cleanup(); } catch (e) { /* ignore */ } cleanup = null; }
    const app = document.getElementById('app');
    const sameRoute = current && current.name === found.route.name && current.key === path;
    current = { name: found.route.name, key: path, params: found.params, query };
    const out = found.route.view({ params: found.params, query, app });
    cleanup = out && out.cleanup;
    document.title = (out && out.title ? out.title + ' — ' : '') + TA.i18n.t('brand');
    TA.util.emit('route', current);
    if (!sameRoute && !(query.s)) window.scrollTo({ top: 0, behavior: 'instant' in window ? 'instant' : 'auto' });
    if (query.s) requestAnimationFrame(() => { const el = document.getElementById(query.s); if (el) el.scrollIntoView({ behavior: TA.util.reduceMotion ? 'auto' : 'smooth' }); });
    if (!sameRoute) { const h = app.querySelector('h1'); if (h) { h.setAttribute('tabindex', '-1'); h.focus({ preventScroll: true }); } }
  }

  TA.router = {
    add(name, pattern, view) { routes.push({ name, re: new RegExp('^' + pattern + '$'), view }); return this; },
    start() { addEventListener('hashchange', render); render(); },
    refresh: render,
    go(hash) { if (location.hash === hash) render(); else location.hash = hash; },
    replaceQuery(query) {
      const { path } = parse(location.hash);
      const qs = new URLSearchParams(Object.entries(query).filter(([, v]) => v !== '' && v != null)).toString();
      history.replaceState(null, '', '#' + path + (qs ? '?' + qs : ''));
      if (current) current.query = query;
    },
    get current() { return current; }
  };
})(window.TA = window.TA || {});
