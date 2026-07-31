import React from "react";
import { motion } from "framer-motion";
import { ABOUT_IMAGES } from "../data/content";
import SafeImage from "./SafeImage";
import { useSiteData } from "../contexts/SiteContext";

const fadeUp = {
  hidden: { opacity: 0, y: 50 },
  show: { opacity: 1, y: 0, transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] } },
};

export default function About() {
  const { pageConfig } = useSiteData();
  const aboutConfig = pageConfig?.aboutPage || {};

  const displayEyebrow = "من نحن";
  const displayTitle = (aboutConfig.title && aboutConfig.title !== "من نحن")
    ? aboutConfig.title
    : "حلول متكاملة للتصميم والتنفيذ";

  const mainImage = aboutConfig.mainImage || ABOUT_IMAGES[0];

  return (
    <section
      id="about"
      data-testid="about-section"
      className="relative py-28 lg:py-40 bg-black overflow-hidden"
    >
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, scale: 1.05 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
            className="relative"
          >
            <div className="relative aspect-[3/4] overflow-hidden">
              <SafeImage
                src={mainImage}
                alt="Adan Decor signature project"
                fallbackType="about"
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/10 bg-gradient-to-t from-black/50 to-transparent z-10" />
            </div>
            
            {/* Gold corner frame */}
            <div className="absolute -top-4 -right-4 w-24 h-24 border-t border-r border-[#D4AF37] z-20" />
            <div className="absolute -bottom-4 -left-4 w-24 h-24 border-b border-l border-[#D4AF37] z-20" />
          </motion.div>

          {/* Content */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
          >
            <div className="flex items-center gap-3 mb-6">
              <span className="h-[2px] w-20 sm:w-32 bg-gradient-to-r from-transparent via-[#D4AF37] to-[#D4AF37] inline-block rounded-full" />
              <span className="eyebrow text-[#D4AF37] text-base sm:text-lg font-bold tracking-wider" data-testid="about-eyebrow">
                {displayEyebrow}
              </span>
            </div>

            <h2
              data-testid="about-headline"
              className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-[1.25] mb-8"
            >
              {displayTitle.includes("حلول متكاملة") && displayTitle.includes("للتصميم والتنفيذ") ? (
                <>
                  <span className="text-white block">حلول متكاملة</span>
                  <span className="text-[#D4AF37] block">للتصميم والتنفيذ</span>
                </>
              ) : (
                <span className="text-[#D4AF37] block">{displayTitle}</span>
              )}
            </h2>

            <div className="space-y-6 sm:space-y-7 font-body">
              {/* Paragraph 1 with gold bold highlight for "في عدن للديكور،" */}
              <p className="text-zinc-200 text-base sm:text-lg lg:text-xl leading-relaxed sm:leading-loose">
                {(() => {
                  const p1 = aboutConfig.paragraph1 || "في عدن للديكور، نقدم حلولاً متكاملة في التصميم الداخلي، التشطيبات، وأعمال التنفيذ، مع التزام كامل بأعلى معايير الجودة والدقة في كل مشروع.";
                  const prefix = "في عدن للديكور،";
                  if (p1.startsWith(prefix)) {
                    return (
                      <>
                        <span className="text-[#D4AF37] font-bold text-base sm:text-lg lg:text-xl inline-block ml-1">{prefix}</span>
                        {p1.slice(prefix.length)}
                      </>
                    );
                  }
                  if (p1.startsWith("في عدن للديكور")) {
                    return (
                      <>
                        <span className="text-[#D4AF37] font-bold text-base sm:text-lg lg:text-xl inline-block ml-1">في عدن للديكور</span>
                        {p1.slice("في عدن للديكور".length)}
                      </>
                    );
                  }
                  return p1;
                })()}
              </p>

              {/* Paragraph 2 */}
              <p className="text-zinc-300 font-normal text-base sm:text-lg lg:text-xl leading-relaxed sm:leading-loose">
                {aboutConfig.paragraph2 || "تشمل خدماتنا الديكور الداخلي، أعمال الجبس، تكسيات الجدران، أنظمة الإضاءة الحديثة، أعمال الألومنيوم والواجهات، النجارة المخصصة، المشاريع التجارية والطبية، بالإضافة إلى أنظمة العزل والترميم، لنقدم لعملائنا حلولاً متكاملة تحت سقف واحد."}
              </p>

              {/* Paragraph 3 */}
              <p className="text-zinc-300 font-normal text-base sm:text-lg lg:text-xl leading-relaxed sm:leading-loose">
                {aboutConfig.paragraph3 || "نعتمد على فريق متخصص، ومواد عالية الجودة، وتنفيذ احترافي يراعي أدق التفاصيل، لنحول الأفكار إلى مساحات عملية وأنيقة تلبي تطلعات عملائنا وتمنحهم قيمة تدوم."}
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

