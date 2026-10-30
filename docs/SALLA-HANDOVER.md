# Handover notes for a future Salla Twilight theme

> **Status: design reference only.** This demo is a static, client-side prototype. It has **not**
> been built, tested or validated as a Salla Twilight theme, and nothing here should be read as a
> claim of Salla compatibility. Template names, component tags, hooks and data fields of Twilight
> must be confirmed against the official Salla Twilight documentation and a real development store
> before implementation.

## How the demo is organised

The UI is split so that each piece maps to one future template or component, and so that live
data can replace the demo data without rewriting the views.

| Layer | Demo file | Role | Future replacement (to be confirmed) |
|---|---|---|---|
| Demo data | `js/data/demo-content.js` | Placeholder perfumes, notes, DNA scores, prices, sizes | Live products, categories and variants from the store |
| Data adapter | `js/data/catalog.js` | Normalises products into **one shape** every component reads (`id, brand, name, images[], variants[], priceFrom, notes, dna…`) | A mapper from the platform's product payload to the same shape |
| Cart / wishlist | `js/core/store.js` | Client-side state keyed by **variant id** | The platform's cart and wishlist APIs/components |
| i18n | `js/core/i18n.js` | Arabic-first strings, `t()` / `tx()` / `price()` | The theme's locale files |
| Router | `js/core/router.js` | Hash routes for a static demo | Real store URLs / page templates |

## Component → page map

| Demo component (render function) | Used on | Notes for implementation |
|---|---|---|
| Header + mega menu + search trigger (`shell.js`) | All pages | Menu items should come from the store's navigation settings |
| Search overlay (`shell.js`) | All pages | Live results are client-side here; replace with the platform's search |
| Cart drawer (`shell.js`) | All pages | Lines reference variant ids; totals, shipping and tax must come from the cart API |
| Mobile tab bar (`shell.js`) | Mobile | Home · Shop · Search · Wishlist · Bag |
| Product card `TA.ui.card()` | Home rails, listings, search, wishlist | Inputs: product + which variant to feature (bottle or 2 ml sample) |
| Product rail `TA.ui.rail()` | Home, product page | Horizontal, scroll-snap, arrow buttons on desktop |
| Product grid `TA.ui.grid()` | Listing, search, wishlist | 2 / 3 / 4 columns |
| Listing page (`pages/category.js`) | Category routes | Filters (brand, gender, niche/designer) and sort are kept in the URL query |
| Product page (`pages/product.js`) | Product route | Gallery, variant selector (2 / 5 / 10 ml, full bottle), quantity, add to bag, wishlist, accordions, related products, sticky mobile buy bar |
| Find Your Jawak `TA.ui.jawak()` | Home (compact), Discover | Mood → product mapping is demo content |
| Scent DNA `TA.ui.radarSVG()` / `dnaBars()` | Product (accordion), Discover | Needs a data source for the 7 scores (e.g. product custom fields) — **to be decided** |
| Discovery set `TA.ui.discoverySet()` | Discover | Adds three sample variants to the bag |
| Stations `TA.ui.stations()` | Discover | Demo locations only |

## Data that does not exist yet and must be sourced

- **Prices, sizes and stock** — all demo placeholders.
- **Sample/decant variants** (2 ml, 5 ml, 10 ml) — modelled as variants of each perfume; confirm how the live catalogue represents them.
- **Fragrance notes, Scent DNA scores, season, occasion, mood** — illustrative; need an agreed source.
- **Testimonials and station locations** — marked as demo content in the UI.
- **Delivery, returns and authenticity text** — should come from store settings/pages.

## Design system

Tokens live in `css/tokens.css`: warm ivory/beige surfaces, deep-brown primary, bronze for
interactive states, champagne micro-accents. Fonts: Tajawal (Arabic), Cormorant Garamond
(English headings), Manrope (English UI/body) — all bundled.

## Imagery

- Product photos marked `studio: true` (cream backdrop, 4:5) fill their frame; transparent
  cut-outs (Isfarkand, Verano, Althair) sit on a matching cream tile.
- The niche banner image was cropped to remove text that was baked into the source image; all
  banner text is HTML. That source also shows Diesel Fuel for Life as a round glass bottle, which
  does not match the real product — replace before production.
- The Alexandre.J studio shot shows a scrambled ribbon inscription — replace before production.
