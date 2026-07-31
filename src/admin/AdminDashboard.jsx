import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  LayoutDashboard,
  Briefcase,
  Layers,
  Image as ImageIcon,
  MessageSquareQuote,
  Eye,
  MessageCircle,
  TrendingUp,
  Clock,
  Sparkles,
  ArrowLeft,
  Database,
  CheckCircle2,
  RefreshCw
} from "lucide-react";
import { useSiteData } from "../contexts/SiteContext";
import { getAnalyticsStats, getAnalyticsLogs } from "../utils/analytics";

export default function AdminDashboard() {
  const { projects = [], services = [], testimonials = [], media = [], syncStatus, lastSyncedAt } = useSiteData();
  const [analytics, setAnalytics] = useState({ totalVisits: 0, consultationClicks: 0, whatsappRedirections: 0 });
  const [recentLogs, setRecentLogs] = useState([]);

  const refreshAnalytics = () => {
    setAnalytics(getAnalyticsStats());
    setRecentLogs(getAnalyticsLogs().slice(0, 8));
  };

  useEffect(() => {
    refreshAnalytics();
    const interval = setInterval(refreshAnalytics, 15000);
    return () => clearInterval(interval);
  }, []);

  const statsCards = [
    { label: "إجمالي أعداد الزيارات", value: analytics.totalVisits || 1, icon: Eye, color: "text-blue-400", bg: "bg-blue-400/10", border: "border-blue-400/20", unit: "زيارة للموقع" },
    { label: "طلبات الاستشارة والنقرات", value: analytics.consultationClicks || 0, icon: TrendingUp, color: "text-[#D4AF37]", bg: "bg-[#D4AF37]/10", border: "border-[#D4AF37]/20", unit: "تفاعل واستفسار" },
    { label: "التحويلات لعبر الواتساب", value: analytics.whatsappRedirections || 0, icon: MessageCircle, color: "text-emerald-400", bg: "bg-emerald-400/10", border: "border-emerald-400/20", unit: "محادثة مباشرة" },
    { label: "مشاريع معرض الأعمال", value: projects.length || 0, icon: Briefcase, color: "text-purple-400", bg: "bg-purple-400/10", border: "border-purple-400/20", unit: "مشروع مسجل" },
  ];

  const quickLinks = [
    { title: "تعديل صفحات الموقع", desc: "النصوص، العناوين، والشعارات في الرئيسية والخدمات ومن نحن.", to: "/admin/pages", icon: Sparkles, color: "text-[#D4AF37]" },
    { title: "إدارة معرض المشاريع", desc: "إضافة أو تعديل صور وتفاصيل مشاريع الديكور والمقاولات.", to: "/admin/projects", icon: Briefcase, color: "text-purple-400" },
    { title: "إدارة الخدمات والقطاعات", desc: "تعديل أقسام الخدمات، الأوصاف والأيقونات التخصصية.", to: "/admin/services", icon: Layers, color: "text-blue-400" },
    { title: "مكتبة الصور والوسائط", desc: "رفع ملفات الصور الحقيقية واستبدالها وإدارتها في قاعدة البيانات.", to: "/admin/media", icon: ImageIcon, color: "text-emerald-400" },
    { title: "آراء وشهادات العملاء", desc: "مراجعة وتعديل آراء العملاء المعروضة في الصفحة الرئيسية.", to: "/admin/testimonials", icon: MessageSquareQuote, color: "text-rose-400" },
  ];

  return (
    <div className="space-y-8" dir="rtl">
      {/* Header Banner */}
      <div className="bg-gradient-to-l from-[#111] via-[#151515] to-[#1a1a14] border border-[#D4AF37]/30 rounded-2xl p-6 lg:p-8 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 left-0 w-80 h-80 bg-[#D4AF37]/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-l from-transparent via-[#D4AF37]/80 to-transparent" />
        
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 text-[#D4AF37] text-xs font-bold uppercase tracking-wider mb-2">
              <LayoutDashboard size={16} />
              <span>نظرة عامة على الإدارة والمحتوى</span>
            </div>
            <h2 className="text-2xl lg:text-3xl font-display font-bold text-white mb-2">
              لوحة التحكم المركزية — عدن للديكور
            </h2>
            <p className="text-white/60 text-sm max-w-3xl leading-relaxed">
              تتيح لك هذه اللوحة التحكم الفوري والمباشر في كافة نصوص وصور وأقسام الموقع. أي تغيير تقيمه هنا يتم حفظه مباشرة في قاعدة البيانات لينعكس فوراً في الموقع العام بشكل دائم.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={refreshAnalytics}
              className="p-3 bg-black/60 hover:bg-[#D4AF37] text-[#D4AF37] hover:text-black border border-[#D4AF37]/30 rounded-xl transition-all"
              title="تحديث الإحصائيات"
            >
              <RefreshCw size={18} />
            </button>
            <div className="px-4 py-3 bg-black/70 border border-[#D4AF37]/20 rounded-xl flex items-center gap-3">
              <Database className="text-[#D4AF37]" size={20} />
              <div className="text-xs">
                <div className="text-white font-bold flex items-center gap-1.5">
                  <CheckCircle2 size={13} className="text-emerald-400" /> اتصال متزامن مباشر
                </div>
                <div className="text-white/40 mt-0.5">آخر تحديث: {lastSyncedAt || "مباشر"}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {statsCards.map((st, idx) => (
          <div
            key={idx}
            className={`bg-[#111] border ${st.border} p-5 rounded-xl hover:scale-[1.02] transition-transform duration-200 relative overflow-hidden flex flex-col justify-between`}
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold text-white/70">{st.label}</span>
              <div className={`p-2.5 rounded-lg ${st.bg} ${st.color}`}>
                <st.icon size={20} />
              </div>
            </div>
            <div>
              <div className="text-3xl font-display font-bold text-white mb-1 dir-ltr text-right">
                {st.value}
              </div>
              <span className="text-[11px] font-bold text-[#D4AF37]/70">{st.unit}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Access Links */}
      <div className="space-y-4">
        <h3 className="font-display font-bold text-lg text-white flex items-center gap-2">
          <Sparkles className="text-[#D4AF37]" size={18} />
          <span>الأقسام والوصول السريع</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {quickLinks.map((ql, idx) => (
            <Link
              key={idx}
              to={ql.to}
              className="bg-[#111] border border-[#D4AF37]/20 hover:border-[#D4AF37] p-5 rounded-xl transition-all duration-300 group flex flex-col justify-between hover:shadow-[0_0_20px_rgba(212,175,55,0.15)]"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className={`p-3 rounded-lg bg-black/60 border border-white/5 ${ql.color}`}>
                    <ql.icon size={22} />
                  </div>
                  <span className="text-white/40 group-hover:text-[#D4AF37] group-hover:-translate-x-1 transition-transform">
                    <ArrowLeft size={18} />
                  </span>
                </div>
                <h4 className="font-display font-bold text-white text-base mb-1.5 group-hover:text-[#D4AF37] transition-colors">
                  {ql.title}
                </h4>
                <p className="text-xs text-white/50 leading-relaxed">{ql.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Activity Section */}
      <div className="bg-[#111] border border-[#D4AF37]/20 rounded-xl p-6">
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#D4AF37]/20">
          <h3 className="font-display font-bold text-base text-white flex items-center gap-2">
            <Clock className="text-[#D4AF37]" size={18} />
            <span>آخر النشاطات وحركة الزوار بالموقع</span>
          </h3>
          <span className="text-xs text-white/40">تحديث فوري تلقائي</span>
        </div>
        
        {recentLogs.length === 0 ? (
          <div className="text-center py-8 text-white/40 text-sm">
            لا توجد سجلات نشاط مسجلة حتى الآن في الجلسة الحالية.
          </div>
        ) : (
          <div className="space-y-3">
            {recentLogs.map((log) => (
              <div
                key={log.id || Math.random()}
                className="p-3.5 bg-black/50 border border-white/5 rounded-lg flex items-center justify-between text-xs transition-colors hover:border-white/20"
              >
                <div className="flex items-center gap-3">
                  <span className="w-2 h-2 rounded-full bg-[#D4AF37] shrink-0" />
                  <span className="text-white font-bold">
                    {log.event === 'page_visit' && "زيارة لصفحة من الموقع"}
                    {log.event === 'consultation_click' && "النقر على طلب استشارة"}
                    {log.event === 'whatsapp_click' && "الانتقال لمحادثة واتساب"}
                    {!['page_visit', 'consultation_click', 'whatsapp_click'].includes(log.event) && log.event}
                  </span>
                </div>
                <span className="text-white/40 dir-ltr font-mono text-[11px]">
                  {log.timestamp ? new Date(log.timestamp).toLocaleTimeString('ar-YE') : "الآن"}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
