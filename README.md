# 3ALTAYER — luxury perfume store demo

A frontend-only, Arabic-first (RTL) shopping demo for 3ALTAYER. It is not the live store and is not
connected to any backend: products, prices, sizes, notes and scores are demo placeholders.

## Run it

- Open `dist/3altayer-homepage-demo.html` directly in a browser (single self-contained file), or
- serve the folder: `python3 -m http.server 8765` and open <http://localhost:8765/>.

Rebuild the single file after any change: `python3 tools/build_standalone.py`.

## Pages (hash routes)

| Route | Page |
|---|---|
| `#/` | Home: hero, categories, most loved, try-before-the-bottle, niche, fragrance of the moment, Find Your Jawak, houses, trust, stations |
| `#/c/all` · `men` · `women` · `niche` · `samples` | Listing with filters (brand, gender, niche/designer) and sort |
| `#/p/<id>` | Product: gallery, size selector, quantity, add to bag, wishlist, notes, Scent DNA, related |
| `#/search?q=` | Search results (Arabic-aware matching on names, houses and notes) |
| `#/wishlist` · `#/brands` · `#/discover` | Wishlist · houses · discovery tools (Jawak, Scent DNA, discovery set, stations) |

Plus a header search overlay, cart drawer, menu drawer, mega menu and a mobile tab bar.

## Structure

```
index.html            app shell (header, drawers, tab bar)
css/                  tokens · base · shell · components · pages
js/data/              demo-content.js (placeholder data) · catalog.js (adapter)
js/core/              util · i18n · router · store (cart + wishlist)
js/components/        icons · product-card · discovery · shell
js/pages/             home · category · product · misc (search, wishlist, brands, discover, 404)
docs/SALLA-HANDOVER.md  component map and open data questions for a future theme build
```

See `docs/SALLA-HANDOVER.md` before any platform implementation — Salla compatibility has not been validated.
