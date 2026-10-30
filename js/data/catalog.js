/* Catalog adapter.
   Every component reads products ONLY through TA.catalog, in the normalised shape below.
   To connect a real store later, replace fromDemo() with a mapper from the platform's
   product/category payloads. Field names of any platform must be verified against its
   own documentation — nothing here assumes or claims a specific API.

   Product shape:
   { id, slug, url, brand, brandSlug, name:{ar,en}, sub:{ar,en}, gender, niche,
     images:[{src, alt}], variants:[{id, kind:'sample'|'decant'|'bottle', ml, price, label}],
     priceFrom, bottle, sample, mood, line, notes, dna, season, occasion, featured, inStock }      */
(function (TA) {
  'use strict';
  const { norm } = TA.util;
  const round5 = n => Math.round(n / 5) * 5;
  const slugify = s => s.toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  const SAMPLE_SIZES = [{ ml: 2, ratio: .035, min: 29 }, { ml: 5, ratio: .08, min: 59 }, { ml: 10, ratio: .14, min: 99 }];

  function fromDemo() {
    return window.PERFUMES.map(raw => {
      const c = window.DEMO_COMMERCE[raw.id];
      const variants = SAMPLE_SIZES.map(s => ({ id: `${raw.id}-${s.ml}ml`, kind: s.ml === 2 ? 'sample' : 'decant', ml: s.ml, price: Math.max(s.min, round5(c.price * s.ratio)) }));
      variants.push({ id: `${raw.id}-bottle`, kind: 'bottle', ml: c.ml, price: c.price });
      const alt = `${raw.house} ${raw.name}`;
      return {
        id: raw.id, slug: raw.id, url: `#/p/${raw.id}`,
        brand: raw.house, brandSlug: slugify(raw.house),
        name: { ar: raw.name, en: raw.name }, sub: { ar: raw.ar, en: raw.house },
        gender: raw.gender, niche: c.niche, featured: c.featured, inStock: true,
        images: [{ src: raw.img, alt, product: true }, ...c.gallery.map(g => ({ src: g.src, pos: g.pos, alt }))],
        variants, bottle: variants[3], sample: variants[0], priceFrom: variants[0].price,
        mood: raw.mood, line: raw.line, notes: raw.notes, dna: raw.dna, season: raw.season, occasion: raw.occasion,
        hasSampleShot: raw.sample
      };
    });
  }

  const products = fromDemo().sort((a, b) => a.featured - b.featured);
  const byId = id => products.find(p => p.id === id);
  const variantIndex = new Map();
  products.forEach(p => p.variants.forEach(v => variantIndex.set(v.id, { variant: v, product: p })));

  const categories = [
    { slug: 'all', name: { ar: 'جميع العطور', en: 'All fragrances' }, desc: { ar: 'مجموعة مختارة من العطور الأصلية، بزجاجات كاملة وعينات للتجربة.', en: 'A curated edit of original fragrances, in full bottles and samples to try.' }, filter: () => true, cover: 'althair' },
    { slug: 'men', name: { ar: 'عطور رجالية', en: 'Men' }, desc: { ar: 'حضور واثق من الخشب والعنبر إلى النسمات المنعشة.', en: 'Confident presence — from woods and amber to fresh breezes.' }, filter: p => p.gender === 'men', cover: 'isfarkand' },
    { slug: 'women', name: { ar: 'عطور نسائية', en: 'Women' }, desc: { ar: 'زهور راقية وحمضيات مشرقة وأنوثة هادئة.', en: 'Refined florals, bright citrus and quiet femininity.' }, filter: p => p.gender === 'women', cover: 'devotion' },
    { slug: 'niche', name: { ar: 'عطور النيش', en: 'Niche' }, desc: { ar: 'إبداعات دور العطور المستقلة لمن يبحث عن التميّز.', en: 'Creations from independent perfume houses, for those who seek distinction.' }, filter: p => p.niche, cover: 'verano' },
    { slug: 'samples', name: { ar: 'العينات والتقسيمات', en: 'Samples & decants' }, desc: { ar: 'جرّب العطر على جلدك قبل الزجاجة: ٢ و٥ و١٠ مل.', en: 'Try it on your skin before the bottle: 2, 5 and 10 ml.' }, filter: () => true, cover: 'alexandre', kind: 'sample' }
  ];
  const bySlug = slug => categories.find(c => c.slug === slug);

  const brands = [...new Set(products.map(p => p.brand))].map(name => ({ name, slug: slugify(name), count: products.filter(p => p.brand === name).length, cover: products.find(p => p.brand === name).id }));

  function search(q) {
    const n = norm(q); if (!n) return [];
    const terms = n.split(' ');
    return products.map(p => {
      const hay = norm([p.name.en, p.sub.ar, p.brand, p.mood.ar, p.mood.en, p.gender === 'men' ? 'رجالي men' : 'نسائي women', p.niche ? 'نيش niche' : '',
        ...p.notes.top.ar, ...p.notes.heart.ar, ...p.notes.base.ar, ...p.notes.top.en, ...p.notes.heart.en, ...p.notes.base.en].join(' '));
      const name = norm(p.name.en + ' ' + p.sub.ar + ' ' + p.brand);
      let score = 0;
      for (const t of terms) { if (!hay.includes(t)) return null; score += name.includes(t) ? 3 : 1; }
      return { p, score };
    }).filter(Boolean).sort((a, b) => b.score - a.score).map(r => r.p);
  }

  function related(p, n = 4) {
    const dist = q => Object.keys(p.dna).reduce((s, k) => s + Math.abs(p.dna[k] - q.dna[k]), 0);
    return products.filter(q => q.id !== p.id).sort((a, b) => dist(a) - dist(b)).slice(0, n);
  }

  TA.catalog = {
    products, byId, categories, bySlug, brands, search, related,
    variant: id => variantIndex.get(id) || null,
    finder: window.FINDER, axes: window.AXES, locations: window.LOCS
  };
})(window.TA = window.TA || {});
