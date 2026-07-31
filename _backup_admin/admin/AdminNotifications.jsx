import React, { useEffect, useState } from "react";
import { Loader2, Users, MousePointerClick, MessageCircle, BarChart3, BellOff, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { getAnalyticsLogs } from "../utils/analytics";

export default function AdminNotifications() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    const logs = getAnalyticsLogs();
    setItems(logs);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const clearAll = () => {
    if (!window.confirm("حذف كل السجلات؟")) return;
    localStorage.removeItem("adan_analytics_logs");
    setItems([]);
    toast.success("تم مسح السجلات");
  };

  return (
    <div data-testid="admin-notifications-page">
      <div className="mb-10 flex items-end justify-between gap-4">
        <div>
          <div className="font-en text-[10px] text-[#D4AF37] tracking-[0.3em] mb-3">ACTIVITY LOG</div>
          <h1 className="font-display text-3xl lg:text-4xl text-white">سجل التتبع</h1>
          <p className="font-body text-white/55 mt-2">{items.length} نشاط مسجّل</p>
        </div>
        {items.length > 0 && (
          <button onClick={clearAll} data-testid="clear-all-logs"
            className="border border-red-500/30 text-red-400 px-4 py-2 text-sm hover:bg-red-500/10 flex items-center gap-2">
            <Trash2 size={14} /> مسح السجل
          </button>
        )}
      </div>

      <div className="glass p-5 mb-8 border-l-2 border-l-[#D4AF37]" data-testid="notifications-info">
        <p className="text-sm text-white/70 font-body leading-relaxed">
          <span className="text-[#D4AF37] font-semibold">ملاحظة:</span> هذا السجل يتتبع جميع زيارات الصفحة ونقرات الاستشارة وتحويلات الواتساب لحظياً. 
        </p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20"><Loader2 size={32} className="text-[#D4AF37] animate-spin" /></div>
      ) : items.length === 0 ? (
        <div className="glass p-16 text-center">
          <BellOff size={40} strokeWidth={1.2} className="text-[#D4AF37]/40 mx-auto mb-4" />
          <p className="text-white/50">لا يوجد نشاط مسجل.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {items.map((log, idx) => {
            let label = "نشاط غير معروف";
            let icon = <MousePointerClick size={16} className="text-white/40" />;
            let detail = "";
            
            if (log.event === 'page_visit') {
              label = `زيارة صفحة`;
              detail = log.payload?.path || '/';
              icon = <Users size={16} className="text-emerald-400" />;
            } else if (log.event === 'whatsapp_click') {
              label = `تحويل واتساب`;
              detail = log.payload?.service || log.payload?.source || 'غير محدد';
              icon = <MessageCircle size={16} className="text-blue-400" />;
            } else if (log.event === 'consultation_click') {
              label = `طلب استشارة`;
              detail = log.payload?.service || log.payload?.source || 'غير محدد';
              icon = <MousePointerClick size={16} className="text-[#D4AF37]" />;
            }

            return (
              <div key={`${log.id || 'log'}_${idx}`} data-testid={`log-${log.id}`}
                className={`glass p-5 flex items-start gap-4 hover:border-[#D4AF37]/30 transition-colors bg-white/[0.02]`}>
                <div className={`w-10 h-10 border flex items-center justify-center shrink-0 border-white/15 bg-white/5`}>
                  {icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`font-display text-white`}>{label}</span>
                    <span className="text-[10px] border border-[#D4AF37]/40 text-[#D4AF37] px-2 py-0.5 font-en tracking-wider">NEW</span>
                  </div>
                  <p className="text-sm text-white/60 line-clamp-2 font-body" dir="ltr">{detail}</p>
                </div>
                <div className="flex flex-col items-end gap-2 shrink-0">
                  <span className="text-xs text-white/40 font-en whitespace-nowrap" dir="ltr">
                    {new Date(log.timestamp).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
