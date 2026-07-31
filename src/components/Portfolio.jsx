import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PORTFOLIO } from "../data/content";
import SafeImage from "./SafeImage";
import { useSiteData } from "../contexts/SiteContext";

// Imported hero image from data/content (the same cinematic hero used on homepage or a similar luxury one)
import { HERO_IMAGE } from "../data/content"; 

const PORTFOLIO_CATEGORIES = [
  { id: "all", label: "الكل" },
  { id: "villas", label: "الفلل" },
  { id: "apartments", label: "الشقق السكنية" },
  { id: "majlis", label: "المجالس" },
  { id: "offices", label: "المكاتب" },
  { id: "commercial", label: "المشاريع التجارية" },
  { id: "medical", label: "المشاريع الطبية" },
  { id: "interior", label: "ديكورات واعمال داخلية" },
  { id: "bedrooms", label: "غرف نوم" },
  { id: "kitchens", label: "المطابخ" },
];

export default function Portfolio() {
  const { projects } = useSiteData();
  const portfolioList = projects?.length ? projects : PORTFOLIO;
  const [active, setActive] = useState("all");

  // Show all defined categories. If you want to filter out empty ones, you can.
  // We'll map them explicitly to ensure the requested ones always show (or at least map correctly)
  const availableCategories = useMemo(() => {
    const usedCats = new Set(portfolioList.map((p) => p.category));
    // Let's show all requested categories, even if empty for now, as requested by user.
    return PORTFOLIO_CATEGORIES.filter((c) => c.id === "all" || usedCats.has(c.id) || true); // Showing all as per explicit list requirement
  }, [portfolioList]);

  const items = active === "all" ? portfolioList : portfolioList.filter((p) => p.category === active);

  return (
    <>
      {/* --- HERO SECTION --- */}
      <section className="relative w-full h-[50vh] min-h-[400px] lg:h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <SafeImage
            src={HERO_IMAGE}
            alt="معرض أعمال عدن للديكور"
            className="w-full h-full object-cover object-center"
            fallbackType="hero"
            priority={true}
          />
          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-black/60 bg-gradient-to-t from-black via-black/40 to-transparent" />
        </div>
        
        <div className="relative z-10 text-center px-6 mt-16 lg:mt-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9 }}
            className="max-w-3xl mx-auto flex flex-col items-center"
          >
            <h1
              data-testid="portfolio-headline"
              className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight text-white mb-6"
            >
              معرض الأعمال
            </h1>
            <p className="text-white/80 font-body text-base lg:text-lg leading-relaxed">
              استعرض مجموعة من مشاريع عدن للديكور المنفذة، وتعرّف على جودة التنفيذ، ودقة التفاصيل، وتنوع الأعمال في مختلف القطاعات.
            </p>
          </motion.div>
        </div>
      </section>

      {/* --- PORTFOLIO CONTENT --- */}
      <section
        id="portfolio"
        data-testid="portfolio-section"
        className="relative py-16 lg:py-24 bg-black min-h-screen"
      >
        <div className="max-w-[1500px] mx-auto px-6 lg:px-12">
          
          {/* Filters */}
          <div className="flex flex-wrap justify-center gap-3 lg:gap-4 mb-16" data-testid="portfolio-filters">
            {PORTFOLIO_CATEGORIES.map((c) => (
              <button
                key={c.id}
                onClick={() => setActive(c.id)}
                data-testid={`portfolio-filter-${c.id}`}
                className={`px-6 py-3 rounded-full text-sm lg:text-base font-body font-medium transition-all duration-500 shadow-sm
                  ${
                    active === c.id
                      ? "bg-[#D4AF37] text-black border-2 border-[#D4AF37] shadow-[0_4px_20px_rgba(212,175,55,0.3)] scale-105"
                      : "bg-transparent text-white/70 border border-white/20 hover:border-[#D4AF37] hover:text-[#D4AF37] hover:bg-[#D4AF37]/5"
                  }
                `}
              >
                {c.label}
              </button>
            ))}
          </div>

          {/* Grid */}
          <motion.div
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10"
          >
            <AnimatePresence mode="popLayout">
              {items.map((item, i) => (
                <motion.div
                  key={`${item.id}_${i}`}
                  layout
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.6, delay: (i % 6) * 0.05 }}
                  data-testid={`portfolio-item-${item.id}`}
                  className="group relative overflow-hidden text-right aspect-[4/3] rounded-xl bg-[#111] border border-white/5 shadow-lg"
                >
                  <SafeImage
                    src={item.image || item.coverImage}
                    alt={item.title}
                    fallbackType="portfolio"
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    priority={i < 6}
                  />
                  
                  {/* Luxury Dark Overlay on Hover */}
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/70 transition-colors duration-500" />
                  
                  {/* Subtle Gradient from bottom always */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-90 group-hover:opacity-100 transition-opacity duration-500" />

                  <div className="absolute inset-0 p-6 lg:p-8 flex flex-col justify-end transform transition-transform duration-500">
                    <div className="flex flex-col gap-2">
                      <span className="font-en text-xs lg:text-sm text-[#D4AF37] font-medium tracking-wider opacity-90 block lg:translate-y-2 lg:group-hover:translate-y-0 transition-transform duration-500">
                        {item.categoryLabel || item.category_label || item.category}
                      </span>
                      <h3 className="font-display text-2xl lg:text-3xl font-bold text-white group-hover:text-[#D4AF37] transition-colors duration-300">
                        {item.title}
                      </h3>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            
            {items.length === 0 && (
              <div className="col-span-full py-20 text-center text-white/50 font-body text-lg">
                لا توجد مشاريع في هذا التصنيف حالياً.
              </div>
            )}
          </motion.div>
        </div>
      </section>
    </>
  );
}
