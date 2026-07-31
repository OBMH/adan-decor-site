import React, { useState } from "react";
import { NavLink, Outlet, Navigate, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  LayoutDashboard, FolderKanban, Wrench, Quote,
  Image, Users, Bell, Settings, LogOut,
  Loader2, Menu, X, ExternalLink, FileEdit
} from "lucide-react";
import { useAuth } from "./AuthContext";
import { useSiteData } from "../contexts/SiteContext";
import { hasPermission, getRoleInfo } from "./rbac";
import { BRAND } from "../data/content";
import SafeImage from "../components/SafeImage";

const NAV = [
  { to: "/admin", label: "لوحة الإحصائيات", icon: LayoutDashboard, end: true, section: "dashboard", testid: "admin-nav-dashboard" },
  { to: "/admin/projects", label: "إدارة معرض الأعمال", icon: FolderKanban, section: "projects", testid: "admin-nav-projects" },
  { to: "/admin/pages", label: "إدارة الصفحات", icon: FileEdit, section: "pages", testid: "admin-nav-pages" },
  { to: "/admin/notifications", label: "سجل التتبع", icon: Bell, section: "notifications", testid: "admin-nav-notifications" },
  { to: "/admin/services", label: "الخدمات", icon: Wrench, section: "services", testid: "admin-nav-services" },
  { to: "/admin/testimonials", label: "الشهادات", icon: Quote, section: "testimonials", testid: "admin-nav-testimonials" },
  { to: "/admin/media", label: "الوسائط", icon: Image, section: "media", testid: "admin-nav-media" },
  { to: "/admin/settings", label: "الإعدادات", icon: Settings, section: "settings", testid: "admin-nav-settings" },
  { to: "/admin/users", label: "المستخدمون", icon: Users, section: "users", testid: "admin-nav-users" },
];

export default function AdminLayout() {
  const { admin, loading, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const { syncStatus, lastSyncedAt } = useSiteData();

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center" dir="rtl">
        <Loader2 size={32} className="text-[#D4AF37] animate-spin" />
      </div>
    );
  }
  if (!admin) return <Navigate to="/admin/login" replace />;

  const roleInfo = getRoleInfo(admin.role);

  return (
    <div className="min-h-screen bg-black text-white flex" dir="rtl">
      {/* Sidebar */}
      <aside
        className={`fixed lg:sticky top-0 right-0 z-40 h-screen w-72 bg-[#0A0A0A] border-l border-[#D4AF37]/15 transition-transform duration-300 ${
          open ? "translate-x-0" : "translate-x-full lg:translate-x-0"
        }`}
        data-testid="admin-sidebar"
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="px-6 py-6 border-b border-[#D4AF37]/15 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-16 h-16 rounded-full overflow-hidden border border-[#D4AF37]/40 relative bg-black flex items-center justify-center">
                <SafeImage src={BRAND.logo} alt="Adan Decor" fallbackType="logo" loading="eager" fetchPriority="high" className="w-full h-full object-cover scale-[1.05]" />
              </div>
              <div className="flex-1 leading-tight">
                <div className="font-display text-white text-base">{BRAND.nameAr}</div>
                <div className="font-en text-[9px] text-[#D4AF37] tracking-[0.25em]">ADMIN PANEL</div>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="lg:hidden text-[#D4AF37]"
              aria-label="إغلاق"
            >
              <X size={22} />
            </button>
          </div>

          {/* Nav */}
          <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
            {NAV.filter((item) => hasPermission(admin.role, item.section)).map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                onClick={() => setOpen(false)}
                data-testid={item.testid}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 text-sm font-body transition-all duration-200 ${
                    isActive
                      ? "bg-[#D4AF37]/10 text-[#D4AF37] border-r-2 border-[#D4AF37]"
                      : "text-white/60 hover:bg-white/5 hover:text-white"
                  }`
                }
              >
                <item.icon size={18} strokeWidth={1.5} />
                {item.label}
              </NavLink>
            ))}
          </nav>

          {/* User + Logout */}
          <div className="px-3 py-4 border-t border-[#D4AF37]/15 space-y-2 pb-20 lg:pb-24">
            <div className="px-3 py-2 bg-white/[0.02] border border-white/5 rounded-sm my-1">
              <div className="flex items-center justify-between mb-1">
                <div className="font-en text-[8px] text-[#D4AF37] tracking-[0.2em]">LOGGED IN AS</div>
                <span className={`text-[9px] px-2 py-0.5 rounded font-bold font-en border ${roleInfo.badgeClass}`}>
                  {roleInfo.id.toUpperCase()}
                </span>
              </div>
              <div className="text-xs font-bold text-white truncate" data-testid="admin-email-display">{admin.name || admin.email}</div>
              <div className="text-[11px] text-white/40 font-en truncate" dir="ltr">{admin.email}</div>
            </div>

            <button
              onClick={logout}
              data-testid="admin-logout"
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-white/60 hover:bg-red-500/10 hover:text-red-400 transition-colors rounded-sm"
            >
              <LogOut size={18} strokeWidth={1.5} />
              تسجيل الخروج
            </button>
            <button
              onClick={() => window.open("/", "_blank")}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-white/60 hover:bg-white/5 hover:text-[#D4AF37] transition-colors rounded-sm"
            >
              <ExternalLink size={18} strokeWidth={1.5} />
              عرض الموقع
            </button>
          </div>
        </div>
      </aside>

      {/* Backdrop */}
      {open && (
        <div className="fixed inset-0 z-30 bg-black/70 lg:hidden" onClick={() => setOpen(false)} />
      )}

      {/* Main */}
      <main className="flex-1 min-w-0 lg:mr-72 lg:ml-0">
        {/* Top bar */}
        <header className="sticky top-0 z-20 bg-black/85 backdrop-blur-xl border-b border-[#D4AF37]/15 px-6 lg:px-10 py-3.5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setOpen(true)}
              className="lg:hidden text-[#D4AF37] p-1 rounded hover:bg-white/5"
              data-testid="admin-mobile-toggle"
              aria-label="القائمة"
            >
              <Menu size={24} />
            </button>
            <div className="hidden lg:block">
              <div className="font-en text-[10px] text-[#D4AF37] tracking-[0.3em] font-semibold">ADAN DECOR · SYSTEM CONTROL</div>
            </div>
          </div>

          <div className="flex items-center gap-3 sm:gap-5">
            {/* Live Sync Badge */}
            <div
              data-testid="live-sync-badge"
              className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.03] border border-[#D4AF37]/30 text-xs font-body transition-all"
            >
              {syncStatus === "saving" ? (
                <>
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                  <span className="text-amber-400 font-bold">جاري الحفظ والمزامنة...</span>
                </>
              ) : (
                <>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
                  <span className="text-emerald-400 font-bold">متصل ومتزامن</span>
                  {lastSyncedAt && <span className="text-white/40 text-[10px] hidden sm:inline" dir="ltr">({lastSyncedAt})</span>}
                </>
              )}
            </div>

            {/* Live Preview Button */}
            <a
              href="/"
              target="_blank"
              rel="noreferrer"
              data-testid="admin-live-preview-btn"
              className="flex items-center gap-2 bg-[#D4AF37]/10 hover:bg-[#D4AF37] text-[#D4AF37] hover:text-black border border-[#D4AF37]/40 px-3.5 py-1.5 rounded-md text-xs font-bold transition-all active:scale-95"
            >
              <ExternalLink size={14} />
              <span className="hidden sm:inline">معاينة الموقع الحقيقي</span>
              <span className="sm:hidden">الموقع</span>
            </a>
          </div>
        </header>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="px-6 lg:px-10 py-8 lg:py-12"
        >
          <Outlet />
        </motion.div>
      </main>
    </div>
  );
}
