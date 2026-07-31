import React, { useState } from "react";
import {
  Settings,
  Globe,
  Phone,
  MessageCircle,
  Share2,
  Database,
  Download,
  Upload,
  RotateCcw,
  Image as ImageIcon,
  CheckCircle2,
  AlertTriangle,
  ShieldCheck,
  Search
} from "lucide-react";
import { toast } from "sonner";
import { useSiteData } from "../contexts/SiteContext";
import { MediaPickerModal } from "../components/MediaPickerModal";
import SafeImage from "../components/SafeImage";

export default function AdminSettings() {
  const { brand = {}, updateBrand, exportAllData, importAllData, resetDefaults } = useSiteData();
  const [mediaPickerOpen, setMediaPickerOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("general"); // 'general' | 'contact' | 'seo' | 'backup'

  const handleUpdate = (fields) => {
    updateBrand(fields);
    toast.success("تم الحفظ والتحديث المباشر في قاعدة البيانات");
  };

  const handleLogoSelected = (url) => {
    handleUpdate({ logo: url });
    setMediaPickerOpen(false);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target.result);
        importAllData(parsed);
        toast.success("تم استعادة النُسخة الاحتياطية وتحديث قاعدة البيانات بالكامل");
      } catch (err) {
        toast.error("الملف غير صالح أو ليس بتنسيق النسخ الاحتياطي الصحيح");
      }
    };
    reader.readAsText(file);
  };

  const handleReset = () => {
    if (window.confirm("تحذير: هل أنت متأكد من إعادة ضبط كافة بيانات الموقع إلى الإعدادات والنصوص الأصلية الافتراضية؟")) {
      resetDefaults();
      toast.success("تم إرجاع كافة البيانات الافتراضية بنجاح");
    }
  };

  return (
    <div className="space-y-6" dir="rtl">
      {/* Header Banner */}
      <div className="bg-[#111] border border-[#D4AF37]/30 p-6 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[#D4AF37] text-xs font-bold uppercase tracking-wide mb-1">
            <Settings size={16} />
            <span>الإعدادات العامة والهوية المؤسسية</span>
          </div>
          <h2 className="font-display text-2xl font-bold text-white">
            إعدادات الهوية والتواصل والبيانات
          </h2>
          <p className="text-white/60 text-sm mt-1">
            إدارة بيانات التواصل، الروابط الاجتماعية، وتحميل النسخ الاحتياطية. أي تغيير ينعكس فوراً بالموقع العام.
          </p>
        </div>
        <div className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 shrink-0">
          <CheckCircle2 size={16} /> الحفظ التلقائي مباشر
        </div>
      </div>

      {/* Tabs */}
      <div className="flex overflow-x-auto border-b border-[#D4AF37]/20 gap-2 pb-1 custom-scrollbar">
        <button
          onClick={() => setActiveTab("general")}
          className={`px-4 py-2.5 rounded-t-lg font-bold text-sm transition-all flex items-center gap-2 shrink-0 ${
            activeTab === "general" ? "bg-[#D4AF37] text-black shadow-md" : "bg-black/50 text-white/60 hover:text-white"
          }`}
        >
          <Globe size={18} /> الهوية والشعار
        </button>
        <button
          onClick={() => setActiveTab("contact")}
          className={`px-4 py-2.5 rounded-t-lg font-bold text-sm transition-all flex items-center gap-2 shrink-0 ${
            activeTab === "contact" ? "bg-[#D4AF37] text-black shadow-md" : "bg-black/50 text-white/60 hover:text-white"
          }`}
        >
          <Share2 size={18} /> أرقام التواصل والتواصل الاجتماعي
        </button>
        <button
          onClick={() => setActiveTab("seo")}
          className={`px-4 py-2.5 rounded-t-lg font-bold text-sm transition-all flex items-center gap-2 shrink-0 ${
            activeTab === "seo" ? "bg-[#D4AF37] text-black shadow-md" : "bg-black/50 text-white/60 hover:text-white"
          }`}
        >
          <Search size={18} /> إعدادات الظهور بمحركات البحث (SEO)
        </button>
        <button
          onClick={() => setActiveTab("backup")}
          className={`px-4 py-2.5 rounded-t-lg font-bold text-sm transition-all flex items-center gap-2 shrink-0 ${
            activeTab === "backup" ? "bg-[#D4AF37] text-black shadow-md" : "bg-black/50 text-white/60 hover:text-white"
          }`}
        >
          <Database size={18} /> النسخ الاحتياطي واستعادة البيانات
        </button>
      </div>

      {/* Tab 1: General Brand Identity */}
      {activeTab === "general" && (
        <div className="bg-[#111] border border-[#D4AF37]/20 p-6 lg:p-8 rounded-xl space-y-6">
          <h3 className="font-display font-bold text-lg text-[#D4AF37] border-b border-white/10 pb-3 flex items-center gap-2">
            <Globe size={18} />
            <span>بيانات الهوية والشعار المؤسسي</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-white/80 mb-2">اسم المؤسسة (بالعربية):</label>
              <input
                type="text"
                value={brand.nameAr || ""}
                onChange={(e) => handleUpdate({ nameAr: e.target.value })}
                className="w-full bg-black border border-[#D4AF37]/30 text-white rounded-lg p-3.5 text-sm focus:outline-none focus:border-[#D4AF37]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-white/80 mb-2">اسم المؤسسة (بالإنكليزية):</label>
              <input
                type="text"
                value={brand.nameEn || ""}
                onChange={(e) => handleUpdate({ nameEn: e.target.value })}
                className="w-full bg-black border border-[#D4AF37]/30 text-white rounded-lg p-3.5 text-sm focus:outline-none focus:border-[#D4AF37] dir-ltr text-right"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-white/80 mb-2">شعار المؤسسة التعريفي (Tagline / Slogan):</label>
              <textarea
                rows={2}
                value={brand.tagline || ""}
                onChange={(e) => handleUpdate({ tagline: e.target.value })}
                className="w-full bg-black border border-[#D4AF37]/30 text-white rounded-lg p-3.5 text-sm focus:outline-none focus:border-[#D4AF37] leading-relaxed"
              />
            </div>
          </div>

          {/* Logo selector */}
          <div className="pt-4 border-t border-white/10">
            <label className="block text-xs font-bold text-[#D4AF37] mb-3">شعار الهوية البصرية (Logo):</label>
            <div className="flex items-center gap-6 bg-black p-4 rounded-xl border border-white/10">
              <div className="w-28 h-28 rounded-lg bg-[#111] border border-[#D4AF37]/40 flex items-center justify-center p-2 shrink-0">
                {brand.logo ? (
                  <SafeImage src={brand.logo} alt="logo" className="max-w-full max-h-full object-contain" />
                ) : (
                  <ImageIcon size={32} className="text-white/30" />
                )}
              </div>
              <div className="space-y-2">
                <p className="text-xs text-white/70 leading-relaxed">
                  يظهر هذا الشعار في الشريط العلوي (Navbar) وفي الفوتر وببطاقات التواصل. يفضل أن يكون بصيغة PNG وبخلفية شفافة.
                </p>
                <button
                  type="button"
                  onClick={() => setMediaPickerOpen(true)}
                  className="bg-[#D4AF37] text-black px-4 py-2 rounded font-bold text-xs hover:bg-[#C5A030] transition-colors flex items-center gap-1.5 shadow-md"
                >
                  <ImageIcon size={14} /> استبدال الشعار أو رفع ملف جديد
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Contact Info & Social Media */}
      {activeTab === "contact" && (
        <div className="bg-[#111] border border-[#D4AF37]/20 p-6 lg:p-8 rounded-xl space-y-6">
          <h3 className="font-display font-bold text-lg text-[#D4AF37] border-b border-white/10 pb-3 flex items-center gap-2">
            <Share2 size={18} />
            <span>بيانات الاتصال وحسابات منصات التواصل الاجتماعي</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-white/80 mb-2 flex items-center gap-1">
                <MessageCircle size={14} className="text-[#D4AF37]" /> رقم الواتساب الرسمي (مع رمز الدولة):
              </label>
              <input
                type="text"
                value={brand.whatsapp || ""}
                onChange={(e) => handleUpdate({ whatsapp: e.target.value })}
                className="w-full bg-black border border-[#D4AF37]/30 text-white rounded-lg p-3.5 text-sm focus:outline-none focus:border-[#D4AF37] dir-ltr text-left"
                placeholder="+967771258215"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-white/80 mb-2">رابط محادثة واتساب المباشر (WhatsApp Link):</label>
              <input
                type="text"
                value={brand.whatsappLink || ""}
                onChange={(e) => handleUpdate({ whatsappLink: e.target.value })}
                className="w-full bg-black border border-[#D4AF37]/30 text-white rounded-lg p-3.5 text-sm focus:outline-none focus:border-[#D4AF37] dir-ltr text-left"
                placeholder="https://wa.me/967771258215"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-white/80 mb-2">رابط حساب إنستغرام (Instagram):</label>
              <input
                type="text"
                value={brand.instagram || ""}
                onChange={(e) => handleUpdate({ instagram: e.target.value })}
                className="w-full bg-black border border-[#D4AF37]/30 text-white rounded-lg p-3.5 text-sm focus:outline-none focus:border-[#D4AF37] dir-ltr text-left"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-white/80 mb-2">رابط حساب تيك توك (TikTok):</label>
              <input
                type="text"
                value={brand.tiktok || ""}
                onChange={(e) => handleUpdate({ tiktok: e.target.value })}
                className="w-full bg-black border border-[#D4AF37]/30 text-white rounded-lg p-3.5 text-sm focus:outline-none focus:border-[#D4AF37] dir-ltr text-left"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-white/80 mb-2">رابط قناة يوتيوب (YouTube):</label>
              <input
                type="text"
                value={brand.youtube || ""}
                onChange={(e) => handleUpdate({ youtube: e.target.value })}
                className="w-full bg-black border border-[#D4AF37]/30 text-white rounded-lg p-3.5 text-sm focus:outline-none focus:border-[#D4AF37] dir-ltr text-left"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-white/80 mb-2">رابط موقع المعرض في خرائط جوجل (Google Maps):</label>
              <input
                type="text"
                value={brand.maps || ""}
                onChange={(e) => handleUpdate({ maps: e.target.value })}
                className="w-full bg-black border border-[#D4AF37]/30 text-white rounded-lg p-3.5 text-sm focus:outline-none focus:border-[#D4AF37] dir-ltr text-left"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-white/80 mb-2">النص الجغرافي للموقع (Location):</label>
              <input
                type="text"
                value={brand.location || ""}
                onChange={(e) => handleUpdate({ location: e.target.value })}
                className="w-full bg-black border border-[#D4AF37]/30 text-white rounded-lg p-3.5 text-sm focus:outline-none focus:border-[#D4AF37]"
                placeholder="عدن — اليمن"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-white/80 mb-2">ساعات العمل الرسمية:</label>
              <input
                type="text"
                value={brand.hours || ""}
                onChange={(e) => handleUpdate({ hours: e.target.value })}
                className="w-full bg-black border border-[#D4AF37]/30 text-white rounded-lg p-3.5 text-sm focus:outline-none focus:border-[#D4AF37]"
                placeholder="مفتوح 24 ساعة"
              />
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: SEO */}
      {activeTab === "seo" && (
        <div className="bg-[#111] border border-[#D4AF37]/20 p-6 lg:p-8 rounded-xl space-y-6">
          <h3 className="font-display font-bold text-lg text-[#D4AF37] border-b border-white/10 pb-3 flex items-center gap-2">
            <Search size={18} />
            <span>إعدادات الظهور في محركات البحث (SEO Meta tags)</span>
          </h3>

          <div className="space-y-6 max-w-3xl">
            <div>
              <label className="block text-xs font-bold text-white/80 mb-2">عنوان الصفحة الرئيسي (Meta Title):</label>
              <input
                type="text"
                value={brand.seoTitle || ""}
                onChange={(e) => handleUpdate({ seoTitle: e.target.value })}
                className="w-full bg-black border border-[#D4AF37]/30 text-white rounded-lg p-3.5 text-sm focus:outline-none focus:border-[#D4AF37]"
                placeholder="عدن للديكور | تصميم داخلي فاخر وتنفيذ ديكورات في عدن واليمن"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-white/80 mb-2">الوصف التعريفي لمحركات البحث (Meta Description):</label>
              <textarea
                rows={3}
                value={brand.seoDescription || ""}
                onChange={(e) => handleUpdate({ seoDescription: e.target.value })}
                className="w-full bg-black border border-[#D4AF37]/30 text-white rounded-lg p-3.5 text-sm focus:outline-none focus:border-[#D4AF37] leading-relaxed"
                placeholder="مؤسسة عدن للديكور رائدة في تقديم حلول التصميم الداخلي الفاخر..."
              />
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Backup & Restore */}
      {activeTab === "backup" && (
        <div className="bg-[#111] border border-[#D4AF37]/20 p-6 lg:p-8 rounded-xl space-y-8">
          <div>
            <h3 className="font-display font-bold text-lg text-[#D4AF37] mb-2 flex items-center gap-2">
              <Database size={18} />
              <span>إدارة النسخ الاحتياطي لقاعدة البيانات</span>
            </h3>
            <p className="text-xs text-white/60 leading-relaxed">
              يمكنك تصدير نُسخة احتياطية كاملة لكافة بيانات ومشاريع ووسائط الموقع إلى ملف JSON على جهازك، أو استعادة ملف نُسخة قديم.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Export */}
            <div className="p-6 bg-black rounded-xl border border-white/10 flex flex-col justify-between gap-4 text-center items-center">
              <div className="w-14 h-14 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37]">
                <Download size={24} />
              </div>
              <div>
                <h4 className="font-display font-bold text-white text-base">تصدير نُسخة احتياطية (Export Backup)</h4>
                <p className="text-xs text-white/50 mt-1">تنزيل كافة بيانات ومحتويات الموقع كملف JSON آمن</p>
              </div>
              <button
                onClick={() => { exportAllData(); toast.success("تم تنزيل ملف النُسخة الاحتياطية بنجاح"); }}
                className="w-full bg-[#D4AF37] text-black py-3 rounded-lg font-bold text-xs hover:bg-[#C5A030] transition-colors flex items-center justify-center gap-2 shadow-md"
              >
                <Download size={16} /> تنزيل الملف الآن
              </button>
            </div>

            {/* Import */}
            <div className="p-6 bg-black rounded-xl border border-white/10 flex flex-col justify-between gap-4 text-center items-center">
              <div className="w-14 h-14 rounded-full bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
                <Upload size={24} />
              </div>
              <div>
                <h4 className="font-display font-bold text-white text-base">استعادة من نُسخة احتياطية (Restore Backup)</h4>
                <p className="text-xs text-white/50 mt-1">رفع ملف JSON سابق وتطبيقه مباشرة على قاعدة بيانات الخادم</p>
              </div>
              <label className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold text-xs hover:bg-blue-500 transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md">
                <Upload size={16} /> اختيار الملف واستعادتـه
                <input type="file" accept=".json" onChange={handleFileUpload} className="hidden" />
              </label>
            </div>
          </div>

          {/* Reset zone */}
          <div className="p-6 bg-red-950/20 border border-red-500/30 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mt-8">
            <div className="flex items-start gap-3">
              <AlertTriangle size={24} className="text-red-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-red-300 text-sm">منطقة الخطر: إعادة ضبط المصنع (Factory Reset)</h4>
                <p className="text-xs text-red-300/70 mt-1">
                  إلغاء كافة التعديلات والمشاريع والعودة التامة للنصوص والمشاريع الافتراضية الأولى.
                </p>
              </div>
            </div>
            <button
              onClick={handleReset}
              className="bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-lg font-bold text-xs transition-colors flex items-center gap-2 shrink-0 shadow-md"
            >
              <RotateCcw size={15} /> إعادة ضبط المصنع
            </button>
          </div>
        </div>
      )}

      <MediaPickerModal
        isOpen={mediaPickerOpen}
        onClose={() => setMediaPickerOpen(false)}
        onSelectImage={handleLogoSelected}
      />
    </div>
  );
}
