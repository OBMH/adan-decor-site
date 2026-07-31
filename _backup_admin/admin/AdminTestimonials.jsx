import React, { useState } from "react";
import { Plus, Trash2, Edit2, X, Quote } from "lucide-react";
import { toast } from "sonner";
import { useSiteData } from "../contexts/SiteContext";

const EMPTY = { name: "", role: "Aden, Yemen", quote: "", order: 0 };

export default function AdminTestimonials() {
  const site = useSiteData();
  const testimonials = site.testimonials || [];
  const [editing, setEditing] = useState(null);

  const save = () => {
    if (!editing.name || !editing.quote) {
      toast.error("الاسم والاقتباس مطلوبان");
      return;
    }

    if (editing.id) {
      site.updateTestimonial(editing.id, editing);
      toast.success("تم تحديث الشهادة بنجاح");
    } else {
      site.addTestimonial(editing);
      toast.success("تمت إضافة الشهادة بنجاح");
    }
    setEditing(null);
  };

  const remove = (id) => {
    if (!window.confirm("حذف هذه الشهادة؟")) return;
    site.deleteTestimonial(id);
    toast.success("تم حذف الشهادة بنجاح");
  };

  return (
    <div data-testid="admin-testimonials-page">
      <div className="mb-10 flex items-end justify-between gap-4">
        <div>
          <div className="font-en text-[10px] text-[#D4AF37] tracking-[0.3em] mb-3">TESTIMONIALS</div>
          <h1 className="font-display text-3xl lg:text-4xl text-white">إدارة شهادات العملاء الموحدة</h1>
          <p className="font-body text-white/55 mt-2">{testimonials.length} شهادة مسجلة</p>
        </div>
        <button
          onClick={() => setEditing({ ...EMPTY, order: testimonials.length + 1 })}
          data-testid="add-testimonial-btn"
          className="bg-[#D4AF37] text-black px-5 py-3 text-sm font-bold flex items-center gap-2 hover:bg-[#C5A030] transition-colors rounded-sm shadow-md"
        >
          <Plus size={18} /> إضافة شهادة جديدة
        </button>
      </div>

      {testimonials.length === 0 ? (
        <div className="glass p-12 text-center text-white/50">
          <p className="mb-2">لا توجد شهادات حتى الآن.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {testimonials.map((t, idx) => (
            <div key={`${t.id}_${idx}`} data-testid={`testimonial-card-${t.id}`} className="glass p-6 group relative flex flex-col justify-between">
              <Quote size={32} strokeWidth={1} className="text-[#D4AF37]/20 absolute top-4 left-4" />
              <div>
                <p className="font-display text-white leading-relaxed mb-4 line-clamp-4">«{t.quote}»</p>
              </div>
              <div className="border-t border-[#D4AF37]/10 pt-3 flex items-center justify-between mt-auto">
                <div>
                  <div className="text-[#D4AF37] text-sm font-display">{t.name}</div>
                  <div className="text-xs text-white/40 font-en">{t.role}</div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setEditing(t)}
                    data-testid={`edit-testimonial-${t.id}`}
                    className="border border-[#D4AF37]/30 text-[#D4AF37] p-2 hover:bg-[#D4AF37]/10 rounded-sm transition-colors"
                  >
                    <Edit2 size={14} />
                  </button>
                  <button
                    onClick={() => remove(t.id)}
                    data-testid={`delete-testimonial-${t.id}`}
                    className="border border-red-500/30 text-red-400 p-2 hover:bg-red-500/10 rounded-sm transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {editing && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-start justify-center p-4 overflow-y-auto"
          onClick={() => setEditing(null)}
        >
          <div
            className="glass max-w-lg w-full p-8 my-8 relative"
            onClick={(e) => e.stopPropagation()}
            data-testid="testimonial-form"
          >
            <button
              onClick={() => setEditing(null)}
              className="absolute top-4 left-4 text-white/50 hover:text-[#D4AF37]"
            >
              <X size={22} />
            </button>
            <div className="absolute top-0 right-0 w-10 h-10 border-t border-r border-[#D4AF37]" />
            <h2 className="font-display text-2xl text-white mb-8">
              {editing.id ? "تعديل الشهادة" : "شهادة جديدة"}
            </h2>
            <div className="space-y-5">
              <div>
                <label className="text-[10px] text-[#D4AF37] font-en tracking-[0.25em] block mb-1">NAME · الاسم</label>
                <input
                  className="luxe-input"
                  value={editing.name || ""}
                  onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                  data-testid="testimonial-name"
                />
              </div>
              <div>
                <label className="text-[10px] text-[#D4AF37] font-en tracking-[0.25em] block mb-1">ROLE · الصفة أو المدينة</label>
                <input
                  className="luxe-input"
                  value={editing.role || ""}
                  onChange={(e) => setEditing({ ...editing, role: e.target.value })}
                  data-testid="testimonial-role"
                />
              </div>
              <div>
                <label className="text-[10px] text-[#D4AF37] font-en tracking-[0.25em] block mb-1">QUOTE · الاقتباس</label>
                <textarea
                  rows={5}
                  className="luxe-input resize-none"
                  value={editing.quote || ""}
                  onChange={(e) => setEditing({ ...editing, quote: e.target.value })}
                  data-testid="testimonial-quote"
                />
              </div>
              <div>
                <label className="text-[10px] text-[#D4AF37] font-en tracking-[0.25em] block mb-1">ORDER · الترتيب</label>
                <input
                  type="number"
                  className="luxe-input"
                  value={editing.order || 0}
                  onChange={(e) => setEditing({ ...editing, order: parseInt(e.target.value) || 0 })}
                />
              </div>
              <div className="flex gap-3 pt-4 border-t border-[#D4AF37]/10">
                <button
                  onClick={save}
                  data-testid="save-testimonial"
                  className="flex-1 bg-[#D4AF37] text-black py-3 font-bold hover:bg-[#C5A030] transition-colors rounded-sm"
                >
                  حفظ
                </button>
                <button
                  onClick={() => setEditing(null)}
                  className="px-6 border border-[#D4AF37]/30 text-[#D4AF37] hover:bg-[#D4AF37]/5 rounded-sm"
                >
                  إلغاء
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
