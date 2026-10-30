/* Bootstrap: routes, page transitions, scroll reveals, brand intro. */
(function (TA) {
  'use strict';
  const { $, $$, on, motion, store } = TA.util;

  /* scroll reveal for [data-rv] — CSS transition driven by IntersectionObserver */
  const io = 'IntersectionObserver' in window && !TA.util.reduceMotion
    ? new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('rv-in'); io.unobserve(e.target); } }), { rootMargin: '0px 0px -6% 0px' })
    : null;
  TA.reveal = (root = document) => {
    $$('[data-rv]:not(.rv-in), .pc:not(.rv-in)', root).forEach((el, i) => {
      if (!io) { el.classList.add('rv-in'); return; }
      el.style.setProperty('--rv-d', `${(i % 4) * 60}ms`); io.observe(el);
    });
  };

  TA.router
    .add('home', '/', TA.pages.home)
    .add('category', '/c/([\\w-]+)', TA.pages.category)
    .add('product', '/p/([\\w-]+)', TA.pages.product)
    .add('search', '/search', TA.pages.search)
    .add('wishlist', '/wishlist', TA.pages.wishlist)
    .add('brands', '/brands', TA.pages.brands)
    .add('discover', '/discover', TA.pages.discover)
    .add('notfound', '/__404__', TA.pages.notfound);

  on('route', () => {
    const app = $('#app');
    TA.reveal(app);
    if (motion()) gsap.fromTo(app, { opacity: 0 }, { opacity: 1, duration: .45, ease: 'power2.out', clearProps: 'opacity' });
  });
  on('lang', () => TA.router.refresh());
  on('wish', () => { if (TA.router.current && TA.router.current.name === 'wishlist') TA.router.refresh(); });

  /* brand intro — once per session, skippable, ~1.6s */
  function intro(done) {
    const el = $('#intro');
    if (!motion() || store.sget('ta.intro')) { el.remove(); return done(); }
    store.sset('ta.intro', '1');
    const logo = $('.intro-logo', el), blue = $('.lg-blue', logo), orange = $('.lg-orange', logo);
    const finish = () => { tl.kill(); el.remove(); $('#hdr').classList.add('ready'); done(); };
    const tl = gsap.timeline({ onComplete: finish });
    tl.fromTo(orange, { opacity: 1, clipPath: 'inset(0 0 0 100%)', x: 30 }, { clipPath: 'inset(0 0 0 0%)', x: 0, duration: .45, ease: 'power3.out' })
      .fromTo(blue, { '--p': 0 }, { '--p': 1, duration: .8, ease: 'power2.inOut' }, .2)
      .add(() => {
        const a = logo.getBoundingClientRect(), target = [...$$('#hdr .logo')].find(l => l.offsetParent);
        if (!target) return;
        const b = target.getBoundingClientRect();
        gsap.to(logo, { x: `+=${b.left + b.width / 2 - (a.left + a.width / 2)}`, y: `+=${b.top + b.height / 2 - (a.top + a.height / 2)}`, scale: b.width / a.width, duration: .55, ease: 'expo.inOut' });
        gsap.to(el, { backgroundColor: 'rgba(250,246,239,0)', duration: .5 });
      }, 1.05)
      .to({}, { duration: .58 });
    el.addEventListener('click', finish, { once: true });
  }

  document.documentElement.classList.remove('no-js');
  TA.shell.bind();
  TA.shell.renderAll();
  intro(() => $('#hdr').classList.add('ready'));
  TA.router.start();
})(window.TA = window.TA || {});
