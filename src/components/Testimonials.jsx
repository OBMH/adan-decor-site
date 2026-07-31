import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Quote, ChevronLeft, ChevronRight } from "lucide-react";
import { TESTIMONIALS } from "../data/content";
import { useSiteData } from "../contexts/SiteContext";

export default function Testimonials() {
  const { testimonials: contextTestimonials } = useSiteData();
  const list = contextTestimonials?.length ? contextTestimonials : TESTIMONIALS;
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    if (idx >= list.length) setIdx(0);
  }, [list.length, idx]);

  useEffect(() => {
    if (!list.length) return;
    const t = setInterval(() => setIdx((i) => (i + 1) % list.length), 6000);
    return () => clearInterval(t);
  }, [list.length]);

  const next = () => setIdx((i) => (i + 1) % list.length);
  const prev = () => setIdx((i) => (i - 1 + list.length) % list.length);

  const t = list[idx] || list[0] || { quote: "", name: "", role: "" };

  return (
    <section
      id="testimonials"
      data-testid="testimonials-section"
      className="relative py-28 lg:py-40 bg-[#050505] overflow-hidden"
    >
      <div className="max-w-[1100px] mx-auto px-6 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9 }}
          className="text-center mb-16"
        >
          <h2
            data-testid="testimonials-headline"
            className="divider-ornament font-display text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight text-white"
          >
            <span>ماذا يقول <span className="text-[#D4AF37]">عملاؤنا؟</span></span>
          </h2>
          <p className="mt-6 text-white/70 font-body text-lg max-w-3xl mx-auto leading-loose">
            نفخر بثقة عملائنا، وهذه بعض تجاربهم بعد تنفيذ مشاريعهم مع عدن للديكور.
          </p>
        </motion.div>

        <div className="relative">
          <Quote
            size={120}
            strokeWidth={0.5}
            className="absolute -top-8 right-0 text-[#D4AF37]/10 hidden lg:block"
          />

          <AnimatePresence mode="wait">
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.6 }}
              data-testid={`testimonial-${idx}`}
              className="glass p-10 lg:p-16 text-center relative"
            >
              {/* Gold corners */}
              <div className="absolute top-0 right-0 w-8 h-8 border-t border-r border-[#D4AF37]" />
              <div className="absolute top-0 left-0 w-8 h-8 border-t border-l border-[#D4AF37]" />
              <div className="absolute bottom-0 right-0 w-8 h-8 border-b border-r border-[#D4AF37]" />
              <div className="absolute bottom-0 left-0 w-8 h-8 border-b border-l border-[#D4AF37]" />

              <p className="font-display text-2xl sm:text-3xl lg:text-4xl text-white leading-loose mb-10">
                «{t.quote}»
              </p>
              <div className="flex flex-col items-center gap-2">
                <div className="gold-line mb-3" />
                <div className="font-display text-xl text-[#D4AF37]">{t.name}</div>
                <div className="font-en text-xs text-white/50 tracking-[0.2em]">{t.role}</div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Controls */}
          <div className="flex items-center justify-center gap-6 mt-10">
            <button
              onClick={prev}
              data-testid="testimonial-prev"
              className="w-12 h-12 border border-[#D4AF37]/30 flex items-center justify-center hover:border-[#D4AF37] hover:bg-[#D4AF37]/10 transition-all duration-300"
              aria-label="السابق"
            >
              <ChevronRight size={20} className="text-[#D4AF37]" />
            </button>
            <div className="flex gap-2" data-testid="testimonial-indicators">
              {list.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setIdx(i)}
                  data-testid={`testimonial-dot-${i}`}
                  className={`h-1 transition-all duration-500 ${
                    i === idx ? "w-10 bg-[#D4AF37]" : "w-4 bg-[#D4AF37]/20"
                  }`}
                  aria-label={`Go to testimonial ${i + 1}`}
                />
              ))}
            </div>
            <button
              onClick={next}
              data-testid="testimonial-next"
              className="w-12 h-12 border border-[#D4AF37]/30 flex items-center justify-center hover:border-[#D4AF37] hover:bg-[#D4AF37]/10 transition-all duration-300"
              aria-label="التالي"
            >
              <ChevronLeft size={20} className="text-[#D4AF37]" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
