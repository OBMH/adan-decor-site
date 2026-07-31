import React, { useEffect } from "react";
import "@/App.css";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { Toaster } from "sonner";
import PublicSite from "@/PublicSite";
import ServiceTemplate from "@/ServiceTemplate";
import PortfolioPage from "@/PortfolioPage";
import { AuthProvider } from "@/admin/AuthContext";
import { SiteProvider } from "@/contexts/SiteContext";
import { PageConfigProvider } from "@/contexts/PageConfigContext";
import AdminLogin from "@/admin/AdminLogin";
import AdminLayout from "@/admin/AdminLayout";
import AdminDashboard from "@/admin/AdminDashboard";
import AdminNotifications from "@/admin/AdminNotifications";
import AdminProjects from "@/admin/AdminProjects";
import AdminServices from "@/admin/AdminServices";
import AdminTestimonials from "@/admin/AdminTestimonials";
import AdminMedia from "@/admin/AdminMedia";
import AdminSettings from "@/admin/AdminSettings";
import AdminUsers from "@/admin/AdminUsers";
import AdminPages from "@/admin/AdminPages";
import { PermissionGuard } from "@/admin/PermissionGuard";
import { preloadCriticalImages } from "@/components/SafeImage";
import { BRAND, HERO_IMAGE, ABOUT_IMAGES, PHILOSOPHY_IMAGE, PORTFOLIO } from "@/data/content";

import { trackAnalyticsEvent } from "@/utils/analytics";

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
    // Track page visit
    if (!pathname.startsWith("/admin")) {
      trackAnalyticsEvent('page_visit', { path: pathname });
    }
  }, [pathname]);

  return null;
}

function App() {

  return (
    <div className="App">
      <BrowserRouter>
        <ScrollToTop />
        <AuthProvider>
          <SiteProvider>
            <PageConfigProvider>
              <Routes>
              <Route path="/" element={<PublicSite />} />
              <Route path="/portfolio" element={<PortfolioPage />} />
              <Route path="/services/:serviceId" element={<ServiceTemplate />} />
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<PermissionGuard section="dashboard"><AdminDashboard /></PermissionGuard>} />
                <Route path="pages" element={<PermissionGuard section="pages"><AdminPages /></PermissionGuard>} />
                <Route path="notifications" element={<PermissionGuard section="notifications"><AdminNotifications /></PermissionGuard>} />
                <Route path="projects" element={<PermissionGuard section="projects"><AdminProjects /></PermissionGuard>} />
                <Route path="services" element={<PermissionGuard section="services"><AdminServices /></PermissionGuard>} />
                <Route path="testimonials" element={<PermissionGuard section="testimonials"><AdminTestimonials /></PermissionGuard>} />
                <Route path="media" element={<PermissionGuard section="media"><AdminMedia /></PermissionGuard>} />
                <Route path="settings" element={<PermissionGuard section="settings"><AdminSettings /></PermissionGuard>} />
                <Route path="users" element={<PermissionGuard section="users"><AdminUsers /></PermissionGuard>} />
              </Route>
            </Routes>
          </PageConfigProvider>
        </SiteProvider>
      </AuthProvider>
        <Toaster
          position="top-center"
          dir="rtl"
          theme="dark"
          toastOptions={{
            style: {
              background: "#0A0A0A",
              border: "1px solid rgba(212, 175, 55, 0.4)",
              color: "#fff",
              fontFamily: "Tajawal, sans-serif",
              borderRadius: 0,
            },
          }}
        />
      </BrowserRouter>
    </div>
  );
}

export default App;
