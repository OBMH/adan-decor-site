import React, { useEffect, useState } from "react";
import { Users, MousePointerClick, MessageCircle, BarChart3, Loader2 } from "lucide-react";
import { getAnalyticsStats, getAnalyticsLogs } from "../utils/analytics";

function StatCard({ icon: Icon, label, value, accent, testid }) {
  return (
    <div className="glass p-6 lg:p-8 relative group hover:border-[#D4AF37]/40 transition-colors" data-testid={testid}>
      <div className="absolute top-0 right-0 w-6 h-6 border-t border-r border-[#D4AF37]/40" />
      <div className="flex items-start justify-between mb-6">
        <Icon size={28} strokeWidth={1.4} className="text-[#D4AF37]" />
        {accent && (
          <span className="font-en text-[10px] text-[#D4AF37] tracking-[0.25em] px-2 py-1 border border-[#D4AF37]/30">{accent}</span>
        )}
      </div>
      <div className="font-display text-4xl lg:text-5xl text-white mb-2">{value}</div>
      <div className="font-body text-sm text-white/55">{label}</div>
    </div>
  );
}

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch stats from analytics util
    const data = getAnalyticsStats();
    const recentLogs = getAnalyticsLogs().slice(0, 5); // Only get latest 5 for overview
    setStats(data);
    setLogs(recentLogs);
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 size={32} className="text-[#D4AF37] animate-spin" />
      </div>
    );
  }

  return (
    <div data-testid="admin-dashboard">
      <div className="mb-10">
        <div className="font-en text-[10px] text-[#D4AF37] tracking-[0.3em] mb-3">OVERVIEW & ANALYTICS</div>
        <h1 className="font-display text-3xl lg:text-4xl text-white">لوحة الإحصائيات</h1>
        <p className="font-body text-white/55 mt-2">تتبع تفاعل الزوار ومعدلات التحويل إلى واتساب.</p>
      </div>

      <div className="grid sm:grid-cols-3 gap-5 mb-12">
        <StatCard
          icon={Users}
          label="إجمالي الزيارات"
          value={stats?.totalVisits ?? 0}
          testid="stat-total-visits"
        />
        <StatCard
          icon={MousePointerClick}
          label="طلبات الاستشارة"
          value={stats?.consultationClicks ?? 0}
          testid="stat-consultation-clicks"
        />
        <StatCard
          icon={MessageCircle}
          label="تحويلات واتساب"
          value={stats?.whatsappRedirections ?? 0}
          accent="مباشر"
          testid="stat-whatsapp-clicks"
        />
      </div>

      {/* Recent Activity */}
      <div className="glass p-6 lg:p-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <BarChart3 className="text-[#D4AF37]" size={24} />
            <h2 className="font-display text-2xl text-white">أحدث النشاطات</h2>
          </div>
          <span className="font-en text-[10px] text-[#D4AF37] tracking-[0.25em]">RECENT ACTIVITY</span>
        </div>
        
        {logs.length === 0 ? (
          <p className="text-white/40 text-center py-10 font-body">لا يوجد نشاط مسجل حتى الآن.</p>
        ) : (
          <div className="space-y-3">
            {logs.map((log, idx) => {
              let label = "نشاط غير معروف";
              let icon = <MousePointerClick size={16} className="text-white/40" />;
              
              if (log.event === 'page_visit') {
                label = `زيارة لصفحة: ${log.payload?.path || '/'}`;
                icon = <Users size={16} className="text-emerald-400" />;
              } else if (log.event === 'whatsapp_click') {
                label = `تحويل واتساب - الخدمة: ${log.payload?.service || log.payload?.source || 'غير محدد'}`;
                icon = <MessageCircle size={16} className="text-blue-400" />;
              } else if (log.event === 'consultation_click') {
                label = `طلب استشارة - المصدر: ${log.payload?.service || log.payload?.source || 'غير محدد'}`;
                icon = <MousePointerClick size={16} className="text-[#D4AF37]" />;
              }

              return (
                <div
                  key={`${log.id || 'log'}_${idx}`}
                  className="flex items-center justify-between gap-4 p-4 border border-[#D4AF37]/10 hover:border-[#D4AF37]/30 transition-colors bg-white/[0.02]"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center">
                      {icon}
                    </div>
                    <div>
                      <div className="font-body text-white/90 text-sm">{label}</div>
                    </div>
                  </div>
                  <div className="text-xs text-white/40 font-en whitespace-nowrap" dir="ltr">
                    {new Date(log.timestamp).toLocaleTimeString("en-US", { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
