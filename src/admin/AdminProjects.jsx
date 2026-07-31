import React, { useState } from "react";
import {
  Briefcase,
  Plus,
  Edit2,
  Trash2,
  Image as ImageIcon,
  Search,
  Check,
  X,
  PlusCircle,
  FolderOpen,
  ArrowUpDown,
  Calendar,
  MapPin,
  Clock,
  Layers,
  Sparkles
} from "lucide-react";
import { toast } from "sonner";
import { useSiteData } from "../contexts/SiteContext";
import { MediaPickerModal } from "../components/MediaPickerModal";
import SafeImage from "../components/SafeImage";

const CATEGORIES = [
  { id: "interior", label: "التصميم والديكور الداخلي" },
  { id: "aluminum", label: "أعمال الألمنيوم والواجهات" },
  { id: "carpentry", label: "النجارة والأعمال الخشبية" },
  { id: "commercial", label: "المشاريع التجارية والطبية" },
  { id: "construction", label: "العوازل والترميم الإنشائي" },
];

export default function AdminProjects() {
  const { projects = [], addProject, updateProject, deleteProject } = useSiteData();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [formData, setFormData] = useState(getEmptyForm());

  // Media Picker State
  const [mediaTarget, setMediaTarget] = useState(null); // 'cover' | 'gallery'
  const [newMaterial, setNewMaterial] = useState("");

  function getEmptyForm() {
    return {
      title: "",
      category: "interior",
      category_label: "التصميم والديكور الداخلي",
      description: "",
      location: "عدن — اليمن",
      execution_time: "شهرين",
      year: new Date().getFullYear().toString(),
      status: "completed", // 'completed' | 'in_progress'
      image: "",
      gallery: [],
      materials_used: ["بديل الرخام الفاخر", "إضاءة ليد مخفية", "أخشاب معالجة"],
      order: (projects?.length || 0) + 1,
    };
  }

  const handleOpenCreate = () => {
    setEditingProject(null);
    setFormData({ ...getEmptyForm(), order: projects.length + 1 });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (project) => {
    setEditingProject(project);
    setFormData({
      ...getEmptyForm(),
      ...project,
      gallery: Array.isArray(project.gallery) ? [...project.gallery] : [],
      materials_used: Array.isArray(project.materials_used) ? [...project.materials_used] : [],
    });
    setIsModalOpen(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      toast.error("يرجى إدخال اسم المشروع أولاً");
      return;
    }

    // Assign correct category_label based on category ID
    const catObj = CATEGORIES.find((c) => c.id === formData.category) || CATEGORIES[0];
    const cleanData = {
      ...formData,
      category_label: catObj.label,
      order: Number(formData.order) || 1,
    };

    if (editingProject) {
      updateProject(editingProject.id, cleanData);
      toast.success("تم تحديث المشروع في قاعدة البيانات بنجاح");
    } else {
      addProject(cleanData);
      toast.success("تم إدراج المشروع الجديد في معرض الأعمال بنجاح");
    }

    setIsModalOpen(false);
  };

  const handleDelete = (id, title) => {
    if (window.confirm(`هل أنت متأكد من حذف مشروع "${title}" نهائياً؟`)) {
      deleteProject(id);
      toast.success("تم حذف المشروع من المعرض");
    }
  };

  const handleImageSelected = (url) => {
    if (mediaTarget === "cover") {
      setFormData((prev) => ({ ...prev, image: url }));
      toast.success("تم تعيين صورة الغلاف");
    } else if (mediaTarget === "gallery") {
      setFormData((prev) => ({ ...prev, gallery: [...prev.gallery, url] }));
      toast.success("تم إضافة الصورة إلى معرض المشروع");
    }
    setMediaTarget(null);
  };

  const removeGalleryImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      gallery: prev.gallery.filter((_, i) => i !== index),
    }));
  };

  const addMaterial = () => {
    if (!newMaterial.trim()) return;
    setFormData((prev) => ({
      ...prev,
      materials_used: [...prev.materials_used, newMaterial.trim()],
    }));
    setNewMaterial("");
  };

  const removeMaterial = (index) => {
    setFormData((prev) => ({
      ...prev,
      materials_used: prev.materials_used.filter((_, i) => i !== index),
    }));
  };

  // Filter projects
  const sortedProjects = [...projects].sort((a, b) => (a.order || 0) - (b.order || 0));
  const filteredProjects = sortedProjects.filter((p) => {
    const matchSearch =
      (p.title || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.location || "").toLowerCase().includes(searchTerm.toLowerCase());
    if (!matchSearch) return false;
    if (selectedCategory !== "all" && p.category !== selectedCategory) return false;
    return true;
  });

  return (
    <div className="space-y-6" dir="rtl">
      {/* Header Banner */}
      <div className="bg-[#111] border border-[#D4AF37]/30 p-6 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[#D4AF37] text-xs font-bold uppercase tracking-wide mb-1">
            <Briefcase size={16} />
            <span>إدارة وتعديل معرض المشاريع والتحف المعمارية</span>
          </div>
          <h2 className="font-display text-2xl font-bold text-white">
            معرض الأعمال والمشاريع ({projects.length})
          </h2>
          <p className="text-white/60 text-sm mt-1">
            أضف وحدث مشاريع المؤسسة والصور التابعة لها لتعرض بأفضل صورة أمام العملاء. التعديل يتم فوراً بقاعدة البيانات.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="bg-[#D4AF37] text-black px-6 py-3.5 rounded-lg font-display font-bold text-sm hover:bg-[#C5A030] transition-all flex items-center gap-2 shadow-[0_0_20px_rgba(212,175,55,0.25)] shrink-0"
        >
          <Plus size={18} />
          <span>إضافة مشروع جديد للمعرض</span>
        </button>
      </div>

      {/* Filters and Search */}
      <div className="bg-[#111] border border-white/10 p-4 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            placeholder="ابحث باسم المشروع أو الموقع..."
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
            جميع التصنيفات ({projects.length})
          </button>
          {CATEGORIES.map((cat) => {
            const count = projects.filter((p) => p.category === cat.id).length;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all shrink-0 ${
                  selectedCategory === cat.id ? "bg-[#D4AF37] text-black" : "bg-black text-white/70 hover:text-white border border-white/10"
                }`}
              >
                {cat.label} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Projects Grid */}
      {filteredProjects.length === 0 ? (
        <div className="bg-[#111] border border-[#D4AF37]/20 rounded-xl p-12 text-center text-white/50">
          <FolderOpen size={56} className="mx-auto text-[#D4AF37]/30 mb-3" />
          <h3 className="text-lg font-bold text-white mb-1">لا توجد مشاريع مطابقة</h3>
          <p className="text-xs text-white/40">جرب تعديل عبارة البحث أو اختر تصنيفاً آخر، أو انقر على "إضافة مشروع جديد".</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="bg-[#111] border border-[#D4AF37]/20 hover:border-[#D4AF37] rounded-xl overflow-hidden transition-all duration-300 flex flex-col justify-between group hover:shadow-[0_0_25px_rgba(212,175,55,0.15)]"
            >
              <div>
                {/* Image Cover */}
                <div className="aspect-video relative overflow-hidden bg-black">
                  <SafeImage
                    src={project.image}
                    alt={project.title}
                    fallbackType="portfolio"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 right-3 flex gap-2">
                    <span className="bg-black/80 backdrop-blur-md border border-[#D4AF37]/40 text-[#D4AF37] text-[11px] font-bold px-3 py-1 rounded-full shadow-lg">
                      {project.category_label || project.category}
                    </span>
                  </div>
                  <div className="absolute bottom-3 left-3 bg-black/70 text-white text-[10px] px-2 py-1 rounded border border-white/10 font-mono">
                    ترتيب: #{project.order}
                  </div>
                </div>

                {/* Details */}
                <div className="p-5 space-y-3">
                  <h3 className="font-display font-bold text-lg text-white group-hover:text-[#D4AF37] transition-colors truncate">
                    {project.title}
                  </h3>

                  <p className="text-white/60 text-xs line-clamp-2 leading-relaxed">
                    {project.description || "لا يوجد وصف مدون لهذا المشروع بعد."}
                  </p>

                  <div className="flex flex-wrap items-center gap-3 pt-2 text-white/50 text-[11px] border-t border-white/5">
                    {project.location && (
                      <span className="flex items-center gap-1">
                        <MapPin size={13} className="text-[#D4AF37]" /> {project.location}
                      </span>
                    )}
                    {project.execution_time && (
                      <span className="flex items-center gap-1">
                        <Clock size={13} className="text-[#D4AF37]" /> {project.execution_time}
                      </span>
                    )}
                    {project.year && (
                      <span className="flex items-center gap-1">
                        <Calendar size={13} className="text-[#D4AF37]" /> {project.year}
                      </span>
                    )}
                  </div>

                  {/* Materials tags */}
                  {Array.isArray(project.materials_used) && project.materials_used.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {project.materials_used.slice(0, 3).map((mat, i) => (
                        <span key={i} className="px-2 py-0.5 bg-white/5 border border-white/10 rounded text-[10px] text-white/70">
                          {mat}
                        </span>
                      ))}
                      {project.materials_used.length > 3 && (
                        <span className="text-[10px] text-[#D4AF37] self-center">+{project.materials_used.length - 3} المزيد</span>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Actions Footer */}
              <div className="px-5 py-3.5 bg-black/60 border-t border-[#D4AF37]/20 flex items-center justify-between">
                <span className="text-xs text-white/50 font-bold flex items-center gap-1">
                  <ImageIcon size={14} className="text-[#D4AF37]" />
                  <span>{Array.isArray(project.gallery) ? project.gallery.length : 0} صور بالمعرض</span>
                </span>
                
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleOpenEdit(project)}
                    className="p-2 bg-[#D4AF37]/10 hover:bg-[#D4AF37] text-[#D4AF37] hover:text-black border border-[#D4AF37]/30 rounded-lg transition-all text-xs font-bold flex items-center gap-1.5"
                    title="تعديل المشروع"
                  >
                    <Edit2 size={15} /> تعديل
                  </button>
                  <button
                    onClick={() => handleDelete(project.id, project.title)}
                    className="p-2 bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white border border-red-500/30 rounded-lg transition-all text-xs font-bold"
                    title="حذف المشروع"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create / Edit Project Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto" onClick={() => setIsModalOpen(false)}>
          <div
            className="bg-[#111] border border-[#D4AF37]/40 w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] my-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-6 bg-black border-b border-[#D4AF37]/20 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#D4AF37]/10 border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37]">
                  <Briefcase size={20} />
                </div>
                <div>
                  <h3 className="font-display font-bold text-lg text-white">
                    {editingProject ? `تعديل المشروع: ${editingProject.title}` : "إضافة مشروع ديكور جديد"}
                  </h3>
                  <p className="text-white/50 text-xs">قم بتعبئة تفاصيل المشروع ليعرض بالواجهة الأمامية للموقع</p>
                </div>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-white/50 hover:text-white p-1">
                <X size={22} />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-white/80 mb-2">
                    اسم المشروع <span className="text-[#D4AF37]">*</span>:
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full bg-black border border-[#D4AF37]/30 text-white rounded-lg p-3 text-sm focus:outline-none focus:border-[#D4AF37]"
                    placeholder="مثال: فيلا سكنية فاخرة — حي السعد"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-white/80 mb-2">التصنيف الهندسـي:</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-black border border-[#D4AF37]/30 text-white rounded-lg p-3 text-sm focus:outline-none focus:border-[#D4AF37]"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c.id} value={c.id}>{c.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-white/80 mb-2">وصف تفصيلي للمشروع والأعمال المنفذة:</label>
                <textarea
                  rows={3}
                  value={formData.description || ""}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-black border border-[#D4AF37]/30 text-white rounded-lg p-3 text-sm focus:outline-none focus:border-[#D4AF37] leading-relaxed"
                  placeholder="اكتب نبذة جذابة عن التصميم الداخلي وتحديات المشروع وجودة التشطيب..."
                />
              </div>

              {/* Specs Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-black/50 border border-white/10 rounded-xl">
                <div>
                  <label className="block text-xs font-bold text-white/70 mb-1.5">موقع التنفيذ:</label>
                  <input
                    type="text"
                    value={formData.location || ""}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full bg-[#151515] border border-white/10 text-white rounded p-2 text-xs"
                    placeholder="مثال: عدن، كاونتي"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-white/70 mb-1.5">مدة التنفيذ:</label>
                  <input
                    type="text"
                    value={formData.execution_time || ""}
                    onChange={(e) => setFormData({ ...formData, execution_time: e.target.value })}
                    className="w-full bg-[#151515] border border-white/10 text-white rounded p-2 text-xs"
                    placeholder="مثال: 45 يوماً"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-white/70 mb-1.5">سنة الإنجاز:</label>
                  <input
                    type="text"
                    value={formData.year || ""}
                    onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                    className="w-full bg-[#151515] border border-white/10 text-white rounded p-2 text-xs"
                    placeholder="2025"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-white/70 mb-1.5">الترتيب بالمعرض:</label>
                  <input
                    type="number"
                    min={1}
                    value={formData.order || 1}
                    onChange={(e) => setFormData({ ...formData, order: Number(e.target.value) })}
                    className="w-full bg-[#151515] border border-white/10 text-white rounded p-2 text-xs dir-ltr text-center"
                  />
                </div>
              </div>

              {/* Cover Image Selector */}
              <div>
                <label className="block text-xs font-bold text-[#D4AF37] mb-2">
                  صورة غلاف المشروع (Cover Image):
                </label>
                <div className="flex items-center gap-4 bg-black p-3 rounded-xl border border-white/10">
                  <div className="w-24 h-24 rounded-lg bg-[#111] border border-white/10 overflow-hidden shrink-0 flex items-center justify-center">
                    {formData.image ? (
                      <SafeImage src={formData.image} alt="cover" className="w-full h-full object-cover" />
                    ) : (
                      <ImageIcon size={28} className="text-white/30" />
                    )}
                  </div>
                  <div className="space-y-2 flex-1">
                    <button
                      type="button"
                      onClick={() => setMediaTarget("cover")}
                      className="bg-[#D4AF37] text-black px-4 py-2 rounded font-bold text-xs hover:bg-[#C5A030] transition-colors flex items-center gap-1.5 shadow-md"
                    >
                      <ImageIcon size={14} /> {formData.image ? "تغيير صورة الغلاف" : "اختيار صورة الغلاف"}
                    </button>
                    <p className="text-[11px] text-white/50">تظهر هذه الصورة بشكل بارز في بطاقات المعرض الرئيسية في الموقع.</p>
                  </div>
                </div>
              </div>

              {/* Project Gallery Images */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-[#D4AF37]">
                    ألبوم وصور المشروع الداخلية (Project Gallery) ({formData.gallery.length} صور):
                  </label>
                  <button
                    type="button"
                    onClick={() => setMediaTarget("gallery")}
                    className="text-xs text-[#D4AF37] hover:underline font-bold flex items-center gap-1"
                  >
                    <PlusCircle size={14} /> إضافة صور للألبوم
                  </button>
                </div>

                <div className="p-4 bg-black rounded-xl border border-white/10 min-h-[90px] flex flex-wrap gap-3 items-center">
                  {formData.gallery.length === 0 ? (
                    <span className="text-xs text-white/40 italic mx-auto">لا توجد صور في ألبوم المشروع حتى الآن. انقر على "إضافة صور للألبوم" أعلاه.</span>
                  ) : (
                    formData.gallery.map((imgUrl, idx) => (
                      <div key={idx} className="w-20 h-20 rounded-lg overflow-hidden bg-[#151515] border border-[#D4AF37]/30 relative group">
                        <SafeImage src={imgUrl} alt="gallery" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => removeGalleryImage(idx)}
                          className="absolute top-1 left-1 bg-red-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          title="حذف من الألبوم"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Materials Used Tags */}
              <div>
                <label className="block text-xs font-bold text-white/80 mb-2">المواد والتقنيات الفنية المستخدمة بالمشروع:</label>
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    placeholder="مثال: رخام إيطالي طبيعي، أرضيات باركيه مقاوم للمياه..."
                    value={newMaterial}
                    onChange={(e) => setNewMaterial(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addMaterial(); } }}
                    className="flex-1 bg-black border border-white/20 text-white text-xs rounded-lg px-3 py-2 focus:outline-none focus:border-[#D4AF37]"
                  />
                  <button
                    type="button"
                    onClick={addMaterial}
                    className="bg-[#D4AF37] text-black px-4 py-2 rounded-lg font-bold text-xs hover:bg-[#C5A030] transition-colors"
                  >
                    إضافة مادة
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.materials_used.map((mat, idx) => (
                    <span key={idx} className="px-3 py-1.5 bg-white/5 border border-white/15 rounded-full text-xs text-white flex items-center gap-2">
                      <span>{mat}</span>
                      <button type="button" onClick={() => removeMaterial(idx)} className="text-white/50 hover:text-red-400">
                        <X size={13} />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Modal Actions */}
              <div className="pt-4 border-t border-white/10 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm font-bold transition-colors"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#D4AF37] hover:bg-[#C5A030] text-black rounded-lg text-sm font-bold transition-all shadow-[0_0_15px_rgba(212,175,55,0.3)] flex items-center gap-2"
                >
                  <Check size={18} />
                  <span>{editingProject ? "حفظ التعديلات" : "إعتماد وإضافة المشروع"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Media Picker Modal */}
      <MediaPickerModal
        isOpen={!!mediaTarget}
        onClose={() => setMediaTarget(null)}
        onSelectImage={handleImageSelected}
      />
    </div>
  );
}
