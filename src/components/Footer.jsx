import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Instagram, Youtube, MapPin, Facebook, Phone, Mail } from "lucide-react";
import { BRAND, NAV_LINKS } from "../data/content";
import { useSiteData } from "../contexts/SiteContext";
import { WhatsAppIcon } from "./WhatsAppIcon";
import SafeImage from "./SafeImage";

// TikTok & Snapchat SVG icons
const TikTokIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5.8 20.1a6.34 6.34 0 0 0 10.86-4.43V8.79a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1.84-.22z"/>
  </svg>
);

const SnapchatIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2.1c-3.8 0-6.2 2.6-6.2 5.5 0 .9.2 1.8.6 2.6-.4.2-1.1.5-1.5.8-.3.2-.5.5-.4.8.2.6.9.8 1.4.6.2.8.5 1.6.9 2.4-1.3.4-2.5 1.3-2.3 2.6.2 1.2 1.7 1.6 3.1 1.7.5 1.2 1.8 1.8 3.5 1.8 1.7 0 3-.6 3.5-1.8 1.4-.1 2.9-.5 3.1-1.7.2-1.3-1-2.2-2.3-2.6.4-.8.7-1.6.9-2.4.5.2 1.2 0 1.4-.6.1-.3-.1-.6-.4-.8-.4-.3-1.1-.6-1.5-.8.4-.8.6-1.7.6-2.6 0-2.9-2.4-5.5-6.2-5.5z"/>
  </svg>
);

export default function Footer() {
  const navigate = useNavigate();
  const location = useLocation();
  const { brand: siteBrand } = useSiteData();
  const currentBrand = siteBrand || BRAND;

  const handleNavClick = (item) => {
    if (typeof item === "object" && item.path) {
      navigate(item.path);
      window.scrollTo(0, 0);
      return;
    }
    const id = typeof item === "object" ? item.id : item;
    if (location.pathname !== "/") {
      navigate(`/#${id}`);
    } else {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const whatsappNum = (currentBrand.whatsapp || BRAND.whatsapp).replace(/\D/g, "");
  const whatsappLink = `https://wa.me/${whatsappNum}`;

  const socials = [
    { id: "whatsapp", href: whatsappLink, icon: <WhatsAppIcon size={18} />, label: "WhatsApp" },
    { id: "instagram", href: currentBrand.instagram, icon: <Instagram size={18} />, label: "Instagram" },
    { id: "facebook", href: currentBrand.facebook, icon: <Facebook size={18} />, label: "Facebook" },
    { id: "snapchat", href: currentBrand.snapchat, icon: <SnapchatIcon size={18} />, label: "Snapchat" },
    { id: "tiktok", href: currentBrand.tiktok, icon: <TikTokIcon size={18} />, label: "TikTok" },
    { id: "youtube", href: currentBrand.youtube, icon: <Youtube size={18} />, label: "YouTube" },
    { id: "maps", href: currentBrand.maps, icon: <MapPin size={18} />, label: "Location" },
  ].filter((s) => s.href);

  return (
    <footer
      data-testid="main-footer"
      className="relative bg-black border-t border-[#D4AF37]/15 pt-20 pb-10 overflow-hidden"
    >
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <div className="grid lg:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <div className="lg:col-span-2">
            <button
              onClick={() => handleNavClick("hero")}
              className="flex items-center gap-3 mb-6 group text-right"
              data-testid="footer-logo"
            >
              <div className="w-20 h-20 rounded-full overflow-hidden border border-[#D4AF37]/40 relative bg-black flex items-center justify-center shrink-0">
                <SafeImage loading="lazy" src={currentBrand.logo || BRAND.logo} alt={currentBrand.nameAr || "Adan Decor"} fallbackType="logo" className="w-full h-full object-cover scale-[1.05]" />
              </div>
              <div className="text-right leading-tight">
                <div className="font-display text-white text-xl">{currentBrand.nameAr || BRAND.nameAr}</div>
                <div className="font-en text-[10px] text-[#D4AF37] tracking-[0.3em]">{currentBrand.nameEn || BRAND.nameEn}</div>
              </div>
            </button>
            <p className="font-body text-white/55 max-w-md leading-relaxed mb-6">
              {currentBrand.tagline || "عدن للديكور — حلول متكاملة في التصميم الداخلي والتنفيذ، نحول الأفكار إلى مساحات عصرية تجمع بين الجودة، الدقة، وجمال التفاصيل."}
            </p>
            <div className="flex flex-wrap gap-3">
              {socials.map((s) => (
                <a
                  key={s.id}
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  data-testid={`footer-${s.id}`}
                  aria-label={s.label}
                  className="w-11 h-11 border border-[#D4AF37]/30 flex items-center justify-center hover:border-[#D4AF37] hover:bg-[#D4AF37] hover:text-black transition-all duration-300 text-[#D4AF37]"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Nav */}
          <div>
            <div className="font-en text-[10px] text-[#D4AF37] tracking-[0.3em] mb-5">NAVIGATE</div>
            <nav className="flex flex-col gap-3">
              {NAV_LINKS.map((l) => (
                <button
                  key={l.id}
                  onClick={() => handleNavClick(l)}
                  data-testid={`footer-nav-${l.id}`}
                  className="text-right text-white/60 hover:text-[#D4AF37] transition-colors duration-300 font-body text-sm"
                >
                  {l.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Contact */}
          <div>
            <div className="font-en text-[10px] text-[#D4AF37] tracking-[0.3em] mb-5">CONTACT</div>
            <div className="space-y-4 text-sm font-body">
              <div className="text-white/60">
                <div className="text-[#D4AF37] mb-1 text-xs font-bold">واتساب وهاتف</div>
                <div dir="ltr" className="text-right">{currentBrand.whatsapp || BRAND.whatsapp}</div>
                {currentBrand.phone2 && <div dir="ltr" className="text-right text-xs text-white/40 mt-0.5">{currentBrand.phone2}</div>}
              </div>
              {currentBrand.email && (
                <div className="text-white/60">
                  <div className="text-[#D4AF37] mb-1 text-xs font-bold">البريد الإلكتروني</div>
                  <div dir="ltr" className="text-right">{currentBrand.email}</div>
                </div>
              )}
              <div className="text-white/60">
                <div className="text-[#D4AF37] mb-1 text-xs font-bold">الموقع والعنوان</div>
                <div>{currentBrand.address || currentBrand.location || BRAND.location}</div>
              </div>
              <div className="text-white/60">
                <div className="text-[#D4AF37] mb-1 text-xs font-bold">ساعات العمل</div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>{currentBrand.hours || BRAND.hours}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-[#D4AF37]/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="font-body text-xs text-white/40 text-center sm:text-right">
            © {new Date().getFullYear()} <span className="text-[#D4AF37]">{currentBrand.nameAr || BRAND.nameAr}</span> — جميع الحقوق محفوظة.
          </div>
          <div className="font-en text-[10px] text-white/30 tracking-[0.3em]">
            CRAFTED WITH PRECISION · MADE FOR LUXURY
          </div>
        </div>
      </div>
    </footer>
  );
}
