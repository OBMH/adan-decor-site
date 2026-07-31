import React, { useState } from "react";
import { Save, Image as ImageIcon, Globe, Phone, Share2, Search, CheckCircle2, Sparkles, Building, MapPin, Mail, Clock, ShieldCheck, Database, Download, Upload, RefreshCw, FileJson } from "lucide-react";
import { toast } from "sonner";
import { useSiteData } from "../contexts/SiteContext";
import SafeImage from "../components/SafeImage";
import { MediaPickerModal } from "../components/MediaPickerModal";

export default function AdminSettings() {
  const site = useSiteData();
  const [brand, setBrand] = useState(site.brand || {});
  const [activeTab, setActiveTab] = useState("identity"); // 'identity' | 'contact' | 'social' | 'seo' | 'backup'
  const [isMediaOpen, setIsMediaOpen] = useState(false);

  const handleSave = () => {
    site.updateBrand(brand);
    toast.success("تم حفظ إعدادات الموقع والهوية بنجاح!", {
      description: "تمت المزامنة اللحظية الشاملة مع الهيدر والفوتر ونماذج التواصل.",
      duration: 4000,
      style: {
        background: "#09090b",
        border: "1px solid rgba(212, 175, 55, 0.4)",
        color: "#ffffff",
      },
    });
  };

  const handleExportBackup = () => {
    site.exportAllData();
    toast.success("تم تصدير ملف النسخة الاحتياطية بنجاح!", {
      description: "تم حفظ كافة إعدادات الموقع والمشاريع والخدمات في ملف JSON.",
      duration: 4000,
      style: {
        background: "#09090b",
        border: "1px solid rgba(212, 175, 55, 0.4)",
        color: "#ffffff",
      },
    });
  };

  const handleImportBackup = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target.result);
        site.importAllData(parsed);
        if (parsed.brand) {
          setBrand(parsed.brand);
        }
        toast.success("تم استرجاع بيانات الموقع بنجاح!", {
          description: "تمت تحديثات القواعد والمحتوى والميديا كلياً وحفظها بنجاح.",
          duration: 5000,
          style: {
            background: "#09090b",
            border: "1px solid rgba(212, 175, 55, 0.5)",
            color: "#ffffff",
          },
        });
      } catch (err) {
        toast.error("فشل استرجاع البيانات! تأكد من رفع ملف JSON صحيح.", {
          style: {
            background: "#09090b",
            border: "1px solid rgba(239, 68, 68, 0.5)",
            color: "#ffffff",
          },
        });
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  return (
    <div data-testid="admin-settings-page" className="space-y-8 pb-16">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-[#D4AF37]/20">
        <div>
          <div className="flex items-center gap-2 text-[10px] font-en text-[#D4AF37] tracking-[0.3em] uppercase mb-2">
            <Sparkles size={14} className="text-[#D4AF37]" />
            GLOBAL SITE CONFIGURATION & BRANDING
          </div>
          <h1 className="font-display text-3xl lg:text-4xl text-white font-bold">إعدادات الموقع العامة والهوية</h1>
          <p className="font-body text-white/60 text-sm mt-1">
            التحكم الشامل في هوية "عدن للديكور"، أرقام التواصل، روابط السوشيال ميديا، وإعدادات محركات البحث (SEO) مع المزامنة اللحظية.
          </p>
        </div>

        <button
          onClick={handleSave}
          data-testid="save-settings"
          className="btn-sweep bg-[#D4AF37] text-black px-8 py-3.5 text-sm font-bold flex items-center justify-center gap-2 hover:bg-[#C5A030] transition-all duration-300 rounded-lg shadow-[0_0_20px_rgba(212,175,55,0.25)] shrink-0 active:scale-95"
        >
          <Save size={18} />
          <span>حفظ التغييرات والمزامنة</span>
        </button>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-[#D4AF37]/15 pb-4">
        <button
          onClick={() => setActiveTab("identity")}
          className={`px-5 py-2.5 text-sm font-display rounded-lg transition-all duration-300 flex items-center gap-2 ${
            activeTab === "identity"
              ? "bg-[#D4AF37] text-black font-bold shadow-md"
              : "bg-white/[0.03] text-white/70 hover:text-white hover:bg-white/[0.08]"
          }`}
        >
          <Building size={16} />
          هوية الموقع والشعار
        </button>
        <button
          onClick={() => setActiveTab("contact")}
          className={`px-5 py-2.5 text-sm font-display rounded-lg transition-all duration-300 flex items-center gap-2 ${
            activeTab === "contact"
              ? "bg-[#D4AF37] text-black font-bold shadow-md"
              : "bg-white/[0.03] text-white/70 hover:text-white hover:bg-white/[0.08]"
          }`}
        >
          <Phone size={16} />
          بيانات التواصل
        </button>
        <button
          onClick={() => setActiveTab("social")}
          className={`px-5 py-2.5 text-sm font-display rounded-lg transition-all duration-300 flex items-center gap-2 ${
            activeTab === "social"
              ? "bg-[#D4AF37] text-black font-bold shadow-md"
              : "bg-white/[0.03] text-white/70 hover:text-white hover:bg-white/[0.08]"
          }`}
        >
          <Share2 size={16} />
          شبكات التواصل الاجتماعي
        </button>
        <button
          onClick={() => setActiveTab("seo")}
          className={`px-5 py-2.5 text-sm font-display rounded-lg transition-all duration-300 flex items-center gap-2 ${
            activeTab === "seo"
              ? "bg-[#D4AF37] text-black font-bold shadow-md"
              : "bg-white/[0.03] text-white/70 hover:text-white hover:bg-white/[0.08]"
          }`}
        >
          <Search size={16} />
          إعدادات المحرك (SEO)
        </button>
        <button
          onClick={() => setActiveTab("backup")}
          data-testid="admin-settings-tab-backup"
          className={`px-5 py-2.5 text-sm font-display rounded-lg transition-all duration-300 flex items-center gap-2 ${
            activeTab === "backup"
              ? "bg-[#D4AF37] text-black font-bold shadow-md"
              : "bg-white/[0.03] text-white/70 hover:text-white hover:bg-white/[0.08]"
          }`}
        >
          <Database size={16} />
          النسخ الاحتياطي والاسترجاع
        </button>
      </div>

      {/* Main Form Area & Live Preview Sidebar */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Form Container */}
        <div className="lg:col-span-2 space-y-8">
          {/* TAB 1: IDENTITY */}
          {activeTab === "identity" && (
            <div className="glass p-6 lg:p-8 rounded-xl border border-[#D4AF37]/20 space-y-6" data-testid="settings-group-brand">
              <div className="flex items-center gap-3 border-b border-[#D4AF37]/15 pb-4">
                <Building size={20} className="text-[#D4AF37]" />
                <div>
                  <h2 className="font-display text-xl text-white font-bold">هوية المؤسسة والشعار</h2>
                  <p className="text-xs text-white/50">تغيير اسم المؤسسة والشعار يظهر فوراً في شريط التنقل العلوي والفوتر.</p>
                </div>
              </div>

              {/* Logo Section */}
              <div className="bg-black/50 p-5 rounded-lg border border-[#D4AF37]/20 flex flex-col sm:flex-row items-center gap-6">
                <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-[#D4AF37] bg-black flex items-center justify-center shrink-0 shadow-[0_0_20px_rgba(212,175,55,0.2)]">
                  <SafeImage
                    src={brand.logo}
                    alt="Logo Preview"
                    fallbackType="logo"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 space-y-3 text-center sm:text-right w-full">
                  <div>
                    <h3 className="text-sm font-bold text-white">صورة اللوجو (الشعار)</h3>
                    <p className="text-xs text-white/50 mt-1">اختر صورة الشعار الرسمية بدقة عالية وخلفية مفرغة أو ملائمة.</p>
                  </div>
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3">
                    <button
                      type="button"
                      onClick={() => setIsMediaOpen(true)}
                      className="bg-[#D4AF37]/10 hover:bg-[#D4AF37] text-[#D4AF37] hover:text-black border border-[#D4AF37]/40 px-4 py-2 rounded-md text-xs font-bold transition-all flex items-center gap-2"
                    >
                      <ImageIcon size={14} />
                      اختر من مكتبة الوسائط
                    </button>
                    {brand.logo && (
                      <button
                        type="button"
                        onClick={() => setBrand({ ...brand, logo: "" })}
                        className="text-red-400 hover:text-red-300 text-xs px-3 py-2 transition-colors"
                      >
                        إزالة الشعار الحالي
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Logo Direct URL Input */}
              <div>
                <label className="text-xs text-white/70 block mb-2 font-body font-medium">رابط الشعار المباشر (URL)</label>
                <input
                  type="text"
                  className="luxe-input dir-ltr text-left text-xs"
                  placeholder="https://..."
                  value={brand.logo || ""}
                  onChange={(e) => setBrand({ ...brand, logo: e.target.value })}
                />
              </div>

              {/* Names */}
              <div className="grid sm:grid-cols-2 gap-6 pt-2">
                <div>
                  <label className="text-[10px] text-[#D4AF37] font-en tracking-[0.2em] block mb-1">BRAND_NAME_AR</label>
                  <label className="text-xs text-white/70 block mb-2 font-medium">اسم المؤسسة (بالعربية)</label>
                  <input
                    type="text"
                    className="luxe-input"
                    placeholder="عدن للديكور"
                    value={brand.nameAr || ""}
                    onChange={(e) => setBrand({ ...brand, nameAr: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-[10px] text-[#D4AF37] font-en tracking-[0.2em] block mb-1">BRAND_NAME_EN</label>
                  <label className="text-xs text-white/70 block mb-2 font-medium">اسم المؤسسة (بالإنجليزية)</label>
                  <input
                    type="text"
                    className="luxe-input font-en"
                    placeholder="Adan Decor"
                    value={brand.nameEn || ""}
                    onChange={(e) => setBrand({ ...brand, nameEn: e.target.value })}
                  />
                </div>
              </div>

              {/* Tagline */}
              <div>
                <label className="text-[10px] text-[#D4AF37] font-en tracking-[0.2em] block mb-1">SLOGAN & TAGLINE</label>
                <label className="text-xs text-white/70 block mb-2 font-medium">الشعار اللفظي (Slogan)</label>
                <input
                  type="text"
                  className="luxe-input"
                  placeholder="عدن للديكور — حلول متكاملة في التصميم الداخلي والتنفيذ، نحول الأفكار إلى مساحات عصرية تجمع بين الجودة، الدقة، وجمال التفاصيل."
                  value={brand.tagline || ""}
                  onChange={(e) => setBrand({ ...brand, tagline: e.target.value })}
                />
              </div>
            </div>
          )}

          {/* TAB 2: CONTACT */}
          {activeTab === "contact" && (
            <div className="glass p-6 lg:p-8 rounded-xl border border-[#D4AF37]/20 space-y-6" data-testid="settings-group-contact">
              <div className="flex items-center gap-3 border-b border-[#D4AF37]/15 pb-4">
                <Phone size={20} className="text-[#D4AF37]" />
                <div>
                  <h2 className="font-display text-xl text-white font-bold">بيانات التواصل والمقر</h2>
                  <p className="text-xs text-white/50">تحديث أرقام الواتساب، التلفون، البريد والعنوان لضمان وصول الاستفسارات بسهولة.</p>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <label className="text-[10px] text-[#D4AF37] font-en tracking-[0.2em] block mb-1">WHATSAPP_PRIMARY</label>
                  <label className="text-xs text-white/70 block mb-2 font-medium">رقم الواتساب الأساسي</label>
                  <input
                    type="text"
                    className="luxe-input dir-ltr text-left font-en"
                    placeholder="+967771258215"
                    value={brand.whatsapp || ""}
                    onChange={(e) => setBrand({ ...brand, whatsapp: e.target.value })}
                  />
                  <span className="text-[11px] text-white/40 mt-1 block">يستخدم في الأزرار العائمة وطلب الاستشارات عبر الواتساب.</span>
                </div>

                <div>
                  <label className="text-[10px] text-[#D4AF37] font-en tracking-[0.2em] block mb-1">PHONE_DIRECT</label>
                  <label className="text-xs text-white/70 block mb-2 font-medium">رقم الهاتف المباشر (رئيسي)</label>
                  <input
                    type="text"
                    className="luxe-input dir-ltr text-left font-en"
                    placeholder="+967771258215"
                    value={brand.phone || ""}
                    onChange={(e) => setBrand({ ...brand, phone: e.target.value })}
                  />
                </div>

                <div>
                  <label className="text-[10px] text-[#D4AF37] font-en tracking-[0.2em] block mb-1">PHONE_SECONDARY</label>
                  <label className="text-xs text-white/70 block mb-2 font-medium">رقم الهاتف الإضافي</label>
                  <input
                    type="text"
                    className="luxe-input dir-ltr text-left font-en"
                    placeholder="+967733445566"
                    value={brand.phone2 || ""}
                    onChange={(e) => setBrand({ ...brand, phone2: e.target.value })}
                  />
                </div>

                <div>
                  <label className="text-[10px] text-[#D4AF37] font-en tracking-[0.2em] block mb-1">EMAIL_ADDRESS</label>
                  <label className="text-xs text-white/70 block mb-2 font-medium">البريد الإلكتروني الرسمي</label>
                  <input
                    type="email"
                    className="luxe-input dir-ltr text-left font-en"
                    placeholder="info@adandecor.com"
                    value={brand.email || ""}
                    onChange={(e) => setBrand({ ...brand, email: e.target.value })}
                  />
                </div>

                <div>
                  <label className="text-[10px] text-[#D4AF37] font-en tracking-[0.2em] block mb-1">CITY_LOCATION</label>
                  <label className="text-xs text-white/70 block mb-2 font-medium">المدينة / المقر</label>
                  <input
                    type="text"
                    className="luxe-input"
                    placeholder="عدن — اليمن"
                    value={brand.location || ""}
                    onChange={(e) => setBrand({ ...brand, location: e.target.value })}
                  />
                </div>

                <div>
                  <label className="text-[10px] text-[#D4AF37] font-en tracking-[0.2em] block mb-1">WORKING_HOURS</label>
                  <label className="text-xs text-white/70 block mb-2 font-medium">ساعات العمل</label>
                  <input
                    type="text"
                    className="luxe-input"
                    placeholder="مفتوح 24 ساعة / من 8 ص إلى 10 م"
                    value={brand.hours || ""}
                    onChange={(e) => setBrand({ ...brand, hours: e.target.value })}
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-[10px] text-[#D4AF37] font-en tracking-[0.2em] block mb-1">PHYSICAL_ADDRESS</label>
                  <label className="text-xs text-white/70 block mb-2 font-medium">العنوان الفيزيائي بالتفصيل</label>
                  <input
                    type="text"
                    className="luxe-input"
                    placeholder="عدن، خور مكسر، الشارع العام - اليمن"
                    value={brand.address || ""}
                    onChange={(e) => setBrand({ ...brand, address: e.target.value })}
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: SOCIAL MEDIA */}
          {activeTab === "social" && (
            <div className="glass p-6 lg:p-8 rounded-xl border border-[#D4AF37]/20 space-y-6" data-testid="settings-group-social">
              <div className="flex items-center gap-3 border-b border-[#D4AF37]/15 pb-4">
                <Share2 size={20} className="text-[#D4AF37]" />
                <div>
                  <h2 className="font-display text-xl text-white font-bold">حسابات وقنوات التواصل الاجتماعي</h2>
                  <p className="text-xs text-white/50">تظهر هذه الروابط تلقائياً في فوتر الموقع، صفحة التواصل، وعناصر الربط المباشر.</p>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <label className="text-[10px] text-[#D4AF37] font-en tracking-[0.2em] block mb-1">INSTAGRAM_URL</label>
                  <label className="text-xs text-white/70 block mb-2 font-medium">رابط حساب انستقرام</label>
                  <input
                    type="text"
                    className="luxe-input dir-ltr text-left font-en text-xs"
                    placeholder="https://www.instagram.com/adendecor/"
                    value={brand.instagram || ""}
                    onChange={(e) => setBrand({ ...brand, instagram: e.target.value })}
                  />
                </div>

                <div>
                  <label className="text-[10px] text-[#D4AF37] font-en tracking-[0.2em] block mb-1">FACEBOOK_URL</label>
                  <label className="text-xs text-white/70 block mb-2 font-medium">رابط صفحة الفيسبوك</label>
                  <input
                    type="text"
                    className="luxe-input dir-ltr text-left font-en text-xs"
                    placeholder="https://facebook.com/adandecor"
                    value={brand.facebook || ""}
                    onChange={(e) => setBrand({ ...brand, facebook: e.target.value })}
                  />
                </div>

                <div>
                  <label className="text-[10px] text-[#D4AF37] font-en tracking-[0.2em] block mb-1">SNAPCHAT_URL</label>
                  <label className="text-xs text-white/70 block mb-2 font-medium">رابط حساب سناب شات</label>
                  <input
                    type="text"
                    className="luxe-input dir-ltr text-left font-en text-xs"
                    placeholder="https://snapchat.com/add/adandecor"
                    value={brand.snapchat || ""}
                    onChange={(e) => setBrand({ ...brand, snapchat: e.target.value })}
                  />
                </div>

                <div>
                  <label className="text-[10px] text-[#D4AF37] font-en tracking-[0.2em] block mb-1">TIKTOK_URL</label>
                  <label className="text-xs text-white/70 block mb-2 font-medium">رابط حساب تيك توك</label>
                  <input
                    type="text"
                    className="luxe-input dir-ltr text-left font-en text-xs"
                    placeholder="https://www.tiktok.com/@yemen_decor_771258215"
                    value={brand.tiktok || ""}
                    onChange={(e) => setBrand({ ...brand, tiktok: e.target.value })}
                  />
                </div>

                <div>
                  <label className="text-[10px] text-[#D4AF37] font-en tracking-[0.2em] block mb-1">YOUTUBE_URL</label>
                  <label className="text-xs text-white/70 block mb-2 font-medium">رابط قناة اليوتيوب</label>
                  <input
                    type="text"
                    className="luxe-input dir-ltr text-left font-en text-xs"
                    placeholder="https://www.youtube.com/@Aden_decor"
                    value={brand.youtube || ""}
                    onChange={(e) => setBrand({ ...brand, youtube: e.target.value })}
                  />
                </div>

                <div>
                  <label className="text-[10px] text-[#D4AF37] font-en tracking-[0.2em] block mb-1">GOOGLE_MAPS_LINK</label>
                  <label className="text-xs text-white/70 block mb-2 font-medium">رابط موقع الشركة على خرائط جوجل</label>
                  <input
                    type="text"
                    className="luxe-input dir-ltr text-left font-en text-xs"
                    placeholder="https://maps.app.goo.gl/..."
                    value={brand.maps || ""}
                    onChange={(e) => setBrand({ ...brand, maps: e.target.value })}
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: SEO */}
          {activeTab === "seo" && (
            <div className="glass p-6 lg:p-8 rounded-xl border border-[#D4AF37]/20 space-y-6" data-testid="settings-group-seo">
              <div className="flex items-center gap-3 border-b border-[#D4AF37]/15 pb-4">
                <Search size={20} className="text-[#D4AF37]" />
                <div>
                  <h2 className="font-display text-xl text-white font-bold">إعدادات محركات البحث والواتساب (SEO)</h2>
                  <p className="text-xs text-white/50">ضبط العنوان والوصف للمشاركة على التواصل ومحركات بحث جوجل.</p>
                </div>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="text-[10px] text-[#D4AF37] font-en tracking-[0.2em] block mb-1">PAGE_TITLE_META</label>
                  <label className="text-xs text-white/70 block mb-2 font-medium">عنوان الموقع الرئيسي (Meta Title)</label>
                  <input
                    type="text"
                    className="luxe-input"
                    placeholder="عدن للديكور | تصميم داخلي فاخر وتصاميم حديثة"
                    value={brand.seoTitle || ""}
                    onChange={(e) => setBrand({ ...brand, seoTitle: e.target.value })}
                  />
                </div>

                <div>
                  <label className="text-[10px] text-[#D4AF37] font-en tracking-[0.2em] block mb-1">META_DESCRIPTION</label>
                  <label className="text-xs text-white/70 block mb-2 font-medium">وصف الموقع لمحركات البحث (Meta Description)</label>
                  <textarea
                    rows={3}
                    className="luxe-input leading-relaxed"
                    placeholder="مؤسسة عدن للديكور رائدة في تقديم حلول التصميم الداخلي الفاخر..."
                    value={brand.seoDescription || ""}
                    onChange={(e) => setBrand({ ...brand, seoDescription: e.target.value })}
                  />
                </div>

                <div>
                  <label className="text-[10px] text-[#D4AF37] font-en tracking-[0.2em] block mb-1">WHATSAPP_DEFAULT_MESSAGE</label>
                  <label className="text-xs text-white/70 block mb-2 font-medium">رسالة الترحيب المسبقة على الواتساب</label>
                  <input
                    type="text"
                    className="luxe-input"
                    placeholder="مرحباً عدن للديكور، أرغب في حجز استشارة واستفسار..."
                    value={brand.whatsappDefaultMsg || ""}
                    onChange={(e) => setBrand({ ...brand, whatsappDefaultMsg: e.target.value })}
                  />
                  <span className="text-[11px] text-white/40 mt-1 block">تظهر كرسالة مجهزة تلقائياً حين ينقر العميل على زر الواتساب العائم.</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: BACKUP & RESTORE */}
          {activeTab === "backup" && (
            <div className="glass p-6 lg:p-8 rounded-xl border border-[#D4AF37]/20 space-y-6" data-testid="settings-group-backup">
              <div className="flex items-center gap-3 border-b border-[#D4AF37]/15 pb-4">
                <Database size={20} className="text-[#D4AF37]" />
                <div>
                  <h2 className="font-display text-xl text-white font-bold">النسخ الاحتياطي واسترجاع البيانات (JSON Data Management)</h2>
                  <p className="text-xs text-white/50">تصدير واسترجاع شجرة بيانات الموقع بالكامل بضغطة زر وحفظ استقرار التطبيق 100%.</p>
                </div>
              </div>

              {/* Action Cards */}
              <div className="grid sm:grid-cols-2 gap-6">
                {/* Export Card */}
                <div className="bg-zinc-950 p-6 rounded-xl border border-[#D4AF37]/25 space-y-4 hover:border-[#D4AF37]/50 transition-all">
                  <div className="w-12 h-12 rounded-lg bg-[#D4AF37]/10 border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37]">
                    <Download size={24} />
                  </div>
                  <div>
                    <h3 className="font-display text-base font-bold text-white mb-1">تصدير نسخة احتياطية (Export JSON)</h3>
                    <p className="text-xs text-white/60 leading-relaxed">
                      تنزيل ملف JSON شامل يحتوي على كافة الخدمات، المشاريع، الشهادات، الصور، وحسابات اللوحة.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleExportBackup}
                    data-testid="export-json-backup-btn"
                    className="w-full bg-[#D4AF37] hover:bg-[#C5A030] text-black font-bold py-3 rounded-lg text-xs flex items-center justify-center gap-2 transition-all shadow-md active:scale-95"
                  >
                    <Download size={16} />
                    <span>تصدير نسخة احتياطية الآن</span>
                  </button>
                </div>

                {/* Import Card */}
                <div className="bg-zinc-950 p-6 rounded-xl border border-[#D4AF37]/25 space-y-4 hover:border-[#D4AF37]/50 transition-all">
                  <div className="w-12 h-12 rounded-lg bg-[#D4AF37]/10 border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37]">
                    <Upload size={24} />
                  </div>
                  <div>
                    <h3 className="font-display text-base font-bold text-white mb-1">استرجاع نسخة احتياطية (Import JSON)</h3>
                    <p className="text-xs text-white/60 leading-relaxed">
                      رفع ملف JSON تم تصديره سابقاً لتحديث محتوى الموقع وإعداداته بشكل آلي وفوري.
                    </p>
                  </div>
                  <label className="w-full bg-white/10 hover:bg-white/20 text-white font-bold py-3 rounded-lg text-xs flex items-center justify-center gap-2 transition-all border border-white/20 cursor-pointer active:scale-95">
                    <Upload size={16} className="text-[#D4AF37]" />
                    <span>اختر ملف JSON للرفع</span>
                    <input
                      type="file"
                      accept=".json"
                      onChange={handleImportBackup}
                      data-testid="import-json-backup-input"
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* Data Summary Stats */}
              <div className="bg-black/60 p-5 rounded-lg border border-white/10 space-y-3">
                <div className="text-xs font-bold text-[#D4AF37] flex items-center gap-2">
                  <FileJson size={16} />
                  ملخص البيانات المخزنة حالياً في ذاكرة النظام:
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2 text-center">
                  <div className="p-3 bg-white/[0.02] border border-white/5 rounded">
                    <div className="text-xl font-bold font-en text-white">{site.services?.length || 0}</div>
                    <div className="text-[11px] text-white/50">خدمة مُدخلة</div>
                  </div>
                  <div className="p-3 bg-white/[0.02] border border-white/5 rounded">
                    <div className="text-xl font-bold font-en text-white">{site.projects?.length || 0}</div>
                    <div className="text-[11px] text-white/50">مشروع معرض</div>
                  </div>
                  <div className="p-3 bg-white/[0.02] border border-white/5 rounded">
                    <div className="text-xl font-bold font-en text-white">{site.testimonials?.length || 0}</div>
                    <div className="text-[11px] text-white/50">شهادة عميل</div>
                  </div>
                  <div className="p-3 bg-white/[0.02] border border-white/5 rounded">
                    <div className="text-xl font-bold font-en text-white">{site.media?.length || 0}</div>
                    <div className="text-[11px] text-white/50">ملف وسائط</div>
                  </div>
                  <div className="p-3 bg-white/[0.02] border border-white/5 rounded">
                    <div className="text-xl font-bold font-en text-white">{site.users?.length || 0}</div>
                    <div className="text-[11px] text-white/50">مستخدم باللوحة</div>
                  </div>
                </div>
              </div>

              {/* Reset Defaults */}
              <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h4 className="text-xs font-bold text-red-400">إعادة تعيين البيانات الافتراضية للموقع</h4>
                  <p className="text-[11px] text-white/50">إعادة ضبط المصنع واسترجاع كافة البيانات الأصلية لتطوير "عدن للديكور".</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    if (window.confirm("هل أنت متأكد من إعادة ضبط مصنع جميع البيانات؟ سيتم مسح أي تعديلات لم تقم بتصديرها!")) {
                      site.resetDefaults();
                      setBrand(site.brand);
                      toast.success("تمت إعادة ضبط البيانات الافتراضية بنجاح!");
                    }
                  }}
                  className="bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white border border-red-500/30 px-4 py-2.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 shrink-0"
                >
                  <RefreshCw size={14} />
                  <span>إعادة الضبط الافتراضي</span>
                </button>
              </div>
            </div>
          )}

          {/* Save Action Bottom Bar */}
          <div className="pt-4 flex items-center justify-between">
            <span className="text-xs text-white/40 flex items-center gap-1.5">
              <ShieldCheck size={14} className="text-[#D4AF37]" />
              الحفظ يضمن التخزين الدائم في الذاكرة الحية للمتصفح وسيرفر التطبيق.
            </span>
            <button
              onClick={handleSave}
              className="bg-[#D4AF37] text-black px-8 py-3 text-sm font-bold flex items-center gap-2 hover:bg-[#C5A030] transition-colors rounded-lg shadow-lg"
            >
              <Save size={16} />
              حفظ الإعدادات الآن
            </button>
          </div>
        </div>

        {/* Live Preview Sidebar Card */}
        <div className="space-y-6">
          <div className="glass p-6 rounded-xl border border-[#D4AF37]/30 bg-black/80 sticky top-28 space-y-6">
            <div className="flex items-center justify-between border-b border-[#D4AF37]/20 pb-3">
              <div className="flex items-center gap-2 text-xs font-bold text-[#D4AF37]">
                <Globe size={16} />
                معاينة حية للواجهة
              </div>
              <span className="text-[10px] text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded-full flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                مباشر Live
              </span>
            </div>

            {/* Header Mini Preview */}
            <div className="bg-zinc-950 p-4 rounded-lg border border-white/10 space-y-3">
              <div className="text-[10px] text-white/40 font-en uppercase tracking-wider">HEADER BRANDING PREVIEW</div>
              <div className="flex items-center gap-3 bg-black p-3 rounded border border-[#D4AF37]/30">
                <div className="w-10 h-10 rounded-full overflow-hidden border border-[#D4AF37] bg-black shrink-0 flex items-center justify-center">
                  <SafeImage src={brand.logo} alt="Logo" fallbackType="logo" className="w-full h-full object-cover" />
                </div>
                <div className="text-right overflow-hidden">
                  <div className="font-display text-sm text-white truncate font-bold">{brand.nameAr || "عدن للديكور"}</div>
                  <div className="font-en text-[9px] text-[#D4AF37] truncate tracking-wider">{brand.nameEn || "ADAN DECOR"}</div>
                </div>
              </div>
            </div>

            {/* Contact Details Preview */}
            <div className="bg-zinc-950 p-4 rounded-lg border border-white/10 space-y-3">
              <div className="text-[10px] text-white/40 font-en uppercase tracking-wider">CONTACT DATA PREVIEW</div>
              <div className="space-y-2 text-xs font-body">
                <div className="flex items-center justify-between text-white/80">
                  <span className="text-white/40">الواتساب:</span>
                  <span dir="ltr" className="text-[#D4AF37] font-en font-bold">{brand.whatsapp || "+967..."}</span>
                </div>
                <div className="flex items-center justify-between text-white/80">
                  <span className="text-white/40">البريد الإلكتروني:</span>
                  <span dir="ltr" className="text-white/90 font-en text-[11px] truncate">{brand.email || "info@adandecor.com"}</span>
                </div>
                <div className="flex items-center justify-between text-white/80">
                  <span className="text-white/40">المقر:</span>
                  <span className="text-white/90 truncate">{brand.location || "عدن — اليمن"}</span>
                </div>
              </div>
            </div>

            {/* WhatsApp Floating Button Preview */}
            <div className="bg-zinc-950 p-4 rounded-lg border border-white/10 space-y-2">
              <div className="text-[10px] text-white/40 font-en uppercase tracking-wider">FLOATING WHATSAPP CTA</div>
              <div className="p-3 bg-[#D4AF37]/10 border border-[#D4AF37]/40 rounded text-right space-y-1">
                <div className="text-xs font-bold text-[#D4AF37]">الرسالة التعريفية المسبقة:</div>
                <div className="text-xs text-white/70 italic truncate">"{brand.whatsappDefaultMsg || "مرحباً عدن للديكور..."}"</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Media Picker Modal */}
      <MediaPickerModal
        isOpen={isMediaOpen}
        onClose={() => setIsMediaOpen(false)}
        onSelectImage={(url) => {
          setBrand({ ...brand, logo: url });
          setIsMediaOpen(false);
          toast.success("تم تحديث صورة اللوجو بنجاح!");
        }}
      />
    </div>
  );
}
