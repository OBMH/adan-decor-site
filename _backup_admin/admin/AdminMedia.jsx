import React, { useState, useCallback, useMemo } from "react";
import {
  Loader2, Trash2, Upload, Copy, Check, Image as ImageIcon,
  Search, Filter, Eye, RefreshCw, Layers, MapPin, Calendar, FileText,
  X, CheckCircle2, Sparkles, ExternalLink
} from "lucide-react";
import { toast } from "sonner";
import { useSiteData } from "../contexts/SiteContext";
import { scanSiteAssets } from "./utils/assetScanner";
import SafeImage from "../components/SafeImage";

// Helper function to compress image
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

const cleanFilename = (name) => {
  if (!name) return "صورة_غير_مسماة.jpg";
  // Fix double extensions like .jpg.png -> .png
  const parts = name.split('.');
  if (parts.length > 2) {
    const ext = parts.pop();
    return `${parts[0]}.${ext}`;
  }
  return name;
};

// Deeply search and replace URLs in siteData, preserving query parameters (like ?g=1 for gallery)
const replaceUrlDeep = (obj, oldUrl, newUrl) => {
  if (Array.isArray(obj)) {
    for (let i = 0; i < obj.length; i++) {
      if (typeof obj[i] === "string") {
        if (obj[i].includes(oldUrl)) {
          obj[i] = obj[i].replace(oldUrl, newUrl);
        }
      } else if (typeof obj[i] === "object" && obj[i] !== null) {
        replaceUrlDeep(obj[i], oldUrl, newUrl);
      }
    }
  } else if (typeof obj === "object" && obj !== null) {
    for (const key in obj) {
      if (typeof obj[key] === "string") {
        if (obj[key].includes(oldUrl)) {
          obj[key] = obj[key].replace(oldUrl, newUrl);
        }
      } else if (typeof obj[key] === "object" && obj[key] !== null) {
        replaceUrlDeep(obj[key], oldUrl, newUrl);
      }
    }
  }
};

export default function AdminMedia() {
  const site = useSiteData();
  const [uploading, setUploading] = useState(false);
  const [copied, setCopied] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSection, setSelectedSection] = useState("all");

  // Modals state
  const [previewAsset, setPreviewAsset] = useState(null);
  const [replaceTarget, setReplaceTarget] = useState(null); // Asset object to be replaced

  // Dynamic Scanner output
  const scannedAssets = useMemo(() => {
    return scanSiteAssets(site.siteData);
  }, [site.siteData]);

  const processUpload = async (file) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("يرجى رفع صور فقط");
      return;
    }

    setUploading(true);
    try {
      const compressedDataUrl = await compressImage(file);
      const estimatedSize = Math.round((compressedDataUrl.length * 3) / 4);

      site.addMedia({
        filename: cleanFilename(file.name),
        data_url: compressedDataUrl,
        size: estimatedSize,
      });
      toast.success("تم الرفع بنجاح إلى مكتبة الوسائط المركزية");
    } catch (err) {
      console.error(err);
      toast.error("حدث خطأ أثناء معالجة الصورة");
    } finally {
      setUploading(false);
    }
  };

  const handleReplaceImage = async (file, oldAsset) => {
    if (!file || !oldAsset || !oldAsset.url) return;
    setUploading(true);
    try {
      const compressedDataUrl = await compressImage(file);
      const estimatedSize = Math.round((compressedDataUrl.length * 3) / 4);

      // Deep clone siteData to replace oldUrl with dataUrl everywhere
      const newSiteData = JSON.parse(JSON.stringify(site.siteData));
      
      // Smart replacement that respects query params
      replaceUrlDeep(newSiteData, oldAsset.url, compressedDataUrl);
      
      const originalFilename = cleanFilename(file.name) || oldAsset.filename || "صورة_مستبدلة.jpg";
      
      if (!newSiteData.media) newSiteData.media = [];
      
      // Update in media library if it exists there, but do NOT create a fake card if it was just a static image.
      const existingMediaIndex = newSiteData.media.findIndex(m => m.id === oldAsset.mediaId);
      if (existingMediaIndex !== -1) {
        newSiteData.media[existingMediaIndex] = {
          ...newSiteData.media[existingMediaIndex],
          data_url: compressedDataUrl,
          filename: originalFilename,
          size: estimatedSize,
          uploaded_at: new Date().toISOString()
        };
      }

      // Add to global asset map for the dynamic engine
      if (!newSiteData.assetMap) newSiteData.assetMap = {};
      newSiteData.assetMap[oldAsset.url] = compressedDataUrl;

      site.importAllData(newSiteData);

      // Trigger the custom event for the DOM mutation engine immediately
      window.dispatchEvent(new CustomEvent('asset-replaced'));

      toast.success("تم استبدال الصورة بنجاح وتحديث جميع أماكن استخدامها بالموقع!");
      setReplaceTarget(null);
      setPreviewAsset(null);
    } catch (err) {
      console.error("Replacement failed:", err);
      toast.error("حدث خطأ أثناء استبدال الصورة");
    } finally {
      setUploading(false);
    }
  };

  const onDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const onDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const onDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      Array.from(files).forEach((file) => processUpload(file));
    }
  }, []);

  const removeMediaItem = (asset) => {
    if (!window.confirm(`هل أنت متأكد من حذف هذه الصورة (${asset.filename})؟\nتنبيه: سيتم إزالتها أيضاً من أي مكان تُستخدم فيه.`)) return;

    // 1. Generic Replacement everywhere to "" (Empty String)
    const newSiteData = JSON.parse(JSON.stringify(site.siteData));
    
    replaceUrlDeep(newSiteData, asset.url, "");

    // 2. Remove the actual media item from media library
    if (asset.mediaId) {
      newSiteData.media = newSiteData.media.filter(m => m.id !== asset.mediaId);
    }

    // 3. Clean up any empty strings left in arrays (e.g. galleries)
    if (newSiteData.projects) {
       newSiteData.projects = newSiteData.projects.map(p => ({
           ...p,
           gallery: Array.isArray(p.gallery) ? p.gallery.filter(g => g !== "" && g != null) : [],
           image: p.image === "" ? null : p.image,
           coverImage: p.coverImage === "" ? null : p.coverImage
       }));
    }
    if (newSiteData.services) {
       newSiteData.services = newSiteData.services.map(s => ({
           ...s,
           gallery: Array.isArray(s.gallery) ? s.gallery.filter(g => g !== "" && g != null) : [],
           image: s.image === "" ? null : s.image
       }));
    }
    if (newSiteData.pageConfig?.aboutPage?.secondaryImages) {
       newSiteData.pageConfig.aboutPage.secondaryImages = newSiteData.pageConfig.aboutPage.secondaryImages.filter(g => g !== "" && g != null);
    }

    if (newSiteData.assetMap) {
       delete newSiteData.assetMap[asset.url];
       // Also if it was the target of a previous replacement
       Object.keys(newSiteData.assetMap).forEach(key => {
         if (newSiteData.assetMap[key] === asset.url) {
           delete newSiteData.assetMap[key];
         }
       });
    }

    site.importAllData(newSiteData);
    toast.success("تمت إزالة الصورة بنجاح من المستودع وجميع أقسام الموقع");
  };

  const copyUrl = (url, id) => {
    navigator.clipboard.writeText(url);
    setCopied(id);
    setTimeout(() => setCopied(null), 1500);
    toast.success("تم نسخ رابط الصورة إلى الحافظة");
  };

  // Extract sections list for filter
  const sectionsList = useMemo(() => {
    const set = new Set();
    scannedAssets.forEach((a) => {
      if (a.section) set.add(a.section);
    });
    return Array.from(set);
  }, [scannedAssets]);

  // Filtered Assets
  const filteredAssets = scannedAssets.filter((a) => {
    const matchesSection = selectedSection === "all" || a.section === selectedSection;
    const term = searchTerm.toLowerCase().trim();
    const matchesSearch =
      !term ||
      (a.filename || "").toLowerCase().includes(term) ||
      (a.page || "").toLowerCase().includes(term) ||
      (a.section || "").toLowerCase().includes(term) ||
      (a.usage || "").toLowerCase().includes(term) ||
      (a.locations || []).some((loc) => loc.toLowerCase().includes(term));

    return matchesSection && matchesSearch;
  });

  return (
    <div data-testid="admin-media-page" className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#D4AF37]/20 pb-6">
        <div>
          <div className="font-en text-[10px] text-[#D4AF37] tracking-[0.3em] mb-2 flex items-center gap-2">
            <Sparkles size={14} /> DYNAMIC CENTRAL MEDIA LIBRARY
          </div>
          <h1 className="font-display text-3xl lg:text-4xl text-white">مكتبة الوسائط والملفات المركزية</h1>
          <p className="font-body text-white/60 mt-2">
            تم فحص واستخراج <span className="text-[#D4AF37] font-bold">{scannedAssets.length}</span> صورة مفحوصة ديناميكياً من جميع صفحات ومشاريع وخدمات الموقع.
          </p>
        </div>

        <label
          className="bg-[#D4AF37] text-black px-6 py-3.5 text-sm font-bold flex items-center justify-center gap-2 hover:bg-[#C5A030] transition-colors cursor-pointer rounded-sm shadow-lg shrink-0"
          data-testid="media-upload-label"
        >
          {uploading ? <Loader2 size={18} className="animate-spin" /> : <Upload size={18} />}
          {uploading ? "جاري الضغط والرفع..." : "رفع صور جديدة"}
          <input
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => {
              if (e.target.files) {
                Array.from(e.target.files).forEach(processUpload);
              }
            }}
            data-testid="media-upload-input"
          />
        </label>
      </div>

      {/* Drag & Drop Area */}
      <div
        className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${
          isDragging ? "border-[#D4AF37] bg-[#D4AF37]/10" : "border-[#D4AF37]/30 bg-black/40 hover:border-[#D4AF37]"
        }`}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
      >
        <ImageIcon size={44} strokeWidth={1} className="text-[#D4AF37] mx-auto mb-3 opacity-80" />
        <h3 className="text-lg text-white font-display mb-1">اسحب وأفلت الصور هنا لرفعها فوراً</h3>
        <p className="text-white/50 font-body text-xs">أو انقر على زر "رفع صور جديدة" لتحديد الصور من جهازك</p>
        <p className="text-[#D4AF37]/80 font-body text-[11px] mt-2">
          نظام الضغط الذكي (Smart Compression) يحافظ على جودة الصورة الفائقة مع حجم ملف خفيف ورندر سريع.
        </p>
      </div>

      {/* Filters & Search Bar */}
      <div className="glass p-5 rounded-lg flex flex-col md:flex-row items-center gap-4">
        {/* Search Input */}
        <div className="relative flex-1 w-full">
          <input
            type="text"
            placeholder="البحث باسم الصورة، الصفحة، القسم، أو مكان الاستخدام..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-black border border-[#D4AF37]/30 text-white rounded-sm pr-10 pl-4 py-3 focus:outline-none focus:border-[#D4AF37] text-sm"
            dir="rtl"
          />
          <Search size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#D4AF37]/60" />
        </div>

        {/* Section Filter */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <Filter size={18} className="text-[#D4AF37]" />
          <select
            value={selectedSection}
            onChange={(e) => setSelectedSection(e.target.value)}
            className="bg-black border border-[#D4AF37]/30 text-white text-sm px-4 py-3 rounded-sm focus:border-[#D4AF37] outline-none w-full md:w-56"
          >
            <option value="all">جميع الأقسام ({scannedAssets.length})</option>
            {sectionsList.map((sec) => {
              const count = scannedAssets.filter((a) => a.section === sec).length;
              return (
                <option key={sec} value={sec}>
                  {sec} ({count})
                </option>
              );
            })}
          </select>
        </div>
      </div>

      {/* Media Asset Grid */}
      {filteredAssets.length === 0 ? (
        <div className="glass p-16 text-center rounded-lg">
          <p className="text-white/50 font-body text-base">لا توجد صور متطابقة مع شروط البحث أو الفلتر الحالية.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredAssets.map((asset, idx) => (
            <div
              key={`${asset.id}_${idx}`}
              data-testid={`media-item-${asset.id}`}
              className="glass overflow-hidden group flex flex-col justify-between rounded-lg border border-[#D4AF37]/20 hover:border-[#D4AF37] transition-all hover:shadow-[0_0_20px_rgba(212,175,55,0.15)] bg-[#0A0A0A]"
            >
              {/* Image Preview Container */}
              <div className="aspect-[4/3] overflow-hidden bg-black relative border-b border-white/10 group">
                <SafeImage
                  src={asset.url}
                  alt={asset.filename}
                  fallbackType="portfolio"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />

                {/* Badges on overlay */}
                <div className="absolute top-2 right-2 flex flex-col gap-1">
                  <span className="bg-black/85 backdrop-blur-md text-[#D4AF37] border border-[#D4AF37]/40 text-[10px] font-bold px-2.5 py-1 rounded-sm shadow-md">
                    {asset.section}
                  </span>
                </div>

                <div className="absolute top-2 left-2">
                  <span className="bg-white/10 backdrop-blur-md text-white/90 text-[10px] px-2 py-0.5 rounded-sm font-en">
                    {asset.page}
                  </span>
                </div>

                {/* Hover Quick Actions Overlay */}
                <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-3">
                  <button
                    onClick={() => setPreviewAsset(asset)}
                    className="bg-[#D4AF37] text-black p-2.5 rounded-full hover:scale-110 transition-transform shadow-lg"
                    title="معاينة ومعلومات الصورة الكاملة"
                  >
                    <Eye size={18} />
                  </button>
                  <button
                    onClick={() => setReplaceTarget(asset)}
                    className="bg-emerald-500 text-black p-2.5 rounded-full hover:scale-110 transition-transform shadow-lg"
                    title="استبدال هذه الصورة بموقعها"
                  >
                    <RefreshCw size={18} />
                  </button>
                </div>
              </div>

              {/* Asset Info Card Footer */}
              <div className="p-4 space-y-3 bg-[#111] flex-1 flex flex-col justify-between">
                <div>
                  <div className="text-xs font-bold text-white font-body truncate mb-1" title={asset.filename}>
                    {asset.filename}
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] text-white/60 mb-2">
                    <MapPin size={12} className="text-[#D4AF37] shrink-0" />
                    <span className="truncate" title={asset.usage}>
                      {asset.usage}
                    </span>
                  </div>
                </div>

                {/* Metadata Row */}
                <div className="border-t border-white/5 pt-2 text-[10px] text-white/40 flex items-center justify-between font-en">
                  <span>{asset.size > 0 ? `${(asset.size / 1024).toFixed(1)} KB` : "صورة مصدر (افتراضية)"}</span>
                  <span>{new Date(asset.uploaded_at).toLocaleDateString("ar-YE")}</span>
                </div>

                {/* Card Action Buttons */}
                <div className="flex gap-2 pt-2">
                  <button
                    onClick={() => copyUrl(asset.url, asset.id)}
                    data-testid={`copy-media-${asset.id}`}
                    className="flex-1 bg-[#D4AF37]/10 text-[#D4AF37] py-2 text-xs font-bold hover:bg-[#D4AF37]/20 flex items-center justify-center gap-1 rounded-sm transition-colors border border-[#D4AF37]/30"
                  >
                    {copied === asset.id ? <Check size={14} /> : <Copy size={14} />}
                    {copied === asset.id ? "تم النسخ" : "نسخ الرابط"}
                  </button>

                  <button
                    onClick={() => setReplaceTarget(asset)}
                    className="bg-emerald-500/10 text-emerald-400 px-2.5 py-2 hover:bg-emerald-500/20 rounded-sm transition-colors border border-emerald-500/20"
                    title="استبدال الصورة"
                  >
                    <RefreshCw size={14} />
                  </button>

                  {asset.mediaId && (
                    <button
                      onClick={() => removeMediaItem(asset)}
                      data-testid={`delete-media-${asset.id}`}
                      className="bg-red-500/10 text-red-400 px-2.5 py-2 hover:bg-red-500/20 rounded-sm transition-colors border border-red-500/20"
                      title="حذف من الوسائط"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* FULL PREVIEW MODAL */}
      {previewAsset && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto"
          onClick={() => setPreviewAsset(null)}
        >
          <div
            className="bg-[#111] border border-[#D4AF37] max-w-4xl w-full rounded-lg overflow-hidden relative shadow-2xl my-8"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setPreviewAsset(null)}
              className="absolute top-4 left-4 text-white/70 hover:text-[#D4AF37] bg-black/60 p-2 rounded-full z-10"
            >
              <X size={20} />
            </button>

            <div className="grid md:grid-cols-2">
              <div className="bg-black p-6 flex items-center justify-center border-b md:border-b-0 md:border-l border-[#D4AF37]/20">
                <SafeImage src={previewAsset.url} alt={previewAsset.filename} fallbackType="portfolio" className="max-h-[60vh] object-contain rounded" />
              </div>

              <div className="p-8 space-y-6 flex flex-col justify-between">
                <div>
                  <div className="font-en text-[10px] text-[#D4AF37] tracking-[0.25em] mb-2">ASSET DETAILS & METADATA</div>
                  <h3 className="font-display text-2xl text-white mb-4">{previewAsset.filename}</h3>

                  <div className="space-y-3 text-sm">
                    <div className="flex items-center gap-3 text-white/80">
                      <Layers size={16} className="text-[#D4AF37]" />
                      <span className="font-bold">القسم:</span> {previewAsset.section}
                    </div>
                    <div className="flex items-center gap-3 text-white/80">
                      <FileText size={16} className="text-[#D4AF37]" />
                      <span className="font-bold">الصفحة:</span> {previewAsset.page}
                    </div>
                    <div className="flex items-start gap-3 text-white/80">
                      <MapPin size={16} className="text-[#D4AF37] mt-1 shrink-0" />
                      <div>
                        <span className="font-bold block">أماكن الاستخدام المكتشفة:</span>
                        <ul className="list-disc list-inside text-xs text-white/60 space-y-1 mt-1">
                          {(previewAsset.locations || [previewAsset.usage]).map((loc, i) => (
                            <li key={i}>{loc}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 text-white/80">
                      <Calendar size={16} className="text-[#D4AF37]" />
                      <span className="font-bold">تاريخ الاكتشاف:</span> {new Date(previewAsset.uploaded_at).toLocaleString("ar-YE")}
                    </div>
                  </div>
                </div>

                <div className="space-y-3 border-t border-[#D4AF37]/20 pt-6">
                  <div className="flex gap-3">
                    <button
                      onClick={() => copyUrl(previewAsset.url, previewAsset.id)}
                      className="flex-1 bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/40 py-2.5 rounded-sm font-bold text-sm flex items-center justify-center gap-2 hover:bg-[#D4AF37]/20"
                    >
                      <Copy size={16} /> نسخ رابط الصورة
                    </button>
                    <button
                      onClick={() => {
                        setReplaceTarget(previewAsset);
                      }}
                      className="flex-1 bg-emerald-500 text-black py-2.5 rounded-sm font-bold text-sm flex items-center justify-center gap-2 hover:bg-emerald-400"
                    >
                      <RefreshCw size={16} /> استبدال الصورة
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* REPLACE IMAGE MODAL */}
      {replaceTarget && (
        <div
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto"
          onClick={() => setReplaceTarget(null)}
        >
          <div
            className="bg-[#111] border border-[#D4AF37] max-w-lg w-full p-8 rounded-lg relative my-8 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setReplaceTarget(null)}
              className="absolute top-4 left-4 text-white/50 hover:text-[#D4AF37]"
            >
              <X size={22} />
            </button>
            <div className="absolute top-0 right-0 w-10 h-10 border-t border-r border-[#D4AF37]" />

            <h3 className="font-display text-2xl text-white mb-2">استبدال الصورة بالموقع</h3>
            <p className="text-white/60 text-xs mb-6">
              سيؤدي تحديد صورة جديدة إلى تحديث هذا العنصر تلقائياً في جميع الصفحات والمأكولات التي تستخدمه.
            </p>

            <div className="mb-6 p-4 bg-black border border-[#D4AF37]/20 rounded-sm flex items-center gap-4">
              <div className="w-16 h-16 overflow-hidden rounded border border-white/10 shrink-0">
                <SafeImage src={replaceTarget.url} alt="Current" fallbackType="portfolio" className="w-full h-full object-cover" />
              </div>
              <div className="overflow-hidden">
                <div className="text-xs text-white/50 font-en">الصورة الحالية:</div>
                <div className="text-sm text-white font-bold truncate">{replaceTarget.filename}</div>
                <div className="text-xs text-[#D4AF37]">{replaceTarget.usage}</div>
              </div>
            </div>

            <div className="space-y-4">
              <label className="block w-full bg-[#D4AF37] text-black py-3.5 text-center font-bold text-sm rounded-sm hover:bg-[#C5A030] transition-colors cursor-pointer">
                {uploading ? "جاري المعالجة..." : "اختيار صورة جديدة من الجهاز لاستبدالها"}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files?.[0]) {
                      handleReplaceImage(e.target.files[0], replaceTarget);
                    }
                  }}
                />
              </label>

              <button
                onClick={() => setReplaceTarget(null)}
                className="w-full py-3 text-sm text-white/60 hover:text-white border border-white/10 rounded-sm"
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
