# 3altayer — UI/UX Demo

Arabic RTL fragrance storefront demo with the approved blue and ivory design, supplied photography, and selected sample products from 3altayer.com.

## Included
- Responsive storefront, product search, filters, favorites, and product detail dialogs.
- Work, events, gym, and gatherings categories.
- Comparison of up to three products.
- Three-sample discovery set builder and demo cart.
- Personal scent wardrobe saved in the browser.

## Run locally
From this directory:

```sh
python3 -m http.server 8080
```

Open http://localhost:8080.

## Hosting
This is a buildless static site. Serve this directory directly. No package installation, build command, API keys, or backend are required. In Vercel, choose Other as the framework, no build command, and the repository root as the output directory.

## Demo scope
Cart actions are local simulations. No orders or payments are submitted. Some product images and category links use the original store CDN. Bottle pricing, size, availability, and complete fragrance metadata require an approved Salla catalog integration. Sample prices are a snapshot from the source store and must be verified before launch.

This branch contains the separate UI/UX demo. The existing Claude branch is preserved.
