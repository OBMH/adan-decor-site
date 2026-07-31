import React, { useState } from "react";
import {
  Layers,
  Plus,
  Edit2,
  Trash2,
  Search,
  Check,
  X,
  Image as ImageIcon,
  Sparkles,
  Sofa,
  PaintBucket,
  Hammer,
  Building2,
  Briefcase,
  Construction,
  ShieldCheck,
  Zap,
  Star
} from "lucide-react";
import { toast } from "sonner";
import { useSiteData } from "../contexts/SiteContext";
import { MediaPickerModal } from "../components/MediaPickerModal";
import SafeImage from "../components/SafeImage";

const SECTOR_CATEGORIES = [
  { id: "interior", title: "الديكور الداخلي والتشطيبات" },
  { id: "aluminum", title: "أعمال الألمنيوم والواجهات" },
  { id: "carpentry", title: "النجارة والديكور الخشبي المخصص" },
  { id: "commercial", title: "المشاريع التجارية والطبية" },
  { id: "construction", title: "العوازل والترميم الإنشائي" },
];

const COMMON_ICONS = [
  "Sofa", "PaintBucket", "Hammer", "Building2", "Briefcase", 
  "Construction", "Layers3", "Trees", "Utensils", "Home", "Sparkles", "Boxes"
];

export default function AdminServices() {
  const { services = [], addService, updateService, deleteService } = useSiteData();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [formData, setFormData] = useState(getEmptyService());
  const [mediaPickerOpen, setMediaPickerOpen] = useState(false);

  function getEmptyService() {
    return {
      title: "",
      categoryId: "interior",
      categoryTitle: "الديكور الداخلي والتشطيبات",
      icon: "Sparkles",
      desc: "",
      image: "",
      order: (services?.length || 0) + 1,
    };
  }

  const handleOpenCreate = () => {
    setEditingService(null);
    setFormData({ ...getEmptyService(), order: services.length + 1 });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (service) => {
    setEditingService(service);
    setFormData({ ...getEmptyService(), ...service });
    setIsModalOpen(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      toast.error("يرجى إدخال عنوان الخدمة");
      return;
    }

    const catObj = SECTOR_CATEGORIES.find(c => c.id === formData.categoryId) || SECTOR_CATEGORIES[0];
    const cleanData = {
      ...formData,
      categoryTitle: catObj.title,
      order: Number(formData.order) || 1,
    };

    if (editingService) {
      updateService(editingService.id, cleanData);
      toast.success("تم تحديث بيانات الخدمة بنجاح");
    } else {
      addService(cleanData);
      toast.success("تم إدراج الخدمة الجديدة بنجاح");
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id, title) => {
    if (window.confirm(`هل أنت متأكد من حذف خدمة "${title}" نهائياً من القائمة؟`)) {
      deleteService(id);
      toast.success("تم حذف الخدمة");
    }
  };

  const handleImageSelected = (url) => {
    setFormData(prev => ({ ...prev, image: url }));
    toast.success("تم تعيين صورة الخدمة");
    setMediaPickerOpen(false);
  };

  const sortedServices = [...services].sort((a, b) => (a.order || 0) - (b.order || 0));
  const filteredServices = sortedServices.filter((s) => {
    const matchSearch = (s.title || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
                        (s.desc || "").toLowerCase().includes(searchTerm.toLowerCase());
    if (!matchSearch) return false;
    if (selectedCategory !== "all" && s.categoryId !== selectedCategory) return false;
    return true;
  });

  return (
    <div className="space-y-6" dir="rtl">
      {/* Header Banner */}
      <div className="bg-[#111] border border-[#D4AF37]/30 p-6 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[#D4AF37] text-xs font-bold uppercase tracking-wide mb-1">
            <Layers size={16} />
            <span>إدارة وتطوير خدمات المؤسسة والقطاعات</span>
          </div>
          <h2 className="font-display text-2xl font-bold text-white">
            قائمة الخدمات المتخصصة ({services.length})
          </h2>
          <p className="text-white/60 text-sm mt-1">
            تحكم بتفاصيل الخدمات الفرعية المدرجة تحت القطاعات الخمسة الكبرى. التعديل يتم فوراً وينعكس بالموقع العام.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="bg-[#D4AF37] text-black px-6 py-3.5 rounded-lg font-display font-bold text-sm hover:bg-[#C5A030] transition-all flex items-center gap-2 shadow-[0_0_20px_rgba(212,175,55,0.25)] shrink-0"
        >
          <Plus size={18} />
          <span>إضافة خدمة جديدة</span>
        </button>
      </div>

      {/* Filters & Search */}
      <div className="bg-[#111] border border-white/10 p-4 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            placeholder="ابحث باسم الخدمة أو الوصف..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-black border border-[#D4AF37]/30 text-white rounded-lg pr-10 pl-4 py-2.5 text-sm focus:outline-none focus:border-[#D4AF37]"
          />
          <Search size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40" />
        </div>

        <div className="flex overflow-x-auto gap-2 w-full sm:w-auto custom-scrollbar pb-1 sm:pb-0">
          <button
            onClick={() => setSelectedCategory("all")}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all shrink-0 ${
              selectedCategory === "all" ? "bg-[#D4AF37] text-black" : "bg-black text-white/70 hover:text-white border border-white/10"
            }`}
          >
            جميع القطاعات ({services.length})
          </button>
          {SECTOR_CATEGORIES.map((cat) => {
            const count = services.filter(s => s.categoryId === cat.id).length;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all shrink-0 ${
                  selectedCategory === cat.id ? "bg-[#D4AF37] text-black" : "bg-black text-white/70 hover:text-white border border-white/10"
                }`}
              >
                {cat.title} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Services Cards Grid */}
      {filteredServices.length === 0 ? (
        <div className="bg-[#111] border border-[#D4AF37]/20 rounded-xl p-12 text-center text-white/50">
          <Layers size={52} className="mx-auto text-[#D4AF37]/30 mb-3" />
          <h3 className="text-lg font-bold text-white mb-1">لا توجد خدمات مطابقة</h3>
          <p className="text-xs text-white/40">يمكنك إضافة خدمة عبر زر "إضافة خدمة جديدة" في الأعلى.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map((srv) => (
            <div
              key={srv.id}
              className="bg-[#111] border border-[#D4AF37]/20 hover:border-[#D4AF37] rounded-xl p-6 transition-all duration-300 flex flex-col justify-between group hover:shadow-[0_0_20px_rgba(212,175,55,0.15)] relative overflow-hidden"
            >
              <div className="absolute -right-12 -top-12 w-28 h-28 bg-[#D4AF37]/5 rounded-full blur-xl pointer-events-none" />

              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="px-2.5 py-1 rounded bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/30 font-bold text-xs">
                    {srv.categoryTitle || srv.categoryId}
                  </span>
                  <span className="text-white/40 font-mono text-xs">#{srv.order}</span>
                </div>

                <h3 className="font-display font-bold text-lg text-white group-hover:text-[#D4AF37] transition-colors mb-2">
                  {srv.title}
                </h3>

                <p className="text-white/60 text-xs leading-relaxed line-clamp-3 mb-4">
                  {srv.desc || "لا يوجد وصف مدون لهذه الخدمة."}
                </p>

                {srv.image && (
                  <div className="w-full h-28 rounded-lg overflow-hidden border border-white/10 mb-4 bg-black">
                    <SafeImage src={srv.image} alt={srv.title} fallbackType="portfolio" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                <span className="text-[11px] text-white/40 font-mono">الأيقونة: {srv.icon || "Default"}</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleOpenEdit(srv)}
                    className="p-2 bg-[#D4AF37]/10 hover:bg-[#D4AF37] text-[#D4AF37] hover:text-black border border-[#D4AF37]/30 rounded-lg transition-all text-xs font-bold flex items-center gap-1.5"
                    title="تعديل الخدمة"
                  >
                    <Edit2 size={15} /> تعديل
                  </button>
                  <button
                    onClick={() => handleDelete(srv.id, srv.title)}
                    className="p-2 bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white border border-red-500/30 rounded-lg transition-all text-xs font-bold"
                    title="حذف الخدمة"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto" onClick={() => setIsModalOpen(false)}>
          <div
            className="bg-[#111] border border-[#D4AF37]/40 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden my-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 bg-black border-b border-[#D4AF37]/20 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#D4AF37]/10 border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37]">
                  <Layers size={20} />
                </div>
                <h3 className="font-display font-bold text-lg text-white">
                  {editingService ? `تعديل الخدمة: ${editingService.title}` : "إدراج خدمة هندسية جديدة"}
                </h3>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-white/50 hover:text-white p-1">
                <X size={22} />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-white/80 mb-2">اسم الخدمة <span className="text-[#D4AF37]">*</span>:</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full bg-black border border-[#D4AF37]/30 text-white rounded-lg p-3 text-sm focus:outline-none focus:border-[#D4AF37]"
                    placeholder="مثال: تصاميم غرف النوم الكلاسيكية"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-white/80 mb-2">القطاع التابع له:</label>
                  <select
                    value={formData.categoryId}
                    onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                    className="w-full bg-black border border-[#D4AF37]/30 text-white rounded-lg p-3 text-sm focus:outline-none focus:border-[#D4AF37]"
                  >
                    {SECTOR_CATEGORIES.map(c => (
                      <option key={c.id} value={c.id}>{c.title}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-white/80 mb-2">الوصف التفصيلي للخدمة:</label>
                <textarea
                  rows={3}
                  value={formData.desc || ""}
                  onChange={(e) => setFormData({ ...formData, desc: e.target.value })}
                  className="w-full bg-black border border-[#D4AF37]/30 text-white rounded-lg p-3 text-sm focus:outline-none focus:border-[#D4AF37] leading-relaxed"
                  placeholder="اكتب نبذة عن مميزات هذه الخدمة ومعايير الجودة المتبعة..."
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-white/80 mb-2">رمز الأيقونة (Lucide Icon Name):</label>
                  <select
                    value={formData.icon || "Sparkles"}
                    onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                    className="w-full bg-black border border-[#D4AF37]/30 text-white rounded-lg p-3 text-sm focus:outline-none focus:border-[#D4AF37] dir-ltr text-right"
                  >
                    {COMMON_ICONS.map(ic => (
                      <option key={ic} value={ic}>{ic}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-white/80 mb-2">الترتيب بقائمة الخدمات:</label>
                  <input
                    type="number"
                    min={1}
                    value={formData.order || 1}
                    onChange={(e) => setFormData({ ...formData, order: Number(e.target.value) })}
                    className="w-full bg-black border border-[#D4AF37]/30 text-white rounded-lg p-3 text-sm text-center dir-ltr"
                  />
                </div>
              </div>

              {/* Service Image (Optional) */}
              <div className="p-3 bg-black rounded-xl border border-white/10 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-16 h-16 rounded-lg overflow-hidden bg-[#111] border border-white/10 flex items-center justify-center">
                    {formData.image ? (
                      <SafeImage src={formData.image} alt="srv" className="w-full h-full object-cover" />
                    ) : (
                      <ImageIcon size={22} className="text-white/30" />
                    )}
                  </div>
                  <div>
                    <span className="text-xs font-bold text-white block">صورة توضيحية للخدمة</span>
                    <span className="text-[10px] text-white/40">اختياري: يعزز مظهر الخدمة عند العرض التفصيلي</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setMediaPickerOpen(true)}
                  className="bg-white/10 hover:bg-[#D4AF37] hover:text-black text-white px-4 py-2 rounded text-xs font-bold transition-all shrink-0"
                >
                  {formData.image ? "تغيير الصورة" : "اختيار صورة"}
                </button>
              </div>

              <div className="pt-4 border-t border-white/10 flex items-center justify-end gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm font-bold transition-colors">
                  إلغاء
                </button>
                <button type="submit" className="px-6 py-2.5 bg-[#D4AF37] hover:bg-[#C5A030] text-black rounded-lg text-sm font-bold transition-all shadow-md flex items-center gap-2">
                  <Check size={18} />
                  <span>{editingService ? "حفظ التعديلات" : "إعتماد وإضافة الخدمة"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <MediaPickerModal
        isOpen={mediaPickerOpen}
        onClose={() => setMediaPickerOpen(false)}
        onSelectImage={handleImageSelected}
      />
    </div>
  );
}
