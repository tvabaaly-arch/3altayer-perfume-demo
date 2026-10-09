/* بيانات المنيو — منقولة حرفيًا من صفحات المنيو المرفقة.
   price: سعر واحد بالريال، أو sizes: [{label, price, kcal?}]
   allergens: true = «مسببات الحساسية: يوجد»، false = «لا يوجد»
   img: مسار الصورة المقصوصة من صفحة القسم، أو null إذا لم تتوفر صورة.
   لتعديل سعر أو اسم: عدّل السطر نفسه فقط. */

const PAPER_SIZES = (s, l, g) => [
  { label: 'ورق صغير', price: s },
  { label: 'ورق كبير', price: l },
  { label: 'زجاج', price: g },
];
const I = (f) => 'menu/img/' + f + '.webp';

window.MENU = {
  brand: { tagline: 'على ذوقك', currency: 'ريال' },

  sections: [
    {
      id: 'hot', ar: 'المشروبات الساخنة', en: 'Hot Tea', art: I('art-hot'), artW: 281, artH: 236, accent: 'orange',
      items: [
        { id: 'hot-01', ar: 'شاي أخضر', en: 'Green Tea', sizes: PAPER_SIZES(5, 7, 6), kcal: 2, allergens: false, img: I('hot-01') },
        { id: 'hot-02', ar: 'شاي جمر', en: 'Gamr Tea', sizes: PAPER_SIZES(5, 7, 6), kcal: 2, allergens: false, img: I('hot-02') },
        { id: 'hot-03', ar: 'شاي طائفي', en: 'Taif Tea', sizes: PAPER_SIZES(6, 8, 7), kcal: 3, allergens: false, img: I('hot-03') },
        { id: 'hot-04', ar: 'شاي عراقي', en: 'Iraqi Tea', sizes: PAPER_SIZES(6, 8, 7), kcal: 2, allergens: false, img: I('hot-04') },
        { id: 'hot-05', ar: 'شاي مغربي', en: 'Moroccan Tea', sizes: PAPER_SIZES(6, 8, 7), kcal: 2, allergens: false, img: I('hot-05') },
        { id: 'hot-06', ar: 'شاي مخلوط', en: 'Blended Tea', sizes: PAPER_SIZES(5, 7, 6), kcal: 6, allergens: false, img: I('hot-06') },
        { id: 'hot-07', ar: 'شاي مكس ورد', en: 'Rose Mix Tea', sizes: PAPER_SIZES(5, 7, 6), kcal: 62, allergens: true, img: I('hot-07') },
        { id: 'hot-08', ar: 'شاي كرك', en: 'Karak Tea', sizes: PAPER_SIZES(6, 8, 7), kcal: 110, allergens: true, img: I('hot-08') },
        { id: 'hot-09', ar: 'شاي حليب', en: 'Milk Tea', sizes: PAPER_SIZES(6, 8, 7), kcal: 112, allergens: true, img: I('hot-09') },
        { id: 'hot-10', ar: 'شاي حليب زنجبيل', en: 'Milk Ginger Tea', sizes: PAPER_SIZES(6, 8, 7), kcal: 110, allergens: true, img: I('hot-10') },
        { id: 'hot-11', ar: 'ليمون زنجبيل', en: 'Lemon Ginger', sizes: PAPER_SIZES(6, 8, 7), kcal: 40, allergens: true, img: I('hot-11') },
        { id: 'hot-12', ar: 'أناناس زنجبيل', en: 'Pineapple Ginger', sizes: PAPER_SIZES(6, 8, 7), kcal: 115, allergens: true, img: I('hot-12') },
        { id: 'hot-13', ar: 'سحلب', en: 'sahlab', sizes: PAPER_SIZES(9, 11, 10), kcal: 220, allergens: true, img: I('hot-13') },
        { id: 'hot-14', ar: 'براد شاي جمر', en: 'Gamr tea brad', price: 30, kcal: 15, allergens: false, img: I('hot-14'), wide: true },
        { id: 'hot-15', ar: 'شاي سيلاني مدخن', en: 'Smoked Ceylon tea', price: 32, kcal: 0, allergens: false, img: I('hot-15') },
      ],
    },
    {
      id: 'coffee', ar: 'القهوة', en: 'Coffee', art: I('art-cof'), artW: 440, artH: 263, accent: 'teal',
      items: [
        { id: 'cof-01', ar: 'قهوة سعودية', en: 'Saudi Coffee', allergens: false, img: I('cof-01'),
          sizes: [{ label: 'ورق صغير', price: 7, kcal: 1 }, { label: 'ورق كبير', price: 9, kcal: 2 }, { label: 'زجاج', price: 8, kcal: 1 }] },
        { id: 'cof-02', ar: 'دلة قهوة سعودية', en: 'Dallah Saudi Coffee', price: 40, kcal: 10, allergens: false, img: I('cof-02'), wide: true },
        { id: 'cof-03', ar: 'أمريكانو', en: 'Americano', price: 14, kcal: 0, allergens: false, img: I('cof-03') },
        { id: 'cof-04', ar: 'قهوة اليوم', en: 'coffee day', price: 13, kcal: 0, allergens: false, img: I('cof-04') },
        { id: 'cof-05', ar: 'لاتيه', en: 'Latte', price: 17, kcal: 160, allergens: true, img: I('cof-05') },
        { id: 'cof-06', ar: 'كابتشينو', en: 'Cappuccino', price: 16, kcal: 110, allergens: true, img: I('cof-06') },
        { id: 'cof-07', ar: 'فلات وايت', en: 'Flat White', price: 16, kcal: 80, allergens: true, img: I('cof-07') },
        { id: 'cof-08', ar: 'كورتادو', en: 'Cortado', price: 15, kcal: 60, allergens: true, img: I('cof-08') },
        { id: 'cof-09', ar: 'ميكاتو', en: 'Macchiato', price: 14, kcal: 16, allergens: true, img: I('cof-09') },
        { id: 'cof-10', ar: 'وايت موكا', en: 'White Mocha', price: 21, kcal: 336, allergens: true, img: I('cof-10') },
        { id: 'cof-11', ar: 'سولتد كراميل', en: 'Salted Caramel', price: 21, kcal: 341, allergens: true, img: I('cof-11') },
        { id: 'cof-12', ar: 'سبانيش لاتيه', en: 'Spanish latte', price: 22, kcal: 336, allergens: true, img: I('cof-12') },
        { id: 'cof-13', ar: 'ايس امريكانو', en: 'Iced americano', price: 14, kcal: 0, allergens: false, img: I('cof-13') },
        { id: 'cof-14', ar: 'قهوة اليوم باردة', en: 'Iced coffee day', price: 13, kcal: 0, allergens: false, img: I('cof-14') },
        { id: 'cof-15', ar: 'ايس لاتيه', en: 'iced latte', price: 17, kcal: 160, allergens: true, img: I('cof-15a') },
        // في المنيو تظهر الثلاثة التالية تحت صورة واحدة مشتركة
        { id: 'cof-16', ar: 'ايس سبانيش لاتيه', en: 'Iced Spanish latte', price: 22, kcal: 336, allergens: true, img: I('cof-15b') },
        { id: 'cof-17', ar: 'ايس وايت موكا', en: 'Iced white mocha', price: 21, kcal: 336, allergens: true, img: I('cof-15b') },
        { id: 'cof-18', ar: 'ايس سولتد كراميل', en: 'Iced salted caramel', price: 21, kcal: 341, allergens: true, img: I('cof-15b') },
      ],
    },
    {
      id: 'cold', ar: 'المشروبات الباردة', en: 'Cold Beverages', art: null, accent: 'teal',
      // صفحة المشروبات الباردة وصلت كمعاينة فقط وليست ملفًا؛ لذلك لا توجد صور منتجات لهذا القسم بعد.
      items: [
        { id: 'cold-01', ar: 'كركديه بارد', en: 'Iced hibiscus', price: 15, kcal: 280, allergens: true, img: null },
        { id: 'cold-02', ar: 'رمان تركي', en: 'Turkish pomegranate', price: 15, kcal: 320, allergens: true, img: null },
        { id: 'cold-03', ar: 'شاي خوخ بارد', en: 'Iced tea peach', price: 17, kcal: 290, allergens: true, img: null },
        { id: 'cold-04', ar: 'سقنتشر كركديه', en: 'Skentecher hibiscus', price: 15, kcal: 360, allergens: true, img: null },
        { id: 'cold-05', ar: 'موهيتو حبحب', en: 'Mojito watermelon', price: 15, kcal: 350, allergens: true, img: null },
        { id: 'cold-06', ar: 'موهيتو توت ازرق', en: 'Blueberry mojito', price: 15, kcal: 320, allergens: true, img: null },
        { id: 'cold-07', ar: 'موهيتو فراولة', en: 'Strawberry mojito', price: 15, kcal: 320, allergens: true, img: null },
        { id: 'cold-08', ar: 'موهيتو توت احمر', en: 'Red berry mojito', price: 15, kcal: 320, allergens: true, img: null },
        { id: 'cold-09', ar: 'كودرد توت احمر', en: 'raspberry code red', price: 15, kcal: 320, allergens: true, img: null },
        { id: 'cold-10', ar: 'كودرد توت ازرق', en: 'Blueberry code red', price: 15, kcal: 32, allergens: true, img: null },
        { id: 'cold-11', ar: 'شاي مغربي بارد', en: 'Iced Moroccan Tea', price: 15, kcal: 2, allergens: false, img: null },
        { id: 'cold-12', ar: 'مياه معدنية', en: 'Mineral water', price: 2, kcal: 0, allergens: false, img: null },
      ],
      addons: {
        ar: 'إضافات', en: 'Add-ons',
        items: [
          { id: 'add-01', ar: 'مكسرات', en: 'NUTS', price: 5, kcal: 250, allergens: true, img: null,
            note: 'نوعان في المنيو، كل منهما 250 سعرة (اسم النوعين غير مقروء في الملف).' },
          { id: 'add-02', ar: 'ترمس شاي أو قهوة خارجي', en: 'Takeaway tea or coffee thermos', allergens: false, img: null, wide: true,
            sizes: [
              { label: 'شاهي مع الترمس', price: 45 },
              { label: 'قهوة مع الترمس', price: 55 },
              { label: 'إعادة تعبئة من ترمس خارجي 1 لتر', price: 25 },
              { label: 'إعادة تعبئة القهوة ترمس 1 لتر', price: 35 },
            ] },
          { id: 'add-03', ar: 'مشاهدة المباراة', en: 'شاي + مياه معدنية', price: 15, kcal: 2, allergens: false, img: null },
          { id: 'add-04', ar: 'صحن تمر', en: '', price: 6, kcal: 7, img: null },
          { id: 'add-05', ar: 'قهوة تركي', en: 'سعر الكاسة', price: 9, kcal: 10, img: null },
          { id: 'add-06', ar: 'إسبريسو', en: '', price: 12, kcal: 4, img: null },
        ],
      },
    },
    {
      id: 'desserts', ar: 'الحلويات', en: 'Desserts', art: I('art-des'), artW: 428, artH: 280, accent: 'orange',
      items: [
        { id: 'des-01', ar: 'سوفليه', en: 'souffle', price: 12, kcal: 320, allergens: true, img: I('des-01') },
        { id: 'des-02', ar: 'سان سباستيان', en: 'San sebastian', price: 21, kcal: 450, allergens: true, img: I('des-02') },
        { id: 'des-03', ar: 'بنت الصحن', en: 'bint alsahn', price: 10, kcal: 200, allergens: true, img: I('des-03') },
        { id: 'des-04', ar: 'خلية', en: 'khalia', price: 15, kcal: 850, allergens: true, img: I('des-04') },
        { id: 'des-05', ar: 'خلية عسل', en: 'Khalia honey', price: 15, kcal: 900, allergens: true, img: I('des-05') },
        { id: 'des-06', ar: 'خلية نستله', en: 'Khalia condensed milk', price: 15, kcal: 1100, allergens: true, img: I('des-06') },
        { id: 'des-07', ar: 'شوكليت كيك', en: 'chocolate cake', price: 19, kcal: 372, allergens: true, img: I('des-07') },
        { id: 'des-08', ar: 'حلا جمرة', en: 'sweet gamra', price: 18, kcal: 340, allergens: true, img: I('des-08') },
        { id: 'des-09', ar: 'كوكيز كلاسك', en: 'Classic cookies', price: 10, kcal: 310, allergens: true, img: I('des-09') },
        { id: 'des-10', ar: 'عريكة', en: 'arika', price: 10, kcal: 440, allergens: true, img: I('des-10') },
        { id: 'des-11', ar: 'فتة تمر', en: 'fattah tamr', price: 8, kcal: 280, allergens: true, img: I('des-11') },
        { id: 'des-12', ar: 'بسبوسة', en: 'basbousa', price: 8, kcal: 180, allergens: true, img: I('des-12') },
      ],
    },
    {
      id: 'bakery', ar: 'المخبوزات والمالح', en: 'Bakery & Savory', art: I('art-bak'), artW: 421, artH: 295, accent: 'saffron',
      items: [
        { id: 'bak-01', ar: 'مكس اجبان', en: 'Cheese Mix', price: 19, kcal: 170, allergens: true, img: I('bak-01') },
        { id: 'bak-02', ar: 'لبنة', en: 'labaneh', price: 17, kcal: 200, allergens: true, img: I('bak-02') },
        { id: 'bak-03', ar: 'لبنة زعتر', en: 'Labaneh zaatar', price: 18, kcal: 210, allergens: true, img: I('bak-03') },
        { id: 'bak-04', ar: 'لبنة عسل', en: 'Labaneh honey', price: 18, kcal: 230, allergens: true, img: I('bak-04') },
        { id: 'bak-05', ar: 'عكاوي خضار', en: 'Akkawi vegetables', price: 18, kcal: 220, allergens: true, img: I('bak-05') },
        { id: 'bak-06', ar: 'جبنه سائلة بالخضار', en: 'Liquid cheese with vegetables', price: 18, kcal: 250, allergens: true, img: I('bak-06') },
        { id: 'bak-07', ar: 'مارجريتا', en: 'margherita', price: 16, kcal: 220, allergens: true, img: I('bak-07') },
        { id: 'bak-08', ar: 'بيروني', en: 'pepperoni', price: 17, kcal: 240, allergens: true, img: I('bak-08') },
        { id: 'bak-09', ar: 'عكاوي', en: 'Akkawi', price: 16, kcal: 170, allergens: true, img: I('bak-09') },
        { id: 'bak-10', ar: 'جبنة سائلة', en: 'liquid cheese', price: 16, kcal: 210, allergens: true, img: I('bak-10') },
        { id: 'bak-11', ar: 'كروسون جبنة', en: 'Cheese croissant', price: 6, kcal: 220, allergens: true, img: I('bak-11') },
        { id: 'bak-12', ar: 'سمبوسة', en: 'Sambosa', allergens: true, img: I('bak-12'), wide: true,
          sizes: [{ label: 'بوكس سمبوسة — الكمية 15 حبة', price: 20 }, { label: 'سمبوسة — الكمية 1 حبة', price: 2 }],
          kcalTable: [['جبن', 100], ['لحم', 70], ['دجاج', 65], ['بطاطس', 80]] },
      ],
    },
  ],

  // الفروع كما وردت في شريط «فروعنا في خدمتكم». لا توجد عناوين أو روابط خرائط في المرفقات.
  branches: [
    { id: 'makkah', ar: 'مكة المكرمة', en: 'MAKKAH', line: ['قرب الحرم', 'خدمة لضيوف الرحمن'], img: I('branch-makkah'), map: null },
    { id: 'jeddah', ar: 'جدة', en: 'JEDDAH', line: ['البلد التاريخية', 'حكاية من البحر والتراث'], img: I('branch-jeddah'), map: null },
    { id: 'riyadh', ar: 'الرياض', en: 'RIYADH', line: ['عاصمة العز', 'ونجد الأصالة'], img: I('branch-riyadh'), map: null },
    { id: 'abha', ar: 'أبها', en: 'ABHA', line: ['عروس الضباب', 'وجمال الجبال'], img: I('branch-abha'), map: null },
    { id: 'tabuk', ar: 'تبوك', en: 'TABUK', line: ['بوابة الشمال', 'وعراقة المكان'], img: I('branch-tabuk'), map: null },
  ],
};
