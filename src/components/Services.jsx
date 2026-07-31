import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { SERVICES, NAV_LINKS } from "../data/content";
import interiorCardBg from "../assets/images/interior_card_bg_1784515033104.jpg";
import aluminumCardBg from "../assets/images/aluminum_card_bg_1784516085266.jpg";
import carpentryCardBg from "../assets/images/carpentry_card_bg_1784516477737.jpg";
import commercialCardBg from "../assets/images/interior_card_bg_1784515033104.jpg";
import insulationCardBg from "../assets/images/insulation_card_bg_1784517415029.jpg";

const HARDCODED_IMAGES = {
  interior: interiorCardBg,
  aluminum: aluminumCardBg,
  carpentry: carpentryCardBg,
  commercial: commercialCardBg,
  construction: insulationCardBg
};

export default function Services() {
  const navigate = useNavigate();
  const configServices = [];

  const totalServices = SERVICES.reduce((acc, cat) => acc + cat.items.length, 0);

  // Find the sublinks for services
  const servicesSubLinks = NAV_LINKS.find(link => link.id === "services")?.subLinks || [];

  const handleSectorClick = (id) => {
    const link = servicesSubLinks.find(sub => sub.id === id);
    if (link && link.path) {
      window.scrollTo(0, 0);
      navigate(link.path);
    }
  };

  return (
    <section
      id="services"
      data-testid="services-section"
      className="relative py-28 lg:py-40 bg-black"
    >
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.9 }}
          className="text-center mb-20 lg:mb-28"
        >
          <h2
            data-testid="services-headline"
            className="divider-ornament font-display text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight text-[#D4AF37] mb-6"
          >
            خدماتنا الفاخرة
          </h2>
          <p className="max-w-2xl mx-auto text-white/60 font-body text-base sm:text-lg">
            نقدم مجموعة متكاملة من الخدمات التخصصية ، بمستوى عالٍ من الدقة والإتقان.
          </p>
        </motion.div>

        {/* Sectors Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {SERVICES.map((category, catIndex) => {
            // Find custom title and image from context
            const customItem = configServices.find(s => s.id === category.id) || {};
            const title = customItem.title || category.title;
            const bgImage = customItem.image || HARDCODED_IMAGES[category.id];

            return (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.8, delay: (catIndex % 3) * 0.1 }}
                onClick={() => handleSectorClick(category.id)}
                className="group relative overflow-hidden cursor-pointer bg-black border border-[#D4AF37]/20 p-10 rounded-sm hover:border-[#D4AF37]/40 hover:bg-[#D4AF37]/5 transition-all duration-500 flex flex-col justify-between min-h-[280px]"
              >
                {bgImage && (
                  <>
                    <div
                      className="absolute inset-0 bg-cover bg-center transition-opacity duration-500 opacity-70 group-hover:opacity-85"
                      style={{ backgroundImage: `url(${bgImage})` }}
                    />
                    <div className="absolute inset-0 bg-black/45 group-hover:bg-black/25 transition-colors duration-500" />
                  </>
                )}
                
                <div className="relative z-10 flex-1">
                  <div className="flex items-center justify-between mb-8">
                    <div className="w-10 h-10 flex items-center justify-center text-[#D4AF37]/40 font-display text-2xl">
                      0{catIndex + 1}
                    </div>
                    <div className="w-12 h-12 rounded-full border border-[#D4AF37]/20 flex items-center justify-center group-hover:border-[#D4AF37]/60 text-[#D4AF37] transition-all duration-500 overflow-hidden relative">
                      <ArrowLeft size={20} className="transform rotate-45 group-hover:rotate-0 group-hover:-translate-x-1 group-hover:text-white transition-all duration-500 relative z-10" />
                      <div className="absolute inset-0 bg-[#D4AF37] translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out" />
                    </div>
                  </div>

                  <h3 className="font-display text-2xl md:text-3xl font-bold text-white mb-4 group-hover:text-[#D4AF37] transition-colors duration-500">
                    {title}
                  </h3>

                  <p className="font-body text-white/60 text-sm leading-relaxed mb-8">
                    خدمات تخصصية شاملة تعكس التزامنا بالجودة والابتكار في هذا القطاع.
                  </p>
                </div>

                <div className="relative z-10 flex items-center gap-2 mt-auto pt-6 border-t border-white/5 group-hover:border-[#D4AF37]/30 transition-colors duration-500">
                  <span className="font-display text-sm text-[#D4AF37] opacity-70 group-hover:opacity-100 transition-opacity duration-500">
                    استعرض الخدمات →
                  </span>
                  <div className="w-6 h-[1px] bg-[#D4AF37]/40 group-hover:bg-[#D4AF37] group-hover:w-10 transition-all duration-500" />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
