import React, { useState } from "react";
import {
  MessageSquareQuote,
  Plus,
  Edit2,
  Trash2,
  Check,
  X,
  Star,
  Quote,
  UserCheck
} from "lucide-react";
import { toast } from "sonner";
import { useSiteData } from "../contexts/SiteContext";

export default function AdminTestimonials() {
  const { testimonials = [], addTestimonial, updateTestimonial, deleteTestimonial } = useSiteData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState(null);
  const [formData, setFormData] = useState(getEmpty());

  function getEmpty() {
    return {
      name: "",
      role: "عميل لمشروع سكنـي في عدن",
      quote: "",
      order: (testimonials?.length || 0) + 1,
    };
  }

  const handleOpenCreate = () => {
    setEditingTestimonial(null);
    setFormData({ ...getEmpty(), order: testimonials.length + 1 });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (t) => {
    setEditingTestimonial(t);
    setFormData({ ...getEmpty(), ...t });
    setIsModalOpen(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.quote.trim()) {
      toast.error("يرجى إدخال اسم العميل ونَص الشهادة");
      return;
    }

    const cleanData = {
      ...formData,
      order: Number(formData.order) || 1,
    };

    if (editingTestimonial) {
      updateTestimonial(editingTestimonial.id, cleanData);
      toast.success("تم تحديث الشهادة بنجاح");
    } else {
      addTestimonial(cleanData);
      toast.success("تم إدراج الشهادة الجديدة بنجاح");
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id, name) => {
    if (window.confirm(`هل أنت متأكد من حذف رأي العميل "${name}"؟`)) {
      deleteTestimonial(id);
      toast.success("تم الحذف من القائمة");
    }
  };

  const sorted = [...testimonials].sort((a, b) => (a.order || 0) - (b.order || 0));

  return (
    <div className="space-y-6" dir="rtl">
      {/* Header Banner */}
      <div className="bg-[#111] border border-[#D4AF37]/30 p-6 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[#D4AF37] text-xs font-bold uppercase tracking-wide mb-1">
            <MessageSquareQuote size={16} />
            <span>إدارة ثقة العملاء والشهادات الحية</span>
          </div>
          <h2 className="font-display text-2xl font-bold text-white">
            آراء العملاء والشهادات ({testimonials.length})
          </h2>
          <p className="text-white/60 text-sm mt-1">
            إدارة آراء العملاء المعروضة في قسم الشهادات بالصفحة الرئيسية لتعزيز المصداقية. التعديلات تُحفظ مباشرة بقاعدة البيانات.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="bg-[#D4AF37] text-black px-6 py-3.5 rounded-lg font-display font-bold text-sm hover:bg-[#C5A030] transition-all flex items-center gap-2 shadow-[0_0_20px_rgba(212,175,55,0.25)] shrink-0"
        >
          <Plus size={18} />
          <span>إضافة شهادة عميل جديدة</span>
        </button>
      </div>

      {/* Grid */}
      {sorted.length === 0 ? (
        <div className="bg-[#111] border border-[#D4AF37]/20 rounded-xl p-12 text-center text-white/50">
          <MessageSquareQuote size={52} className="mx-auto text-[#D4AF37]/30 mb-3" />
          <h3 className="text-lg font-bold text-white mb-1">لا توجد شهادات مسجلة</h3>
          <p className="text-xs text-white/40">انقر على زر "إضافة شهادة عميل جديدة" لإدراج الرأي الأول.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sorted.map((item) => (
            <div
              key={item.id}
              className="bg-[#111] border border-[#D4AF37]/20 hover:border-[#D4AF37] p-6 rounded-xl transition-all flex flex-col justify-between group relative overflow-hidden"
            >
              <Quote className="absolute top-4 left-4 text-white/5 w-16 h-16 pointer-events-none" />

              <div>
                <div className="flex items-center gap-1 text-[#D4AF37] mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={15} fill="#D4AF37" />
                  ))}
                  <span className="text-white/40 font-mono text-[11px] mr-auto">#{item.order}</span>
                </div>

                <p className="text-white/80 text-sm leading-relaxed italic mb-6 relative z-10">
                  "{item.quote}"
                </p>
              </div>

              <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37] font-bold text-xs">
                    {(item.name || "ع").charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-xs">{item.name}</h4>
                    <p className="text-[10px] text-[#D4AF37]/80">{item.role}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleOpenEdit(item)}
                    className="p-2 bg-[#D4AF37]/10 hover:bg-[#D4AF37] text-[#D4AF37] hover:text-black rounded-lg transition-colors text-xs"
                    title="تعديل الشهادة"
                  >
                    <Edit2 size={15} />
                  </button>
                  <button
                    onClick={() => handleDelete(item.id, item.name)}
                    className="p-2 bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white rounded-lg transition-colors text-xs"
                    title="حذف الشهادة"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4" onClick={() => setIsModalOpen(false)}>
          <div
            className="bg-[#111] border border-[#D4AF37]/40 w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 bg-black border-b border-[#D4AF37]/20 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-[#D4AF37]/10 border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37]">
                  <MessageSquareQuote size={18} />
                </div>
                <h3 className="font-display font-bold text-lg text-white">
                  {editingTestimonial ? "تعديل رأي العميل" : "إضافة شهادة عميل جديدة"}
                </h3>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-white/50 hover:text-white p-1">
                <X size={22} />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-white/80 mb-2">اسم العميل <span className="text-[#D4AF37]">*</span>:</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-black border border-[#D4AF37]/30 text-white rounded-lg p-3 text-sm focus:outline-none focus:border-[#D4AF37]"
                    placeholder="مثال: د. محمد العولقي"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-white/80 mb-2">الترتيب:</label>
                  <input
                    type="number"
                    min={1}
                    value={formData.order || 1}
                    onChange={(e) => setFormData({ ...formData, order: Number(e.target.value) })}
                    className="w-full bg-black border border-[#D4AF37]/30 text-white rounded-lg p-3 text-sm text-center dir-ltr"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-white/80 mb-2">صفة أو مشروع العميل:</label>
                <input
                  type="text"
                  value={formData.role || ""}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full bg-black border border-[#D4AF37]/30 text-white rounded-lg p-3 text-sm focus:outline-none focus:border-[#D4AF37]"
                  placeholder="مثال: عميل فيلا سكنية — خور مكسر"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-white/80 mb-2">نَص الرأي والشهادة <span className="text-[#D4AF37]">*</span>:</label>
                <textarea
                  rows={4}
                  required
                  value={formData.quote}
                  onChange={(e) => setFormData({ ...formData, quote: e.target.value })}
                  className="w-full bg-black border border-[#D4AF37]/30 text-white rounded-lg p-3 text-sm focus:outline-none focus:border-[#D4AF37] leading-relaxed"
                  placeholder="اكتب انطباع العميل عن جودة التصميم والتنفيذ والالتزام بالوقت..."
                />
              </div>

              <div className="pt-4 border-t border-white/10 flex items-center justify-end gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm font-bold transition-colors">
                  إلغاء
                </button>
                <button type="submit" className="px-6 py-2.5 bg-[#D4AF37] hover:bg-[#C5A030] text-black rounded-lg text-sm font-bold transition-all shadow-md flex items-center gap-2">
                  <Check size={18} />
                  <span>{editingTestimonial ? "حفظ التعديلات" : "إعتماد الشهادة"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
