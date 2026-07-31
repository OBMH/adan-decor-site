import React, { useState, useMemo } from "react";
import {
  Plus, Trash2, Edit2, X, Image as ImageIcon, Sparkles, CheckCircle2,
  FolderPlus, Eye, Tag, MapPin, Calendar, User, Layers, ArrowUpRight,
  Search, Filter, ArrowUpDown, Upload, Maximize2, MoveUp, MoveDown,
  Star, AlertTriangle, Layers3, Check, RefreshCw, ChevronLeft, ChevronRight
} from "lucide-react";
import { toast } from "sonner";
import { useSiteData } from "../contexts/SiteContext";
import { MediaPickerModal } from "../components/MediaPickerModal";
import SafeImage from "../components/SafeImage";

// Category options mapping
const CATEGORY_OPTIONS = [
  { id: "residential", title: "فلل وسكني فاخر" },
  { id: "majlis", title: "مجالس وضيافة ملكية" },
  { id: "interior", title: "تصميم وديكور داخلي" },
  { id: "commercial", title: "مشاريع تجارية ومكاتب" },
  { id: "facades", title: "واجهات وألمنيوم" },
  { id: "carpentry", title: "أعمال خشبية وديكورات مخصصة" },
  { id: "construction", title: "عوازل وترميم إنشائي" },
];

const STATUS_OPTIONS = [
  { id: "completed", title: "مكتمل 100%" },
  { id: "in_progress", title: "قيد التنفيذ الحالي" },
  { id: "upcoming", title: "قريباً / مرحلة التخطيط" },
];

const MATERIAL_PRESETS = [
  "رخام إيطالي فاخر",
  "نقوش إسلامية مخصصة",
  "خشب جوزي طبيعي",
  "إضاءة مخفية LED",
  "بديل شيبورد عالي الجودة",
  "ألمنيوم دبل جلاز عازل",
  "بديل رخام ماربل",
  "مخمل ملكي فاخر",
  "ورق حائط فرنسي",
  "جبس بورد فرنسي",
  "واجهات زجاج ستركشر",
  "قرميد إسباني"
];

const EMPTY_PROJECT = {
  title: "",
  category: "residential",
  category_label: "فلل وسكني فاخر",
  coverImage: "", // Independent cover image
  image: "", // Compatible alias
  desc: "",
  description: "", // Full architectural description
  fullDescription: "",
  gallery: [], // Array of URLs for internal gallery (completely independent of coverImage)
  materials: [], // Array of dynamic materials/features strings
  status: "completed",
  location: "عدن — اليمن",
  client: "",
  year: new Date().getFullYear().toString(),
  highlights: [], // Array of key highlight strings
  featured: false,
  order: 1,
};

// Image Compression Helper
const compressImage = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const MAX_WIDTH = 1920;
        const MAX_HEIGHT = 1080;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            width = MAX_HEIGHT;
          }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL("image/jpeg", 0.75);
        resolve(dataUrl);
      };
      img.onerror = (err) => reject(err);
    };
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
};

export default function AdminProjects() {
  const site = useSiteData();
  const projects = site.projects || [];

  // Editor State
  const [editing, setEditing] = useState(null);
  const [activeFormTab, setActiveFormTab] = useState("basic"); // 'basic' | 'cover' | 'story' | 'gallery' | 'materials'

  // Filter & Search State
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [featuredOnly, setFeaturedOnly] = useState(false);
  const [sortBy, setSortBy] = useState("order"); // 'order' | 'newest' | 'title' | 'photos'

  // Media Picker State
  const [isMediaPickerOpen, setIsMediaPickerOpen] = useState(false);
  const [mediaTarget, setMediaTarget] = useState({ type: "cover" }); // { type: 'cover' } | { type: 'gallery' } | { type: 'replaceGallery', index: number }

  // Dynamic Item Inputs
  const [newMaterialInput, setNewMaterialInput] = useState("");
  const [newHighlightInput, setNewHighlightInput] = useState("");

  // Preview & Delete Confirmation Modals
  const [previewProject, setPreviewProject] = useState(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState(null);

  // Fullscreen Image Lightbox
  const [lightboxState, setLightboxState] = useState({ isOpen: false, photos: [], currentIndex: 0 });

  // Statistics KPIs
  const stats = useMemo(() => {
    const totalProjects = projects.length;
    const totalGalleryPhotos = projects.reduce((acc, p) => acc + (Array.isArray(p.gallery) ? p.gallery.length : 0), 0);
    const completedProjects = projects.filter((p) => (p.status || "completed") === "completed").length;
    const featuredProjects = projects.filter((p) => p.featured).length;
    return { totalProjects, totalGalleryPhotos, completedProjects, featuredProjects };
  }, [projects]);

  // Filtered Projects Calculation
  const filteredProjects = useMemo(() => {
    return projects
      .filter((p) => {
        if (searchTerm.trim()) {
          const term = searchTerm.toLowerCase();
          const titleMatch = (p.title || "").toLowerCase().includes(term);
          const descMatch = (p.desc || "").toLowerCase().includes(term);
          const fullDescMatch = (p.fullDescription || "").toLowerCase().includes(term);
          const locMatch = (p.location || "").toLowerCase().includes(term);
          const clientMatch = (p.client || "").toLowerCase().includes(term);
          const catMatch = (p.category_label || p.category || "").toLowerCase().includes(term);
          const matMatch = Array.isArray(p.materials) && p.materials.some((m) => m.toLowerCase().includes(term));
          if (!titleMatch && !descMatch && !fullDescMatch && !locMatch && !clientMatch && !catMatch && !matMatch) {
            return false;
          }
        }
        if (selectedCategory !== "all" && p.category !== selectedCategory) {
          return false;
        }
        if (selectedStatus !== "all" && (p.status || "completed") !== selectedStatus) {
          return false;
        }
        if (featuredOnly && !p.featured) {
          return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === "order") {
          return (a.order || 0) - (b.order || 0);
        }
        if (sortBy === "newest") {
          return (b.id || 0) - (a.id || 0);
        }
        if (sortBy === "title") {
          return (a.title || "").localeCompare(b.title || "", "ar");
        }
        if (sortBy === "photos") {
          const photosA = Array.isArray(a.gallery) ? a.gallery.length : 0;
          const photosB = Array.isArray(b.gallery) ? b.gallery.length : 0;
          return photosB - photosA;
        }
        return 0;
      });
  }, [projects, searchTerm, selectedCategory, selectedStatus, featuredOnly, sortBy]);

  // Actions
  const openCreate = () => {
    setEditing({
      ...EMPTY_PROJECT,
      order: projects.length + 1,
    });
    setActiveFormTab("basic");
  };

  const openEdit = (p) => {
    const cover = p.coverImage || p.image || "";
    const descriptionText = p.description || p.fullDescription || p.desc || "";
    setEditing({
      ...EMPTY_PROJECT,
      ...p,
      coverImage: cover,
      image: cover,
      description: descriptionText,
      desc: p.desc || descriptionText,
      fullDescription: p.fullDescription || descriptionText,
      gallery: Array.isArray(p.gallery) ? p.gallery : [],
      materials: Array.isArray(p.materials) ? p.materials : [],
      highlights: Array.isArray(p.highlights) ? p.highlights : [],
    });
    setActiveFormTab("basic");
  };

  const saveProject = () => {
    const titleVal = (editing.title || "").trim();
    const descVal = (editing.desc || editing.description || "").trim();

    if (!titleVal || !descVal) {
      toast.error("عنوان المشروع والوصف الأساسي مطلوبان على الأقل");
      return;
    }

    const cover = editing.coverImage || editing.image || "";
    const fullDescText = editing.fullDescription || editing.description || descVal;

    const projectToSave = {
      ...editing,
      title: titleVal,
      coverImage: cover,
      image: cover, // Synced alias
      desc: descVal,
      description: fullDescText,
      fullDescription: fullDescText,
      gallery: Array.isArray(editing.gallery) ? editing.gallery : [],
      materials: Array.isArray(editing.materials) ? editing.materials : [],
      highlights: Array.isArray(editing.highlights) ? editing.highlights : [],
    };

    if (editing.id) {
      site.updateProject(editing.id, projectToSave);
      toast.success(`تم تحديث المشروع "${titleVal}" بنجاح`);
    } else {
      site.addProject(projectToSave);
      toast.success(`تمت إضافة المشروع الجديد "${titleVal}" بنجاح`);
    }
    setEditing(null);
  };

  const confirmDeleteProject = () => {
    if (!deleteConfirmation) return;
    site.deleteProject(deleteConfirmation.id);
    toast.success(`تم حذف المشروع "${deleteConfirmation.title}" بنجاح`);
    setDeleteConfirmation(null);
  };

  // Media Selection Handlers (Independent Cover vs Gallery)
  const handleMediaSelect = (url) => {
    if (!editing) return;
    if (mediaTarget?.type === "cover") {
      setEditing((prev) => ({ ...prev, coverImage: url, image: url }));
      toast.success("تم تحديد صورة الغلاف بنجاح");
    } else if (mediaTarget?.type === "gallery") {
      setEditing((prev) => ({
        ...prev,
        gallery: [...(prev.gallery || []), url],
      }));
      toast.success("تمت إضافة الصورة لمعرض الصور الداخلي");
    } else if (mediaTarget?.type === "replaceGallery" && typeof mediaTarget.index === "number") {
      setEditing((prev) => {
        const newGallery = [...(prev.gallery || [])];
        newGallery[mediaTarget.index] = url;
        return { ...prev, gallery: newGallery };
      });
      toast.success("تم استبدال صورة المعرض بنجاح");
    }
  };

  // Direct File Upload for Cover Image
  const handleDirectCoverUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("يرجى اختيار ملف صورة فقط");
      return;
    }
    try {
      const compressed = await compressImage(file);
      site.addMedia({
        filename: file.name,
        data_url: compressed,
        size: Math.round((compressed.length * 3) / 4),
      });
      setEditing((prev) => ({ ...prev, coverImage: compressed, image: compressed }));
      toast.success("تم رفع وتعريف صورة الغلاف بنجاح");
    } catch (err) {
      console.error(err);
      toast.error("فشل معالجة صورة الغلاف");
    }
  };

  // Direct File Upload for Gallery (Multiple Files Supported)
  const handleDirectGalleryUpload = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const newUrls = [];
    for (const file of Array.from(files)) {
      if (!file.type.startsWith("image/")) continue;
      try {
        const compressed = await compressImage(file);
        site.addMedia({
          filename: file.name,
          data_url: compressed,
          size: Math.round((compressed.length * 3) / 4),
        });
        newUrls.push(compressed);
      } catch (err) {
        console.error(err);
      }
    }
    if (newUrls.length > 0) {
      setEditing((prev) => ({
        ...prev,
        gallery: [...(prev.gallery || []), ...newUrls],
      }));
      toast.success(`تم رفع ${newUrls.length} صورة بنجاح إلى معرض المشروع`);
    }
  };

  // Gallery Management Helpers
  const removeGalleryImage = (index) => {
    setEditing((prev) => ({
      ...prev,
      gallery: (prev.gallery || []).filter((_, i) => i !== index),
    }));
    toast.success("تمت إزالة الصورة من معرض الصور الداخلي");
  };

  const moveGalleryImage = (index, direction) => {
    if (!editing || !editing.gallery) return;
    const newGallery = [...editing.gallery];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newGallery.length) return;
    const temp = newGallery[index];
    newGallery[index] = newGallery[targetIndex];
    newGallery[targetIndex] = temp;
    setEditing((prev) => ({ ...prev, gallery: newGallery }));
  };

  const setGalleryImageAsCover = (index) => {
    const targetUrl = editing.gallery[index];
    if (!targetUrl) return;
    setEditing((prev) => ({ ...prev, coverImage: targetUrl, image: targetUrl }));
    toast.success("تم تعيين هذه الصورة كغلاف رئيسي للمشروع");
  };

  // Services & Materials Tag Management
  const addMaterialTag = (customVal) => {
    const val = (customVal || newMaterialInput).trim();
    if (!val) return;
    if ((editing.materials || []).includes(val)) {
      toast.info("هذه الخامة أو الخدمة مضافة بالفعل");
      return;
    }
    setEditing((prev) => ({
      ...prev,
      materials: [...(prev.materials || []), val],
    }));
    setNewMaterialInput("");
  };

  const removeMaterialTag = (index) => {
    setEditing((prev) => ({
      ...prev,
      materials: (prev.materials || []).filter((_, i) => i !== index),
    }));
  };

  // Highlights Management
  const addHighlightItem = () => {
    const val = newHighlightInput.trim();
    if (!val) return;
    setEditing((prev) => ({
      ...prev,
      highlights: [...(prev.highlights || []), val],
    }));
    setNewHighlightInput("");
  };

  const removeHighlightItem = (index) => {
    setEditing((prev) => ({
      ...prev,
      highlights: (prev.highlights || []).filter((_, i) => i !== index),
    }));
  };

  return (
    <div data-testid="admin-projects-page" className="space-y-8">
      {/* Header & Title */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#D4AF37]/20 pb-6">
        <div>
          <div className="font-en text-[10px] text-[#D4AF37] tracking-[0.3em] mb-2 flex items-center gap-2">
            <Sparkles size={14} /> ENTERPRISE PORTFOLIO & GALLERY CMS
          </div>
          <h1 className="font-display text-3xl lg:text-4xl text-white">نظام إدارة معرض الأعمال والمشاريع</h1>
          <p className="font-body text-white/60 mt-2 text-sm leading-relaxed">
            لوحة تحكم احترافية لإدارة جميع مشاريع المؤسسة، التفاصيل المعمارية، غلاف المشروع، وألبوم الصور الداخلي المستقل بكل سهولة.
          </p>
        </div>

        <button
          onClick={openCreate}
          data-testid="add-project-btn"
          className="bg-[#D4AF37] text-black px-6 py-3.5 text-sm font-bold flex items-center gap-2 hover:bg-[#C5A030] transition-colors rounded-sm shadow-xl shrink-0"
        >
          <Plus size={18} /> إضافة مشروع جديد
        </button>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass p-5 rounded-lg border border-[#D4AF37]/20 bg-[#0A0A0A]">
          <div className="flex items-center justify-between text-white/50 text-xs mb-2">
            <span>إجمالي المشاريع</span>
            <FolderPlus size={16} className="text-[#D4AF37]" />
          </div>
          <div className="font-display text-2xl text-white font-bold">{stats.totalProjects}</div>
          <span className="text-[10px] text-[#D4AF37] mt-1 block">مشروع مسجل بالنظام</span>
        </div>

        <div className="glass p-5 rounded-lg border border-[#D4AF37]/20 bg-[#0A0A0A]">
          <div className="flex items-center justify-between text-white/50 text-xs mb-2">
            <span>إجمالي صور الألبومات</span>
            <ImageIcon size={16} className="text-[#D4AF37]" />
          </div>
          <div className="font-display text-2xl text-white font-bold">{stats.totalGalleryPhotos}</div>
          <span className="text-[10px] text-emerald-400 mt-1 block">صورة بالمعارض الداخلية</span>
        </div>

        <div className="glass p-5 rounded-lg border border-[#D4AF37]/20 bg-[#0A0A0A]">
          <div className="flex items-center justify-between text-white/50 text-xs mb-2">
            <span>المشاريع المكتملة</span>
            <CheckCircle2 size={16} className="text-[#D4AF37]" />
          </div>
          <div className="font-display text-2xl text-white font-bold">{stats.completedProjects}</div>
          <span className="text-[10px] text-white/40 mt-1 block">مكتمل ومسلم للعميل</span>
        </div>

        <div className="glass p-5 rounded-lg border border-[#D4AF37]/20 bg-[#0A0A0A]">
          <div className="flex items-center justify-between text-white/50 text-xs mb-2">
            <span>المشاريع المميزة</span>
            <Star size={16} className="text-[#D4AF37]" />
          </div>
          <div className="font-display text-2xl text-white font-bold">{stats.featuredProjects}</div>
          <span className="text-[10px] text-[#D4AF37] mt-1 block">تظهر بصدر الواجهة</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="glass p-5 rounded-lg border border-[#D4AF37]/20 bg-[#0A0A0A] space-y-4">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Search Input */}
          <div className="relative">
            <input
              type="text"
              placeholder="ابحث باسم المشروع، العميل، الخامة، أو الموقع..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-black border border-[#D4AF37]/30 text-white rounded-sm pr-10 pl-8 py-2.5 text-xs focus:outline-none focus:border-[#D4AF37]"
            />
            <Search size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#D4AF37]/60" />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute left-2.5 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Category Filter */}
          <div className="flex items-center gap-2 bg-black border border-[#D4AF37]/30 rounded-sm px-3 py-1">
            <Filter size={14} className="text-[#D4AF37] shrink-0" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full bg-transparent text-white text-xs outline-none py-1.5 cursor-pointer"
            >
              <option value="all" className="bg-black text-white">جميع القطاعات والتصنيفات</option>
              {CATEGORY_OPTIONS.map((c) => (
                <option key={c.id} value={c.id} className="bg-black text-white">
                  {c.title}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2 bg-black border border-[#D4AF37]/30 rounded-sm px-3 py-1">
            <Layers3 size={14} className="text-[#D4AF37] shrink-0" />
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full bg-transparent text-white text-xs outline-none py-1.5 cursor-pointer"
            >
              <option value="all" className="bg-black text-white">جميع حالات التنفيذ</option>
              {STATUS_OPTIONS.map((s) => (
                <option key={s.id} value={s.id} className="bg-black text-white">
                  {s.title}
                </option>
              ))}
            </select>
          </div>

          {/* Sort By */}
          <div className="flex items-center gap-2 bg-black border border-[#D4AF37]/30 rounded-sm px-3 py-1">
            <ArrowUpDown size={14} className="text-[#D4AF37] shrink-0" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full bg-transparent text-white text-xs outline-none py-1.5 cursor-pointer"
            >
              <option value="order" className="bg-black text-white">ترتيب الظهور الرقمي</option>
              <option value="newest" className="bg-black text-white">الأحدث إضافتاً</option>
              <option value="title" className="bg-black text-white">أبجدياً بالاسم</option>
              <option value="photos" className="bg-black text-white">الأكثر صوراً بالألبوم</option>
            </select>
          </div>
        </div>

        {/* Featured Toggle & Clear Filter */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-3 text-xs">
          <label className="flex items-center gap-2 text-white/80 cursor-pointer hover:text-white select-none">
            <input
              type="checkbox"
              checked={featuredOnly}
              onChange={(e) => setFeaturedOnly(e.target.checked)}
              className="w-4 h-4 accent-[#D4AF37] rounded"
            />
            إظهار المشاريع المميزة فقط ⭐
          </label>

          <div className="text-white/40">
            يتم عرض <span className="text-[#D4AF37] font-bold">{filteredProjects.length}</span> من أصل {projects.length} مشروع
          </div>
        </div>
      </div>

      {/* Projects Grid */}
      {filteredProjects.length === 0 ? (
        <div className="glass p-16 text-center text-white/50 rounded-lg border border-[#D4AF37]/20 bg-[#0A0A0A]">
          <p className="mb-4 text-base">لم يتم العثور على أي مشاريع تطابق خيارات البحث أو التصفية.</p>
          <button
            onClick={() => {
              setSearchTerm("");
              setSelectedCategory("all");
              setSelectedStatus("all");
              setFeaturedOnly(false);
            }}
            className="text-[#D4AF37] underline font-bold text-xs"
          >
            إعادة ضبط خيارات التصفية
          </button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((p, pIdx) => {
            const galleryCount = Array.isArray(p.gallery) ? p.gallery.length : 0;
            const materialsCount = Array.isArray(p.materials) ? p.materials.length : 0;

            return (
              <div
                key={`${p.id}_${pIdx}`}
                data-testid={`project-card-${p.id}`}
                className="glass p-5 group relative flex flex-col justify-between rounded-lg border border-[#D4AF37]/20 hover:border-[#D4AF37] transition-all bg-[#0A0A0A] hover:shadow-[0_0_20px_rgba(212,175,55,0.15)]"
              >
                <div>
                  {/* Cover Image Box */}
                  <div className="aspect-[16/10] overflow-hidden rounded-sm border border-[#D4AF37]/20 relative mb-4 bg-black/60">
                    <SafeImage
                      src={p.image}
                      alt={p.title}
                      fallbackType="portfolio"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    
                    {/* Category Badge */}
                    <div className="absolute top-2 right-2 bg-black/80 backdrop-blur text-[#D4AF37] border border-[#D4AF37]/40 text-[10px] font-bold px-2 py-0.5 rounded shadow">
                      {p.category_label || p.category}
                    </div>

                    {/* Featured Badge */}
                    {p.featured && (
                      <div className="absolute top-2 left-2 bg-[#D4AF37] text-black text-[10px] font-bold px-2 py-0.5 rounded shadow flex items-center gap-1">
                        <Star size={10} fill="currentColor" /> مميز
                      </div>
                    )}

                    {/* Gallery Photos Counter Badge */}
                    <div className="absolute bottom-2 left-2 bg-black/85 backdrop-blur text-white text-[10px] font-bold px-2 py-1 rounded border border-white/20 flex items-center gap-1">
                      <ImageIcon size={12} className="text-[#D4AF37]" />
                      {galleryCount > 0 ? `${galleryCount} صورة بالألبوم` : "لا توجد صور فرعية"}
                    </div>

                    {/* Order Badge */}
                    <div className="absolute bottom-2 right-2 bg-black/85 backdrop-blur text-white/70 text-[10px] font-mono px-2 py-0.5 rounded border border-white/10">
                      #{p.order || 1}
                    </div>
                  </div>

                  {/* Title & Status */}
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="font-display text-lg text-white font-bold truncate flex-1">{p.title}</h3>
                    <span
                      className={`text-[9px] px-2 py-0.5 rounded font-bold shrink-0 border ${
                        p.status === "completed" || !p.status
                          ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                          : p.status === "in_progress"
                          ? "bg-amber-500/10 text-amber-400 border-amber-500/30"
                          : "bg-blue-500/10 text-blue-400 border-blue-500/30"
                      }`}
                    >
                      {p.status === "completed" || !p.status ? "مكتمل" : p.status === "in_progress" ? "قيد التنفيذ" : "قريباً"}
                    </span>
                  </div>

                  {/* Description Short */}
                  <p className="text-xs text-white/60 line-clamp-2 leading-relaxed mb-4">{p.desc}</p>

                  {/* Metadata Chips */}
                  <div className="flex flex-wrap items-center gap-3 text-[11px] text-white/50 border-t border-white/10 pt-3 mb-3">
                    <span className="flex items-center gap-1">
                      <MapPin size={12} className="text-[#D4AF37]" /> {p.location || "عدن"}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar size={12} className="text-[#D4AF37]" /> {p.year || "2025"}
                    </span>
                    {p.client && (
                      <span className="flex items-center gap-1 truncate max-w-[120px]">
                        <User size={12} className="text-[#D4AF37]" /> {p.client}
                      </span>
                    )}
                  </div>

                  {/* Materials Preview */}
                  {materialsCount > 0 && (
                    <div className="flex flex-wrap gap-1 mb-4">
                      {p.materials.slice(0, 3).map((m, idx) => (
                        <span key={idx} className="bg-white/5 text-white/70 text-[10px] px-2 py-0.5 rounded border border-white/10 truncate max-w-[130px]">
                          • {m}
                        </span>
                      ))}
                      {materialsCount > 3 && (
                        <span className="text-[10px] text-[#D4AF37] px-1 py-0.5 font-bold">
                          +{materialsCount - 3} خامات أخرى
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Card Action Controls */}
                <div className="flex items-center gap-2 pt-3 border-t border-[#D4AF37]/10 mt-auto">
                  <button
                    onClick={() => setPreviewProject(p)}
                    className="p-2 border border-white/20 text-white/70 hover:text-white hover:bg-white/10 rounded-sm transition-colors"
                    title="معاينة تفاصيل المشروع"
                  >
                    <Eye size={14} />
                  </button>
                  <button
                    onClick={() => openEdit(p)}
                    data-testid={`edit-project-${p.id}`}
                    className="flex-1 border border-[#D4AF37]/40 text-[#D4AF37] py-2 text-xs font-bold hover:bg-[#D4AF37]/10 flex items-center justify-center gap-1.5 transition-colors rounded-sm"
                  >
                    <Edit2 size={14} /> تعديل ومعرض الصور
                  </button>
                  <button
                    onClick={() => setDeleteConfirmation(p)}
                    data-testid={`delete-project-${p.id}`}
                    className="border border-red-500/30 text-red-400 px-3 py-2 hover:bg-red-500/10 transition-colors rounded-sm"
                    title="حذف المشروع"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* CREATE / EDIT PROJECT FULL MODAL */}
      {editing && (
        <div
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-start justify-center p-4 overflow-y-auto"
          onClick={() => setEditing(null)}
        >
          <div
            className="bg-[#111] border border-[#D4AF37] max-w-4xl w-full p-6 lg:p-8 my-8 relative rounded-xl shadow-2xl"
            onClick={(e) => e.stopPropagation()}
            data-testid="project-form"
          >
            <button
              onClick={() => setEditing(null)}
              className="absolute top-4 left-4 text-white/50 hover:text-[#D4AF37] transition-colors"
            >
              <X size={22} />
            </button>
            <div className="absolute top-0 right-0 w-12 h-12 border-t-2 border-r-2 border-[#D4AF37]" />

            <div className="mb-6">
              <div className="font-en text-[10px] text-[#D4AF37] tracking-[0.25em] mb-1">ENTERPRISE PROJECT CMS EDITOR</div>
              <h2 className="font-display text-2xl text-white">
                {editing.id ? `تعديل المشروع: ${editing.title || ""}` : "إضافة مشروع جديد لمعرض الأعمال"}
              </h2>
            </div>

            {/* Modal Navigation Tabs */}
            <div className="flex items-center gap-2 mb-6 border-b border-[#D4AF37]/20 overflow-x-auto pb-2 custom-scrollbar">
              <button
                type="button"
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
                type="button"
                onClick={() => setActiveFormTab("cover")}
                className={`px-4 py-2 text-xs font-bold rounded-sm transition-colors whitespace-nowrap ${
                  activeFormTab === "cover"
                    ? "bg-[#D4AF37] text-black"
                    : "bg-white/5 text-white/70 hover:text-white"
                }`}
              >
                2. صورة الغلاف الرئيسية {editing.image ? "✓" : ""}
              </button>

              <button
                type="button"
                onClick={() => setActiveFormTab("story")}
                className={`px-4 py-2 text-xs font-bold rounded-sm transition-colors whitespace-nowrap ${
                  activeFormTab === "story"
                    ? "bg-[#D4AF37] text-black"
                    : "bg-white/5 text-white/70 hover:text-white"
                }`}
              >
                3. الوصف والقصة المعمارية
              </button>

              <button
                type="button"
                onClick={() => setActiveFormTab("gallery")}
                className={`px-4 py-2 text-xs font-bold rounded-sm transition-colors whitespace-nowrap ${
                  activeFormTab === "gallery"
                    ? "bg-[#D4AF37] text-black"
                    : "bg-white/5 text-white/70 hover:text-white"
                }`}
              >
                4. معرض الصور الداخلي ({editing.gallery?.length || 0})
              </button>

              <button
                type="button"
                onClick={() => setActiveFormTab("materials")}
                className={`px-4 py-2 text-xs font-bold rounded-sm transition-colors whitespace-nowrap ${
                  activeFormTab === "materials"
                    ? "bg-[#D4AF37] text-black"
                    : "bg-white/5 text-white/70 hover:text-white"
                }`}
              >
                5. الخدمات والخامات المنفذة ({editing.materials?.length || 0})
              </button>
            </div>

            {/* TAB 1: BASIC INFORMATION */}
            {activeFormTab === "basic" && (
              <div className="space-y-5">
                <div>
                  <label className="text-[10px] text-[#D4AF37] font-en tracking-[0.25em] block mb-1">PROJECT TITLE · اسم المشروع المعماري *</label>
                  <input
                    type="text"
                    className="w-full bg-black border border-[#D4AF37]/30 text-white p-3 rounded-sm focus:border-[#D4AF37] outline-none text-sm"
                    value={editing.title || ""}
                    onChange={(e) => setEditing({ ...editing, title: e.target.value })}
                    placeholder="مثال: تصميم وتنفيذ فيلا جولد كوست الفاخرة..."
                    data-testid="project-title"
                  />
                </div>

                <div className="grid sm:grid-cols-3 gap-4">
                  <div>
                    <label className="text-[10px] text-[#D4AF37] font-en tracking-[0.25em] block mb-1">SECTOR / CATEGORY · القطاع المعماري</label>
                    <select
                      className="w-full bg-black border border-[#D4AF37]/30 text-white p-3 rounded-sm focus:border-[#D4AF37] outline-none text-sm cursor-pointer"
                      value={editing.category || "residential"}
                      onChange={(e) => {
                        const catObj = CATEGORY_OPTIONS.find((c) => c.id === e.target.value);
                        setEditing({
                          ...editing,
                          category: e.target.value,
                          category_label: catObj ? catObj.title : e.target.value,
                        });
                      }}
                      data-testid="project-category"
                    >
                      {CATEGORY_OPTIONS.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.title}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] text-[#D4AF37] font-en tracking-[0.25em] block mb-1">STATUS · حالة التنفيذ</label>
                    <select
                      className="w-full bg-black border border-[#D4AF37]/30 text-white p-3 rounded-sm focus:border-[#D4AF37] outline-none text-sm cursor-pointer"
                      value={editing.status || "completed"}
                      onChange={(e) => setEditing({ ...editing, status: e.target.value })}
                    >
                      {STATUS_OPTIONS.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.title}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] text-[#D4AF37] font-en tracking-[0.25em] block mb-1">DISPLAY ORDER · ترتيب الظهور</label>
                    <input
                      type="number"
                      min="1"
                      className="w-full bg-black border border-[#D4AF37]/30 text-white p-3 rounded-sm focus:border-[#D4AF37] outline-none text-sm"
                      value={editing.order || 1}
                      onChange={(e) => setEditing({ ...editing, order: parseInt(e.target.value) || 1 })}
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-3 gap-4">
                  <div>
                    <label className="text-[10px] text-[#D4AF37] font-en tracking-[0.25em] block mb-1">LOCATION · المدينة والموقع</label>
                    <input
                      type="text"
                      className="w-full bg-black border border-[#D4AF37]/30 text-white p-3 rounded-sm focus:border-[#D4AF37] outline-none text-sm"
                      value={editing.location || ""}
                      onChange={(e) => setEditing({ ...editing, location: e.target.value })}
                      placeholder="عدن — خور مكسر"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] text-[#D4AF37] font-en tracking-[0.25em] block mb-1">YEAR · سنة التنفيذ</label>
                    <input
                      type="text"
                      className="w-full bg-black border border-[#D4AF37]/30 text-white p-3 rounded-sm focus:border-[#D4AF37] outline-none text-sm"
                      value={editing.year || ""}
                      onChange={(e) => setEditing({ ...editing, year: e.target.value })}
                      placeholder="2025"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] text-[#D4AF37] font-en tracking-[0.25em] block mb-1">CLIENT · اسم العميل/الجهة</label>
                    <input
                      type="text"
                      className="w-full bg-black border border-[#D4AF37]/30 text-white p-3 rounded-sm focus:border-[#D4AF37] outline-none text-sm"
                      value={editing.client || ""}
                      onChange={(e) => setEditing({ ...editing, client: e.target.value })}
                      placeholder="عميل خاص / شركة"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <label className="flex items-center gap-3 cursor-pointer text-sm text-white select-none">
                    <input
                      type="checkbox"
                      checked={!!editing.featured}
                      onChange={(e) => setEditing({ ...editing, featured: e.target.checked })}
                      className="w-5 h-5 accent-[#D4AF37] rounded"
                    />
                    <span>تعيين كـ "مشروع مميز" (يظهر في الواجهة الرئيسية وأعلى معارض الأعمال) ⭐</span>
                  </label>
                </div>
              </div>
            )}

            {/* TAB 2: INDEPENDENT COVER IMAGE */}
            {activeFormTab === "cover" && (
              <div className="space-y-5">
                <div className="bg-[#1A1A1A] p-4 rounded border border-[#D4AF37]/20 text-xs text-white/70 leading-relaxed">
                  <span className="text-[#D4AF37] font-bold block mb-1">ملاحظة الفصل التام لصور الغلاف:</span>
                  صورة غلاف المشروع هي الصورة الرئيسية التي تظهر في بطاقة المشروع والقوائم. استبدالها أو حذفها لن يؤثر إطلاقاً على ألبوم الصور الداخلي للمشروع.
                </div>

                <div>
                  <label className="text-[10px] text-[#D4AF37] font-en tracking-[0.25em] block mb-2">COVER IMAGE URL OR UPLOAD · رابط صورة الغلاف</label>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <input
                      type="text"
                      className="w-full bg-black border border-[#D4AF37]/30 text-white p-3 rounded-sm focus:border-[#D4AF37] outline-none text-sm flex-1 text-left dir-ltr"
                      placeholder="رابط الصورة المباشر https://..."
                      value={editing.image || ""}
                      onChange={(e) => setEditing({ ...editing, image: e.target.value })}
                      data-testid="project-image"
                    />
                    
                    <button
                      type="button"
                      onClick={() => {
                        setMediaTarget({ type: "cover" });
                        setIsMediaPickerOpen(true);
                      }}
                      className="bg-[#D4AF37]/10 text-[#D4AF37] px-4 py-3 hover:bg-[#D4AF37]/20 transition-colors border border-[#D4AF37]/30 rounded-sm flex items-center justify-center gap-2 text-xs font-bold shrink-0"
                    >
                      <ImageIcon size={16} /> اختيار من الوسائط
                    </button>

                    <label className="bg-[#D4AF37] text-black px-4 py-3 hover:bg-[#C5A030] transition-colors rounded-sm flex items-center justify-center gap-2 text-xs font-bold cursor-pointer shrink-0">
                      <Upload size={16} /> رفع غلاف جديد
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleDirectCoverUpload}
                      />
                    </label>
                  </div>
                </div>

                {/* Cover Image Preview */}
                {editing.image ? (
                  <div className="relative aspect-[16/9] w-full max-h-[350px] overflow-hidden rounded-lg border-2 border-[#D4AF37]/40 bg-black group">
                    <SafeImage src={editing.image} alt="Cover Preview" fallbackType="portfolio" className="w-full h-full object-cover" />
                    <div className="absolute top-3 left-3 flex gap-2">
                      <button
                        type="button"
                        onClick={() => setEditing({ ...editing, image: "" })}
                        className="bg-red-600 text-white px-3 py-1.5 rounded text-xs font-bold flex items-center gap-1 hover:bg-red-700 shadow"
                      >
                        <Trash2 size={14} /> إزالة صورة الغلاف
                      </button>
                    </div>
                    <div className="absolute bottom-3 right-3 bg-black/80 backdrop-blur text-[#D4AF37] text-xs font-bold px-3 py-1 rounded border border-[#D4AF37]/30">
                      معاينة صورة الغلاف الحالية
                    </div>
                  </div>
                ) : (
                  <div className="p-12 text-center text-white/40 border border-dashed border-[#D4AF37]/30 rounded-lg bg-black/40">
                    <ImageIcon size={48} className="mx-auto text-[#D4AF37]/30 mb-2" />
                    <p className="text-sm">لم يتم تعيين صورة غلاف للمشروع حتى الآن.</p>
                  </div>
                )}
              </div>
            )}

            {/* TAB 3: STORY & DETAILED DESCRIPTION */}
            {activeFormTab === "story" && (
              <div className="space-y-5">
                <div>
                  <label className="text-[10px] text-[#D4AF37] font-en tracking-[0.25em] block mb-1">SUMMARY DESCRIPTION · الوصف المختصر للمشروع *</label>
                  <textarea
                    rows={3}
                    className="w-full bg-black border border-[#D4AF37]/30 text-white p-3 rounded-sm focus:border-[#D4AF37] outline-none text-sm resize-none"
                    value={editing.desc || ""}
                    onChange={(e) => setEditing({ ...editing, desc: e.target.value })}
                    placeholder="وصف ملخص يظهر ببطاقة المشروع والقوائم المختصرة..."
                    data-testid="project-desc"
                  />
                </div>

                <div>
                  <label className="text-[10px] text-[#D4AF37] font-en tracking-[0.25em] block mb-1">FULL ARCHITECTURAL STORY · القصة والوصف التفصيلي الكامل للمشروع</label>
                  <textarea
                    rows={6}
                    className="w-full bg-black border border-[#D4AF37]/30 text-white p-3 rounded-sm focus:border-[#D4AF37] outline-none text-sm resize-y"
                    value={editing.fullDescription || ""}
                    onChange={(e) => setEditing({ ...editing, fullDescription: e.target.value })}
                    placeholder="سرد التفاصيل المعمارية، الرؤية الهندسية، توزيع المساحات، والمشاعر المعمارية للمشروع..."
                  />
                </div>

                {/* Dynamic Project Highlights */}
                <div>
                  <label className="text-[10px] text-[#D4AF37] font-en tracking-[0.25em] block mb-2">KEY HIGHLIGHTS & FEATURES · أبرز المميزات المعمارية</label>
                  <div className="flex gap-2 mb-3">
                    <input
                      type="text"
                      className="flex-1 bg-black border border-[#D4AF37]/30 text-white p-2.5 rounded-sm focus:border-[#D4AF37] outline-none text-xs"
                      placeholder="أضف ميزة معماريّة (مثال: إضاءة ثريات مخصصة بارتفاع مزدوج)..."
                      value={newHighlightInput}
                      onChange={(e) => setNewHighlightInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          addHighlightItem();
                        }
                      }}
                    />
                    <button
                      type="button"
                      onClick={addHighlightItem}
                      className="bg-[#D4AF37] text-black px-4 py-2 font-bold text-xs rounded-sm hover:bg-[#C5A030]"
                    >
                      إضافة ميزة
                    </button>
                  </div>

                  <div className="space-y-2">
                    {(editing.highlights || []).map((h, idx) => (
                      <div key={idx} className="flex items-center justify-between bg-white/5 border border-white/10 p-2.5 rounded text-xs text-white">
                        <span className="flex items-center gap-2">
                          <CheckCircle2 size={14} className="text-[#D4AF37]" /> {h}
                        </span>
                        <button onClick={() => removeHighlightItem(idx)} className="text-white/40 hover:text-red-400">
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: INDEPENDENT PROJECT GALLERY */}
            {activeFormTab === "gallery" && (
              <div className="space-y-5">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-[#1A1A1A] p-4 rounded border border-[#D4AF37]/20">
                  <div>
                    <span className="text-xs text-[#D4AF37] font-bold block">معرض الصور الداخلي المستقل:</span>
                    <p className="text-[11px] text-white/60">رفع وإدارة عدد غير محدود من الصور التفصيلية للمشروع. يمكنك إعادة ترتيب الصور أو تعيين أي صورة كغلاف.</p>
                  </div>

                  <div className="flex flex-wrap gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => {
                        setMediaTarget({ type: "gallery" });
                        setIsMediaPickerOpen(true);
                      }}
                      className="bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/30 px-3.5 py-2 rounded-sm text-xs font-bold flex items-center gap-1.5 hover:bg-[#D4AF37]/20"
                    >
                      <ImageIcon size={14} /> اختيار من المكتبة
                    </button>

                    <label className="bg-[#D4AF37] text-black px-3.5 py-2 rounded-sm text-xs font-bold flex items-center gap-1.5 hover:bg-[#C5A030] cursor-pointer">
                      <Upload size={14} /> رفع صور جديدة
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        className="hidden"
                        onChange={handleDirectGalleryUpload}
                      />
                    </label>
                  </div>
                </div>

                {/* Gallery Items Grid */}
                {(editing.gallery || []).length === 0 ? (
                  <div className="p-12 text-center text-white/40 border border-dashed border-[#D4AF37]/30 rounded-lg bg-black/40">
                    <ImageIcon size={48} className="mx-auto text-[#D4AF37]/30 mb-2" />
                    <p className="text-sm">لا توجد صور مضافة حتى الآن للألبوم الداخلي للمشروع.</p>
                    <p className="text-xs text-white/30 mt-1">يمكنك رفع عدة صور دفعة واحدة باستخدام الزر أعلاه.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 max-h-[50vh] overflow-y-auto pr-2 custom-scrollbar">
                    {editing.gallery.map((gUrl, idx) => (
                      <div
                        key={idx}
                        className="relative aspect-[4/3] rounded-lg overflow-hidden border border-[#D4AF37]/30 bg-black group shadow-md"
                      >
                        <SafeImage src={gUrl} alt={`Gallery item ${idx + 1}`} fallbackType="portfolio" className="w-full h-full object-cover" />
                        
                        {/* Index Badge */}
                        <div className="absolute top-2 right-2 bg-black/80 backdrop-blur text-white text-[10px] font-mono px-2 py-0.5 rounded border border-white/20">
                          #{idx + 1}
                        </div>

                        {/* Hover Overlay Controls */}
                        <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2">
                          {/* Top Controls: Reordering */}
                          <div className="flex justify-between items-center">
                            <div className="flex gap-1">
                              <button
                                type="button"
                                disabled={idx === 0}
                                onClick={() => moveGalleryImage(idx, "up")}
                                className="bg-white/20 hover:bg-[#D4AF37] hover:text-black text-white p-1 rounded disabled:opacity-30"
                                title="تحريك للأمام"
                              >
                                <MoveUp size={12} />
                              </button>
                              <button
                                type="button"
                                disabled={idx === editing.gallery.length - 1}
                                onClick={() => moveGalleryImage(idx, "down")}
                                className="bg-white/20 hover:bg-[#D4AF37] hover:text-black text-white p-1 rounded disabled:opacity-30"
                                title="تحريك للخلف"
                              >
                                <MoveDown size={12} />
                              </button>
                            </div>

                            <button
                              type="button"
                              onClick={() => removeGalleryImage(idx)}
                              className="bg-red-600 text-white p-1.5 rounded-full hover:bg-red-700 transition-colors"
                              title="حذف من المعرض"
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>

                          {/* Center Button: Fullscreen Preview */}
                          <div className="flex justify-center my-auto">
                            <button
                              type="button"
                              onClick={() => setLightboxState({ isOpen: true, photos: editing.gallery, currentIndex: idx })}
                              className="bg-white/20 hover:bg-white text-white hover:text-black p-2 rounded-full transition-colors"
                              title="تكبير ومعاينة"
                            >
                              <Maximize2 size={16} />
                            </button>
                          </div>

                          {/* Bottom Controls: Replace & Set as Cover */}
                          <div className="flex gap-1 text-[9px]">
                            <button
                              type="button"
                              onClick={() => {
                                setMediaTarget({ type: "replaceGallery", index: idx });
                                setIsMediaPickerOpen(true);
                              }}
                              className="flex-1 bg-white/20 hover:bg-white/30 text-white py-1 rounded text-center truncate"
                            >
                              استبدال
                            </button>
                            <button
                              type="button"
                              onClick={() => setGalleryImageAsCover(idx)}
                              className="flex-1 bg-[#D4AF37] hover:bg-[#C5A030] text-black font-bold py-1 rounded text-center truncate"
                              title="تعيين كصورة الغلاف للمشروع"
                            >
                              تعيين كغلاف
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB 5: DYNAMIC MATERIALS & EXECUTED SERVICES */}
            {activeFormTab === "materials" && (
              <div className="space-y-5">
                <div>
                  <label className="text-[10px] text-[#D4AF37] font-en tracking-[0.25em] block mb-2">SERVICES & MATERIALS EXECUTED · الخامات والخدمات المنفذة للمشروع</label>
                  
                  {/* Preset Chips */}
                  <div className="mb-4">
                    <span className="text-xs text-white/50 block mb-2">اختيارات سريعة لإضافة الخامات الشائعة بضغطة زر:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {MATERIAL_PRESETS.map((preset, pIdx) => (
                        <button
                          key={pIdx}
                          type="button"
                          onClick={() => addMaterialTag(preset)}
                          className="bg-white/5 hover:bg-[#D4AF37]/20 hover:text-[#D4AF37] text-white/80 text-xs px-2.5 py-1 rounded border border-white/10 hover:border-[#D4AF37]/30 transition-colors"
                        >
                          + {preset}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Add Custom Tag */}
                  <div className="flex gap-2 mb-4">
                    <input
                      type="text"
                      className="flex-1 bg-black border border-[#D4AF37]/30 text-white p-3 rounded-sm focus:border-[#D4AF37] outline-none text-sm"
                      placeholder="أدخل مادة أو خامة مخصصة (مثال: رخام كالكاتا إيطالي نخب أول)..."
                      value={newMaterialInput}
                      onChange={(e) => setNewMaterialInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          addMaterialTag();
                        }
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => addMaterialTag()}
                      className="bg-[#D4AF37] text-black px-5 py-3 font-bold text-xs rounded-sm hover:bg-[#C5A030]"
                    >
                      إضافة خامة
                    </button>
                  </div>

                  {/* Active Materials Tag List */}
                  <div className="flex flex-wrap gap-2 pt-2">
                    {(editing.materials || []).length === 0 ? (
                      <div className="p-6 text-center text-white/40 border border-dashed border-[#D4AF37]/20 rounded w-full text-xs">
                        لم يتم إضافة أي خامات أو خدمات منفذة للمشروع حتى الآن.
                      </div>
                    ) : (
                      editing.materials.map((m, idx) => (
                        <span
                          key={idx}
                          className="bg-[#D4AF37]/10 text-[#D4AF37] text-xs px-3.5 py-2 rounded-sm flex items-center gap-2 border border-[#D4AF37]/30 shadow-sm"
                        >
                          <Tag size={12} />
                          {m}
                          <button
                            type="button"
                            onClick={() => removeMaterialTag(idx)}
                            className="text-white/60 hover:text-red-400 p-0.5 rounded transition-colors"
                            title="حذف"
                          >
                            <X size={14} />
                          </button>
                        </span>
                      ))
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Modal Save / Cancel Actions */}
            <div className="flex items-center gap-3 pt-6 border-t border-[#D4AF37]/20 mt-8">
              <button
                type="button"
                onClick={saveProject}
                data-testid="save-project"
                className="flex-1 bg-[#D4AF37] text-black py-3.5 font-bold hover:bg-[#C5A030] transition-colors rounded-sm text-sm shadow-lg flex items-center justify-center gap-2"
              >
                <Check size={18} /> حفظ المشروع وجميع التعديلات
              </button>
              <button
                type="button"
                onClick={() => setEditing(null)}
                className="px-6 py-3.5 border border-[#D4AF37]/30 text-[#D4AF37] hover:bg-[#D4AF37]/10 rounded-sm text-sm transition-colors"
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FULL PROJECT PREVIEW MODAL */}
      {previewProject && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto"
          onClick={() => setPreviewProject(null)}
        >
          <div
            className="bg-[#111] border border-[#D4AF37] max-w-3xl w-full p-6 lg:p-8 relative rounded-xl shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto custom-scrollbar"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setPreviewProject(null)}
              className="absolute top-4 left-4 text-white/50 hover:text-[#D4AF37]"
            >
              <X size={22} />
            </button>

            {/* Cover Image */}
            <div className="aspect-[16/9] w-full overflow-hidden rounded-lg border border-[#D4AF37]/30 relative">
              <SafeImage src={previewProject.image} alt={previewProject.title} fallbackType="portfolio" className="w-full h-full object-cover" />
              <div className="absolute top-3 right-3 bg-black/80 backdrop-blur text-[#D4AF37] text-xs font-bold px-3 py-1 rounded border border-[#D4AF37]/40">
                {previewProject.category_label || previewProject.category}
              </div>
            </div>

            <div>
              <h2 className="font-display text-2xl text-white font-bold mb-2">{previewProject.title}</h2>
              <div className="flex flex-wrap gap-4 text-xs text-white/60 mb-4">
                <span>📍 {previewProject.location || "عدن"}</span>
                <span>📅 {previewProject.year || "2025"}</span>
                {previewProject.client && <span>👤 العميل: {previewProject.client}</span>}
              </div>

              <p className="text-sm text-white/80 leading-relaxed mb-4">{previewProject.desc}</p>
              {previewProject.fullDescription && (
                <p className="text-xs text-white/60 leading-relaxed border-t border-white/10 pt-4 mb-4">
                  {previewProject.fullDescription}
                </p>
              )}
            </div>

            {/* Materials */}
            {Array.isArray(previewProject.materials) && previewProject.materials.length > 0 && (
              <div>
                <h4 className="text-[#D4AF37] text-xs font-bold mb-2">الخدمات والخامات المنفذة:</h4>
                <div className="flex flex-wrap gap-2">
                  {previewProject.materials.map((m, i) => (
                    <span key={i} className="bg-[#D4AF37]/10 text-[#D4AF37] text-xs px-2.5 py-1 rounded border border-[#D4AF37]/30">
                      {m}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Gallery Lightbox Preview */}
            {Array.isArray(previewProject.gallery) && previewProject.gallery.length > 0 && (
              <div>
                <h4 className="text-[#D4AF37] text-xs font-bold mb-2">معرض الصور الداخلي ({previewProject.gallery.length} صورة):</h4>
                <div className="grid grid-cols-3 gap-2">
                  {previewProject.gallery.map((g, idx) => (
                    <div
                      key={idx}
                      onClick={() => setLightboxState({ isOpen: true, photos: previewProject.gallery, currentIndex: idx })}
                      className="aspect-video rounded overflow-hidden border border-white/20 cursor-pointer hover:border-[#D4AF37]"
                    >
                      <SafeImage src={g} alt={`Gallery ${idx}`} fallbackType="portfolio" className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* CONFIRMATION DELETE MODAL */}
      {deleteConfirmation && (
        <div
          className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setDeleteConfirmation(null)}
        >
          <div
            className="bg-[#111] border border-red-500/50 max-w-md w-full p-6 rounded-xl shadow-2xl space-y-4 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 text-red-400">
              <AlertTriangle size={28} />
              <h3 className="font-display text-xl font-bold text-white">تأكيد حذف المشروع نهائياً</h3>
            </div>

            <p className="text-xs text-white/70 leading-relaxed">
              هل أنت متأكد من رغبتك في حذف المشروع <span className="text-[#D4AF37] font-bold">"{deleteConfirmation.title}"</span> مع ألبومه المكون من {Array.isArray(deleteConfirmation.gallery) ? deleteConfirmation.gallery.length : 0} صور؟ لا يمكن التراجع عن هذا الإجراء.
            </p>

            <div className="flex gap-3 pt-4 border-t border-white/10">
              <button
                onClick={confirmDeleteProject}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2.5 font-bold rounded text-xs transition-colors"
              >
                نعم، قم بالحذف النهائي
              </button>
              <button
                onClick={() => setDeleteConfirmation(null)}
                className="px-5 border border-white/20 text-white/70 hover:text-white py-2.5 rounded text-xs"
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FULLSCREEN LIGHTBOX MODAL */}
      {lightboxState.isOpen && (
        <div
          className="fixed inset-0 z-[110] bg-black/95 backdrop-blur-lg flex items-center justify-center p-4"
          onClick={() => setLightboxState({ isOpen: false, photos: [], currentIndex: 0 })}
        >
          <button
            onClick={() => setLightboxState({ isOpen: false, photos: [], currentIndex: 0 })}
            className="absolute top-4 right-4 text-white/70 hover:text-white bg-black/50 p-2 rounded-full border border-white/20"
          >
            <X size={24} />
          </button>

          {/* Photo Counter */}
          <div className="absolute top-4 left-4 text-white/80 font-mono text-xs bg-black/60 px-3 py-1.5 rounded border border-white/20">
            الصورة {lightboxState.currentIndex + 1} من {lightboxState.photos.length}
          </div>

          {/* Previous Button */}
          {lightboxState.photos.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setLightboxState((prev) => ({
                  ...prev,
                  currentIndex: (prev.currentIndex - 1 + prev.photos.length) % prev.photos.length,
                }));
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/60 text-white p-3 rounded-full hover:bg-[#D4AF37] hover:text-black transition-colors border border-white/20"
            >
              <ChevronRight size={24} />
            </button>
          )}

          {/* Main Image View */}
          <div className="max-w-4xl max-h-[85vh] overflow-hidden rounded-lg shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <SafeImage
              src={lightboxState.photos[lightboxState.currentIndex]}
              alt="Lightbox View"
              fallbackType="portfolio"
              className="w-full h-full object-contain max-h-[80vh]"
            />
          </div>

          {/* Next Button */}
          {lightboxState.photos.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setLightboxState((prev) => ({
                  ...prev,
                  currentIndex: (prev.currentIndex + 1) % prev.photos.length,
                }));
              }}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/60 text-white p-3 rounded-full hover:bg-[#D4AF37] hover:text-black transition-colors border border-white/20"
            >
              <ChevronLeft size={24} />
            </button>
          )}
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
