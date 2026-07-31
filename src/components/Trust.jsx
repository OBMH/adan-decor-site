import React from "react";
import { motion } from "framer-motion";
import {
  Layers, ShieldCheck, Building2, PencilRuler, Clock, MessageCircle, Gem
} from "lucide-react";
import { TRUST_PILLARS } from "../data/content";

const ICONS = { Layers, ShieldCheck, Building2, PencilRuler, Clock, MessageCircle, Gem };

export default function Trust() {
  return (
    <section
      id="trust"
      data-testid="trust-section"
      className="relative py-28 lg:py-40 bg-black overflow-hidden"
    >
      {/* Subtle gold glow */}
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(212,175,55,0.08) 0%, transparent 60%)" }} />

      <div className="relative max-w-[1400px] mx-auto px-6 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.9 }}
          className="text-center mb-20"
        >
          <h2
            data-testid="trust-headline"
            className="divider-ornament font-display text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight text-white max-w-3xl mx-auto"
          >
            <span>لماذا <span className="text-[#D4AF37]">عدن للديكور؟</span></span>
          </h2>
          <p className="mt-8 text-white/70 font-body text-lg max-w-4xl mx-auto leading-loose">
            نجمع بين الخبرة، جودة التنفيذ، والتصميم العصري لنقدم حلولاً متكاملة تلبي احتياجات المشاريع السكنية، التجارية، والطبية، مع الالتزام بأعلى معايير الجودة والدقة في كل مرحلة من مراحل التنفيذ.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-px bg-[#D4AF37]/10">
          {TRUST_PILLARS.map((p, i) => {
            const Icon = ICONS[p.icon] || Gem;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.8, delay: i * 0.08 }}
                data-testid={`trust-pillar-${i}`}
                className="bg-black p-10 lg:p-12 group hover:bg-[#0A0A0A] transition-colors duration-500"
              >
                <div className="flex flex-col gap-6 min-h-[260px]">
                  <Icon size={36} strokeWidth={1.2} className="text-[#D4AF37] group-hover:scale-110 transition-transform duration-500" />
                  <h3 className="font-display text-2xl font-bold text-white">{p.title}</h3>
                  <p className="font-body text-white/60 leading-loose">{p.desc}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
