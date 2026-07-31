import React from "react";
import { WhatsAppIcon } from "./WhatsAppIcon";
import { motion } from "framer-motion";
import { BRAND } from "../data/content";
import { useSiteData } from "../contexts/SiteContext";

export default function FloatingWhatsApp() {
  const { brand: siteBrand } = useSiteData();
  const brand = siteBrand || BRAND;

  const num = (brand.whatsapp || BRAND.whatsapp).replace(/\D/g, "");
  const msg = brand.whatsappDefaultMsg || "مرحباً عدن للديكور، أرغب في حجز استشارة واستفسار";
  const link = `https://wa.me/${num}?text=${encodeURIComponent(msg)}`;

  return (
    <motion.a
      href={link}
      target="_blank"
      rel="noreferrer"
      data-testid="floating-whatsapp"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 1.5, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ scale: 1.08 }}
      className="fixed bottom-20 left-5 lg:bottom-6 lg:left-6 z-40 w-14 h-14 bg-[#D4AF37] flex items-center justify-center shadow-[0_0_40px_rgba(212,175,55,0.35)] group rounded-full"
      aria-label="WhatsApp"
    >
      <WhatsAppIcon size={26} className="text-black" />
      <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-[#D4AF37] border-2 border-black animate-ping" />
    </motion.a>
  );
}
