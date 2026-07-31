import React, { useState, useEffect } from "react";
import { Save, Image as ImageIcon, Sparkles, Building, Phone, MapPin, Globe } from "lucide-react";
import { toast } from "sonner";
import { useSiteData } from "../contexts/SiteContext";
import { MediaPickerModal } from "../components/MediaPickerModal";

export default function AdminPages() {
  const site = useSiteData();
  const [activeTab, setActiveTab] = useState("homePage");
  const [isMediaPickerOpen, setIsMediaPickerOpen] = useState(false);
  const [mediaTarget, setMediaTarget] = useState(null); // { tab: "homePage", field: "bgImage" } or { tab: "servicesPage", index: 0 }

  // Local state for forms
  const [pageConfig, setPageConfig] = useState(site.pageConfig);
  const [brand, setBrand] = useState(site.brand);

  useEffect(() => {
    setPageConfig(site.pageConfig);
    setBrand(site.brand);
  }, [site.pageConfig, site.brand]);

  const handleSave = () => {
    site.setEntirePageConfig(pageConfig);
    site.updateBrand(brand);
    toast.success("تم حفظ جميع تعديلات الصفحات بنجاح، وستشاهدها بالموقع فوراً!");
  };

  const openMediaPicker = (target) => {
    setMediaTarget(target);
    setIsMediaPickerOpen(true);
  };

  const handleMediaSelect = (url) => {
    if (!mediaTarget) return;

    if (mediaTarget.tab === "homePage" && mediaTarget.field === "bgImage") {
      setPageConfig((prev) => ({
        ...prev,
        homePage: {
          ...prev.homePage,
          hero: { ...prev.homePage.hero, bgImage: url },
        },
      }));
    } else if (mediaTarget.tab === "aboutPage" && mediaTarget.field === "mainImage") {
      setPageConfig((prev) => ({
        ...prev,
        aboutPage: { ...prev.aboutPage, mainImage: url },
      }));
    } else if (mediaTarget.tab === "aboutPage" && mediaTarget.field === "secondaryImage") {
      setPageConfig((prev) => ({
        ...prev,
        aboutPage: {
          ...prev.aboutPage,
          secondaryImages: [...(prev.aboutPage.secondaryImages || []), url],
        },
      }));
    } else if (mediaTarget.tab === "servicesPage" && mediaTarget.index !== undefined) {
      const newSectors = [...pageConfig.servicesPage.sectors];
      newSectors[mediaTarget.index].image = url;
      setPageConfig((prev) => ({
        ...prev,
        servicesPage: { ...prev.servicesPage, sectors: newSectors },
      }));
    }
  };

  const tabs = [
    { id: "homePage", label: "الرئيسية (Hero & Trust)" },
    { id: "aboutPage", label: "من نحن (About)" },
    { id: "servicesPage", label: "الخدمات (Sectors)" },
    { id: "portfolioPage", label: "معرض المشاريع" },
    { id: "footer", label: "الهيدر والفوتر والمعلومات" },
  ];

  return (
    <div data-testid="admin-pages-container">
      <div className="mb-10 flex items-end justify-between gap-4">
        <div>
          <div className="font-en text-[10px] text-[#D4AF37] tracking-[0.3em] mb-3">PAGES & CONTENT CONTROL</div>
          <h1 className="font-display text-3xl lg:text-4xl text-white">إدارة محتوى الصفحات</h1>
          <p className="font-body text-white/55 mt-2">تعديل نصوص وصور وأقسام الموقع بالكامل بمزامنة فورية.</p>
        </div>
        <button
          onClick={handleSave}
          data-testid="save-pages-btn"
          className="btn-sweep bg-[#D4AF37] text-black px-6 py-3 text-sm font-bold flex items-center gap-2 hover:bg-[#C5A030] transition-colors rounded-sm shadow-lg"
        >
          <Save size={18} />
          حفظ التغييرات
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2 border-b border-[#D4AF37]/20">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            data-testid={`tab-${tab.id}`}
            className={`px-6 py-3 text-sm font-display whitespace-nowrap transition-colors ${
              activeTab === tab.id
                ? "bg-[#D4AF37]/10 text-[#D4AF37] border-b-2 border-[#D4AF37]"
                : "text-white/60 hover:bg-white/5 hover:text-white"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content Form Panels */}
      <div className="glass p-6 lg:p-10">
        {/* HOMEPAGE TAB */}
        {activeTab === "homePage" && (
          <div className="space-y-8" data-testid="panel-homepage">
            <div>
              <h3 className="text-[#D4AF37] font-display text-xl mb-6 flex items-center gap-2">
                <Sparkles size={20} /> قسم الغلاف الرئيسي (Hero Section)
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-white/70 text-sm mb-2">العنوان الرئيسي - الجزء 1</label>
                  <input
                    type="text"
                    value={pageConfig.homePage?.hero?.headlinePart1 || ""}
                    onChange={(e) =>
                      setPageConfig((prev) => ({
                        ...prev,
                        homePage: {
                          ...prev.homePage,
                          hero: { ...prev.homePage.hero, headlinePart1: e.target.value },
                        },
                      }))
                    }
                    className="w-full bg-black border border-[#D4AF37]/20 text-white p-3 rounded-sm focus:border-[#D4AF37] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-white/70 text-sm mb-2">العنوان الرئيسي - الجزء 2 (ذهبي)</label>
                  <input
                    type="text"
                    value={pageConfig.homePage?.hero?.headlinePart2 || ""}
                    onChange={(e) =>
                      setPageConfig((prev) => ({
                        ...prev,
                        homePage: {
                          ...prev.homePage,
                          hero: { ...prev.homePage.hero, headlinePart2: e.target.value },
                        },
                      }))
                    }
                    className="w-full bg-black border border-[#D4AF37]/20 text-white p-3 rounded-sm focus:border-[#D4AF37] outline-none"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-white/70 text-sm mb-2">العنوان الفرعي (Subtitle)</label>
                  <textarea
                    rows={3}
                    value={pageConfig.homePage?.hero?.subtitle || ""}
                    onChange={(e) =>
                      setPageConfig((prev) => ({
                        ...prev,
                        homePage: {
                          ...prev.homePage,
                          hero: { ...prev.homePage.hero, subtitle: e.target.value },
                        },
                      }))
                    }
                    className="w-full bg-black border border-[#D4AF37]/20 text-white p-3 rounded-sm focus:border-[#D4AF37] outline-none resize-none"
                  />
                </div>
                <div>
                  <label className="block text-white/70 text-sm mb-2">نص زر الدعوة الرئيسي (Primary CTA)</label>
                  <input
                    type="text"
                    value={pageConfig.homePage?.hero?.ctaPrimaryText || ""}
                    onChange={(e) =>
                      setPageConfig((prev) => ({
                        ...prev,
                        homePage: {
                          ...prev.homePage,
                          hero: { ...prev.homePage.hero, ctaPrimaryText: e.target.value },
                        },
                      }))
                    }
                    className="w-full bg-black border border-[#D4AF37]/20 text-white p-3 rounded-sm focus:border-[#D4AF37] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-white/70 text-sm mb-2">نص زر الدعوة الثانوي (Secondary CTA)</label>
                  <input
                    type="text"
                    value={pageConfig.homePage?.hero?.ctaSecondaryText || ""}
                    onChange={(e) =>
                      setPageConfig((prev) => ({
                        ...prev,
                        homePage: {
                          ...prev.homePage,
                          hero: { ...prev.homePage.hero, ctaSecondaryText: e.target.value },
                        },
                      }))
                    }
                    className="w-full bg-black border border-[#D4AF37]/20 text-white p-3 rounded-sm focus:border-[#D4AF37] outline-none"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-white/70 text-sm mb-2">رابط صورة خلفية البطل (اتركه فارغاً للافتراضية)</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={pageConfig.homePage?.hero?.bgImage || ""}
                      placeholder="https://..."
                      onChange={(e) =>
                        setPageConfig((prev) => ({
                          ...prev,
                          homePage: {
                            ...prev.homePage,
                            hero: { ...prev.homePage.hero, bgImage: e.target.value },
                          },
                        }))
                      }
                      className="w-full bg-black border border-[#D4AF37]/20 text-white p-3 rounded-sm focus:border-[#D4AF37] outline-none dir-ltr text-left"
                    />
                    <button
                      type="button"
                      onClick={() => openMediaPicker({ tab: "homePage", field: "bgImage" })}
                      className="bg-[#D4AF37]/10 text-[#D4AF37] px-4 py-2 hover:bg-[#D4AF37]/20 transition-colors border border-[#D4AF37]/30 rounded-sm flex items-center gap-2 whitespace-nowrap"
                    >
                      <ImageIcon size={18} /> مكتبة الوسائط
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-[#D4AF37]/10 pt-8">
              <h3 className="text-[#D4AF37] font-display text-xl mb-6">قسم الثقة والتميز (Trust Section)</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-white/70 text-sm mb-2">عنوان القسم</label>
                  <input
                    type="text"
                    value={pageConfig.homePage?.trust?.title || ""}
                    onChange={(e) =>
                      setPageConfig((prev) => ({
                        ...prev,
                        homePage: {
                          ...prev.homePage,
                          trust: { ...prev.homePage.trust, title: e.target.value },
                        },
                      }))
                    }
                    className="w-full bg-black border border-[#D4AF37]/20 text-white p-3 rounded-sm focus:border-[#D4AF37] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-white/70 text-sm mb-2">العنوان الفرعي للقسم</label>
                  <input
                    type="text"
                    value={pageConfig.homePage?.trust?.subtitle || ""}
                    onChange={(e) =>
                      setPageConfig((prev) => ({
                        ...prev,
                        homePage: {
                          ...prev.homePage,
                          trust: { ...prev.homePage.trust, subtitle: e.target.value },
                        },
                      }))
                    }
                    className="w-full bg-black border border-[#D4AF37]/20 text-white p-3 rounded-sm focus:border-[#D4AF37] outline-none"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ABOUT PAGE TAB */}
        {activeTab === "aboutPage" && (
          <div className="space-y-8" data-testid="panel-about">
            <h3 className="text-[#D4AF37] font-display text-xl mb-6 flex items-center gap-2">
              <Building size={20} /> قسم من نحن (About Section)
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-white/70 text-sm mb-2">العنوان الرئيسي</label>
                <input
                  type="text"
                  value={pageConfig.aboutPage?.title || ""}
                  onChange={(e) =>
                    setPageConfig((prev) => ({
                      ...prev,
                      aboutPage: { ...prev.aboutPage, title: e.target.value },
                    }))
                  }
                  className="w-full bg-black border border-[#D4AF37]/20 text-white p-3 rounded-sm focus:border-[#D4AF37] outline-none"
                />
              </div>
              <div>
                <label className="block text-white/70 text-sm mb-2">العنوان الفرعي / الوسم (Eyebrow)</label>
                <input
                  type="text"
                  value={pageConfig.aboutPage?.eyebrow || pageConfig.aboutPage?.subtitle || ""}
                  onChange={(e) =>
                    setPageConfig((prev) => ({
                      ...prev,
                      aboutPage: { ...prev.aboutPage, eyebrow: e.target.value, subtitle: e.target.value },
                    }))
                  }
                  className="w-full bg-black border border-[#D4AF37]/20 text-white p-3 rounded-sm focus:border-[#D4AF37] outline-none"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-white/70 text-sm mb-2">فقرة التقديم الأولى</label>
                <textarea
                  rows={3}
                  value={pageConfig.aboutPage?.paragraph1 || ""}
                  onChange={(e) =>
                    setPageConfig((prev) => ({
                      ...prev,
                      aboutPage: { ...prev.aboutPage, paragraph1: e.target.value },
                    }))
                  }
                  className="w-full bg-black border border-[#D4AF37]/20 text-white p-3 rounded-sm focus:border-[#D4AF37] outline-none resize-none"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-white/70 text-sm mb-2">فقرة التقديم الثانية</label>
                <textarea
                  rows={3}
                  value={pageConfig.aboutPage?.paragraph2 || ""}
                  onChange={(e) =>
                    setPageConfig((prev) => ({
                      ...prev,
                      aboutPage: { ...prev.aboutPage, paragraph2: e.target.value },
                    }))
                  }
                  className="w-full bg-black border border-[#D4AF37]/20 text-white p-3 rounded-sm focus:border-[#D4AF37] outline-none resize-none"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-white/70 text-sm mb-2">فقرة التقديم الثالثة</label>
                <textarea
                  rows={3}
                  value={pageConfig.aboutPage?.paragraph3 || ""}
                  onChange={(e) =>
                    setPageConfig((prev) => ({
                      ...prev,
                      aboutPage: { ...prev.aboutPage, paragraph3: e.target.value },
                    }))
                  }
                  className="w-full bg-black border border-[#D4AF37]/20 text-white p-3 rounded-sm focus:border-[#D4AF37] outline-none resize-none"
                />
              </div>
              <div>
                <label className="block text-white/70 text-sm mb-2">عنوان الفلسفة</label>
                <input
                  type="text"
                  value={pageConfig.aboutPage?.philosophyTitle || ""}
                  onChange={(e) =>
                    setPageConfig((prev) => ({
                      ...prev,
                      aboutPage: { ...prev.aboutPage, philosophyTitle: e.target.value },
                    }))
                  }
                  className="w-full bg-black border border-[#D4AF37]/20 text-white p-3 rounded-sm focus:border-[#D4AF37] outline-none"
                />
              </div>
              <div>
                <label className="block text-white/70 text-sm mb-2">نص الفلسفة</label>
                <input
                  type="text"
                  value={pageConfig.aboutPage?.philosophyText || ""}
                  onChange={(e) =>
                    setPageConfig((prev) => ({
                      ...prev,
                      aboutPage: { ...prev.aboutPage, philosophyText: e.target.value },
                    }))
                  }
                  className="w-full bg-black border border-[#D4AF37]/20 text-white p-3 rounded-sm focus:border-[#D4AF37] outline-none"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-white/70 text-sm mb-2">صورة قسم من نحن الرئيسية</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="https://..."
                    value={pageConfig.aboutPage?.mainImage || ""}
                    onChange={(e) =>
                      setPageConfig((prev) => ({
                        ...prev,
                        aboutPage: { ...prev.aboutPage, mainImage: e.target.value },
                      }))
                    }
                    className="w-full bg-black border border-[#D4AF37]/20 text-white p-3 rounded-sm focus:border-[#D4AF37] outline-none dir-ltr text-left"
                  />
                  <button
                    type="button"
                    onClick={() => openMediaPicker({ tab: "aboutPage", field: "mainImage" })}
                    className="bg-[#D4AF37]/10 text-[#D4AF37] px-4 py-2 hover:bg-[#D4AF37]/20 transition-colors border border-[#D4AF37]/30 rounded-sm flex items-center gap-2 whitespace-nowrap"
                  >
                    <ImageIcon size={18} /> مكتبة الوسائط
                  </button>
                </div>
              </div>

              {/* Secondary Images Gallery for About Us */}
              <div className="md:col-span-2 border-t border-[#D4AF37]/20 pt-6 mt-4">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-white font-display text-base">معرض الصور الثانوي لقسم من نحن</h4>
                  <button
                    type="button"
                    onClick={() => openMediaPicker({ tab: "aboutPage", field: "secondaryImage" })}
                    className="bg-[#D4AF37] text-black px-4 py-2 rounded-sm text-xs font-bold flex items-center gap-1.5 hover:bg-[#C5A030]"
                  >
                    <ImageIcon size={16} /> إضافة صورة ثانوية
                  </button>
                </div>

                {(!pageConfig.aboutPage?.secondaryImages || pageConfig.aboutPage.secondaryImages.length === 0) ? (
                  <div className="p-6 text-center text-white/40 border border-dashed border-[#D4AF37]/20 rounded-sm text-xs">
                    لا توجد صور ثانوية مضافة لقسم من نحن حالياً.
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {pageConfig.aboutPage.secondaryImages.map((sImg, sIdx) => (
                      <div key={sIdx} className="relative aspect-square rounded overflow-hidden border border-[#D4AF37]/20 group">
                        <img src={sImg} alt={`About Secondary ${sIdx}`} className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => {
                            const newSecondary = pageConfig.aboutPage.secondaryImages.filter((_, i) => i !== sIdx);
                            setPageConfig((prev) => ({
                              ...prev,
                              aboutPage: { ...prev.aboutPage, secondaryImages: newSecondary },
                            }));
                          }}
                          className="absolute top-2 left-2 bg-red-600 text-white p-1 rounded-full hover:bg-red-500"
                          title="حذف الصورة"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* SERVICES PAGE TAB */}
        {activeTab === "servicesPage" && (
          <div className="space-y-8" data-testid="panel-services">
            <div>
              <h3 className="text-[#D4AF37] font-display text-xl mb-6">إدارة عنوان وصور قطاعات الخدمات</h3>
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div>
                  <label className="block text-white/70 text-sm mb-2">عنوان قسم الخدمات</label>
                  <input
                    type="text"
                    value={pageConfig.servicesPage?.title || ""}
                    onChange={(e) =>
                      setPageConfig((prev) => ({
                        ...prev,
                        servicesPage: { ...prev.servicesPage, title: e.target.value },
                      }))
                    }
                    className="w-full bg-black border border-[#D4AF37]/20 text-white p-3 rounded-sm focus:border-[#D4AF37] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-white/70 text-sm mb-2">الوصف الفرعي للخدمات</label>
                  <input
                    type="text"
                    value={pageConfig.servicesPage?.subtitle || ""}
                    onChange={(e) =>
                      setPageConfig((prev) => ({
                        ...prev,
                        servicesPage: { ...prev.servicesPage, subtitle: e.target.value },
                      }))
                    }
                    className="w-full bg-black border border-[#D4AF37]/20 text-white p-3 rounded-sm focus:border-[#D4AF37] outline-none"
                  />
                </div>
              </div>

              <h4 className="text-white font-display text-lg mb-4">قطاعات الخدمات الـ 5 الأساسية</h4>
              <div className="space-y-4">
                {(pageConfig.servicesPage?.sectors || []).map((sec, idx) => (
                  <div key={sec.id || idx} className="p-4 border border-[#D4AF37]/20 bg-black/40 rounded-sm">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-white/70 text-xs mb-1">اسم القطاع ({sec.id})</label>
                        <input
                          type="text"
                          value={sec.title || ""}
                          onChange={(e) => {
                            const newSectors = [...pageConfig.servicesPage.sectors];
                            newSectors[idx].title = e.target.value;
                            setPageConfig((prev) => ({
                              ...prev,
                              servicesPage: { ...prev.servicesPage, sectors: newSectors },
                            }));
                          }}
                          className="w-full bg-black border border-[#D4AF37]/20 text-white p-2.5 rounded-sm focus:border-[#D4AF37] outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-white/70 text-xs mb-1">صورة خلفية البطاقة</label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={sec.image || ""}
                            placeholder="رابط الصورة..."
                            onChange={(e) => {
                              const newSectors = [...pageConfig.servicesPage.sectors];
                              newSectors[idx].image = e.target.value;
                              setPageConfig((prev) => ({
                                ...prev,
                                servicesPage: { ...prev.servicesPage, sectors: newSectors },
                              }));
                            }}
                            className="w-full bg-black border border-[#D4AF37]/20 text-white p-2.5 rounded-sm focus:border-[#D4AF37] outline-none dir-ltr text-left"
                          />
                          <button
                            type="button"
                            onClick={() => openMediaPicker({ tab: "servicesPage", index: idx })}
                            className="bg-[#D4AF37]/10 text-[#D4AF37] px-3 py-2 hover:bg-[#D4AF37]/20 transition-colors border border-[#D4AF37]/30 rounded-sm flex items-center gap-2 whitespace-nowrap"
                          >
                            <ImageIcon size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* PORTFOLIO PAGE TAB */}
        {activeTab === "portfolioPage" && (
          <div className="space-y-8" data-testid="panel-portfolio">
            <h3 className="text-[#D4AF37] font-display text-xl mb-6">إدارة صفحة معرض المشاريع</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-white/70 text-sm mb-2">عنوان صفحة معرض المشاريع</label>
                <input
                  type="text"
                  value={pageConfig.portfolioPage?.title || ""}
                  onChange={(e) =>
                    setPageConfig((prev) => ({
                      ...prev,
                      portfolioPage: { ...prev.portfolioPage, title: e.target.value },
                    }))
                  }
                  className="w-full bg-black border border-[#D4AF37]/20 text-white p-3 rounded-sm focus:border-[#D4AF37] outline-none"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-white/70 text-sm mb-2">الوصف الفرعي لصفحة المعرض</label>
                <textarea
                  rows={3}
                  value={pageConfig.portfolioPage?.subtitle || ""}
                  onChange={(e) =>
                    setPageConfig((prev) => ({
                      ...prev,
                      portfolioPage: { ...prev.portfolioPage, subtitle: e.target.value },
                    }))
                  }
                  className="w-full bg-black border border-[#D4AF37]/20 text-white p-3 rounded-sm focus:border-[#D4AF37] outline-none resize-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* HEADER & FOOTER & BRAND TAB */}
        {activeTab === "footer" && (
          <div className="space-y-8" data-testid="panel-brand">
            <h3 className="text-[#D4AF37] font-display text-xl mb-6 flex items-center gap-2">
              <Globe size={20} /> بيانات الهوية والتواصل والفوتر
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-white/70 text-sm mb-2">اسم المؤسسة (عربي)</label>
                <input
                  type="text"
                  value={brand.nameAr || ""}
                  onChange={(e) => setBrand({ ...brand, nameAr: e.target.value })}
                  className="w-full bg-black border border-[#D4AF37]/20 text-white p-3 rounded-sm focus:border-[#D4AF37] outline-none"
                />
              </div>
              <div>
                <label className="block text-white/70 text-sm mb-2">اسم المؤسسة (إنجليزي)</label>
                <input
                  type="text"
                  value={brand.nameEn || ""}
                  onChange={(e) => setBrand({ ...brand, nameEn: e.target.value })}
                  className="w-full bg-black border border-[#D4AF37]/20 text-white p-3 rounded-sm focus:border-[#D4AF37] outline-none"
                />
              </div>
              <div>
                <label className="block text-white/70 text-sm mb-2">الشعار اللفظي (Tagline)</label>
                <input
                  type="text"
                  value={brand.tagline || ""}
                  onChange={(e) => setBrand({ ...brand, tagline: e.target.value })}
                  className="w-full bg-black border border-[#D4AF37]/20 text-white p-3 rounded-sm focus:border-[#D4AF37] outline-none"
                />
              </div>
              <div>
                <label className="block text-white/70 text-sm mb-2">رقم الواتساب</label>
                <input
                  type="text"
                  value={brand.whatsapp || ""}
                  onChange={(e) => setBrand({ ...brand, whatsapp: e.target.value })}
                  className="w-full bg-black border border-[#D4AF37]/20 text-white p-3 rounded-sm focus:border-[#D4AF37] outline-none dir-ltr text-left"
                />
              </div>
              <div>
                <label className="block text-white/70 text-sm mb-2">الموقع الجغرافي</label>
                <input
                  type="text"
                  value={brand.location || ""}
                  onChange={(e) => setBrand({ ...brand, location: e.target.value })}
                  className="w-full bg-black border border-[#D4AF37]/20 text-white p-3 rounded-sm focus:border-[#D4AF37] outline-none"
                />
              </div>
              <div>
                <label className="block text-white/70 text-sm mb-2">ساعات العمل</label>
                <input
                  type="text"
                  value={brand.hours || ""}
                  onChange={(e) => setBrand({ ...brand, hours: e.target.value })}
                  className="w-full bg-black border border-[#D4AF37]/20 text-white p-3 rounded-sm focus:border-[#D4AF37] outline-none"
                />
              </div>
              <div>
                <label className="block text-white/70 text-sm mb-2">رابط انستغرام</label>
                <input
                  type="text"
                  value={brand.instagram || ""}
                  onChange={(e) => setBrand({ ...brand, instagram: e.target.value })}
                  className="w-full bg-black border border-[#D4AF37]/20 text-white p-3 rounded-sm focus:border-[#D4AF37] outline-none dir-ltr text-left"
                />
              </div>
              <div>
                <label className="block text-white/70 text-sm mb-2">رابط تيك توك</label>
                <input
                  type="text"
                  value={brand.tiktok || ""}
                  onChange={(e) => setBrand({ ...brand, tiktok: e.target.value })}
                  className="w-full bg-black border border-[#D4AF37]/20 text-white p-3 rounded-sm focus:border-[#D4AF37] outline-none dir-ltr text-left"
                />
              </div>
              <div>
                <label className="block text-white/70 text-sm mb-2">رابط يوتيوب</label>
                <input
                  type="text"
                  value={brand.youtube || ""}
                  onChange={(e) => setBrand({ ...brand, youtube: e.target.value })}
                  className="w-full bg-black border border-[#D4AF37]/20 text-white p-3 rounded-sm focus:border-[#D4AF37] outline-none dir-ltr text-left"
                />
              </div>
              <div>
                <label className="block text-white/70 text-sm mb-2">رابط خرائط جوجل</label>
                <input
                  type="text"
                  value={brand.maps || ""}
                  onChange={(e) => setBrand({ ...brand, maps: e.target.value })}
                  className="w-full bg-black border border-[#D4AF37]/20 text-white p-3 rounded-sm focus:border-[#D4AF37] outline-none dir-ltr text-left"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-white/70 text-sm mb-2">حقوق النشر بالفوتر (Copyright)</label>
                <input
                  type="text"
                  value={pageConfig.footer?.copyright || ""}
                  onChange={(e) =>
                    setPageConfig((prev) => ({
                      ...prev,
                      footer: { ...prev.footer, copyright: e.target.value },
                    }))
                  }
                  className="w-full bg-black border border-[#D4AF37]/20 text-white p-3 rounded-sm focus:border-[#D4AF37] outline-none"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      <MediaPickerModal 
        isOpen={isMediaPickerOpen} 
        onClose={() => setIsMediaPickerOpen(false)} 
        onSelectImage={handleMediaSelect} 
      />
    </div>
  );
}
