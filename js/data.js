/* Demo data — notes, scores, seasons and occasions are ILLUSTRATIVE only. */
window.PERFUMES = [
  { id:'isfarkand', img:'assets/img/isfarkand.webp', gender:'men', sample:true,
    name:'Isfarkand', house:'Ormonde Jayne', ar:'إسفركند',
    mood:{ar:'دافئ ذهبي',en:'Warm & golden'},
    line:{ar:'إشراقة ذهبية بتوابل ناعمة وعنبر مخملي.',en:'A golden glow of soft spice over velvety amber.'},
    notes:{top:{ar:['برغموت','فلفل وردي'],en:['Bergamot','Pink pepper']},heart:{ar:['زعفران','ورد'],en:['Saffron','Rose']},base:{ar:['عنبر','مسك'],en:['Amber','Musk']}},
    dna:{fresh:45,citrus:55,floral:40,woody:60,amber:72,longevity:76,projection:70},
    season:{ar:'خريف · شتاء',en:'Autumn · Winter'}, occasion:{ar:'سهرة · مناسبات',en:'Evening · Events'} },
  { id:'verano', img:'assets/img/verano.webp', gender:'men', sample:true,
    name:'Verano', house:'Ormonde Jayne', ar:'فيرانو',
    mood:{ar:'منعش أزرق',en:'Fresh & azure'},
    line:{ar:'نسمة بحرية باردة تنتهي بمسك أبيض نظيف.',en:'A cool sea breeze settling into clean white musk.'},
    notes:{top:{ar:['حمضيات','نعناع'],en:['Citrus','Mint']},heart:{ar:['زهر البرتقال','لافندر'],en:['Orange blossom','Lavender']},base:{ar:['مسك أبيض','أخشاب خفيفة'],en:['White musk','Light woods']}},
    dna:{fresh:88,citrus:82,floral:32,woody:34,amber:22,longevity:58,projection:64},
    season:{ar:'صيف · ربيع',en:'Summer · Spring'}, occasion:{ar:'نهار · سفر',en:'Daytime · Travel'} },
  { id:'althair', img:'assets/img/althair.webp', gender:'men', sample:true,
    name:'Althair', house:'Parfums de Marly', ar:'ألثير',
    mood:{ar:'دافئ مخملي',en:'Warm & velvety'},
    line:{ar:'فانيلا مخملية وتوابل ناعمة بحضور يبقى.',en:'Velvet vanilla and soft spice with lasting presence.'},
    notes:{top:{ar:['هيل','برغموت'],en:['Cardamom','Bergamot']},heart:{ar:['فانيلا','قرفة'],en:['Vanilla','Cinnamon']},base:{ar:['براليني','عنبر','صندل'],en:['Praline','Amber','Sandalwood']}},
    dna:{fresh:15,citrus:25,floral:20,woody:55,amber:92,longevity:92,projection:85},
    season:{ar:'خريف · شتاء',en:'Autumn · Winter'}, occasion:{ar:'سهرة · مناسبات',en:'Evening · Events'} },
  { id:'diesel', img:'assets/img/diesel.webp', gender:'men', sample:false,
    name:'Fuel for Life', house:'Diesel', ar:'فيول فور لايف',
    mood:{ar:'جريء عصري',en:'Bold & urban'},
    line:{ar:'طاقة شبابية بخشب وتوابل وروح شارع.',en:'Youthful energy of woods, spice and street spirit.'},
    notes:{top:{ar:['حمضيات','لافندر'],en:['Citrus','Lavender']},heart:{ar:['توابل','جلد'],en:['Spice','Leather']},base:{ar:['أخشاب','عنبر'],en:['Woods','Amber']}},
    dna:{fresh:55,citrus:46,floral:14,woody:76,amber:46,longevity:60,projection:56},
    season:{ar:'خريف · ربيع',en:'Autumn · Spring'}, occasion:{ar:'يومي · نادي',en:'Daily · Club'} },
  { id:'lancome', img:'assets/img/lancome.webp', gender:'women', sample:false,
    name:'Absolue Rose on the Moon', house:'Lancôme', ar:'أبسولو روز أون ذا مون',
    mood:{ar:'وردي هادئ',en:'Soft & rosy'},
    line:{ar:'وردة ناعمة تحت ضوء القمر، هادئة ومريحة.',en:'A soft rose beneath the moonlight, calm and comforting.'},
    notes:{top:{ar:['حمضيات ناعمة'],en:['Soft citrus']},heart:{ar:['ورد','ياسمين'],en:['Rose','Jasmine']},base:{ar:['مسك','خشب'],en:['Musk','Wood']}},
    dna:{fresh:40,citrus:30,floral:92,woody:24,amber:40,longevity:66,projection:55},
    season:{ar:'ربيع · خريف',en:'Spring · Autumn'}, occasion:{ar:'يومي · مناسبات',en:'Daily · Events'} },
  { id:'devotion', img:'assets/img/devotion.webp', gender:'women', sample:false,
    name:'Devotion', house:'Dolce & Gabbana', ar:'ديفوشن',
    mood:{ar:'مشرق وناعم',en:'Bright & tender'},
    line:{ar:'ليمون مشرق على قاعدة فانيلا كريمية.',en:'Bright lemon over a creamy vanilla base.'},
    notes:{top:{ar:['ليمون','برتقال'],en:['Lemon','Orange']},heart:{ar:['زهر البرتقال'],en:['Orange blossom']},base:{ar:['فانيلا','مسك'],en:['Vanilla','Musk']}},
    dna:{fresh:56,citrus:88,floral:55,woody:24,amber:50,longevity:70,projection:66},
    season:{ar:'ربيع · صيف',en:'Spring · Summer'}, occasion:{ar:'نهار · مناسبات',en:'Daytime · Events'} },
  { id:'alexandre', img:'assets/img/alexandre.webp', gender:'women', sample:false,
    name:'Alexandre.J', house:'Alexandre.J', ar:'ألكسندر جاي',
    mood:{ar:'أرجواني ملكي',en:'Regal & violet'},
    line:{ar:'زهور بودرية بعمق أرجواني وحضور أنيق.',en:'Powdery florals with a deep violet, elegant presence.'},
    notes:{top:{ar:['توابل خفيفة'],en:['Light spice']},heart:{ar:['بنفسج','ورد'],en:['Violet','Rose']},base:{ar:['باتشولي','مسك'],en:['Patchouli','Musk']}},
    dna:{fresh:25,citrus:20,floral:82,woody:40,amber:62,longevity:76,projection:70},
    season:{ar:'خريف · شتاء',en:'Autumn · Winter'}, occasion:{ar:'سهرة · مناسبات',en:'Evening · Events'} },
  { id:'burberry', img:'assets/img/burberry.webp', gender:'women', sample:false,
    name:'Burberry for Women', house:'Burberry', ar:'بيربري للنساء',
    mood:{ar:'كلاسيكي مشمس',en:'Classic & sunlit'},
    line:{ar:'زهور وفواكه بأناقة كلاسيكية لا تُنسى.',en:'Florals and fruit in timeless classic elegance.'},
    notes:{top:{ar:['فواكه','حمضيات'],en:['Fruits','Citrus']},heart:{ar:['ياسمين','ورد'],en:['Jasmine','Rose']},base:{ar:['فانيلا','مسك'],en:['Vanilla','Musk']}},
    dna:{fresh:46,citrus:50,floral:76,woody:35,amber:40,longevity:56,projection:50},
    season:{ar:'ربيع · صيف',en:'Spring · Summer'}, occasion:{ar:'يومي · دوام',en:'Daily · Work'} }
];

window.FINDER = [
  { k:'fresh',    ar:'منعش', en:'Fresh',     pick:'verano',    alt:['burberry','devotion'] },
  { k:'bold',     ar:'جريء', en:'Bold',      pick:'althair',   alt:['isfarkand','diesel'] },
  { k:'dark',     ar:'غامض', en:'Dark',      pick:'alexandre', alt:['althair','isfarkand'] },
  { k:'calm',     ar:'هادئ', en:'Calm',      pick:'lancome',   alt:['burberry','verano'] },
  { k:'woody',    ar:'خشبي', en:'Woody',     pick:'diesel',    alt:['isfarkand','althair'] },
  { k:'seductive',ar:'مغري', en:'Seductive', pick:'devotion',  alt:['alexandre','lancome'] }
];

window.MOODS = [
  { ar:'الجمعة',  en:'Friday',    sub:{ar:'صلاة وغداء وعائلة',en:'Prayer, lunch & family'}, tint:'#F7F8FA', picks:['isfarkand','lancome'] },
  { ar:'الدوام',  en:'Workday',   sub:{ar:'حضور نظيف ومرتّب',en:'Clean, composed presence'}, tint:'#F6F7F5', picks:['verano','burberry'] },
  { ar:'النادي',  en:'Club',      sub:{ar:'طاقة وحركة',en:'Energy in motion'}, tint:'#F8F5F1', picks:['diesel','devotion'] },
  { ar:'المناسبات',en:'Occasions',sub:{ar:'أناقة تلفت النظر',en:'Elegance that turns heads'}, tint:'#F2F4F8', picks:['althair','alexandre'] },
  { ar:'الهدوء',  en:'Calm',      sub:{ar:'وقت لنفسك',en:'Time for yourself'}, tint:'#F3F6FA', picks:['lancome','verano'] }
];

window.LOCS = [
  { ar:'الرياض — موقع تجريبي ١', en:'Riyadh — demo site 1', state:{ar:'متاح',en:'Available'}, ok:true, slots:['althair','verano','isfarkand','devotion','lancome','alexandre','diesel','burberry','isfarkand','verano','althair','alexandre'] },
  { ar:'جدة — موقع تجريبي ٢', en:'Jeddah — demo site 2', state:{ar:'متاح',en:'Available'}, ok:true, slots:['devotion','althair','burberry','verano','alexandre','isfarkand','lancome','diesel','althair','devotion','verano','isfarkand'] },
  { ar:'الدمام — موقع تجريبي ٣', en:'Dammam — demo site 3', state:{ar:'قريباً',en:'Coming soon'}, ok:false, slots:['verano','lancome','althair','diesel','isfarkand','burberry','devotion','alexandre','lancome','althair','verano','diesel'] }
];

window.BRANDS = ['Ormonde Jayne','Parfums de Marly','Alexandre.J','Diesel','Lancôme','Dolce & Gabbana','Burberry'];

window.AXES = [
  {k:'fresh',ar:'منعش',en:'Fresh'},{k:'citrus',ar:'حمضي',en:'Citrus'},{k:'floral',ar:'زهري',en:'Floral'},
  {k:'woody',ar:'خشبي',en:'Woody'},{k:'amber',ar:'عنبري',en:'Amber'},{k:'longevity',ar:'الثبات',en:'Longevity'},{k:'projection',ar:'الفوحان',en:'Projection'}
];
