import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ShieldCheck, PencilRuler, Clock, Sparkles, CheckCircle2, ArrowRight, ArrowLeft } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import { BRAND } from "@/data/content";
import { WhatsAppIcon } from "@/components/WhatsAppIcon";
import SafeImage from "@/components/SafeImage";

import interiorCardBg from "@/assets/images/interior_card_bg_1784515033104.jpg";
import aluminumCardBg from "@/assets/images/aluminum_card_bg_1784516085266.jpg";
import carpentryCardBg from "@/assets/images/carpentry_card_bg_1784516477737.jpg";
import commercialCardBg from "@/assets/images/interior_card_bg_1784515033104.jpg";
import insulationCardBg from "@/assets/images/insulation_card_bg_1784517415029.jpg";
import heroImg from "@/assets/images/luxury_interior_hero_1784488795242.jpg";
import aboutImg from "@/assets/images/luxury_interior_about_1784488806775.jpg";
import aboutSlide2 from "@/assets/images/luxury_about_slide2_1784490484658.jpg";
import aboutSlide3 from "@/assets/images/luxury_about_slide3_1784490498052.jpg";
import aboutSlide4 from "@/assets/images/luxury_about_slide4_1784490510728.jpg";
import portfolioMajlisModern from "@/assets/images/portfolio_majlis_modern_1784490542736.jpg";
import portfolioMajlisClassic from "@/assets/images/portfolio_majlis_classic_1784490556781.jpg";
import portfolioCorridorClassic from "@/assets/images/portfolio_corridor_classic_1784490570233.jpg";

const serviceData = {
  "interior-design": {
    title: "الديكور الداخلي والتشطيبات",
    subtitle: "Interior Design & Fit-Out",
    description: "نقدم حلولاً متكاملة للديكور الداخلي والتشطيبات الفاخرة التي تجمع بين الجمال والوظيفة لتعكس ذوقك الرفيع.",
    about: "قطاع الديكور الداخلي والتشطيبات في عدن للديكور يمثل جوهر الإبداع والتميز. نحن نهتم بأدق التفاصيل في تحويل الفراغات إلى مساحات تنبض بالحياة، باستخدام أحدث التقنيات وأجود المواد لضمان تنفيذ أعمال تتجاوز توقعات عملائنا، سواء في المشاريع السكنية أو التجارية.",
    heroImage: interiorCardBg,
    aboutImage: portfolioMajlisModern,
    gallery: [portfolioMajlisModern, portfolioMajlisClassic, portfolioCorridorClassic],
    subServices: [
      { id: "ceilings", title: "الأسقف المعلقة والديكورية", items: ["جبسمبورد", "جبس مغربي"] },
      { id: "wall-panels", title: "تكسيات الجدران", items: ["بديل شيبورد", "بديل رخام", "بديل خشب", "فوم"] },
      { id: "painting", title: "الدهانات والتشطيبات النهائية", items: [] },
      { id: "lighting", title: "أنظمة الإضاءة الحديثة", items: ["سبوت لايت", "داون لايت", "إضاءة مخفية", "LED Profile", "Magnetic Track"] }
    ],
    features: [
      { icon: ShieldCheck, title: "جودة لا تضاهى", desc: "نستخدم أفضل الخامات لضمان استدامة وجمال التنفيذ المتقن." },
      { icon: PencilRuler, title: "تصاميم مبتكرة", desc: "تصاميم عصرية وكلاسيكية تناسب جميع الأذواق وتستغل المساحات بذكاء." },
      { icon: Clock, title: "دقة في المواعيد", desc: "التزام كامل بتسليم المشاريع في الوقت المتفق عليه دون تأخير." },
      { icon: Sparkles, title: "إشراف هندسي متكامل", desc: "متابعة دقيقة لكل مرحلة لضمان التنفيذ بأعلى المعايير الهندسية." }
    ],
    process: [
      { step: "01", title: "المعاينة والاستشارة", desc: "نقوم بزيارة الموقع وتقديم استشارات هندسية مبدئية لفهم متطلباتك ورؤيتك بوضوح." },
      { step: "02", title: "التصميم والتخطيط", desc: "نعد المخططات الهندسية والتصاميم ثلاثية الأبعاد (3D) لتراها واقعاً قبل التنفيذ." },
      { step: "03", title: "التنفيذ والإشراف", desc: "يبدأ فريقنا بالتنفيذ تحت إشراف هندسي دقيق لضمان مطابقة التصميم وجودة العمل." },
      { step: "04", title: "التسليم النهائي", desc: "نسلمك المشروع جاهزاً ومطابقاً لأعلى معايير التشطيب الفاخر، لتستمتع بمساحتك الجديدة." }
    ]
  },
  "aluminum-facades": {
    title: "أعمال الألمنيوم والواجهات",
    subtitle: "Aluminum & Facades",
    description: "نصمم وننفذ أرقى واجهات الألمنيوم والزجاج التي تضفي طابعاً عصرية وقيمة جمالية وهندسية لمشروعك.",
    about: "يعتبر قطاع الألمنيوم والواجهات من أهم القطاعات التي تبرز هوية المبنى. في عدن للديكور، نوفر حلولاً مبتكرة للواجهات الزجاجية وأعمال الكلادنج والشبابيك، معتمدين على معايير الجودة العالمية لضمان العزل الحراري والصوتي والمظهر العصري الجذاب.",
    heroImage: aluminumCardBg,
    aboutImage: aluminumCardBg,
    gallery: [aluminumCardBg, heroImg, aboutSlide2],
    subServices: [
      { id: "windows", title: "شبابيك ألمنيوم", items: [] },
      { id: "doors", title: "أبواب ألمنيوم", items: [] },
      { id: "glass", title: "واجهات زجاجية", items: [] },
      { id: "cladding", title: "أعمال الكلادنج", items: [] }
    ],
    features: [
      { icon: ShieldCheck, title: "جودة وأمان", desc: "استخدام قطاعات ألمنيوم وزجاج عالي الجودة ومقاوم للعوامل الجوية." },
      { icon: PencilRuler, title: "تصاميم عصرية", desc: "واجهات زجاجية وكلادنج تعكس التطور وتضيف لمسة جمالية للمبنى." },
      { icon: Clock, title: "دقة التنفيذ", desc: "تركيب متقن يضمن العزل المائي والحراري والصوتي بأعلى المعايير." },
      { icon: Sparkles, title: "إشراف هندسي", desc: "متابعة دقيقة لضمان التنفيذ وفقاً للمواصفات الهندسية العالمية." }
    ],
    process: [
      { step: "01", title: "المعاينة وأخذ القياسات", desc: "زيارة الموقع لرفع المقاسات بدقة ودراسة المتطلبات الهندسية." },
      { step: "02", title: "التصميم والاعتماد", desc: "تقديم المخططات التفصيلية لاختيار القطاعات وألوان الكلادنج." },
      { step: "03", title: "التصنيع والتجهيز", desc: "تفصيل الألمنيوم والزجاج في ورشنا باستخدام أحدث التقنيات." },
      { step: "04", title: "التركيب والتسليم", desc: "تركيب الواجهات باحترافية عالية وتسليم المشروع بجودة تامة." }
    ]
  },
  "custom-carpentry": {
    title: "النجارة والديكور الخشبي المخصص",
    subtitle: "Custom Carpentry",
    description: "أعمال نجارة مخصصة وديكورات خشبية فريدة تلبي احتياجاتك وتضفي الدفء والأناقة على مساحاتك.",
    about: "نقدم في قطاع النجارة والديكور الخشبي أعمالاً فنية متقنة تُصنع خصيصاً لتلائم مساحتك. من الأبواب الفاخرة إلى الخزائن الجدارية والمكتبات، نستخدم أفضل أنواع الأخشاب لنضمن المتانة والجمال في كل قطعة ننتجها.",
    heroImage: carpentryCardBg,
    aboutImage: carpentryCardBg,
    gallery: [carpentryCardBg, portfolioMajlisClassic, aboutSlide3],
    subServices: [
      { id: "wooden-doors", title: "أبواب خشبية", items: [] },
      { id: "decor", title: "ديكورات خشبية ثابتة", items: [] },
      { id: "tv-units", title: "مكتبات التلفزيون", items: [] },
      { id: "cabinets", title: "خزائن الحائط", items: [] },
      { id: "bed-backs", title: "خلفيات السرير", items: [] },
      { id: "desks", title: "مكاتب العمل", items: [] }
    ],
    features: [
      { icon: ShieldCheck, title: "أخشاب فاخرة", desc: "انتقاء أفضل أنواع الأخشاب الطبيعية والصناعية لضمان المتانة والجمال." },
      { icon: PencilRuler, title: "تفصيل مخصص", desc: "تصنيع قطع فريدة تتناسب تماماً مع مساحتك وذوقك الخاص." },
      { icon: Sparkles, title: "تشطيبات راقية", desc: "دهانات ومعالجات خشبية عالية الجودة تبرز جمال الخشب وتحميه." },
      { icon: Clock, title: "التزام بالمواعيد", desc: "تسليم الأعمال الخشبية في الوقت المحدد مع الحفاظ على أعلى معايير الجودة." }
    ],
    process: [
      { step: "01", title: "الاستشارة والتصميم", desc: "فهم احتياجاتك وتقديم تصاميم أولية للقطع الخشبية المطلوبة." },
      { step: "02", title: "رفع المقاسات", desc: "زيارة الموقع لأخذ المقاسات الدقيقة واختيار نوع الخشب والتشطيب." },
      { step: "03", title: "التصنيع الحرفي", desc: "تنفيذ التصاميم في منجرتنا على أيدي حرفيين مهرة باستخدام معدات متطورة." },
      { step: "04", title: "التركيب النهائي", desc: "تركيب الأعمال الخشبية في الموقع بدقة واحترافية لضمان التكامل." }
    ]
  },
  "commercial-medical": {
    title: "المشاريع التجارية والطبية",
    subtitle: "Commercial & Medical Projects",
    description: "تصميم وتنفيذ المشاريع التجارية والطبية بمعايير عالمية تضمن الكفاءة التشغيلية وتجربة مستخدم مريحة.",
    about: "ندرك في قطاع المشاريع التجارية والطبية أهمية توفير بيئة عمل مريحة ومطابقة للاشتراطات الصحية والمهنية. نقدم خدمات متكاملة لتجهيز العيادات، المكاتب، والمعارض التجارية بأعلى معايير الجودة، مع التركيز على الاستغلال الأمثل للمساحات.",
    heroImage: commercialCardBg,
    aboutImage: commercialCardBg,
    gallery: [commercialCardBg, portfolioCorridorClassic, aboutSlide4],
    subServices: [
      { id: "offices", title: "تصميم وتنفيذ المكاتب والشركات", items: [] },
      { id: "shops", title: "المحلات والمعارض التجارية", items: [] },
      { id: "clinics", title: "العيادات والمشاريع الطبية", items: [] }
    ],
    features: [
      { icon: PencilRuler, title: "استغلال المساحات", desc: "تصميم ذكي يعظم الاستفادة من المساحات لتحقيق الكفاءة التشغيلية." },
      { icon: ShieldCheck, title: "معايير صحية", desc: "تنفيذ دقيق يطابق اشتراطات الأمن والسلامة للمعايير الصحية." },
      { icon: Sparkles, title: "هوية بصرية متكاملة", desc: "تصاميم تعكس هوية علامتك التجارية وتوفر تجربة مميزة للعملاء." },
      { icon: Clock, title: "إدارة احترافية", desc: "تنفيذ المشاريع ضمن الجدول الزمني والميزانية المحددة لضمان سرعة التشغيل." }
    ],
    process: [
      { step: "01", title: "دراسة المشروع", desc: "تحليل نشاطك التجاري أو الطبي لفهم المتطلبات التشغيلية والهوية البصرية." },
      { step: "02", title: "التصميم وتوزيع المساحات", desc: "إعداد مخططات تفصيلية تضمن سهولة الحركة والجماليات." },
      { step: "03", title: "التنفيذ المتكامل", desc: "تولي كافة أعمال التشطيب والتجهيز باحترافية ووفقاً للجدول الزمني." },
      { step: "04", title: "التسليم والتشغيل", desc: "تسليم المشروع جاهزاً بالكامل للبدء في استقبال عملائك بنجاح." }
    ]
  },
  "insulation-waterproofing": {
    title: "العوازل والترميم الإنشائي",
    subtitle: "Waterproofing & Insulation",
    description: "حلول متقدمة للعوازل المائية والحرارية والترميم الإنشائي لضمان حماية وسلامة مبناك على المدى الطويل.",
    about: "قطاع العوازل والترميم الإنشائي يهدف إلى حماية المباني من العوامل الجوية وإطالة عمرها الافتراضي. نستخدم أحدث التقنيات في العزل المائي والحراري والصوتي، بالإضافة إلى أنظمة الإيبوكسي المتطورة، لضمان بيئة آمنة وصحية ومستدامة.",
    heroImage: insulationCardBg,
    aboutImage: insulationCardBg,
    gallery: [insulationCardBg, aboutImg, portfolioMajlisModern],
    subServices: [
      { id: "water", title: "العزل المائي", items: [] },
      { id: "roofs", title: "عزل الأسطح والأسقف", items: [] },
      { id: "tanks", title: "عزل خزانات المياه", items: [] },
      { id: "thermal", title: "العزل الحراري", items: [] },
      { id: "sound", title: "العزل الصوتي", items: [] },
      { id: "epoxy", title: "أنظمة الإيبوكسي", items: ["إيبوكسي صناعي", "إيبوكسي طبي", "إيبوكسي ديكوري"] },
      { id: "cracks", title: "ترميم ومعالجة التشققات", items: [] },
      { id: "facades", title: "ترميم الواجهات", items: [] },
      { id: "polishing", title: "جلي البلاط وتلميعه", items: [] }
    ],
    features: [
      { icon: ShieldCheck, title: "حماية متكاملة", desc: "حلول عزل متطورة تحمي مبناك من تسربات المياه والحرارة." },
      { icon: Sparkles, title: "مواد معتمدة", desc: "استخدام أحدث مواد العزل المطابقة للمواصفات العالمية." },
      { icon: Clock, title: "استدامة وضمان", desc: "تنفيذ احترافي يطيل العمر الافتراضي للمبنى مع تقديم ضمانات." },
      { icon: PencilRuler, title: "كفاءة وحرفية", desc: "فريق متخصص في معالجة التشققات والترميم الجذري للعيوب الإنشائية." }
    ],
    process: [
      { step: "01", title: "الفحص والاختبار", desc: "فحص المبنى لتحديد أماكن التسرب أو التشققات بدقة وتقييم الهيكل." },
      { step: "02", title: "اختيار الحل الأنسب", desc: "تحديد نوع العزل أو طريقة الترميم المناسبة وتقديم خطة عمل." },
      { step: "03", title: "التنفيذ والمعالجة", desc: "تطبيق مواد العزل أو أعمال الترميم بخطوات فنية مدروسة." },
      { step: "04", title: "الاختبار والتسليم", desc: "إجراء اختبارات نهائية للتأكد من فعالية العزل ومتانة الترميم قبل التسليم." }
    ]
  }
};

export default function ServiceTemplate() {
  const { serviceId } = useParams();
  const navigate = useNavigate();

  const data = serviceData[serviceId] || {
    title: "عنوان الخدمة",
    subtitle: "Service Template",
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [serviceId]);

  // Now ALL services use the "InteriorPrototype" structure natively, 
  // without the old structure.

  return (
    <div className="min-h-screen bg-black text-white" dir="rtl">
      <Navbar />
      
      <main className="pt-24 lg:pt-32">
        {/* 1. Hero Section */}
        <section className="relative py-24 lg:py-32 overflow-hidden border-b border-[#D4AF37]/20">
          <div className="absolute inset-0">
            <SafeImage
              src={data.heroImage}
              alt={data.title}
              className="w-full h-full object-cover opacity-30"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent" />
          </div>
          
          <div className="max-w-[1400px] mx-auto px-6 lg:px-12 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-4xl"
            >
              <div className="flex items-center gap-4 mb-6">
                <span className="w-12 h-[1px] bg-[#D4AF37]" />
                <span className="font-en text-[#D4AF37] tracking-[0.2em] text-sm uppercase">{data.subtitle}</span>
              </div>
              <h1 className="font-display text-4xl sm:text-5xl lg:text-7xl font-bold mb-8 text-white leading-tight">
                {data.title}
              </h1>
              <p className="text-white/70 font-body text-xl leading-relaxed mb-12 max-w-2xl">
                {data.description}
              </p>
            </motion.div>
          </div>
        </section>

        {/* 2. نبذة عن القطاع */}
        <section className="py-24">
          <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <div className="flex items-center gap-4 mb-6">
                  <span className="text-[#D4AF37] font-display text-2xl">عن الخدمة</span>
                  <span className="flex-1 h-[1px] bg-[#D4AF37]/20" />
                </div>
                <h2 className="font-display text-3xl sm:text-4xl font-bold text-white mb-8 leading-snug">
                  نصمم الفخامة لتلائم أسلوب حياتك
                </h2>
                <div className="text-white/60 font-body space-y-6 leading-relaxed text-lg">
                  <p>{data.about}</p>
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="relative"
              >
                <div className="absolute -inset-4 border border-[#D4AF37]/20 rounded-sm translate-x-4 translate-y-4" />
                <div className="aspect-[4/5] relative rounded-sm overflow-hidden z-10 shadow-2xl">
                  <SafeImage
                    src={data.aboutImage}
                    alt={data.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* 6. معرض الأعمال */}
        <section className="py-24">
          <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
              <div className="max-w-2xl">
                <h2 className="font-display text-3xl sm:text-4xl font-bold text-white mb-6">أعمالنا تتحدث عنا</h2>
                <p className="text-white/60 font-body text-lg">نماذج من مشاريعنا المنفذة التي تعكس مستوى الجودة والاهتمام بالتفاصيل.</p>
              </div>
            </div>
            
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {(data.gallery || []).map((imgSrc, itemIdx) => (
                <motion.div 
                  key={itemIdx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: itemIdx * 0.1 }}
                  className="group relative aspect-[4/5] rounded-sm overflow-hidden shadow-2xl bg-black border border-white/5"
                >
                  <SafeImage
                    src={imgSrc}
                    alt={`مشروع ${itemIdx + 1}`}
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80 group-hover:opacity-60 transition-opacity duration-500" />
                  <div className="absolute bottom-6 right-6 left-6 z-10 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                    <p className="font-display text-lg font-bold text-white mb-2">مشروع منفذ</p>
                    <p className="text-[#D4AF37] font-body text-sm">{data.title}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* 4. الخدمات الفرعية */}
        {data.subServices && data.subServices.length > 0 && (
          <section className="py-24 bg-[#D4AF37]/5 border-y border-[#D4AF37]/10">
            <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
                <div className="max-w-2xl">
                  <h2 className="font-display text-3xl sm:text-4xl font-bold text-white mb-6">مجالات اختصاصنا</h2>
                  <p className="text-white/60 font-body text-lg">نقدم مجموعة متكاملة من الخدمات التخصصية لضمان تنفيذ مشروعك بالكامل تحت سقف واحد.</p>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
                {data.subServices.map((sub, idx) => (
                  <motion.div 
                    key={sub.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                    className="group relative overflow-hidden bg-black border border-[#D4AF37]/20 p-10 rounded-sm hover:border-[#D4AF37]/50 transition-colors"
                  >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[#D4AF37]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    
                    <h3 className="font-display text-2xl font-bold text-[#D4AF37] mb-6">{sub.title}</h3>
                    
                    {sub.items && sub.items.length > 0 ? (
                      <ul className="grid grid-cols-2 gap-4 text-white/70 font-body text-sm">
                        {sub.items.map((item, i) => (
                          <li key={i} className="flex items-center gap-3">
                            <CheckCircle2 size={16} className="text-[#D4AF37]/60" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-white/50 font-body">تطبيقات متكاملة وحلول مخصصة تناسب كافة المتطلبات.</p>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* 3. مميزات الخدمة */}
        {data.features && (
          <section className="py-24">
            <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
              <div className="text-center max-w-2xl mx-auto mb-16">
                <h2 className="font-display text-3xl sm:text-4xl font-bold text-white mb-6">لماذا تختار خدماتنا؟</h2>
                <p className="text-white/60 font-body text-lg">نسعى دائماً لتقديم الأفضل من خلال معايير جودة صارمة واهتمام بأدق التفاصيل.</p>
              </div>
              
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {data.features.map((feat, idx) => {
                  const Icon = feat.icon;
                  return (
                    <motion.div 
                      key={idx}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: idx * 0.1 }}
                      className="bg-black border border-[#D4AF37]/20 p-8 rounded-sm hover:border-[#D4AF37]/50 transition-colors group"
                    >
                      <div className="w-14 h-14 bg-[#D4AF37]/10 rounded-full flex items-center justify-center mb-6 text-[#D4AF37] group-hover:bg-[#D4AF37] group-hover:text-black transition-colors">
                        <Icon size={24} />
                      </div>
                      <h3 className="font-display text-xl font-bold text-white mb-4">{feat.title}</h3>
                      <p className="text-white/60 font-body text-sm leading-relaxed">{feat.desc}</p>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        {/* 5. مراحل تنفيذ الخدمة */}
        {data.process && (
          <section className="py-24 bg-[#D4AF37]/5 border-y border-[#D4AF37]/10 relative overflow-hidden">
            <div className="max-w-[1400px] mx-auto px-6 lg:px-12 relative z-10">
              <div className="text-center max-w-2xl mx-auto mb-20">
                <h2 className="font-display text-3xl sm:text-4xl font-bold text-white mb-6">مراحل تنفيذ الخدمة</h2>
                <p className="text-white/60 font-body text-lg">منهجية عمل واضحة تضمن لك الشفافية والراحة في كل خطوة من المشروع.</p>
              </div>

              <div className="grid md:grid-cols-4 gap-8 relative">
                {/* Connecting Line */}
                <div className="hidden md:block absolute top-12 right-0 left-0 h-[1px] bg-[#D4AF37]/20" />
                
                {data.process.map((step, idx) => (
                  <motion.div 
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                    className="relative z-10"
                  >
                    <div className="w-24 h-24 mx-auto bg-black border border-[#D4AF37] rounded-full flex items-center justify-center mb-8 shadow-[0_0_30px_rgba(212,175,55,0.1)]">
                      <span className="font-display text-3xl text-[#D4AF37]">{step.step}</span>
                    </div>
                    <div className="text-center">
                      <h3 className="font-display text-xl font-bold text-white mb-4">{step.title}</h3>
                      <p className="text-white/60 font-body text-sm leading-relaxed">{step.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* 7. Call To Action המطور */}
        <section className="py-32 relative overflow-hidden">
          <div className="absolute inset-0">
            <SafeImage
              src={data.heroImage}
              alt={data.title}
              className="w-full h-full object-cover opacity-20 filter grayscale"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black via-black/90 to-black" />
          </div>
          <div className="max-w-[800px] mx-auto px-6 text-center relative z-10">
            <div className="w-20 h-20 mx-auto border border-[#D4AF37]/30 rounded-full flex items-center justify-center mb-8">
              <WhatsAppIcon size={32} className="text-[#D4AF37]" />
            </div>
            <h2 className="font-display text-4xl sm:text-5xl font-bold text-white mb-8 leading-tight">
              هل أنت مستعد لبدء مشروعك؟
            </h2>
            <p className="font-body text-white/60 mb-12 text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed">
              تواصل معنا الآن للحصول على استشارة مجانية وعرض سعر مخصص لمشروعك. نحن هنا لتحويل أفكارك إلى واقع يفوق توقعاتك.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <button 
                onClick={async () => {
                  const { trackAnalyticsEvent } = await import('@/utils/analytics');
                  await trackAnalyticsEvent('consultation_click', { source: 'service_cta_enhanced', service: data.title });
                  navigate('/#contact');
                }}
                className="w-full sm:w-auto px-10 py-5 bg-[#D4AF37] text-black font-bold text-lg flex items-center justify-center gap-3 hover:bg-[#C5A030] transition-colors rounded-sm"
              >
                احصل على استشارة مجانية
              </button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <FloatingWhatsApp />
    </div>
  );
}
