import React, { useState } from "react";
import { motion } from "framer-motion";
import { Phone, Instagram, Youtube, Send, Facebook, MapPin } from "lucide-react";
import { WhatsAppIcon } from "./WhatsAppIcon";
import { BRAND } from "../data/content";
import { useSiteData } from "../contexts/SiteContext";
import { trackAnalyticsEvent } from "../utils/analytics";

const TikTokIcon = ({ size = 20, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className} xmlns="http://www.w3.org/2000/svg">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5.8 20.1a6.34 6.34 0 0 0 10.86-4.43V8.79a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1.84-.22z"/>
  </svg>
);

const SnapchatIcon = ({ size = 20, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className} xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2.1c-3.8 0-6.2 2.6-6.2 5.5 0 .9.2 1.8.6 2.6-.4.2-1.1.5-1.5.8-.3.2-.5.5-.4.8.2.6.9.8 1.4.6.2.8.5 1.6.9 2.4-1.3.4-2.5 1.3-2.3 2.6.2 1.2 1.7 1.6 3.1 1.7.5 1.2 1.8 1.8 3.5 1.8 1.7 0 3-.6 3.5-1.8 1.4-.1 2.9-.5 3.1-1.7.2-1.3-1-2.2-2.3-2.6.4-.8.7-1.6.9-2.4.5.2 1.2 0 1.4-.6.1-.3-.1-.6-.4-.8-.4-.3-1.1-.6-1.5-.8.4-.8.6-1.7.6-2.6 0-2.9-2.4-5.5-6.2-5.5z"/>
  </svg>
);

const PROJECT_TYPE_OPTIONS = [
  "الديكور الداخلي والتشطيبات",
  "أعمال الألمنيوم والواجهات",
  "النجارة والديكور الخشبي المخصص",
  "المشاريع التجارية والطبية",
  "العوازل والترميم الإنشائي",
  "أخرى",
];

export default function Contact() {
  const { brand: siteBrand } = useSiteData();
  const brand = siteBrand || BRAND;

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    projectType: "الديكور الداخلي والتشطيبات",
    customProjectType: "",
    details: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    const finalProjectType =
      formData.projectType === "أخرى" && formData.customProjectType.trim()
        ? `أخرى (${formData.customProjectType.trim()})`
        : formData.projectType;

    await trackAnalyticsEvent("consultation_form_submit", {
      projectType: finalProjectType,
    });

    const phoneNumber = (brand.whatsapp || BRAND.whatsapp).replace(/\D/g, "");

    const messageText = `طلب استشارة جديد - عدن للديكور
• اسم العميل: ${formData.name || "غير محدد"}
• رقم الهاتف: ${formData.phone || "غير محدد"}
• نوع المشروع: ${finalProjectType}
• تفاصيل المشروع: ${formData.details || "لا توجد تفاصيل إضافية"}`;

    const encodedMessage = encodeURIComponent(messageText);
    window.open(`https://wa.me/${phoneNumber}?text=${encodedMessage}`, "_blank");
  };

  const handleDirectCall = () => {
    const phone = (brand.whatsapp || BRAND.whatsapp).replace(/\D/g, "");
    window.location.href = `tel:${phone}`;
  };

  return (
    <section
      id="contact"
      data-testid="contact-section"
      className="relative py-20 lg:py-32 bg-black overflow-hidden"
    >
      {/* Decorative background glows */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full pointer-events-none opacity-20 blur-3xl"
        style={{
          background:
            "radial-gradient(circle, rgba(212,175,55,0.25) 0%, transparent 70%)",
        }}
      />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative bg-black border-2 border-[#D4AF37]/60 rounded-2xl lg:rounded-3xl p-6 sm:p-10 lg:p-12 shadow-[0_0_50px_rgba(212,175,55,0.12)] overflow-hidden"
        >
          {/* Subtle gold corner accents */}
          <div className="absolute top-0 right-0 w-14 h-14 border-t-2 border-r-2 border-[#D4AF37] rounded-tr-2xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-14 h-14 border-b-2 border-l-2 border-[#D4AF37] rounded-bl-2xl pointer-events-none" />

          {/* Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 mb-3">
              <span className="h-[2px] w-8 bg-gradient-to-r from-transparent to-[#D4AF37]" />
              <span className="text-[#D4AF37] font-bold text-sm tracking-wider uppercase">
                تواصل معنا
              </span>
              <span className="h-[2px] w-8 bg-gradient-to-l from-transparent to-[#D4AF37]" />
            </div>
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-white mb-4">
              احجز استشارتك
            </h2>
            <p className="font-body text-zinc-300 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
              ابدأ مشروعك معنا، ودع خبراء عدن للديكور يحولون أفكارك إلى مساحات عصرية تجمع بين الجودة، الدقة، وجمال التفاصيل.
            </p>
          </div>

          {/* Booking Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Name field */}
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-2">
                  الاسم الكامل
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="الاسم الكامل"
                  required
                  className="w-full bg-zinc-950 border border-[#D4AF37]/20 focus:border-[#D4AF37] text-white placeholder-zinc-500 rounded-xl px-4 py-3.5 text-sm outline-none transition-all duration-300 focus:ring-1 focus:ring-[#D4AF37] hover:border-[#D4AF37]/40"
                />
              </div>

              {/* Phone field */}
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-2">
                  رقم الهاتف
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="رقم الهاتف"
                  required
                  dir="auto"
                  className="w-full bg-zinc-950 border border-[#D4AF37]/20 focus:border-[#D4AF37] text-white placeholder-zinc-500 rounded-xl px-4 py-3.5 text-sm outline-none transition-all duration-300 focus:ring-1 focus:ring-[#D4AF37] hover:border-[#D4AF37]/40"
                />
              </div>
            </div>

            {/* Project Type */}
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-2">
                نوع المشروع
              </label>
              <select
                name="projectType"
                value={formData.projectType}
                onChange={handleChange}
                className="w-full bg-zinc-950 border border-[#D4AF37]/20 focus:border-[#D4AF37] text-white rounded-xl px-4 py-3.5 text-sm outline-none transition-all duration-300 focus:ring-1 focus:ring-[#D4AF37] cursor-pointer hover:border-[#D4AF37]/40"
              >
                {PROJECT_TYPE_OPTIONS.map((type) => (
                  <option key={type} value={type} className="bg-zinc-900 text-white">
                    {type}
                  </option>
                ))}
              </select>

              {formData.projectType === "أخرى" && (
                <div className="mt-3">
                  <input
                    type="text"
                    name="customProjectType"
                    value={formData.customProjectType}
                    onChange={handleChange}
                    placeholder="حدد نوع المشروع هنا..."
                    required
                    className="w-full bg-zinc-950 border border-[#D4AF37]/20 focus:border-[#D4AF37] text-white placeholder-zinc-500 rounded-xl px-4 py-3.5 text-sm outline-none transition-all duration-300 focus:ring-1 focus:ring-[#D4AF37] hover:border-[#D4AF37]/40"
                  />
                </div>
              )}
            </div>

            {/* Details */}
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-2">
                تفاصيل المشروع
              </label>
              <textarea
                name="details"
                rows={4}
                value={formData.details}
                onChange={handleChange}
                placeholder="اكتب تفاصيل مشروعك..."
                className="w-full bg-zinc-950 border border-[#D4AF37]/20 focus:border-[#D4AF37] text-white placeholder-zinc-500 rounded-xl p-4 text-sm outline-none transition-all duration-300 focus:ring-1 focus:ring-[#D4AF37] resize-none hover:border-[#D4AF37]/40"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-[#D4AF37] via-[#F3E5AB] to-[#D4AF37] text-black font-bold text-base py-4 rounded-xl shadow-lg hover:shadow-[#D4AF37]/20 active:scale-[0.99] transition-all duration-300 flex items-center justify-center gap-3 group"
            >
              <WhatsAppIcon size={22} className="text-black" />
              <span>إرسال طلب استشارة مجانية</span>
              <Send size={18} className="transform group-hover:-translate-x-1 transition-transform" />
            </button>
          </form>

          {/* Social & Contact Buttons inside the same Box - Luxury Organized Layout */}
          <div className="mt-10 pt-8 border-t border-[#D4AF37]/20">
            {/* Direct Quick Action Badges */}
            <div className="flex flex-wrap items-center justify-center gap-3 mb-6">
              <button
                type="button"
                onClick={handleSubmit}
                className="flex items-center gap-2.5 px-5 py-2.5 bg-black/60 border border-[#D4AF37]/40 hover:border-[#D4AF37] hover:bg-[#D4AF37] hover:text-black rounded-full text-xs sm:text-sm font-medium text-[#D4AF37] transition-all duration-300 shadow-sm active:scale-95 group"
              >
                <WhatsAppIcon size={18} className="text-[#D4AF37] group-hover:text-black transition-colors" />
                <span>محادثة واتساب</span>
              </button>

              <button
                type="button"
                onClick={handleDirectCall}
                className="flex items-center gap-2.5 px-5 py-2.5 bg-black/60 border border-[#D4AF37]/40 hover:border-[#D4AF37] hover:bg-[#D4AF37] hover:text-black rounded-full text-xs sm:text-sm font-medium text-[#D4AF37] transition-all duration-300 shadow-sm active:scale-95 group"
              >
                <Phone size={18} className="text-[#D4AF37] group-hover:text-black transition-colors" />
                <span>اتصال مباشر</span>
              </button>
            </div>

            {/* Divider with text */}
            <div className="flex items-center gap-3 my-6 max-w-md mx-auto">
              <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-[#D4AF37]/30" />
              <span className="text-zinc-400 text-xs font-medium">تابعنا عبر منصاتنا الرسمية</span>
              <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-[#D4AF37]/30" />
            </div>

            {/* Social Icons Grid / Row */}
            <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
              {/* Instagram */}
              {brand.instagram && (
                <a
                  href={brand.instagram}
                  target="_blank"
                  rel="noreferrer"
                  title="إنستغرام"
                  aria-label="إنستغرام"
                  className="relative group w-12 h-12 rounded-full border border-[#D4AF37]/30 bg-black/50 flex items-center justify-center text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black hover:border-[#D4AF37] hover:shadow-[0_0_18px_rgba(212,175,55,0.35)] transition-all duration-300 active:scale-95 transform hover:-translate-y-1"
                >
                  <Instagram size={20} />
                  <span className="absolute -top-9 left-1/2 -translate-x-1/2 px-2.5 py-1 bg-[#D4AF37] text-black text-[11px] font-bold rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap shadow-lg">
                    إنستغرام
                  </span>
                </a>
              )}

              {/* Snapchat */}
              {brand.snapchat && (
                <a
                  href={brand.snapchat}
                  target="_blank"
                  rel="noreferrer"
                  title="سناب شات"
                  aria-label="سناب شات"
                  className="relative group w-12 h-12 rounded-full border border-[#D4AF37]/30 bg-black/50 flex items-center justify-center text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black hover:border-[#D4AF37] hover:shadow-[0_0_18px_rgba(212,175,55,0.35)] transition-all duration-300 active:scale-95 transform hover:-translate-y-1"
                >
                  <SnapchatIcon size={20} />
                  <span className="absolute -top-9 left-1/2 -translate-x-1/2 px-2.5 py-1 bg-[#D4AF37] text-black text-[11px] font-bold rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap shadow-lg">
                    سناب شات
                  </span>
                </a>
              )}

              {/* TikTok */}
              {brand.tiktok && (
                <a
                  href={brand.tiktok}
                  target="_blank"
                  rel="noreferrer"
                  title="تيك توك"
                  aria-label="تيك توك"
                  className="relative group w-12 h-12 rounded-full border border-[#D4AF37]/30 bg-black/50 flex items-center justify-center text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black hover:border-[#D4AF37] hover:shadow-[0_0_18px_rgba(212,175,55,0.35)] transition-all duration-300 active:scale-95 transform hover:-translate-y-1"
                >
                  <TikTokIcon size={20} />
                  <span className="absolute -top-9 left-1/2 -translate-x-1/2 px-2.5 py-1 bg-[#D4AF37] text-black text-[11px] font-bold rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap shadow-lg">
                    تيك توك
                  </span>
                </a>
              )}

              {/* YouTube */}
              {brand.youtube && (
                <a
                  href={brand.youtube}
                  target="_blank"
                  rel="noreferrer"
                  title="يوتيوب"
                  aria-label="يوتيوب"
                  className="relative group w-12 h-12 rounded-full border border-[#D4AF37]/30 bg-black/50 flex items-center justify-center text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black hover:border-[#D4AF37] hover:shadow-[0_0_18px_rgba(212,175,55,0.35)] transition-all duration-300 active:scale-95 transform hover:-translate-y-1"
                >
                  <Youtube size={20} />
                  <span className="absolute -top-9 left-1/2 -translate-x-1/2 px-2.5 py-1 bg-[#D4AF37] text-black text-[11px] font-bold rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap shadow-lg">
                    يوتيوب
                  </span>
                </a>
              )}

              {/* Facebook */}
              {brand.facebook && (
                <a
                  href={brand.facebook}
                  target="_blank"
                  rel="noreferrer"
                  title="فيسبوك"
                  aria-label="فيسبوك"
                  className="relative group w-12 h-12 rounded-full border border-[#D4AF37]/30 bg-black/50 flex items-center justify-center text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black hover:border-[#D4AF37] hover:shadow-[0_0_18px_rgba(212,175,55,0.35)] transition-all duration-300 active:scale-95 transform hover:-translate-y-1"
                >
                  <Facebook size={20} />
                  <span className="absolute -top-9 left-1/2 -translate-x-1/2 px-2.5 py-1 bg-[#D4AF37] text-black text-[11px] font-bold rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap shadow-lg">
                    فيسبوك
                  </span>
                </a>
              )}

              {/* Location / Maps */}
              {brand.maps && (
                <a
                  href={brand.maps}
                  target="_blank"
                  rel="noreferrer"
                  title="الموقع على الخريطة"
                  aria-label="الموقع"
                  className="relative group w-12 h-12 rounded-full border border-[#D4AF37]/30 bg-black/50 flex items-center justify-center text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black hover:border-[#D4AF37] hover:shadow-[0_0_18px_rgba(212,175,55,0.35)] transition-all duration-300 active:scale-95 transform hover:-translate-y-1"
                >
                  <MapPin size={20} />
                  <span className="absolute -top-9 left-1/2 -translate-x-1/2 px-2.5 py-1 bg-[#D4AF37] text-black text-[11px] font-bold rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap shadow-lg">
                    الموقع
                  </span>
                </a>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

