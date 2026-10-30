/* Inline SVG icon set (1.4 stroke, 24 grid). Usage: TA.icon('bag') */
(function (TA) {
  'use strict';
  const P = {
    search: '<circle cx="11" cy="11" r="6.5"/><path d="M20 20l-4.2-4.2"/>',
    bag: '<path d="M5 8h14l-1.2 12H6.2L5 8z"/><path d="M9 8V6.5a3 3 0 0 1 6 0V8"/>',
    heart: '<path d="M12 20s-7.5-4.6-7.5-10A4.3 4.3 0 0 1 12 7.4 4.3 4.3 0 0 1 19.5 10c0 5.4-7.5 10-7.5 10z"/>',
    menu: '<path d="M4 8h16M4 16h16"/>',
    close: '<path d="M6 6l12 12M18 6L6 18"/>',
    chev: '<path d="M9 6l6 6-6 6"/>',
    chevDown: '<path d="M6 9l6 6 6-6"/>',
    arrow: '<path d="M20 12H4M10 6l-6 6 6 6"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    minus: '<path d="M5 12h14"/>',
    trash: '<path d="M5 7h14M10 7V5h4v2M7 7l1 13h8l1-13"/>',
    home: '<path d="M4 11l8-6.5 8 6.5V20h-5v-5.5H9V20H4z"/>',
    grid: '<rect x="4.5" y="4.5" width="6" height="6"/><rect x="13.5" y="4.5" width="6" height="6"/><rect x="4.5" y="13.5" width="6" height="6"/><rect x="13.5" y="13.5" width="6" height="6"/>',
    truck: '<path d="M3 7h11v9H3zM14 10h4l3 3v3h-7"/><circle cx="7" cy="17.5" r="1.6"/><circle cx="17" cy="17.5" r="1.6"/>',
    shield: '<path d="M12 3l7 3v5c0 5-3 8-7 10-4-2-7-5-7-10V6l7-3z"/><path d="M9 12l2 2 4-4"/>',
    check: '<path d="M5 12.5l4.5 4.5L19 7.5"/>',
    vial: '<rect x="9" y="6" width="6" height="15" rx="2"/><path d="M10.5 6V3h3v3M9 13h6"/>',
    bottle: '<rect x="6" y="9" width="12" height="12" rx="2"/><path d="M10 9V5h4v4"/>',
    filter: '<path d="M4 7h10M18 7h2M4 17h4M12 17h8"/><circle cx="16" cy="7" r="2"/><circle cx="10" cy="17" r="2"/>',
    spark: '<path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5L18 18M6 18l2.5-2.5M15.5 8.5L18 6"/>',
    pin: '<path d="M12 21s-6.5-6-6.5-11a6.5 6.5 0 0 1 13 0c0 5-6.5 11-6.5 11z"/><circle cx="12" cy="10" r="2.3"/>',
    radar: '<path d="M12 3l8 6-3 10H7L4 9z"/><path d="M12 8l4 3-1.5 4.5h-5L8 11z"/>',
    instagram: '<rect x="4" y="4" width="16" height="16" rx="5"/><circle cx="12" cy="12" r="3.6"/><circle cx="16.8" cy="7.2" r=".6"/>',
    x: '<path d="M5 5l14 14M19 5L5 19"/>',
    tiktok: '<path d="M14 4v10.5a3.5 3.5 0 1 1-3.5-3.5M14 4c.4 2.4 2 3.8 4.5 4"/>',
    whatsapp: '<path d="M4 20l1.2-4A8 8 0 1 1 8 18.8L4 20z"/><path d="M9 9.5c.3 2.6 2.4 4.8 5 5.2l1.2-1.2-1.8-1-1 .7c-.8-.4-1.5-1.1-1.9-1.9l.7-1-1-1.8L9 9.5z"/>',
    globe: '<circle cx="12" cy="12" r="8.5"/><path d="M3.5 12h17M12 3.5c2.5 2.6 2.5 14.4 0 17M12 3.5c-2.5 2.6-2.5 14.4 0 17"/>'
  };
  TA.icon = (name, cls = '') => `<svg class="ic ${cls}" viewBox="0 0 24 24" aria-hidden="true" focusable="false">${P[name] || ''}</svg>`;
})(window.TA = window.TA || {});
