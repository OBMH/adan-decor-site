import React, { useState, useEffect } from "react";
import {
  Bell,
  MessageSquare,
  Clock,
  CheckCircle2,
  Trash2,
  User,
  Phone,
  Calendar,
  Sparkles,
  RefreshCw
} from "lucide-react";
import { toast } from "sonner";
import { adminApi } from "./api";
import { getAnalyticsLogs } from "../utils/analytics";

export default function AdminNotifications() {
  const [messages, setMessages] = useState([]);
  const [activityLogs, setActivityLogs] = useState([]);
  const [activeTab, setActiveTab] = useState("messages"); // 'messages' | 'activity'
  const [loading, setLoading] = useState(true);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const res = await adminApi.get("/admin/messages");
      setMessages(res.data || []);
    } catch (err) {
      console.warn("Could not fetch messages:", err);
    } finally {
      setActivityLogs(getAnalyticsLogs());
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleMarkRead = async (id) => {
    try {
      await adminApi.patch(`/admin/messages/${id}/read`);
      setMessages(prev => prev.map(m => m.id === id ? { ...m, is_read: true } : m));
      toast.success("تم تمييز الرسالة كمقروءة");
    } catch (err) {
      toast.error("حدث خطأ");
    }
  };

  const handleDeleteMessage = async (id) => {
    if (!window.confirm("هل أنت متأكد من حذف هذه الرسالة؟")) return;
    try {
      await adminApi.delete(`/admin/messages/${id}`);
      setMessages(prev => prev.filter(m => m.id !== id));
      toast.success("تم حذف الرسالة");
    } catch (err) {
      toast.error("حدث خطأ في الحذف");
    }
  };

  return (
    <div className="space-y-6" dir="rtl">
      {/* Header Banner */}
      <div className="bg-[#111] border border-[#D4AF37]/30 p-6 rounded-xl flex items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[#D4AF37] text-xs font-bold uppercase tracking-wide mb-1">
            <Bell size={16} />
            <span>سجل التتبع والمراسلات الواردة</span>
          </div>
          <h2 className="font-display text-2xl font-bold text-white">
            رسائل العملاء وسجل الحركة ({messages.length})
          </h2>
          <p className="text-white/60 text-sm mt-1">
            تابع رسائل طلبات الاستشارة القادمة من نماذج الاتصال بصفحات الموقع وسجلات نشاط الزائرين.
          </p>
        </div>
        <button
          onClick={fetchMessages}
          className="p-3 bg-black/60 hover:bg-[#D4AF37] text-[#D4AF37] hover:text-black border border-[#D4AF37]/30 rounded-xl transition-all"
          title="تحديث القائمة"
        >
          <RefreshCw size={18} />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[#D4AF37]/20 gap-4">
        <button
          onClick={() => setActiveTab("messages")}
          className={`pb-3 px-4 font-bold text-sm transition-all flex items-center gap-2 border-b-2 ${
            activeTab === "messages"
              ? "border-[#D4AF37] text-[#D4AF37]"
              : "border-transparent text-white/50 hover:text-white"
          }`}
        >
          <MessageSquare size={18} />
          <span>رسائل طلبات الاستشارة ({messages.length})</span>
        </button>
        <button
          onClick={() => setActiveTab("activity")}
          className={`pb-3 px-4 font-bold text-sm transition-all flex items-center gap-2 border-b-2 ${
            activeTab === "activity"
              ? "border-[#D4AF37] text-[#D4AF37]"
              : "border-transparent text-white/50 hover:text-white"
          }`}
        >
          <Clock size={18} />
          <span>سجلات زيارات وحركة الموقع ({activityLogs.length})</span>
        </button>
      </div>

      {/* Tab 1: Messages */}
      {activeTab === "messages" && (
        <div className="space-y-4">
          {messages.length === 0 ? (
            <div className="bg-[#111] border border-[#D4AF37]/20 rounded-xl p-12 text-center text-white/50">
              <MessageSquare size={52} className="mx-auto text-[#D4AF37]/30 mb-3" />
              <h3 className="text-lg font-bold text-white mb-1">لا توجد رسائل واردة حالياً</h3>
              <p className="text-xs text-white/40">ستظهر هنا أي رسائل يرسلها العملاء عبر نموذج الاستشارة في الموقع العام.</p>
            </div>
          ) : (
            messages.map((msg) => (
              <div
                key={msg.id}
                className={`bg-[#111] border p-6 rounded-xl transition-all flex flex-col md:flex-row md:items-center justify-between gap-6 ${
                  msg.is_read ? "border-white/10 opacity-80" : "border-[#D4AF37]/50 shadow-[0_0_15px_rgba(212,175,55,0.1)]"
                }`}
              >
                <div className="space-y-3 flex-1">
                  <div className="flex items-center gap-3">
                    <span className="w-10 h-10 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37] font-bold">
                      <User size={18} />
                    </span>
                    <div>
                      <h4 className="font-bold text-white text-base flex items-center gap-2">
                        {msg.name}
                        {!msg.is_read && <span className="bg-[#D4AF37] text-black text-[10px] px-2 py-0.5 rounded-full font-bold">جديدة</span>}
                      </h4>
                      <div className="flex items-center gap-4 text-xs text-white/60 mt-1">
                        <a href={`tel:${msg.phone}`} className="hover:text-[#D4AF37] flex items-center gap-1 dir-ltr">
                          <Phone size={12} /> {msg.phone}
                        </a>
                        <span className="flex items-center gap-1">
                          <Calendar size={12} /> {msg.created_at ? new Date(msg.created_at).toLocaleDateString('ar-YE') : "اليوم"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {msg.project_type && (
                    <div className="inline-block px-3 py-1 bg-white/5 border border-white/10 rounded text-xs text-[#D4AF37] font-bold">
                      نوع المشروع المطلوب: {msg.project_type} {msg.budget ? `(${msg.budget})` : ""}
                    </div>
                  )}

                  <p className="text-white/80 text-sm bg-black/50 p-4 rounded-lg border border-white/5 leading-relaxed">
                    {msg.message || "لا توجد تفاصيل إضافية في نص الرسالة."}
                  </p>
                </div>

                <div className="flex md:flex-col items-center gap-2 shrink-0">
                  {!msg.is_read && (
                    <button
                      onClick={() => handleMarkRead(msg.id)}
                      className="w-full px-4 py-2 bg-[#D4AF37]/10 hover:bg-[#D4AF37] text-[#D4AF37] hover:text-black border border-[#D4AF37]/30 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5"
                    >
                      <CheckCircle2 size={15} /> تم القراءة
                    </button>
                  )}
                  <button
                    onClick={() => handleDeleteMessage(msg.id)}
                    className="w-full px-4 py-2 bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white border border-red-500/30 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5"
                  >
                    <Trash2 size={15} /> حذف
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Tab 2: Activity Logs */}
      {activeTab === "activity" && (
        <div className="bg-[#111] border border-white/10 rounded-xl p-6">
          {activityLogs.length === 0 ? (
            <div className="text-center py-12 text-white/40 text-sm">
              لا توجد نشاطات مسجلة حتى الآن. ستظهر الحركات عندما يقوم الزوار بتصفح الموقع أو التفاعل معه.
            </div>
          ) : (
            <div className="space-y-3">
              {activityLogs.map((log) => (
                <div
                  key={log.id}
                  className="p-3.5 bg-black/50 border border-white/5 hover:border-white/20 rounded-lg flex items-center justify-between text-xs transition-all"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#D4AF37] shrink-0 shadow-[0_0_8px_rgba(212,175,55,0.5)]" />
                    <span className="text-white font-bold text-sm">
                      {log.event === 'page_visit' && "زيارة من زائر لصفحات الموقع"}
                      {log.event === 'consultation_click' && "النقر على زر طلب استشارة مجانية"}
                      {log.event === 'whatsapp_click' && "النقر على التوجيه السريع لواتساب"}
                      {!['page_visit', 'consultation_click', 'whatsapp_click'].includes(log.event) && log.event}
                    </span>
                  </div>
                  <span className="text-white/40 font-mono text-xs dir-ltr">
                    {log.timestamp ? new Date(log.timestamp).toLocaleTimeString('ar-YE') : "الآن"}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
