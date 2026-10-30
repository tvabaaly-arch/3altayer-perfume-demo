/* i18n — Arabic first, English second. t('key', {vars}) · tx({ar,en}) · price(n) */
(function (TA) {
  'use strict';
  const D = {
    brand: ['عالطاير', '3ALTAYER'],
    skip: ['تخطَّ إلى المحتوى', 'Skip to content'],
    ann1: ['عطور أصلية مضمونة', 'Guaranteed original fragrances'],
    ann2: ['توصيل سريع لباب بيتك', 'Fast delivery to your door'],
    ann3: ['جرّب العيّنة قبل الزجاجة', 'Try the sample before the bottle'],
    searchPh: ['ابحث عن عطر، ماركة أو نوتة…', 'Search a fragrance, brand or note…'],
    search: ['بحث', 'Search'], cart: ['السلة', 'Bag'], wishlist: ['المفضلة', 'Wishlist'], menu: ['القائمة', 'Menu'], close: ['إغلاق', 'Close'],
    home: ['الرئيسية', 'Home'], shop: ['تسوّق', 'Shop'], perfumes: ['العطور', 'Fragrances'], brands: ['الماركات', 'Brands'], discover: ['اكتشف', 'Discover'],
    men: ['رجالي', 'Men'], women: ['نسائي', 'Women'], niche: ['نيش', 'Niche'], samples: ['العينات', 'Samples'], all: ['جميع العطور', 'All fragrances'],
    jawak: ['Find Your Jawak', 'Find Your Jawak'], jawakSub: ['اختر مزاجك ونرشّح لك عطرك', 'Pick a mood, get your match'],
    dna: ['Scent DNA', 'Scent DNA'], dnaSub: ['بصمة كل عطر في سبعة أبعاد', 'Every scent in seven dimensions'],
    set: ['مجموعة الاكتشاف', 'Discovery set'], setSub: ['ثلاث عينات تختارها بنفسك', 'Three samples of your choice'],
    stations: ['محطات عالطاير', '3ALTAYER Stations'], stationsSub: ['جرّب العطر على أرض الواقع', 'Try fragrances in person'],
    shopBy: ['تسوّق حسب', 'Shop by'], featuredHouse: ['دار مميزة', 'Featured house'], viewAll: ['عرض الكل', 'View all'],
    lang: ['English', 'العربية'], langShort: ['EN', 'ع'],

    // product
    addToCart: ['أضف إلى السلة', 'Add to bag'], add: ['أضف', 'Add'], added: ['أُضيف إلى السلة', 'Added to your bag'],
    from: ['من', 'From'], sampleFrom: ['عيّنة من {p}', 'Sample from {p}'], ml: ['مل', 'ml'],
    kind_sample: ['عيّنة', 'Sample'], kind_decant: ['تقسيمة', 'Decant'], kind_bottle: ['زجاجة كاملة', 'Full bottle'],
    chooseSize: ['اختر الحجم', 'Choose a size'], qty: ['الكمية', 'Quantity'], inc: ['زيادة الكمية', 'Increase quantity'], dec: ['تقليل الكمية', 'Decrease quantity'],
    trySample: ['غير متأكد؟ جرّب عيّنة {ml} مل أولاً بـ {p}', 'Not sure? Try a {ml} ml sample first for {p}'],
    wishAdd: ['أضف إلى المفضلة', 'Add to wishlist'], wishRemove: ['إزالة من المفضلة', 'Remove from wishlist'],
    wishAdded: ['أُضيف إلى المفضلة', 'Saved to your wishlist'], wishRemoved: ['أُزيل من المفضلة', 'Removed from your wishlist'],
    description: ['الوصف', 'Description'], notes: ['الهرم العطري', 'Fragrance notes'], top: ['القمة', 'Top'], heart: ['القلب', 'Heart'], base: ['القاعدة', 'Base'],
    scentDna: ['بصمة العطر', 'Scent DNA'], delivery: ['التوصيل والأصالة', 'Delivery & authenticity'],
    deliveryTxt: ['كل العطور أصلية ومن مصادرها المعتمدة. تفاصيل التوصيل والإرجاع تُعرض هنا من إعدادات المتجر.', 'Every fragrance is original and from its authorised source. Delivery and returns details will appear here from the store settings.'],
    related: ['قد يعجبك أيضاً', 'You may also like'], inStock: ['متوفر', 'In stock'],
    season: ['الموسم', 'Season'], occasion: ['المناسبة', 'Occasion'], mood: ['الطابع', 'Character'], size: ['الحجم', 'Size'],
    demoPrices: ['الأسعار والأحجام بيانات تجريبية للعرض.', 'Prices and sizes are demo data.'],
    demoData: ['الملاحظات والنسب بيانات توضيحية.', 'Notes and scores are illustrative.'],
    original: ['أصلي ومضمون', 'Original & guaranteed'], fast: ['توصيل سريع', 'Fast delivery'], tryFirst: ['عينات متوفرة', 'Samples available'],
    gallery: ['صور المنتج', 'Product images'], imageN: ['صورة {n}', 'Image {n}'],
    viewProduct: ['عرض المنتج', 'View product'],

    // category
    results: ['عدد النتائج: {n}', '{n} fragrances'], sort: ['الترتيب', 'Sort'], s_featured: ['المميزة', 'Featured'], s_asc: ['السعر: الأقل أولاً', 'Price: low to high'],
    s_desc: ['السعر: الأعلى أولاً', 'Price: high to low'], s_name: ['الاسم', 'Name'], filter: ['تصفية', 'Filter'], filters: ['التصفية', 'Filters'],
    brand_f: ['الماركة', 'Brand'], gender_f: ['الفئة', 'Gender'], family_f: ['النوع', 'Type'], clearAll: ['مسح الكل', 'Clear all'],
    showN: ['عرض {n} نتيجة', 'Show {n} results'], noResults: ['لا توجد نتائج مطابقة.', 'No matching results.'], designer: ['ديزاينر', 'Designer'],
    breadcrumb: ['مسار التنقل', 'Breadcrumb'], showingSamples: ['الأسعار المعروضة لعيّنة ٢ مل', 'Prices shown for a 2 ml sample'],

    // search
    searchResults: ['نتائج البحث عن “{q}”', 'Results for “{q}”'], popular: ['عمليات بحث شائعة', 'Popular searches'], typeToSearch: ['اكتب اسم عطر أو ماركة أو نوتة', 'Type a fragrance, brand or note'],
    seeAllResults: ['عرض كل النتائج ({n})', 'See all results ({n})'], searchNone: ['لم نجد نتائج لـ “{q}”. جرّب كلمة أخرى.', 'Nothing found for “{q}”. Try another word.'],

    // cart
    cartTitle: ['سلة التسوّق', 'Your bag'], cartEmpty: ['سلتك فارغة حالياً.', 'Your bag is empty.'], startShopping: ['ابدأ التسوّق', 'Start shopping'],
    subtotal: ['المجموع الفرعي', 'Subtotal'], checkout: ['إتمام الطلب', 'Checkout'], remove: ['إزالة', 'Remove'],
    checkoutDemo: ['نسخة تجريبية — لا يوجد دفع فعلي.', 'Demo only — there is no real checkout.'], cartNote: ['تُحسب رسوم الشحن والضريبة في صفحة الدفع.', 'Shipping and taxes are calculated at checkout.'],
    items: ['عدد القطع: {n}', '{n} items'],

    // wishlist
    wishTitle: ['المفضلة', 'Wishlist'], wishEmpty: ['لم تحفظ أي عطر بعد. اضغط على القلب لحفظ ما يعجبك.', 'Nothing saved yet. Tap the heart to keep what you love.'],

    // home
    heroEyebrow: ['عطور نيش أصلية', 'Original niche fragrances'], heroTitle: ['وش جوّك اليوم؟', 'What’s your mood today?'],
    heroText: ['عطور أصلية من أرقى الدور، بزجاجات كاملة وعينات تجرّبها على جلدك قبل أن تقرّر.', 'Original fragrances from the finest houses — in full bottles, and samples to try on your skin before you decide.'],
    shopNow: ['تسوّق العطور', 'Shop fragrances'], trySamples: ['جرّب العينات', 'Try samples'],
    catTitle: ['تسوّق حسب القسم', 'Shop by category'], bestTitle: ['الأكثر طلباً', 'Most loved'], bestSub: ['اختيارات عملائنا هذا الموسم', 'Our clients’ choices this season'],
    samplesEyebrow: ['جرّب قبل الزجاجة', 'Try before the bottle'], samplesTitle: ['لا تشتري الحيرة. جرّب أولاً.', 'Don’t buy doubt. Try first.'],
    samplesText: ['كل عطر متوفر بعيّنة ٢ مل وتقسيمات ٥ و١٠ مل. جرّبه على جلدك، ثم اختر الزجاجة بثقة.', 'Every fragrance comes as a 2 ml sample and 5 and 10 ml decants. Wear it on your skin, then choose the bottle with confidence.'],
    step1: ['اختر العطر', 'Choose a scent'], step2: ['جرّب العيّنة', 'Wear the sample'], step3: ['الزجاجة بثقة', 'Bottle, confidently'],
    shopSamples: ['تسوّق العينات', 'Shop samples'],
    momentEyebrow: ['عطر اللحظة', 'Fragrance of the moment'], nicheTitle: ['من دور النيش', 'From the niche houses'], nicheSub: ['إبداعات مستقلة لمن يبحث عن التميّز', 'Independent creations for the discerning'],
    jawakEyebrow: ['اكتشف عطرك', 'Discover your scent'], jawakTitle: ['وش إحساسك الحين؟', 'How do you feel right now?'],
    jawakText: ['اختر كلمة واحدة ونرشّح لك العطر الأقرب لمزاجك.', 'Pick one word and we’ll suggest the scent closest to your mood.'],
    because: ['لأن جوّك {m}', 'Because you feel {m}'], exploreMore: ['استكشف المزيد', 'Explore more'], alsoTry: ['جرّب أيضاً', 'Also try'],
    brandsTitle: ['دور العطور', 'Perfume houses'], trustTitle: ['ثقة قبل الرش', 'Trust before the spray'],
    t1: ['عطور أصلية', 'Original fragrances'], t1d: ['كل زجاجة من مصدرها المعتمد.', 'Every bottle from its authorised source.'],
    t2: ['ضمان الأصالة', 'Authenticity guaranteed'], t2d: ['نضمن لك أصالة ما تشتريه.', 'We guarantee what you buy is authentic.'],
    t3: ['توصيل سريع', 'Fast delivery'], t3d: ['يصلك عطرك بسرعة وعناية.', 'Your fragrance arrives quickly and carefully.'],
    t4: ['جرّب قبل تشتري', 'Try before you buy'], t4d: ['عينات وتقسيمات لكل ذوق.', 'Samples and decants for every taste.'],
    q1: ['جرّبت ثلاث عينات قبل ما أقرر، والحين أعرف بالضبط وش يناسبني.', 'I tried three samples before deciding — now I know exactly what suits me.'],
    q2: ['الاختيار صار ممتع مو محيّر.', 'Choosing became a pleasure, not a puzzle.'], q3: ['وصلني بسرعة وبتغليف يليق بالعطر.', 'Arrived fast, packaged the way a perfume deserves.'],
    demoClient: ['عميل تجريبي', 'Demo client'], demoContent: ['محتوى تجريبي', 'Demo content'],
    stationsTitle: ['اكتشفه أونلاين. جرّبه على أرض الواقع.', 'Discover online. Experience it in person.'],
    stationsText: ['محطات ذكية لعينات العطور تمسك فيها العطر قبل أن تقرّر.', 'Smart sample stations where you can try a fragrance before you decide.'],
    findStation: ['اعرف المزيد', 'Learn more'],
    closingTitle: ['لا تدوّر على عطر… دوّر على جوّك.', 'Don’t just find a perfume. Find your Jawak.'],
    newsTitle: ['ابقَ على جوّك', 'Stay in your Jawak'], newsText: ['جديد العطور وعروض العينات، بدون إزعاج.', 'New arrivals and sample offers, no spam.'],
    subscribe: ['اشترك', 'Subscribe'], subscribed: ['تم الاشتراك (تجريبي) — شكراً لك.', 'Subscribed (demo) — thank you.'], email: ['البريد الإلكتروني', 'Email address'],

    // discover
    discoverTitle: ['اكتشف جوّك', 'Discover your Jawak'], discoverText: ['أدوات تساعدك على اختيار العطر: رشّح حسب مزاجك، اقرأ بصمته، وجرّب مجموعة عينات.', 'Tools to help you choose: match by mood, read a scent’s profile, and try a sample set.'],
    dnaPick: ['اختر عطراً لعرض بصمته', 'Choose a fragrance to see its profile'],
    setTitle: ['ابنِ مجموعة الاكتشاف', 'Build your discovery set'], setText: ['اخترنا لك ثلاث عينات لتبدأ. بدّل أي عطر بلمسة.', 'We’ve started you with three samples. Swap any with a tap.'],
    setReady: ['مجموعتك جاهزة — اختر عطراً لاستبدال الخانة المحددة.', 'Your set is ready — pick a scent to replace the highlighted slot.'],
    setLeft: ['اختر {n} لإكمال المجموعة', 'Choose {n} more to complete your set'], setAdd: ['أضف المجموعة إلى السلة', 'Add set to bag'], setAdded: ['أُضيفت المجموعة إلى السلة', 'Set added to your bag'],
    chooseScent: ['اختر عطراً', 'Choose a scent'], demoLocations: ['مواقع تجريبية — لا تمثّل المحطات الفعلية.', 'Demo locations — not actual stations.'],
    tryNow: ['جرّب الآن (تجريبي)', 'Try now (demo)'], ready: ['عيّنة {n} جاهزة في الدرج · تجريبي', '{n} sample ready in the tray · demo'], soon: ['هذه المحطة قريباً — موقع تجريبي', 'This station is coming soon — demo site'],

    // footer / misc
    footerAbout: ['عطور نيش أصلية، عينات، وتجربة اكتشاف تشبهك.', 'Original niche fragrances, samples, and a discovery experience that feels like you.'],
    help: ['المساعدة', 'Help'], contact: ['تواصل معنا', 'Contact us'], shipping: ['الشحن والتوصيل', 'Shipping'], returns: ['الاستبدال والإرجاع', 'Returns'], faq: ['الأسئلة الشائعة', 'FAQ'],
    rights: ['© ٢٠٢٦ عالطاير — نسخة عرض تجريبية، واجهة أمامية فقط.', '© 2026 3ALTAYER — demo version, frontend only.'],
    demoLink: ['رابط تجريبي في هذه النسخة', 'Demo link in this version'],
    notFound: ['الصفحة غير موجودة', 'Page not found'], backHome: ['العودة للرئيسية', 'Back to home'],
    brandsText: ['دور العطور المتوفرة في عالطاير.', 'The perfume houses available at 3ALTAYER.']
  };
  let lang = 'ar';
  const t = (k, vars) => { const e = D[k]; let s = e ? e[lang === 'ar' ? 0 : 1] : k; if (vars) for (const v in vars) s = s.replace(`{${v}}`, vars[v]); return s; };
  const tx = o => (o && typeof o === 'object') ? (o[lang] ?? o.ar) : (o ?? '');
  const price = n => lang === 'ar' ? `${Number(n).toLocaleString('en-US')} ر.س` : `SAR ${Number(n).toLocaleString('en-US')}`;
  const variantLabel = v => `${t('kind_' + v.kind)} · ${v.ml} ${t('ml')}`;

  function apply(root = document) {
    root.querySelectorAll('[data-t]').forEach(el => { el.textContent = t(el.dataset.t); });
    root.querySelectorAll('[data-t-attr]').forEach(el => el.dataset.tAttr.split(';').forEach(pair => { const [a, k] = pair.split(':'); el.setAttribute(a, t(k)); }));
  }
  function setLang(l) {
    lang = l;
    document.documentElement.lang = l; document.documentElement.dir = l === 'ar' ? 'rtl' : 'ltr';
    TA.util.store.set('ta.lang', l);
    apply(); TA.util.emit('lang', l);
  }
  TA.i18n = { t, tx, price, variantLabel, apply, setLang, get lang() { return lang; } };
  const saved = TA.util.store.get('ta.lang', 'ar');
  if (saved === 'en') { lang = 'en'; document.documentElement.lang = 'en'; document.documentElement.dir = 'ltr'; }
})(window.TA = window.TA || {});
