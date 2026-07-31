import React, { useState } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  FileText,
  Briefcase,
  Layers,
  MessageSquareQuote,
  Image as ImageIcon,
  Settings,
  Users,
  Bell,
  LogOut,
  ExternalLink,
  Menu,
  X,
  Sparkles,
  ShieldCheck,
  Globe,
  Loader2,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { useAuth } from "./AuthContext";
import { useSiteData } from "../contexts/SiteContext";
import { hasPermission, getRoleInfo } from "./rbac";

export default function AdminLayout() {
  const { admin, logout } = useAuth();
  const { syncStatus, lastSyncedAt, brand } = useSiteData();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const navigate = useNavigate();

  if (!admin) return null;

  const navItems = [
    { to: "/admin", icon: LayoutDashboard, label: "لوحة التحكم الرئيسية", section: "dashboard", end: true },
    { to: "/admin/pages", icon: FileText, label: "إدارة صفحات الموقع", section: "pages" },
    { to: "/admin/services", icon: Layers, label: "الخدمات والقطاعات", section: "services" },
    { to: "/admin/projects", icon: Briefcase, label: "معرض الأعمال والمشاريع", section: "projects" },
    { to: "/admin/testimonials", icon: MessageSquareQuote, label: "آراء العملاء والشهادات", section: "testimonials" },
    { to: "/admin/media", icon: ImageIcon, label: "مكتبة الوسائط والملفات", section: "media" },
    { to: "/admin/notifications", icon: Bell, label: "سجل التتبع والتحديثات", section: "notifications" },
    { to: "/admin/settings", icon: Settings, label: "إعدادات الموقع العام", section: "settings" },
    { to: "/admin/users", icon: Users, label: "المستخدمون والصلاحيات", section: "users" },
  ];

  const filteredNavItems = navItems.filter(item => hasPermission(admin.role, item.section));
  const roleInfo = getRoleInfo(admin.role);

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white flex flex-col lg:flex-row font-body relative" dir="rtl">
      {/* Mobile Header */}
      <header className="lg:hidden flex items-center justify-between p-4 bg-[#111] border-b border-[#D4AF37]/20 z-40 sticky top-0">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 text-[#D4AF37] hover:bg-[#D4AF37]/10 rounded-lg transition-colors"
            aria-label="فتح القائمة الجانبية"
          >
            <Menu size={24} />
          </button>
          <span className="font-display font-bold text-lg text-[#D4AF37]">
            {brand?.nameAr || "عدن للديكور"} — لوحة الإدارة
          </span>
        </div>

        <div className="flex items-center gap-2">
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="p-2 bg-[#D4AF37]/10 text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black rounded-lg transition-colors"
            title="فتح الموقع العام"
          >
            <ExternalLink size={20} />
          </a>
        </div>
      </header>

      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/80 z-40 lg:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 bottom-0 right-0 w-72 bg-[#111] border-l border-[#D4AF37]/30 z-50 transform transition-transform duration-300 ease-in-out flex flex-col justify-between ${
          sidebarOpen ? "translate-x-0" : "translate-x-full lg:translate-x-0"
        } lg:static lg:w-72 lg:flex-shrink-0`}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar Brand Header */}
          <div className="p-6 border-b border-[#D4AF37]/20 flex items-center justify-between relative overflow-hidden">
            <div className="absolute -left-10 -top-10 w-24 h-24 bg-[#D4AF37]/5 rounded-full blur-xl pointer-events-none" />
            <div className="flex items-center gap-3 relative z-10">
              <div className="w-10 h-10 rounded-lg bg-[#D4AF37]/10 border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37] font-display font-bold text-xl shadow-[0_0_15px_rgba(212,175,55,0.2)]">
                A
              </div>
              <div>
                <h1 className="font-display font-bold text-lg text-white leading-tight">
                  {brand?.nameAr || "عدن للديكور"}
                </h1>
                <p className="text-[11px] text-[#D4AF37] flex items-center gap-1 mt-0.5">
                  <Sparkles size={12} /> لوحة التحكم والتشغيل
                </p>
              </div>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-white/60 hover:text-[#D4AF37] transition-colors p-1"
            >
              <X size={22} />
            </button>
          </div>

          {/* User & Role Card */}
          <div className="p-4 mx-4 my-3 bg-black/60 rounded-xl border border-white/10 flex flex-col gap-2">
            <div className="flex items-center gap-2 text-sm text-white/90">
              <ShieldCheck size={16} className="text-[#D4AF37]" />
              <span className="font-bold truncate">{admin?.name || "المشرف العام"}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className={`px-2 py-0.5 rounded text-[11px] border font-bold ${roleInfo.badgeClass}`}>
                {roleInfo.nameAr}
              </span>
              <span className="text-[10px] text-white/40 dir-ltr">{admin?.email}</span>
            </div>
          </div>

          {/* Live Sync Status Pill */}
          <div className="px-5 py-2 flex items-center justify-between text-xs border-y border-white/5 bg-[#0a0a0a]">
            <span className="text-white/50 flex items-center gap-1.5 font-bold">
              {syncStatus === "saving" ? (
                <Loader2 size={13} className="text-[#D4AF37] animate-spin" />
              ) : syncStatus === "synced" ? (
                <CheckCircle2 size={13} className="text-emerald-400" />
              ) : (
                <AlertCircle size={13} className="text-amber-400" />
              )}
              {syncStatus === "saving" ? "جاري الحفظ والربط..." : "المزامنة نشطة (مباشر)"}
            </span>
            <span className="text-[10px] text-white/30 dir-ltr">
              {lastSyncedAt ? `${lastSyncedAt}` : ""}
            </span>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1 custom-scrollbar">
            <div className="px-3 pb-2 text-[10px] uppercase font-bold text-white/30 tracking-wider">
              التنقل والإدارة
            </div>
            {filteredNavItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-3 rounded-lg font-medium text-sm transition-all duration-200 group relative ${
                    isActive
                      ? "bg-[#D4AF37] text-black font-bold shadow-[0_0_20px_rgba(212,175,55,0.3)]"
                      : "text-white/70 hover:bg-white/5 hover:text-white"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <item.icon
                      size={20}
                      className={isActive ? "text-black" : "text-[#D4AF37]/70 group-hover:text-[#D4AF37] transition-colors"}
                    />
                    <span className="flex-1 truncate">{item.label}</span>
                    {isActive && <div className="w-1.5 h-6 bg-black rounded-full" />}
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          {/* Footer Action Buttons */}
          <div className="p-4 border-t border-[#D4AF37]/20 space-y-2 bg-[#0e0e0e]">
            <div className="grid grid-cols-2 gap-2">
              <a
                href="/"
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-2 bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/30 py-2.5 px-3 rounded-lg text-xs font-bold hover:bg-[#D4AF37] hover:text-black transition-all"
              >
                <Globe size={15} /> فتح الموقع
              </a>
              <button
                onClick={() => setPreviewModalOpen(true)}
                className="flex items-center justify-center gap-2 bg-white/5 text-white/80 border border-white/10 py-2.5 px-3 rounded-lg text-xs font-bold hover:bg-white/10 hover:text-white transition-all"
              >
                <ExternalLink size={15} /> معاينة حية
              </button>
            </div>
            <button
              onClick={logout}
              className="w-full flex items-center justify-center gap-2 bg-red-500/10 text-red-400 border border-red-500/30 hover:bg-red-500 hover:text-white py-2.5 rounded-lg font-bold text-xs transition-colors"
            >
              <LogOut size={16} /> تسجيل الخروج
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 bg-[#070707] min-h-screen overflow-y-auto">
        {/* Top bar info */}
        <div className="hidden lg:flex items-center justify-between px-8 py-3.5 bg-[#0e0e0e] border-b border-[#D4AF37]/15">
          <div className="flex items-center gap-3 text-xs">
            <span className="px-2.5 py-1 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-bold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> النظام متصل بقاعدة البيانات مباشرة
            </span>
            <span className="text-white/40">|</span>
            <span className="text-white/60">التحديثات تنعكس في الموقع العام في نفس الوقت دون الحاجة لإعادة التشغيل.</span>
          </div>
          <div className="flex items-center gap-4 text-xs text-white/60">
            <span>مرحباً، <strong className="text-white">{admin?.name}</strong></span>
            <span className="w-1 h-1 rounded-full bg-[#D4AF37]" />
            <span className="text-[#D4AF37]">{roleInfo.nameAr}</span>
          </div>
        </div>

        {/* Content Outlet */}
        <div className="flex-1 p-6 lg:p-10 max-w-[1500px] w-full mx-auto">
          <Outlet />
        </div>
      </main>

      {/* Live Preview Modal */}
      {previewModalOpen && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex flex-col p-4 sm:p-6" onClick={() => setPreviewModalOpen(false)}>
          <div className="bg-[#111] border border-[#D4AF37]/40 flex-1 flex flex-col rounded-xl overflow-hidden shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="p-4 bg-black flex items-center justify-between border-b border-[#D4AF37]/30">
              <div className="flex items-center gap-3">
                <Globe className="text-[#D4AF37]" size={20} />
                <span className="font-display font-bold text-white text-base">المعاينـة المباشرة للموقع العام</span>
                <span className="px-2 py-0.5 bg-[#D4AF37]/10 text-[#D4AF37] text-xs font-bold rounded border border-[#D4AF37]/30">
                  Real-Time Mirror
                </span>
              </div>
              <button
                onClick={() => setPreviewModalOpen(false)}
                className="text-white/60 hover:text-white p-1 rounded transition-colors"
                title="إغلاق المعاينة"
              >
                <X size={22} />
              </button>
            </div>
            <div className="flex-1 bg-white relative">
              <iframe
                src="/"
                title="Public Site Preview"
                className="w-full h-full border-0"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
