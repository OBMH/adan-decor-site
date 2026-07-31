import React from "react";
import { motion } from "framer-motion";
import { PHILOSOPHY_IMAGE } from "../data/content";
import SafeImage from "./SafeImage";

export default function Philosophy() {
  return (
    <section
      id="philosophy"
      data-testid="philosophy-section"
      className="relative py-32 lg:py-48 overflow-hidden"
    >
      {/* Background image */}
      <div className="absolute inset-0">
        <SafeImage
          src={PHILOSOPHY_IMAGE}
          alt="Design philosophy"
          fallbackType="philosophy"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/80" />
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black/70 to-black" />
      </div>

      <div className="relative max-w-[1100px] mx-auto px-6 lg:px-12 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 1 }}
        >
          <div className="divider-ornament mb-10">
            <span className="eyebrow">فلسفتنا في التصميم</span>
          </div>

          <motion.blockquote
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            data-testid="philosophy-quote"
            className="font-display text-2xl sm:text-3xl lg:text-5xl leading-loose lg:leading-[1.7] text-white max-w-4xl mx-auto"
          >
            «نؤمن أن التصميم ليس مجرد شكل جمالي،
            <br className="hidden sm:block" />
            بل <span className="text-[#D4AF37]">تجربة متكاملة</span> تعكس أسلوب الحياة والرقي.
            <br className="hidden sm:block" />
            لذلك نصنع مساحات تجمع بين الوظيفة، الفخامة،
            <br className="hidden sm:block" />
            والهوية البصرية المتناسقة.»
          </motion.blockquote>

          <div className="mt-12 flex flex-col items-center gap-3">
            <div className="gold-line-vertical" />
            <span className="font-en text-xs text-[#D4AF37] tracking-[0.4em]">ADAN DECOR</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
