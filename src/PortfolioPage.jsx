import React, { useEffect } from "react";
import Navbar from "@/components/Navbar";
import Portfolio from "@/components/Portfolio";
import Footer from "@/components/Footer";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";

export default function PortfolioPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white" dir="rtl">
      <Navbar />
      <main className="pt-20">
        <Portfolio />
      </main>
      <Footer />
      <FloatingWhatsApp />
    </div>
  );
}
