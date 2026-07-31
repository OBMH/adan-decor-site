import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ChevronDown, ChevronLeft } from "lucide-react";
import { NAV_LINKS, BRAND } from "../data/content";
import { useSiteData } from "../contexts/SiteContext";
import SafeImage from "./SafeImage";

export default function Navbar() {
  const { brand: siteBrand } = useSiteData();
  const brand = siteBrand || BRAND;
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [activeMobileDropdown, setActiveMobileDropdown] = useState(null);
  const headerRef = useRef(null);
  
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (headerRef.current && !headerRef.current.contains(event.target)) {
        setActiveMobileDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, []);

  const handleNavClick = (item, closeMenu = true) => {
    if (item.path) {
      navigate(item.path);
      if (closeMenu) setOpen(false);
      return;
    }
    
    if (location.pathname !== "/") {
      navigate(`/#${item.id}`);
      if (closeMenu) setOpen(false);
    } else {
      const el = document.getElementById(item.id);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
        navigate(`#${item.id}`);
        if (closeMenu) setTimeout(() => setOpen(false), 500);
      } else {
        if (closeMenu) setOpen(false);
      }
    }
  };

  return (
    <motion.header
      ref={headerRef}
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      data-testid="main-navbar"
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 bg-black ${
        scrolled
          ? "border-b border-[#D4AF37]/20 shadow-lg"
          : "border-b border-transparent"
      }`}
    >
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <div className={`flex items-center justify-between transition-all duration-500 ${scrolled ? "h-16 lg:h-20" : "h-20 lg:h-24"}`}>
          {/* Logo */}
          <button
            onClick={() => handleNavClick({ id: "hero" })}
            data-testid="navbar-logo"
            className="group flex items-center gap-3"
          >
            <div className="w-16 h-16 lg:w-20 lg:h-20 rounded-full overflow-hidden border border-[#D4AF37]/40 group-hover:border-[#D4AF37] transition-transform duration-500 hover:scale-105 relative bg-black flex items-center justify-center">
              <SafeImage
                src={brand.logo || BRAND.logo}
                alt={brand.nameAr || "Adan Decor"}
                fallbackType="logo"
                className="w-full h-full object-cover scale-[1.05]"
               priority={true}
              />
            </div>
            <div className="text-right leading-tight">
              <div className="font-display text-white text-lg lg:text-xl">{brand.nameAr || BRAND.nameAr}</div>
              <div className="font-en text-[10px] text-[#D4AF37]">{brand.nameEn?.toUpperCase() || "ADAN · DECOR"}</div>
            </div>
          </button>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-10">
            {NAV_LINKS.map((l) => (
              <div key={l.id} className="relative group/nav">
                <button
                  onClick={() => handleNavClick(l)}
                  data-testid={`nav-link-${l.id}`}
                  className="flex items-center gap-1 text-sm font-medium text-white/70 hover:text-[#D4AF37] transition-colors duration-300 py-2 group-hover/nav:text-[#D4AF37]"
                >
                  {l.label}
                  {l.subLinks && <ChevronDown size={14} className="transition-transform duration-300 group-hover/nav:rotate-180" />}
                  <span className="absolute bottom-0 right-0 w-0 h-px bg-[#D4AF37] group-hover/nav:w-full transition-all duration-500" />
                </button>

                {l.subLinks && (
                  <div className="absolute top-full right-0 pt-4 opacity-0 translate-y-4 invisible group-hover/nav:opacity-100 group-hover/nav:translate-y-0 group-hover/nav:visible transition-all duration-300 z-50">
                    <div className="bg-black/95 backdrop-blur-xl border border-[#D4AF37]/20 rounded-sm py-2 min-w-[200px] flex flex-col shadow-2xl">
                      {l.subLinks.map((sub) => (
                        <button
                          key={sub.id}
                          onClick={() => handleNavClick(sub)}
                          className="text-right px-6 py-3 text-sm text-white/70 hover:text-[#D4AF37] hover:bg-white/5 transition-colors duration-300 whitespace-nowrap border-b border-[#D4AF37]/10 last:border-0"
                        >
                          {sub.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </nav>
          {/* Mobile horizontal nav */}
          <nav className="lg:hidden absolute top-full inset-x-0 bg-black border-b border-[#D4AF37]/20 flex flex-col px-4 py-1">
            <div className="flex overflow-x-auto overflow-y-visible whitespace-nowrap gap-5 sm:gap-6 no-scrollbar pb-2 px-1">
              {NAV_LINKS.map((l) => {
                const isSubLinkActive = l.subLinks?.some(sub => location.pathname === sub.path);
                const isActive = l.path ? location.pathname === l.path : (location.hash === `#${l.id}` || (location.pathname === '/' && l.id === 'hero' && !location.hash) || isSubLinkActive);
                return (
                    <button
                      key={l.id}
                      onClick={() => {
                        if (l.subLinks) {
                            setActiveMobileDropdown(activeMobileDropdown === l.id ? null : l.id);
                        } else {
                            handleNavClick(l, false);
                            setActiveMobileDropdown(null);
                        }
                      }}
                      className={`relative flex items-center gap-1 text-sm font-medium transition-colors duration-300 py-1 ${isActive ? "text-[#D4AF37]" : "text-white/80 hover:text-[#D4AF37]"}`}
                    >
                      {l.label}
                      {l.subLinks && <ChevronDown size={12} className={`transition-transform duration-300 ${activeMobileDropdown === l.id ? "rotate-180" : ""}`} />}
                      {isActive && <motion.span layout layoutId="active-nav-mobile" className="absolute bottom-0 left-0 right-0 h-px bg-[#D4AF37]" transition={{ type: "spring", stiffness: 300, damping: 30 }} />}
                    </button>
                );
              })}
            </div>
            
            {/* Vertical Sub-menu dropdown */}
            <AnimatePresence>
              {activeMobileDropdown && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex flex-col border-t border-white/10 pt-1 mt-1 bg-black"
                >
                  {NAV_LINKS.find(l => l.id === activeMobileDropdown)?.subLinks.map(sub => {
                      const isSubActive = location.pathname === sub.path;
                      return (
                          <button
                              key={sub.id}
                              onClick={() => {
                                  handleNavClick(sub, false);
                                  // Keep it open so it never closes on navigating between services
                              }}
                              className={`flex items-center justify-between w-full text-right text-base transition-all duration-300 py-4 px-2 border-b border-white/10 last:border-0 group ${isSubActive ? "text-[#D4AF37]" : "text-white/85 hover:text-[#D4AF37]"}`}
                          >
                              <span className="font-body group-hover:text-[#D4AF37] transition-colors">
                                  {sub.label}
                              </span>
                              <ChevronLeft size={16} className={`group-hover:text-[#D4AF37] transition-colors ${isSubActive ? "text-[#D4AF37]" : "text-[#D4AF37]/90"}`} />
                          </button>
                      );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </nav>

          {/* CTA */}
          <button
            onClick={() => handleNavClick({ id: "contact" })}
            data-testid="navbar-cta"
            className="hidden lg:inline-flex btn-sweep border border-[#D4AF37] text-[#D4AF37] px-6 py-3 text-sm font-medium hover:bg-[#D4AF37] hover:text-black transition-colors duration-300"
          >
            احجز استشارتك
          </button>
        </div>
      </div>

      {/* Mobile menu - placeholder for logic that might depend on 'open' state */}
      {false && <div />}
    </motion.header>
  );
}
