import React, { useState } from "react";
import {
  Plus, Trash2, Edit2, X, Image as ImageIcon, Layers, FileText,
  Sparkles, CheckCircle2, ListPlus, FolderPlus, ArrowUpRight
} from "lucide-react";
import { toast } from "sonner";
import { useSiteData } from "../contexts/SiteContext";
import { MediaPickerModal } from "../components/MediaPickerModal";
import SafeImage from "../components/SafeImage";

const ICON_OPTIONS = [
  "LayoutPanelTop", "BedDouble", "Armchair", "Lamp", "Hammer",
  "Briefcase", "Layers", "Hotel", "Home", "Crown",
  "Mountain", "RectangleHorizontal", "Trees", "Layers3", "Construction",
  "PaintBucket", "Sparkles", "Building2", "GlassWater", "Sofa",
  "Boxes", "TreePine", "Utensils",
];

const CATEGORY_OPTIONS = [
  { id: "interior", title: "الديكور الداخلي والتشطيبات" },
  { id: "aluminum", title: "أعمال الألمنيوم والواجهات" },
  { id: "carpentry", title: "النجارة والديكور الخشبي المخصص" },
  { id: "commercial", title: "المشاريع التجارية والطبية" },
  { id: "construction", title: "العوازل والترميم الإنشائي" },
];

const EMPTY = {
  categoryId: "interior",
  categoryTitle: "الديكور الداخلي والتشطيبات",
  icon: "Crown",
  title: "",
  desc: "",
  image: "",
  fullDescription: "",
  subServices: [], // [{ title, desc }]
  features: [], // [string]
  gallery: [], // [string URLs]
  ctaText: "اطلب استشارة مجانية للخدمة",
  ctaSubtext: "تواصل مع مهندسينا المختصين لبدء تنفيذ مشروعك بأعلى معايير الفخامة.",
  order: 0,
};

export default function AdminServices() {
  const site = useSiteData();
  const services = site.services || [];
  const [editing, setEditing] = useState(null);
  const [activeFormTab, setActiveFormTab] = useState("basic"); // 'basic' | 'content' | 'subservices' | 'gallery'
  const [isMediaPickerOpen, setIsMediaPickerOpen] = useState(false);
  const [mediaTargetField, setMediaTargetField] = useState("image"); // 'image' or 'gallery'

  const openCreate = () => {
    setEditing({ ...EMPTY, order: services.length + 1 });
    setActiveFormTab("basic");
  };

  const openEdit = (s) => {
    setEditing({
      ...EMPTY,
      ...s,
      subServices: Array.isArray(s.subServices) ? s.subServices : [],
      features: Array.isArray(s.features) ? s.features : [],
      gallery: Array.isArray(s.gallery) ? s.gallery : [],
    });
    setActiveFormTab("basic");
  };

  const save = () => {
    if (!editing.title || !editing.desc) {
      toast.error("العنوان والوصف المختصر مطلوبان");
      return;
    }

    if (editing.id) {
      site.updateService(editing.id, editing);
      toast.success("تم تحديث جميع بيانات الخدمة ومحتواها الداخلي بنجاح");
    } else {
      site.addService(editing);
      toast.success("تمت إضافة الخدمة الجديدة بنجاح");
    }
    setEditing(null);
  };

  const remove = (id) => {
    if (!window.confirm("حذف هذه الخدمة بالكامل؟ ستختفي من الصفحة الرئيسية والصفحة الداخلية فوراً.")) return;
    site.deleteService(id);
    toast.success("تم حذف الخدمة بنجاح");
  };

  // Sub-service item handlers
  const addSubServiceItem = () => {
    setEditing((prev) => ({
      ...prev,
      subServices: [...(prev.subServices || []), { title: "", desc: "" }],
    }));
  };

  const updateSubServiceItem = (index, field, value) => {
    setEditing((prev) => {
      const updated = [...(prev.subServices || [])];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, subServices: updated };
    });
  };

  const removeSubServiceItem = (index) => {
    setEditing((prev) => ({
      ...prev,
      subServices: (prev.subServices || []).filter((_, i) => i !== index),
    }));
  };

  // Gallery image handlers
  const handleMediaSelect = (url) => {
    if (mediaTargetField === "image") {
      setEditing((prev) => ({ ...prev, image: url }));
    } else if (mediaTargetField === "gallery") {
      setEditing((prev) => ({
        ...prev,
        gallery: [...(prev.gallery || []), url],
      }));
    }
  };

  const removeGalleryImage = (index) => {
    setEditing((prev) => ({
      ...prev,
      gallery: (prev.gallery || []).filter((_, i) => i !== index),
    }));
  };

  return (
    <div data-testid="admin-services-page" className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#D4AF37]/20 pb-6">
        <div>
          <div className="font-en text-[10px] text-[#D4AF37] tracking-[0.3em] mb-2 flex items-center gap-2">
            <Sparkles size={14} /> ENTERPRISE SERVICES MANAGEMENT
          </div>
          <h1 className="font-display text-3xl lg:text-4xl text-white">إدارة الخدمات والصفحات الداخلية</h1>
          <p className="font-body text-white/60 mt-2">
            {services.length} خدمة متاحة للتعديل الشامل (بطاقات العرض، التفاصيل الداخلية، المعارض والخدمات الفرعية).
          </p>
        </div>
        <button
          onClick={openCreate}
          data-testid="add-service-btn"
          className="bg-[#D4AF37] text-black px-6 py-3.5 text-sm font-bold flex items-center gap-2 hover:bg-[#C5A030] transition-colors rounded-sm shadow-md shrink-0"
        >
          <Plus size={18} /> إضافة خدمة جديدة
        </button>
      </div>

      {/* Services Grid */}
      {services.length === 0 ? (
        <div className="glass p-16 text-center text-white/50 rounded-lg">
          <p className="mb-4">لا توجد خدمات حالياً.</p>
          <button onClick={openCreate} className="text-[#D4AF37] underline font-bold">
            أنشئ أول خدمة
          </button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((s, sIdx) => (
            <div
              key={`${s.id}_${sIdx}`}
              data-testid={`service-card-${s.id}`}
              className="glass p-6 group relative flex flex-col justify-between rounded-lg border border-[#D4AF37]/20 hover:border-[#D4AF37] transition-all bg-[#0A0A0A]"
            >
              <div>
                <div className="flex items-center justify-between mb-3 border-b border-[#D4AF37]/10 pb-2">
                  <span className="font-en text-[10px] text-[#D4AF37] tracking-[0.25em] font-bold">{s.icon}</span>
                  <span className="text-[11px] text-white/40 font-body">{s.categoryTitle || s.categoryId}</span>
                </div>

                {s.image && (
                  <div className="mb-4 h-36 w-full overflow-hidden rounded-sm border border-[#D4AF37]/20 relative">
                    <SafeImage src={s.image} alt={s.title} fallbackType="portfolio" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    {Array.isArray(s.gallery) && s.gallery.length > 0 && (
                      <span className="absolute bottom-2 left-2 bg-black/80 backdrop-blur text-[#D4AF37] text-[10px] font-bold px-2 py-0.5 rounded border border-[#D4AF37]/30">
                        {s.gallery.length} صور في المعرض
                      </span>
                    )}
                  </div>
                )}

                <h3 className="font-display text-xl text-white mb-2">{s.title}</h3>
                <p className="text-xs text-white/60 leading-relaxed line-clamp-3 mb-4">{s.desc}</p>

                {Array.isArray(s.subServices) && s.subServices.length > 0 && (
                  <div className="text-[11px] text-[#D4AF37]/80 bg-[#D4AF37]/5 p-2 rounded mb-4 border border-[#D4AF37]/10">
                    يتضمن {s.subServices.length} خدمات فرعية مخصصة
                  </div>
                )}
              </div>

              <div className="flex gap-2 pt-3 border-t border-[#D4AF37]/10 mt-auto">
                <button
                  onClick={() => openEdit(s)}
                  data-testid={`edit-service-${s.id}`}
                  className="flex-1 border border-[#D4AF37]/40 text-[#D4AF37] py-2 text-xs font-bold hover:bg-[#D4AF37]/10 flex items-center justify-center gap-2 transition-colors rounded-sm"
                >
                  <Edit2 size={14} /> تعديل وإدارة المحتوى
                </button>
                <button
                  onClick={() => remove(s.id)}
                  data-testid={`delete-service-${s.id}`}
                  className="border border-red-500/30 text-red-400 px-3 py-2 hover:bg-red-500/10 transition-colors rounded-sm"
                  title="حذف"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* COMPREHENSIVE SERVICE EDITOR MODAL */}
      {editing && (
        <div
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-start justify-center p-4 overflow-y-auto"
          onClick={() => setEditing(null)}
        >
          <div
            className="bg-[#111] border border-[#D4AF37] max-w-3xl w-full p-6 lg:p-8 my-8 relative rounded-xl shadow-2xl"
            onClick={(e) => e.stopPropagation()}
            data-testid="service-form"
          >
            <button
              onClick={() => setEditing(null)}
              className="absolute top-4 left-4 text-white/50 hover:text-[#D4AF37]"
            >
              <X size={22} />
            </button>
            <div className="absolute top-0 right-0 w-10 h-10 border-t-2 border-r-2 border-[#D4AF37]" />

            <div className="mb-6">
              <div className="font-en text-[10px] text-[#D4AF37] tracking-[0.25em] mb-1">SERVICE CONTENT EDITOR</div>
              <h2 className="font-display text-2xl text-white">
                {editing.id ? `تعديل خدمة: ${editing.title || ""}` : "إضافة خدمة احترافية جديدة"}
              </h2>
            </div>

            {/* Editor Tabs */}
            <div className="flex items-center gap-2 mb-6 border-b border-[#D4AF37]/20 overflow-x-auto pb-2">
              <button
                onClick={() => setActiveFormTab("basic")}
                className={`px-4 py-2 text-xs font-bold rounded-sm transition-colors whitespace-nowrap ${
                  activeFormTab === "basic"
                    ? "bg-[#D4AF37] text-black"
                    : "bg-white/5 text-white/70 hover:text-white"
                }`}
              >
                1. البيانات الأساسية
              </button>

              <button
                onClick={() => setActiveFormTab("content")}
                className={`px-4 py-2 text-xs font-bold rounded-sm transition-colors whitespace-nowrap ${
                  activeFormTab === "content"
                    ? "bg-[#D4AF37] text-black"
                    : "bg-white/5 text-white/70 hover:text-white"
                }`}
              >
                2. الصفحة الداخلية والدعوة (CTA)
              </button>

              <button
                onClick={() => setActiveFormTab("subservices")}
                className={`px-4 py-2 text-xs font-bold rounded-sm transition-colors whitespace-nowrap ${
                  activeFormTab === "subservices"
                    ? "bg-[#D4AF37] text-black"
                    : "bg-white/5 text-white/70 hover:text-white"
                }`}
              >
                3. الخدمات الفرعية ({editing.subServices?.length || 0})
              </button>

              <button
                onClick={() => setActiveFormTab("gallery")}
                className={`px-4 py-2 text-xs font-bold rounded-sm transition-colors whitespace-nowrap ${
                  activeFormTab === "gallery"
                    ? "bg-[#D4AF37] text-black"
                    : "bg-white/5 text-white/70 hover:text-white"
                }`}
              >
                4. المعرض الداخلي ({editing.gallery?.length || 0})
              </button>
            </div>

            {/* TAB 1: BASIC INFO */}
            {activeFormTab === "basic" && (
              <div className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="text-[10px] text-[#D4AF37] font-en tracking-[0.25em] block mb-1">CATEGORY · القطاع الرئيسي</label>
                    <select
                      className="w-full bg-black border border-[#D4AF37]/30 text-white p-3 rounded-sm focus:border-[#D4AF37] outline-none text-sm"
                      value={editing.categoryId || "interior"}
                      onChange={(e) => {
                        const catObj = CATEGORY_OPTIONS.find((c) => c.id === e.target.value);
                        setEditing({
                          ...editing,
                          categoryId: e.target.value,
                          categoryTitle: catObj ? catObj.title : e.target.value,
                        });
                      }}
                      data-testid="service-category"
                    >
                      {CATEGORY_OPTIONS.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.title}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] text-[#D4AF37] font-en tracking-[0.25em] block mb-1">ICON · الأيقونة</label>
                    <select
                      className="w-full bg-black border border-[#D4AF37]/30 text-white p-3 rounded-sm focus:border-[#D4AF37] outline-none text-sm"
                      value={editing.icon || "Crown"}
                      onChange={(e) => setEditing({ ...editing, icon: e.target.value })}
                      data-testid="service-icon"
                    >
                      {ICON_OPTIONS.map((i) => (
                        <option key={i} value={i}>
                          {i}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-[10px] text-[#D4AF37] font-en tracking-[0.25em] block mb-1">TITLE · عنوان الخدمة الرئيسي</label>
                  <input
                    className="w-full bg-black border border-[#D4AF37]/30 text-white p-3 rounded-sm focus:border-[#D4AF37] outline-none text-sm"
                    value={editing.title || ""}
                    onChange={(e) => setEditing({ ...editing, title: e.target.value })}
                    placeholder="مثال: تخطيط المساحات والتصميم المعماري..."
                    data-testid="service-title"
                  />
                </div>

                <div>
                  <label className="text-[10px] text-[#D4AF37] font-en tracking-[0.25em] block mb-1">SHORT DESCRIPTION · الوصف المختصر للبطاقة</label>
                  <textarea
                    rows={3}
                    className="w-full bg-black border border-[#D4AF37]/30 text-white p-3 rounded-sm focus:border-[#D4AF37] outline-none text-sm resize-none"
                    value={editing.desc || ""}
                    onChange={(e) => setEditing({ ...editing, desc: e.target.value })}
                    data-testid="service-desc"
                  />
                </div>

                <div>
                  <label className="text-[10px] text-[#D4AF37] font-en tracking-[0.25em] block mb-1">MAIN COVER IMAGE · صورة الغلاف للخدمة</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      className="w-full bg-black border border-[#D4AF37]/30 text-white p-3 rounded-sm focus:border-[#D4AF37] outline-none text-sm dir-ltr text-left flex-1"
                      placeholder="رابط الصورة الرئيسي..."
                      value={editing.image || ""}
                      onChange={(e) => setEditing({ ...editing, image: e.target.value })}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setMediaTargetField("image");
                        setIsMediaPickerOpen(true);
                      }}
                      className="bg-[#D4AF37]/10 text-[#D4AF37] px-4 py-2 hover:bg-[#D4AF37]/20 transition-colors border border-[#D4AF37]/30 rounded-sm flex items-center gap-2 text-xs font-bold whitespace-nowrap"
                    >
                      <ImageIcon size={16} /> مكتبة الوسائط
                    </button>
                  </div>
                  {editing.image && (
                    <div className="mt-3 h-28 w-full overflow-hidden rounded border border-[#D4AF37]/20">
                      <SafeImage src={editing.image} alt="Preview" fallbackType="portfolio" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>

                <div>
                  <label className="text-[10px] text-[#D4AF37] font-en tracking-[0.25em] block mb-1">ORDER · الترتيب</label>
                  <input
                    type="number"
                    className="w-full bg-black border border-[#D4AF37]/30 text-white p-3 rounded-sm focus:border-[#D4AF37] outline-none text-sm"
                    value={editing.order || 0}
                    onChange={(e) => setEditing({ ...editing, order: parseInt(e.target.value) || 0 })}
                  />
                </div>
              </div>
            )}

            {/* TAB 2: DETAILED CONTENT & CTA */}
            {activeFormTab === "content" && (
              <div className="space-y-5">
                <div>
                  <label className="text-[10px] text-[#D4AF37] font-en tracking-[0.25em] block mb-1">
                    FULL PAGE OVERVIEW · الوصف التفصيلي الممتد للصفحة الداخلية
                  </label>
                  <textarea
                    rows={5}
                    className="w-full bg-black border border-[#D4AF37]/30 text-white p-3 rounded-sm focus:border-[#D4AF37] outline-none text-sm resize-none"
                    placeholder="شرح كامل للخدمة والمعايير الهندسية والتقنيات المستخدمة من قبل فريق عدن للديكور..."
                    value={editing.fullDescription || ""}
                    onChange={(e) => setEditing({ ...editing, fullDescription: e.target.value })}
                  />
                </div>

                <div className="border-t border-[#D4AF37]/20 pt-4">
                  <h4 className="text-white font-display text-base mb-4">عنوان ودعوة التواصل الخاصة بالخدمة (CTA)</h4>
                  <div className="space-y-4">
                    <div>
                      <label className="text-[10px] text-[#D4AF37] font-en tracking-[0.25em] block mb-1">CTA BUTTON TEXT · نص زر طلب الخدمة</label>
                      <input
                        type="text"
                        className="w-full bg-black border border-[#D4AF37]/30 text-white p-3 rounded-sm focus:border-[#D4AF37] outline-none text-sm"
                        value={editing.ctaText || ""}
                        onChange={(e) => setEditing({ ...editing, ctaText: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-[#D4AF37] font-en tracking-[0.25em] block mb-1">CTA SUBTEXT · الشرح المصاحب لزر الطلب</label>
                      <textarea
                        rows={2}
                        className="w-full bg-black border border-[#D4AF37]/30 text-white p-3 rounded-sm focus:border-[#D4AF37] outline-none text-sm resize-none"
                        value={editing.ctaSubtext || ""}
                        onChange={(e) => setEditing({ ...editing, ctaSubtext: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: SUB-SERVICES */}
            {activeFormTab === "subservices" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-white/60">أضف الخدمات الفرعية أو الميزات الفنية التفصيلية التي تقدمها هذه الخدمة:</span>
                  <button
                    onClick={addSubServiceItem}
                    className="bg-[#D4AF37] text-black px-4 py-2 rounded-sm text-xs font-bold flex items-center gap-1 hover:bg-[#C5A030]"
                  >
                    <Plus size={14} /> إضافة خدمة فرعية
                  </button>
                </div>

                {(editing.subServices || []).length === 0 ? (
                  <div className="p-8 text-center text-white/40 border border-dashed border-[#D4AF37]/20 rounded-sm">
                    لا توجد خدمات فرعية بعد. انقر على "إضافة خدمة فرعية" للبدء.
                  </div>
                ) : (
                  <div className="space-y-3 max-h-[50vh] overflow-y-auto pr-2 custom-scrollbar">
                    {editing.subServices.map((item, idx) => (
                      <div key={idx} className="p-4 bg-black border border-[#D4AF37]/20 rounded-sm space-y-3 relative">
                        <button
                          onClick={() => removeSubServiceItem(idx)}
                          className="absolute top-3 left-3 text-red-400 hover:text-red-300"
                          title="حذف"
                        >
                          <Trash2 size={16} />
                        </button>
                        <div>
                          <label className="text-[10px] text-[#D4AF37] font-en block mb-1">عنوان الخدمة الفرعية ({idx + 1})</label>
                          <input
                            type="text"
                            value={item.title || ""}
                            onChange={(e) => updateSubServiceItem(idx, "title", e.target.value)}
                            className="w-full bg-[#111] border border-white/10 text-white p-2.5 rounded-sm text-sm focus:border-[#D4AF37] outline-none"
                            placeholder="اسم الميزة أو الخدمة..."
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-[#D4AF37] font-en block mb-1">شرح الخدمة الفرعية</label>
                          <textarea
                            rows={2}
                            value={item.desc || ""}
                            onChange={(e) => updateSubServiceItem(idx, "desc", e.target.value)}
                            className="w-full bg-[#111] border border-white/10 text-white p-2.5 rounded-sm text-sm focus:border-[#D4AF37] outline-none resize-none"
                            placeholder="تفاصيل التقديم والتنفيذ..."
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB 4: INTERNAL GALLERY */}
            {activeFormTab === "gallery" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-white/60">معرض الصور الداخلي الخاص بالخدمة:</span>
                  <button
                    onClick={() => {
                      setMediaTargetField("gallery");
                      setIsMediaPickerOpen(true);
                    }}
                    className="bg-[#D4AF37] text-black px-4 py-2 rounded-sm text-xs font-bold flex items-center gap-1.5 hover:bg-[#C5A030]"
                  >
                    <ImageIcon size={14} /> إضافة صور للمعرض
                  </button>
                </div>

                {(editing.gallery || []).length === 0 ? (
                  <div className="p-8 text-center text-white/40 border border-dashed border-[#D4AF37]/20 rounded-sm">
                    لا توجد صور في معرض هذه الخدمة بعد.
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-[50vh] overflow-y-auto pr-2 custom-scrollbar">
                    {editing.gallery.map((gUrl, idx) => (
                      <div key={idx} className="relative aspect-video rounded overflow-hidden border border-[#D4AF37]/20 group">
                        <SafeImage src={gUrl} alt={`Gallery ${idx}`} fallbackType="portfolio" className="w-full h-full object-cover" />
                        <button
                          onClick={() => removeGalleryImage(idx)}
                          className="absolute top-2 left-2 bg-red-600/80 text-white p-1.5 rounded-full hover:bg-red-600 transition-colors"
                          title="حذف الصورة من معرض الخدمة"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Form Footer */}
            <div className="flex gap-3 pt-6 border-t border-[#D4AF37]/20 mt-6">
              <button
                onClick={save}
                data-testid="save-service"
                className="flex-1 bg-[#D4AF37] text-black py-3 font-bold hover:bg-[#C5A030] transition-colors rounded-sm text-sm"
              >
                حفظ الخدمة وتطبيق التحديثات
              </button>
              <button
                onClick={() => setEditing(null)}
                className="px-6 border border-[#D4AF37]/30 text-[#D4AF37] hover:bg-[#D4AF37]/5 rounded-sm text-sm"
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Media Picker Modal */}
      <MediaPickerModal
        isOpen={isMediaPickerOpen}
        onClose={() => setIsMediaPickerOpen(false)}
        onSelectImage={handleMediaSelect}
      />
    </div>
  );
}
