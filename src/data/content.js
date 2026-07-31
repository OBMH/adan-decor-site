// Centralized luxury content for Aden Decor (Adan Decor)

import logoImg from "../assets/images/adan_decor_logo_1784488782852.png";
import heroImg from "../assets/images/luxury_interior_hero_1784488795242.jpg";
import aboutImg from "../assets/images/luxury_interior_about_1784488806775.jpg";
import aboutSlide2 from "../assets/images/luxury_about_slide2_1784490484658.jpg";
import aboutSlide3 from "../assets/images/luxury_about_slide3_1784490498052.jpg";
import aboutSlide4 from "../assets/images/luxury_about_slide4_1784490510728.jpg";
import philosophyBg from "../assets/images/luxury_philosophy_bg_1784490523745.jpg";
const portfolioMajlisModern = "https://images.unsplash.com/photo-1618221118493-9c48ea92a955?auto=format&fit=crop&w=1200&q=80"; // Replaced with a warm luxury modern majlis interior
import portfolioMajlisClassic from "../assets/images/portfolio_majlis_classic_1784490556781.jpg";
import portfolioCorridorClassic from "../assets/images/portfolio_corridor_classic_1784490570233.jpg";
import officeDeskImg from "../assets/images/office_desk_new.png";
import interiorCardBg from "../assets/images/interior_card_bg_1784515033104.jpg";
import aluminumCardBg from "../assets/images/aluminum_card_bg_1784516085266.jpg";
import carpentryCardBg from "../assets/images/carpentry_card_bg_1784516477737.jpg";
import commercialCardBg from "../assets/images/interior_card_bg_1784515033104.jpg";
import insulationCardBg from "../assets/images/insulation_card_bg_1784517415029.jpg";

export const BRAND = {
  name: "Adan Decor",
  nameAr: "عدن للديكور",
  nameArShort: "عدن للديكور",
  tagline: "عدن للديكور — حلول متكاملة في التصميم الداخلي والتنفيذ، نحول الأفكار إلى مساحات عصرية تجمع بين الجودة، الدقة، وجمال التفاصيل.",
  logo: logoImg,
  whatsapp: "+967771258215",
  whatsappLink: "https://wa.me/967771258215",
  instagram: "https://www.instagram.com/adendecor/",
  youtube: "https://www.youtube.com/@Aden_decor",
  facebook: "",
  tiktok: "https://www.tiktok.com/@yemen_decor_771258215",
  maps: "https://maps.app.goo.gl/6EwDsAe3HLmS1FNh7",
  location: "عدن — اليمن",
  hours: "Open 24 Hours",
  hoursAr: "مفتوح 24 ساعة",
};

export const HERO_IMAGE = heroImg;

export const ABOUT_IMAGE = aboutImg;

export const ABOUT_IMAGES = [
  aboutImg,
  aboutSlide2,
  aboutSlide3,
  aboutSlide4
];

export const PHILOSOPHY_IMAGE = philosophyBg;

export const NAV_LINKS = [
  { id: "hero", label: "الرئيسية" },
  {
    id: "services",
    label: "خدماتنا",
    subLinks: [
      { id: "interior", path: "/services/interior-design", label: "الديكور الداخلي والتشطيبات" },
      { id: "aluminum", path: "/services/aluminum-facades", label: "أعمال الألمنيوم والواجهات" },
      { id: "carpentry", path: "/services/custom-carpentry", label: "النجارة والديكور الخشبي المخصص" },
      { id: "commercial", path: "/services/commercial-medical", label: "المشاريع التجارية والطبية" },
      { id: "construction", path: "/services/insulation-waterproofing", label: "العوازل والترميم الإنشائي" }
    ]
  },
  { id: "portfolio", path: "/portfolio", label: "معرض الأعمال" },
  { id: "about", label: "من نحن" },
  { id: "contact", label: "اتصل بنا" },
];

export const SERVICES = [
  {
    id: "interior",
    title: "الديكور الداخلي والتشطيبات",
    subtitle: "Interior Design & Fit-Out",
    items: [
      { icon: "LayoutPanelTop", title: "تخطيط المساحات", desc: "نستغل كل متر في منزلك! نقدم حلولاً ذكية لتوزيع الأثاث والحركة لضمان الانسيابية والراحة، مع مراعاة أبعاد الفراغ لتحقيق توازن مثالي بين الجمال والوظيفة." },
      { icon: "PaintBucket", title: "أعمال الجبس", desc: "ديكورات جبسية فنية للأسقف والجدران بتصاميم كلاسيكية وعصرية فاخرة." },
      { icon: "Sofa", title: "تصميم غرف المعيشة", desc: "غرف معيشة عصرية وفاخرة تجمع بين الراحة والذوق الرفيع." },
      { icon: "BedDouble", title: "تصميم الغرف", desc: "غرف مصممة بعناية تعكس شخصية ساكنيها وتمنحهم الراحة المطلقة." },
      { icon: "Boxes", title: "تجهيز العقارات", desc: "تجهيز كامل للعقارات بأثاث ومفروشات ومستلزمات بأعلى المعايير." },
    ]
  },
  {
    id: "aluminum",
    title: "أعمال الألمنيوم والواجهات",
    subtitle: "Aluminum & Facades",
    items: [
      { icon: "RectangleHorizontal", title: "تصميم النوافذ", desc: "نوافذ فاخرة تجمع بين الإطلالة المثالية والعزل الحراري والأناقة المعمارية." },
      { icon: "Layers3", title: "ألوكوبوند", desc: "تنفيذ ألوكوبوند احترافي للواجهات الخارجية والداخلية بأعلى معايير الجودة." },
      { icon: "Building2", title: "ديكور الأسمنت الخارجي", desc: "تصاميم أسمنتية خارجية فنية تمنح الواجهات هوية معمارية فريدة." },
      { icon: "GlassWater", title: "الزجاج المعشّق", desc: "زجاج معشّق فني بنقوش وألوان كلاسيكية وعصرية لإضافة لمسة من الفن." },
      { icon: "Mountain", title: "تصميم الحجر والطوب والجبس", desc: "تصميم وتنفيذ واجهات وجدران بالحجر الطبيعي والطوب والجبس بلمسات فنية راقية." },
    ]
  },
  {
    id: "carpentry",
    title: "النجارة والديكور الخشبي المخصص",
    subtitle: "Custom Carpentry",
    items: [
      { icon: "Hammer", title: "أعمال الخشب", desc: "أعمال نجارة فاخرة بأخشاب نبيلة ولمسات يدوية دقيقة تخلّد التميّز." },
      { icon: "Trees", title: "التصميم الداخلي الخشبي", desc: "ديكورات خشبية داخلية فخمة تضفي دفئاً وعراقة على كل مساحة." },
    ]
  },
  {
    id: "commercial",
    title: "المشاريع التجارية والطبية",
    subtitle: "Commercial & Medical Projects",
    items: [
      { icon: "Briefcase", title: "تصميم المساحات المكتبية", desc: "بيئات عمل راقية تعزّز الإنتاجية وتعكس هوية علامتك التجارية." },
      { icon: "Utensils", title: "تصميم المطاعم", desc: "تصميم مطاعم فاخرة تخلق تجربة طعام لا تُنسى لروّاد المكان." },
    ]
  },
  {
    id: "construction",
    title: "العوازل والترميم الإنشائي",
    subtitle: "Waterproofing & Insulation",
    items: [
      { icon: "Construction", title: "البناء بالحجر", desc: "بناء حجري احترافي يعكس الأصالة المعمارية بأيدي خبرة تمتد لسنوات." },
      { icon: "Sparkles", title: "صقل وجلي الحجر", desc: "خدمات صقل وجلي الحجر الطبيعي والرخام لإحياء بريقها الأصلي وحمايتها." },
      { icon: "Home", title: "القرميد", desc: "تركيب القرميد للأسقف بمختلف الأنواع والألوان بإتقان وضمان طويل المدى." },
      { icon: "TreePine", title: "تجديد الحدائق", desc: "تصميم وتجديد الحدائق والمساحات الخارجية بلمسة طبيعية فاخرة." },
    ]
  }
];

export const PORTFOLIO = [
  {
    id: 1,
    title: "مجلس",
    category: "majlis",
    categoryLabel: "مجالس",
    description: "مجلس عصري بحائط هندسي مزود بإضاءة LED مدمجة، ثريا ذهبية حلقية، طاولات رخامية بإطارات ذهبية، ومفروشات بألوان رمادية وكحلية متناغمة.",
    materials: ["جبس بورد متعدد الطبقات", "إضاءة LED خفية", "رخام طبيعي", "خشب فاخر", "معادن ذهبية"],
    image: portfolioMajlisModern,
    featured: true,
  },
  {
    id: 2,
    title: "ديوان عربي",
    category: "majlis",
    categoryLabel: "مجالس",
    description: "ديوان عربي ضخم بسقف جبسي محفور بنقوش إسلامية، إضاءة خفية، مفروشات مخملية خضراء، طاولات خشبية فنية، وعناصر معمارية يمنية أصيلة.",
    materials: ["نقوش إسلامية", "مخمل أخضر", "خشب جوزي", "نحاس ذهبي", "رخام بني"],
    image: portfolioMajlisClassic,
    featured: true,
  },
  {
    id: 3,
    title: "ممر داخلي",
    category: "villas",
    categoryLabel: "فلل",
    description: "ممر كلاسيكي بقوالب جدارية احترافية (Boiserie)، إضاءة ذهبية جدارية أنيقة، وقطع فنية تجريدية. اللون الأبيض النقي يعكس النظافة والرقي.",
    materials: ["قوالب جبسية", "إضاءة جدارية نحاسية", "أرضيات خشبية", "مرايا فنية"],
    image: portfolioCorridorClassic,
    featured: true,
  },
  {
    id: 4,
    title: "شقة سكنية",
    category: "apartments",
    categoryLabel: "شقق",
    description: "تصميم داخلي متكامل لشقة سكنية يعتمد على الألوان الهادئة وتوظيف الإضاءة الطبيعية لزيادة اتساع المكان.",
    materials: ["بديل خشب", "أرضيات باركيه", "إضاءة مخفية"],
    image: interiorCardBg,
    featured: false,
  },
  {
    id: 5,
    title: "مكتب شركة",
    category: "offices",
    categoryLabel: "مكاتب",
    description: "تجهيز مكاتب إدارية بأعلى معايير الراحة والتقنية الحديثة، بما يعكس هوية الشركة المهنية.",
    materials: ["قواطع زجاجية", "ألمنيوم", "إضاءة سقفية"],
    image: officeDeskImg,
    featured: false,
  },
  {
    id: 6,
    title: "تصميم لمركز طبي",
    category: "medical",
    categoryLabel: "مشاريع طبية",
    description: "تنفيذ وتجهيز عيادة أسنان وفق الاشتراطات الصحية مع التركيز على بيئة مريحة للمرضى.",
    materials: ["أرضيات إيبوكسي", "ديكورات صحية", "عزل صوتي"],
    image: insulationCardBg,
    featured: false,
  },
  {
    id: 7,
    title: "تصميم لمحل تجاري",
    category: "commercial",
    categoryLabel: "مشاريع تجارية",
    description: "تنفيذ معرض تجاري بتوزيع إضاءة مدروس لإبراز المنتجات وتصميم واجهة زجاجية جذابة.",
    materials: ["زجاج سيكوريت", "ديكورات خشبية", "إضاءة مسارية"],
    image: aluminumCardBg,
    featured: false,
  },
  {
    id: 8,
    title: "أعمال داخلية",
    category: "interior",
    categoryLabel: "ديكورات وأعمال داخلية",
    description: "أعمال داخلية متكاملة تتميز بتكسيات خشبية أنيقة وجداريات عصرية، مع توزيع إضاءة مثالي لإبراز جماليات المساحة.",
    materials: ["تكسيات خشبية", "إضاءة مخفية", "ألوان دافئة"],
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1200&q=80",
    featured: true,
  },
  {
    id: 9,
    title: "غرفة نوم",
    category: "bedrooms",
    categoryLabel: "غرف نوم",
    description: "تصميم داخلي فاخر لغرفة نوم رئيسية يجمع بين الأناقة والراحة مع توزيع إضاءة مدروس.",
    materials: ["ديكورات خشبية", "إضاءة مخفية", "ألوان هادئة"],
    image: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80",
    featured: true,
  },
  {
    id: 10,
    title: "مكتب شخصي",
    category: "offices",
    categoryLabel: "مكاتب",
    description: "تصميم مكتب شخصي فاخر يجمع بين الراحة والإنتاجية مع ديكورات خشبية أنيقة.",
    materials: ["خشب فاخر", "إضاءة عصرية", "أثاث مريح"],
    image: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1200&q=80",
    featured: true,
  },
  {
    id: 11,
    title: "مطبخ حديث",
    category: "kitchens",
    categoryLabel: "المطابخ",
    description: "تصميم مطبخ حديث يجمع بين العملية والأناقة مع استغلال أمثل للمساحات وإضاءة مميزة.",
    materials: ["خزائن عصرية", "أسطح رخامية", "إضاءة مدمجة"],
    image: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=1200&q=80",
    featured: true,
  },
  {
    id: 12,
    title: "مكتب اداري",
    category: "offices",
    categoryLabel: "مكاتب",
    description: "تصميم مكتب إداري راقي يجمع بين الفخامة والعملية لتوفير بيئة عمل ملهمة.",
    materials: ["أثاث مكتبي فاخر", "تكسيات جدارية", "إضاءة متوازنة"],
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80",
    featured: true,
  },
];


export const CATEGORIES = [
  { id: "all", label: "الكل" },
  { id: "villas", label: "فلل" },
  { id: "majlis", label: "مجالس" },
  { id: "apartments", label: "شقق" },
  { id: "offices", label: "مكاتب" },
  { id: "commercial", label: "مشاريع تجارية" },
  { id: "medical", label: "مشاريع طبية" },
];

export const TESTIMONIALS = [
  {
    name: "Abdul Baqi Alnaqib",
    role: "Aden, Yemen",
    quote: "المهندس ماشاءالله تبارك الله رجل فهمان في شغله وملم بتفاصيل الاشياء ويقدم استشارت الله يوفقه لكل خير",
  },
  {
    name: "محمد أبو علياء",
    role: "Aden, Yemen",
    quote: "ماشاء الله عمله روعه",
  },
  {
    name: "Saleh Saad",
    role: "Aden, Yemen",
    quote: "مهندس واستشاري في جميع مجالات البناء. فن واتقان في العمل والتزام بالمواعيد المحددة وفقاً للمعايير المطلوبة مسبقاً. سُعدت بالتعامل معكم. كل الاحترام والتوفيق لشخصك الكريم.",
  },
  {
    name: "هائل سعيد",
    role: "Aden, Yemen",
    quote: "من الأعمال على الموقع تبدو ممتازة",
  },
];

export const TRUST_PILLARS = [
  { icon: "Layers", title: "حلول متكاملة تحت سقف واحد", desc: "نوفر جميع خدمات التصميم الداخلي، التشطيبات، والتنفيذ من خلال فريق متخصص، لتسهيل تنفيذ مشروعك دون الحاجة للتعامل مع عدة جهات." },
  { icon: "ShieldCheck", title: "جودة في التنفيذ والمواد", desc: "نعتمد على مواد عالية الجودة وتنفيذ احترافي يضمن نتائج تدوم وتلبي أعلى معايير التشطيب." },
  { icon: "Building2", title: "خبرة في المشاريع السكنية والتجارية والطبية", desc: "ننفذ الفلل، الشقق، المكاتب، المحلات، العيادات، والمشاريع التجارية وفق متطلبات كل مشروع." },
  { icon: "PencilRuler", title: "تصاميم عملية وعصرية", desc: "نقدم حلولاً تجمع بين الجمال، الوظيفة، والاستفادة المثلى من المساحات." },
  { icon: "Clock", title: "التزام بالمواعيد", desc: "نحرص على تنفيذ المشاريع وفق الجدول الزمني المتفق عليه مع متابعة دقيقة لكل مرحلة." },
  { icon: "MessageCircle", title: "استشارة مجانية قبل التنفيذ", desc: "نساعد عملاءنا على اختيار الحلول المناسبة لمشاريعهم قبل بدء التنفيذ لضمان أفضل النتائج." },
];

export const PROJECT_TYPES = [
  "الديكور الداخلي والتشطيبات",
  "أعمال الألمنيوم والواجهات",
  "أعمال النجارة والديكور الخشبي",
  "المشاريع التجارية والطبية",
  "العوازل والترميم الإنشائي",
  "أخرى"
];

export const BUDGETS = [
  "أقل من 50,000 $",
  "50,000 — 150,000 $",
  "150,000 — 500,000 $",
  "أكثر من 500,000 $",
];
