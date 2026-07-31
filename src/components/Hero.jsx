import React from "react";
import { motion } from "framer-motion";
import { HERO_IMAGE, BRAND } from "../data/content";
import SafeImage from "./SafeImage";
import { useNavigate } from "react-router-dom";
import { trackAnalyticsEvent } from "../utils/analytics";
import { useSiteData } from "../contexts/SiteContext";

export default function Hero() {
  const navigate = useNavigate();
  const { pageConfig, brand: siteBrand } = useSiteData();
  const brand = siteBrand || BRAND;
  const heroConfig = pageConfig?.homePage?.hero || {};

  const headlinePart1 = heroConfig.headlinePart1 || "نصمم الفخامة...";
  const headlinePart2 = heroConfig.headlinePart2 || "وننفذها بإتقان.";
  const titleText = heroConfig.title || `${headlinePart1}\n${headlinePart2}`;
  
  const titleLines = titleText.includes("\n") 
    ? titleText.split("\n") 
    : [headlinePart1, headlinePart2];

  const subtitle = heroConfig.subtitle || "حلول متكاملة في التصميم الداخلي، التشطيبات، الواجهات، والأعمال المتخصصة، لتحول رؤيتك إلى واقع يجمع بين الجمال والجودة والدقة.";
  const ctaPrimaryText = heroConfig.ctaPrimaryText || "اطلب استشارة مجانية";
  const ctaSecondaryText = heroConfig.ctaSecondaryText || "شاهد أعمالنا";
  const bgImage = heroConfig.backgroundImage || HERO_IMAGE;

  const handleConsultationClick = async () => {
    await trackAnalyticsEvent('consultation_click', { source: 'hero_button' });
    const el = document.getElementById("contact");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      navigate("/#contact");
    }
  };

  return (
    <section
      id="hero"
      data-testid="hero-section"
      className="relative min-h-screen w-full overflow-hidden flex items-center justify-center pt-24 pb-16"
    >
      {/* Background image & Overlay */}
      <div className="absolute inset-0 bg-black">
        <SafeImage
          src={bgImage}
          alt="Adan Decor luxury interior"
          fallbackType="hero"
          loading="eager"
          fetchPriority="high"
          className="w-full h-full object-cover object-center brightness-90 contrast-105"
        />
        <div className="absolute inset-0 bg-black/60" />
      </div>

      {/* Decorative gold corner frames */}
      <div className="absolute top-28 right-8 lg:right-16 w-24 h-24 border-t border-r border-[#D4AF37]/40 z-20 hidden md:block" />

      {/* Content Container */}
      <div className="relative z-30 w-full max-w-5xl mx-auto px-6 py-12 flex flex-col items-center justify-center text-center">
        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          data-testid="hero-headline"
          className="font-display font-extrabold leading-[1.2] sm:leading-[1.2] lg:leading-[1.25] mb-6 tracking-tight drop-shadow-2xl"
        >
          <span className="block text-white text-4xl sm:text-6xl lg:text-7xl mb-2 sm:mb-3">{titleLines[0]}</span>
          <span className="block text-[#D4AF37] text-4xl sm:text-6xl lg:text-7xl">{titleLines[1] || titleLines[0]}</span>
        </motion.h1>

        {/* Description - Slightly increased size for improved legibility */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.5 }}
          data-testid="hero-sub"
          className="font-body text-base sm:text-xl lg:text-[1.35rem] text-white/90 max-w-2xl sm:max-w-3xl mx-auto mb-10 leading-relaxed sm:leading-loose drop-shadow-md"
        >
          {subtitle}
        </motion.p>

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.8 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-xs sm:max-w-none"
        >
          <button
            onClick={handleConsultationClick}
            data-testid="hero-cta-primary"
            className="hero-cta-interactive bg-[#D4AF37] text-black font-body font-bold text-base sm:text-lg px-8 py-3.5 w-full sm:w-[260px] text-center rounded-none"
          >
            {ctaPrimaryText}
          </button>
          <button
            onClick={() => {
              navigate("/portfolio");
              window.scrollTo(0, 0);
            }}
            data-testid="hero-cta-secondary"
            className="border border-[#D4AF37] text-[#D4AF37] bg-black/40 hover:bg-[#D4AF37]/15 font-body font-bold text-base sm:text-lg px-8 py-3.5 w-full sm:w-[260px] transition-all duration-300 active:scale-95 text-center rounded-none"
          >
            {ctaSecondaryText}
          </button>
        </motion.div>
      </div>
    </section>
  );
}

