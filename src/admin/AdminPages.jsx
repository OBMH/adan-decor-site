import React, { useState } from "react";
import {
  FileText,
  Sparkles,
  Save,
  Image as ImageIcon,
  Layers,
  Home,
  Info,
  Briefcase,
  Layout,
  CheckCircle2
} from "lucide-react";
import { toast } from "sonner";
import { useSiteData } from "../contexts/SiteContext";
import { MediaPickerModal } from "../components/MediaPickerModal";
import SafeImage from "../components/SafeImage";

export default function AdminPages() {
  const { pageConfig = {}, updatePageConfig } = useSiteData();
  const [activeTab, setActiveTab] = useState("home"); // 'home' | 'about' | 'services' | 'portfolio' | 'footer'
  const [mediaPickerTarget, setMediaPickerTarget] = useState(null); // { tab: string, index?: number, key: string }

  // Handlers for instant updates
  const handleUpdate = (pageKey, sectionKey, newValues) => {
    updatePageConfig(pageKey, sectionKey, newValues);
    toast.success("تم التحديث والحفظ في قاعدة البيانات بنجاح");
  };

  const handleImageSelected = (url) => {
    if (!mediaPickerTarget) return;
    const { tab, key, index } = mediaPickerTarget;

    if (tab === "home" && key === "heroBg") {
      handleUpdate("homePage", "hero", { bgImage: url });
    } else if (tab === "about" && key === "mainImage") {
      handleUpdate("aboutPage", null, { mainImage: url });
    } else if (tab === "services" && key === "sectorImage" && index !== undefined) {
      const currentSectors = [...(pageConfig?.servicesPage?.sectors || [])];
      if (currentSectors[index]) {
        currentSectors[index] = { ...currentSectors[index], image: url };
        handleUpdate("servicesPage", null, { sectors: currentSectors });
      }
    }
    setMediaPickerTarget(null);
  };

  const tabs = [
    { id: "home", label: "الرئيسية (Hero & Trust)", icon: Home },
    { id: "about", label: "من نحن وفلسفة العمل", icon: Info },
    { id: "services", label: "صفحة الخدمات والقطاعات", icon: Layers },
    { id: "portfolio", label: "معرض الأعمال", icon: Briefcase },
    { id: "footer", label: "التذييل والفوتر", icon: Layout },
  ];

  return (
    <div className="space-y-6" dir="rtl">
      {/* Header Banner */}
      <div className="bg-[#111] border border-[#D4AF37]/30 p-6 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[#D4AF37] text-xs font-bold uppercase tracking-wide mb-1">
            <FileText size={16} />
            <span>إدارة المحتوى والنصوص المعمارية</span>
          </div>
          <h2 className="font-display text-2xl font-bold text-white">
            تعديل صفحات ومحتوى الموقع
          </h2>
          <p className="text-white/60 text-sm mt-1">
            أي تغيير في هذه الحقول ينعكس بشكل فوري في صفحات الموقع العام ومربوط بقاعدة البيانات مباشرة دون الحاجة لأي زر حفظ.
          </p>
        </div>
        <div className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 shrink-0">
          <CheckCircle2 size={16} /> الحفظ الفوري مفعل (Live Auto-Save)
        </div>
      </div>

      {/* Tabs */}
      <div className="flex overflow-x-auto border-b border-[#D4AF37]/20 pb-1 gap-2 custom-scrollbar">
        {tabs.map((t) => {
          const Icon = t.icon;
          const isActive = activeTab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`px-4 py-2.5 rounded-t-lg font-bold text-sm transition-all flex items-center gap-2 shrink-0 ${
                isActive
                  ? "bg-[#D4AF37] text-black shadow-[0_0_15px_rgba(212,175,55,0.3)]"
                  : "bg-black/50 text-white/60 hover:bg-white/5 hover:text-white"
              }`}
            >
              <Icon size={18} />
              <span>{t.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Content 1: Home Page */}
      {activeTab === "home" && (
        <div className="bg-[#111] border border-[#D4AF37]/20 p-6 lg:p-8 rounded-xl space-y-6">
          <h3 className="font-display font-bold text-lg text-[#D4AF37] border-b border-white/10 pb-3 flex items-center gap-2">
            <Home size={18} />
            <span>نصوص الغلاف الرئيسي (Hero Section)</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-white/80 mb-2">
                الشطر الأول من العنوان (Headline Part 1):
              </label>
              <input
                type="text"
                value={pageConfig?.homePage?.hero?.headlinePart1 || ""}
                onChange={(e) => handleUpdate("homePage", "hero", { headlinePart1: e.target.value })}
                className="w-full bg-black border border-[#D4AF37]/30 text-white rounded-lg p-3.5 text-sm focus:outline-none focus:border-[#D4AF37]"
                placeholder="مثال: نصمم الفخامة..."
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-white/80 mb-2">
                الشطر الثاني من العنوان (Headline Part 2):
              </label>
              <input
                type="text"
                value={pageConfig?.homePage?.hero?.headlinePart2 || ""}
                onChange={(e) => handleUpdate("homePage", "hero", { headlinePart2: e.target.value })}
                className="w-full bg-black border border-[#D4AF37]/30 text-white rounded-lg p-3.5 text-sm focus:outline-none focus:border-[#D4AF37]"
                placeholder="مثال: وننفذها بإتقان."
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-white/80 mb-2">
                النص الوصفي التكميلي تحت العنوان (Subtitle):
              </label>
              <textarea
                rows={3}
                value={pageConfig?.homePage?.hero?.subtitle || ""}
                onChange={(e) => handleUpdate("homePage", "hero", { subtitle: e.target.value })}
                className="w-full bg-black border border-[#D4AF37]/30 text-white rounded-lg p-3.5 text-sm focus:outline-none focus:border-[#D4AF37] leading-relaxed"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-white/80 mb-2">
                نص الزر الأساسي (CTA Primary):
              </label>
              <input
                type="text"
                value={pageConfig?.homePage?.hero?.ctaPrimaryText || ""}
                onChange={(e) => handleUpdate("homePage", "hero", { ctaPrimaryText: e.target.value })}
                className="w-full bg-black border border-[#D4AF37]/30 text-white rounded-lg p-3.5 text-sm focus:outline-none focus:border-[#D4AF37]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-white/80 mb-2">
                نص الزر الثانوي (CTA Secondary):
              </label>
              <input
                type="text"
                value={pageConfig?.homePage?.hero?.ctaSecondaryText || ""}
                onChange={(e) => handleUpdate("homePage", "hero", { ctaSecondaryText: e.target.value })}
                className="w-full bg-black border border-[#D4AF37]/30 text-white rounded-lg p-3.5 text-sm focus:outline-none focus:border-[#D4AF37]"
              />
            </div>
          </div>

          {/* Hero Background Image */}
          <div className="pt-4 border-t border-white/10">
            <label className="block text-xs font-bold text-[#D4AF37] mb-3">
              صورة خلفية الغلاف الرئيسي (Hero Background Image):
            </label>
            <div className="flex items-center gap-6 bg-black p-4 rounded-xl border border-white/10">
              <div className="w-40 h-24 rounded-lg overflow-hidden border border-[#D4AF37]/40 bg-black shrink-0">
                <SafeImage
                  src={pageConfig?.homePage?.hero?.bgImage || "/placeholder.jpg"}
                  alt="Hero bg"
                  fallbackType="portfolio"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="space-y-2">
                <p className="text-xs text-white/70 leading-relaxed">
                  يمكنك استبدال خلفية الصفحة الرئيسية عبر الاستعراض من مكتبة الصور أو رفع ملف جديد.
                </p>
                <button
                  type="button"
                  onClick={() => setMediaPickerTarget({ tab: "home", key: "heroBg" })}
                  className="bg-[#D4AF37] text-black px-4 py-2 rounded font-bold text-xs hover:bg-[#C5A030] transition-colors flex items-center gap-1.5 shadow-md"
                >
                  <ImageIcon size={14} /> اختر أو ارفع صورة جديدة
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab Content 2: About Page */}
      {activeTab === "about" && (
        <div className="bg-[#111] border border-[#D4AF37]/20 p-6 lg:p-8 rounded-xl space-y-6">
          <h3 className="font-display font-bold text-lg text-[#D4AF37] border-b border-white/10 pb-3 flex items-center gap-2">
            <Info size={18} />
            <span>نصوص صفحة وقسم "من نحن"</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-white/80 mb-2">
                العنوان الفرعي الصغير (Eyebrow Text):
              </label>
              <input
                type="text"
                value={pageConfig?.aboutPage?.eyebrow || ""}
                onChange={(e) => handleUpdate("aboutPage", null, { eyebrow: e.target.value })}
                className="w-full bg-black border border-[#D4AF37]/30 text-white rounded-lg p-3.5 text-sm focus:outline-none focus:border-[#D4AF37]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-white/80 mb-2">
                العنوان العريض الأساسي (Title):
              </label>
              <input
                type="text"
                value={pageConfig?.aboutPage?.title || ""}
                onChange={(e) => handleUpdate("aboutPage", null, { title: e.target.value })}
                className="w-full bg-black border border-[#D4AF37]/30 text-white rounded-lg p-3.5 text-sm focus:outline-none focus:border-[#D4AF37]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-white/80 mb-2">
              الفقرة التعريفية الأولى:
            </label>
            <textarea
              rows={3}
              value={pageConfig?.aboutPage?.paragraph1 || ""}
              onChange={(e) => handleUpdate("aboutPage", null, { paragraph1: e.target.value })}
              className="w-full bg-black border border-[#D4AF37]/30 text-white rounded-lg p-3.5 text-sm focus:outline-none focus:border-[#D4AF37] leading-relaxed"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-white/80 mb-2">
              الفقرة التعريفية الثانية:
            </label>
            <textarea
              rows={3}
              value={pageConfig?.aboutPage?.paragraph2 || ""}
              onChange={(e) => handleUpdate("aboutPage", null, { paragraph2: e.target.value })}
              className="w-full bg-black border border-[#D4AF37]/30 text-white rounded-lg p-3.5 text-sm focus:outline-none focus:border-[#D4AF37] leading-relaxed"
            />
          </div>

          <div className="p-5 bg-black/60 rounded-xl border border-white/10 space-y-4">
            <h4 className="font-display font-bold text-sm text-[#D4AF37]">قسم فلسفتنا في العمل</h4>
            <div>
              <label className="block text-xs font-bold text-white/80 mb-2">عنوان الفلسفة:</label>
              <input
                type="text"
                value={pageConfig?.aboutPage?.philosophyTitle || ""}
                onChange={(e) => handleUpdate("aboutPage", null, { philosophyTitle: e.target.value })}
                className="w-full bg-black border border-[#D4AF37]/30 text-white rounded-lg p-3 text-sm focus:outline-none focus:border-[#D4AF37]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-white/80 mb-2">نص الفلسفة:</label>
              <textarea
                rows={2}
                value={pageConfig?.aboutPage?.philosophyText || ""}
                onChange={(e) => handleUpdate("aboutPage", null, { philosophyText: e.target.value })}
                className="w-full bg-black border border-[#D4AF37]/30 text-white rounded-lg p-3 text-sm focus:outline-none focus:border-[#D4AF37] leading-relaxed"
              />
            </div>
          </div>

          {/* About Main Image */}
          <div className="pt-4 border-t border-white/10">
            <label className="block text-xs font-bold text-[#D4AF37] mb-3">
              الصورة الرئيسية في قسم وقيم من نحن:
            </label>
            <div className="flex items-center gap-6 bg-black p-4 rounded-xl border border-white/10">
              <div className="w-36 h-36 rounded-lg overflow-hidden border border-[#D4AF37]/40 bg-black shrink-0">
                <SafeImage
                  src={pageConfig?.aboutPage?.mainImage || "/placeholder.jpg"}
                  alt="About main"
                  fallbackType="portfolio"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="space-y-2">
                <p className="text-xs text-white/70 leading-relaxed">
                  تظهر هذه الصورة في صفحة من نحن وأقسام التعريف بالمؤسسة.
                </p>
                <button
                  type="button"
                  onClick={() => setMediaPickerTarget({ tab: "about", key: "mainImage" })}
                  className="bg-[#D4AF37] text-black px-4 py-2 rounded font-bold text-xs hover:bg-[#C5A030] transition-colors flex items-center gap-1.5 shadow-md"
                >
                  <ImageIcon size={14} /> اختيار صورة أو رفع ملف جديد
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab Content 3: Services Page Banner & Sectors Cards */}
      {activeTab === "services" && (
        <div className="bg-[#111] border border-[#D4AF37]/20 p-6 lg:p-8 rounded-xl space-y-6">
          <h3 className="font-display font-bold text-lg text-[#D4AF37] border-b border-white/10 pb-3 flex items-center gap-2">
            <Layers size={18} />
            <span>إعدادات صفحة الخدمات وبطاقات القطاعات</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-white/80 mb-2">عنوان صفحة الخدمات:</label>
              <input
                type="text"
                value={pageConfig?.servicesPage?.title || ""}
                onChange={(e) => handleUpdate("servicesPage", null, { title: e.target.value })}
                className="w-full bg-black border border-[#D4AF37]/30 text-white rounded-lg p-3.5 text-sm focus:outline-none focus:border-[#D4AF37]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-white/80 mb-2">النص الوصفي لصفحة الخدمات:</label>
              <input
                type="text"
                value={pageConfig?.servicesPage?.subtitle || ""}
                onChange={(e) => handleUpdate("servicesPage", null, { subtitle: e.target.value })}
                className="w-full bg-black border border-[#D4AF37]/30 text-white rounded-lg p-3.5 text-sm focus:outline-none focus:border-[#D4AF37]"
              />
            </div>
          </div>

          {/* Sectors list */}
          <div className="pt-4 border-t border-white/10">
            <h4 className="font-display font-bold text-base text-white mb-4">
              بطاقات القطاعات الخمسة الأساسية (Sectors Card Backgrounds)
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {(pageConfig?.servicesPage?.sectors || []).map((sec, idx) => (
                <div key={sec.id || idx} className="bg-black p-4 rounded-xl border border-white/10 flex flex-col justify-between gap-3">
                  <div>
                    <span className="text-[10px] text-[#D4AF37] font-bold uppercase block mb-1">القطاع: {sec.id}</span>
                    <h5 className="text-white font-bold text-sm mb-3">{sec.title}</h5>
                    <div className="aspect-video w-full rounded-lg overflow-hidden border border-[#D4AF37]/20 bg-black">
                      <SafeImage
                        src={sec.image}
                        alt={sec.title}
                        fallbackType="portfolio"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setMediaPickerTarget({ tab: "services", key: "sectorImage", index: idx })}
                    className="w-full bg-white/10 hover:bg-[#D4AF37] hover:text-black text-white py-2 rounded text-xs font-bold transition-all flex items-center justify-center gap-1.5"
                  >
                    <ImageIcon size={14} /> استبدال الصورة
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab Content 4: Portfolio Page */}
      {activeTab === "portfolio" && (
        <div className="bg-[#111] border border-[#D4AF37]/20 p-6 lg:p-8 rounded-xl space-y-6">
          <h3 className="font-display font-bold text-lg text-[#D4AF37] border-b border-white/10 pb-3 flex items-center gap-2">
            <Briefcase size={18} />
            <span>نصوص عنوان صفحة معرض الأعمال</span>
          </h3>

          <div className="space-y-6 max-w-3xl">
            <div>
              <label className="block text-xs font-bold text-white/80 mb-2">عنوان المعرض:</label>
              <input
                type="text"
                value={pageConfig?.portfolioPage?.title || ""}
                onChange={(e) => handleUpdate("portfolioPage", null, { title: e.target.value })}
                className="w-full bg-black border border-[#D4AF37]/30 text-white rounded-lg p-3.5 text-sm focus:outline-none focus:border-[#D4AF37]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-white/80 mb-2">النص التمهيدي فوق المعرض:</label>
              <textarea
                rows={3}
                value={pageConfig?.portfolioPage?.subtitle || ""}
                onChange={(e) => handleUpdate("portfolioPage", null, { subtitle: e.target.value })}
                className="w-full bg-black border border-[#D4AF37]/30 text-white rounded-lg p-3.5 text-sm focus:outline-none focus:border-[#D4AF37] leading-relaxed"
              />
            </div>
          </div>
        </div>
      )}

      {/* Tab Content 5: Footer */}
      {activeTab === "footer" && (
        <div className="bg-[#111] border border-[#D4AF37]/20 p-6 lg:p-8 rounded-xl space-y-6">
          <h3 className="font-display font-bold text-lg text-[#D4AF37] border-b border-white/10 pb-3 flex items-center gap-2">
            <Layout size={18} />
            <span>نصوص التذييل (Footer)</span>
          </h3>

          <div className="space-y-6 max-w-3xl">
            <div>
              <label className="block text-xs font-bold text-white/80 mb-2">نص حقوق النشر (Copyright Text):</label>
              <input
                type="text"
                value={pageConfig?.footer?.copyright || ""}
                onChange={(e) => handleUpdate("footer", null, { copyright: e.target.value })}
                className="w-full bg-black border border-[#D4AF37]/30 text-white rounded-lg p-3.5 text-sm focus:outline-none focus:border-[#D4AF37]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-white/80 mb-2">نبذة المؤسسة في التذييل:</label>
              <textarea
                rows={3}
                value={pageConfig?.footer?.aboutText || ""}
                onChange={(e) => handleUpdate("footer", null, { aboutText: e.target.value })}
                className="w-full bg-black border border-[#D4AF37]/30 text-white rounded-lg p-3.5 text-sm focus:outline-none focus:border-[#D4AF37] leading-relaxed"
              />
            </div>
          </div>
        </div>
      )}

      {/* Media Picker Modal */}
      <MediaPickerModal
        isOpen={!!mediaPickerTarget}
        onClose={() => setMediaPickerTarget(null)}
        onSelectImage={handleImageSelected}
      />
    </div>
  );
}
