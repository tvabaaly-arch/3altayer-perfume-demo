/* Cart + wishlist state (client-side demo).
   Lines reference variant ids so a live cart API can replace this module later
   without touching the components that call TA.cart / TA.wish. */
(function (TA) {
  'use strict';
  const { store, emit } = TA.util;
  const KEY_CART = 'ta.cart.v1', KEY_WISH = 'ta.wish.v1';
  let lines = store.get(KEY_CART, []).filter(l => TA.catalog.variant(l.v));
  let wish = new Set(store.get(KEY_WISH, []).filter(id => TA.catalog.byId(id)));

  const saveCart = () => { store.set(KEY_CART, lines); emit('cart', TA.cart.summary()); };
  const saveWish = () => { store.set(KEY_WISH, [...wish]); emit('wish', wish.size); };

  TA.cart = {
    lines: () => lines.map(l => ({ ...l, ...TA.catalog.variant(l.v) })),
    add(variantId, qty = 1) {
      const line = lines.find(l => l.v === variantId);
      line ? line.qty = Math.min(line.qty + qty, 10) : lines.push({ v: variantId, qty });
      saveCart();
    },
    setQty(variantId, qty) {
      const line = lines.find(l => l.v === variantId); if (!line) return;
      if (qty < 1) lines = lines.filter(l => l.v !== variantId); else line.qty = Math.min(qty, 10);
      saveCart();
    },
    remove(variantId) { lines = lines.filter(l => l.v !== variantId); saveCart(); },
    clear() { lines = []; saveCart(); },
    summary() {
      const ls = TA.cart.lines();
      return { count: ls.reduce((n, l) => n + l.qty, 0), subtotal: ls.reduce((n, l) => n + l.qty * l.variant.price, 0) };
    }
  };

  TA.wish = {
    has: id => wish.has(id),
    toggle(id) { wish.has(id) ? wish.delete(id) : wish.add(id); saveWish(); return wish.has(id); },
    ids: () => [...wish],
    count: () => wish.size
  };
})(window.TA = window.TA || {});
