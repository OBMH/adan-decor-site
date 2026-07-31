import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Services from "@/components/Services";
import Trust from "@/components/Trust";
import Testimonials from "@/components/Testimonials";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";

export default function PublicSite() {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace("#", "");
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    }
  }, [location]);

  return (
    <div className="min-h-screen bg-black text-white" dir="rtl">
      <Navbar />
      <main>
        <Hero />
        <About />
        <Services />
        <Trust />
        <Testimonials />
        <Contact />
      </main>
      <Footer />
      <FloatingWhatsApp />
    </div>
  );
}
