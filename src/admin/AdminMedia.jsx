import React, { useState, useMemo } from "react";
import {
  Image as ImageIcon,
  Upload,
  Search,
  Trash2,
  ExternalLink,
  Copy,
  CheckCircle2,
  RefreshCw,
  Loader2,
  Filter,
  Layers,
  FileText,
  AlertCircle
} from "lucide-react";
import { toast } from "sonner";
import { useSiteData } from "../contexts/SiteContext";
import SafeImage from "../components/SafeImage";
import { scanSiteAssets } from "./utils/assetScanner";

export default function AdminMedia() {
  const { siteData, media = [], addMedia, deleteMedia } = useSiteData();
  const [activeTab, setActiveTab] = useState("library"); // 'library' | 'scanner'
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [uploading, setUploading] = useState(false);

  // Scan all images across the whole site
  const siteAssets = useMemo(() => {
    return scanSiteAssets(siteData || {});
  }, [siteData]);

  // Upload handler via real backend endpoint /api/upload
  const handleFilesUpload = async (files) => {
    if (!files || files.length === 0) return;
    setUploading(true);
    let successCount = 0;

    try {
      for (const file of Array.from(files)) {
        if (!file.type.startsWith("image/")) {
          toast.error(`الملف ${file.name} ليس صورة`);
          continue;
        }

        const formData = new FormData();
        formData.append("file", file);

        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (!res.ok) {
          toast.error(`فشل رفع الصورة ${file.name}`);
          continue;
        }

        const result = await res.json();
        addMedia({
          filename: result.originalName || file.name,
          url: result.url,
          size: result.size || file.size,
          uploaded_at: new Date().toISOString(),
        });

        successCount++;
      }

      if (successCount > 0) {
        toast.success(`تم رفع ${successCount} صورة بنجاح وإضافتها للمكتبة`);
      }
    } catch (err) {
      console.error(err);
      toast.error("حدث خطأ في شبكة الرفع");
    } finally {
      setUploading(false);
    }
  };

  const handleCopyUrl = (url) => {
    navigator.clipboard.writeText(url);
    toast.success("تم نسخ رابط الصورة");
  };

  // Filtered media items
  const filteredMedia = media.filter((m) => {
    const term = searchTerm.toLowerCase();
    const fname = (m.filename || "").toLowerCase();
    return fname.includes(term);
  });

  // Filtered assets for scanner tab
  const filteredAssets = siteAssets.filter((a) => {
    const matchTerm = (a.filename || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
                      (a.page || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
                      (a.usage || "").toLowerCase().includes(searchTerm.toLowerCase());
    if (!matchTerm) return false;
    if (selectedCategory !== "all" && a.page !== selectedCategory) return false;
    return true;
  });

  const categories = useMemo(() => {
    const set = new Set(siteAssets.map(a => a.page || "عام"));
    return ["all", ...Array.from(set)];
  }, [siteAssets]);

  const getMediaUrl = (item) => item.url || item.data_url || "";

  return (
    <div className="space-y-6" dir="rtl">
      {/* Header */}
      <div className="bg-[#111] border border-[#D4AF37]/30 p-6 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[#D4AF37] text-xs font-bold uppercase tracking-wide mb-1">
            <ImageIcon size={16} />
            <span>إدارة أصول الوسائط والتخزين الفعلي</span>
          </div>
          <h2 className="font-display text-2xl font-bold text-white">
            مكتبة صور ووسائط الموقع
          </h2>
          <p className="text-white/60 text-sm mt-1">
            جميع الصور يتم حفظها مباشرة كملفات حقيقية على الخادم (بدون Base64) لضمان أعلى سرعة وأداء للموقع.
          </p>
        </div>

        <label className="bg-[#D4AF37] text-black px-6 py-3.5 rounded-lg font-display font-bold text-sm hover:bg-[#C5A030] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_20px_rgba(212,175,55,0.25)] shrink-0">
          {uploading ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              <span>جاري الرفع إلى السيرفر...</span>
            </>
          ) : (
            <>
              <Upload size={18} />
              <span>رفع صور جديدة للمكتبة</span>
            </>
          )}
          <input
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => handleFilesUpload(e.target.files)}
            disabled={uploading}
          />
        </label>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-[#D4AF37]/20 gap-4">
        <button
          onClick={() => setActiveTab("library")}
          className={`pb-3 px-4 font-bold text-sm transition-all flex items-center gap-2 border-b-2 ${
            activeTab === "library"
              ? "border-[#D4AF37] text-[#D4AF37]"
              : "border-transparent text-white/50 hover:text-white"
          }`}
        >
          <Layers size={18} />
          <span>الصور المرفوعة حديثاً ({media.length})</span>
        </button>
        <button
          onClick={() => setActiveTab("scanner")}
          className={`pb-3 px-4 font-bold text-sm transition-all flex items-center gap-2 border-b-2 ${
            activeTab === "scanner"
              ? "border-[#D4AF37] text-[#D4AF37]"
              : "border-transparent text-white/50 hover:text-white"
          }`}
        >
          <FileText size={18} />
          <span>كافة صور الموقع الحالية ({siteAssets.length})</span>
        </button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4 bg-[#111] p-4 rounded-xl border border-white/10">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="ابحث عن صورة باسم الملف أو مكان استخدامها..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-black border border-[#D4AF37]/30 text-white rounded-lg pr-10 pl-4 py-2.5 text-sm focus:outline-none focus:border-[#D4AF37]"
          />
          <Search size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40" />
        </div>

        {activeTab === "scanner" && (
          <div className="flex items-center gap-2 shrink-0">
            <Filter size={16} className="text-[#D4AF37]" />
            <span className="text-xs text-white/70 font-bold">الصفحة:</span>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-black border border-[#D4AF37]/30 text-white text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-[#D4AF37]"
            >
              <option value="all">جميع الصفحات والأقسام</option>
              {categories.filter(c => c !== "all").map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Tab 1: Uploaded Media Library */}
      {activeTab === "library" && (
        <>
          {filteredMedia.length === 0 ? (
            <div className="bg-[#111] border border-[#D4AF37]/20 rounded-xl p-12 text-center text-white/50">
              <ImageIcon size={52} className="mx-auto text-[#D4AF37]/40 mb-3" strokeWidth={1.2} />
              <h3 className="font-display font-bold text-lg text-white mb-1">لا توجد صور متطابقة في المكتبة</h3>
              <p className="text-xs text-white/40">يمكنك النقر على "رفع صور جديدة للمكتبة" أعلاه لإضافة صور لاستخدامها بمشاريع وصفحات الموقع.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {filteredMedia.map((m, idx) => {
                const imgUrl = getMediaUrl(m);
                return (
                  <div
                    key={`${m.id || idx}`}
                    className="bg-[#111] border border-[#D4AF37]/20 rounded-xl overflow-hidden group flex flex-col justify-between hover:border-[#D4AF37] transition-all duration-300 relative"
                  >
                    <div className="aspect-square relative overflow-hidden bg-black">
                      <SafeImage
                        src={imgUrl}
                        alt={m.filename || "media"}
                        fallbackType="portfolio"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-2 transition-opacity p-2">
                        <button
                          onClick={() => handleCopyUrl(imgUrl)}
                          className="p-2.5 bg-[#D4AF37] text-black rounded-lg hover:scale-110 transition-transform shadow-lg"
                          title="نسخ الرابط"
                        >
                          <Copy size={16} />
                        </button>
                        <a
                          href={imgUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="p-2.5 bg-white text-black rounded-lg hover:scale-110 transition-transform shadow-lg"
                          title="عرض الصورة بملء الشاشة"
                        >
                          <ExternalLink size={16} />
                        </a>
                        <button
                          onClick={() => {
                            if (window.confirm("هل أنت متأكد من حذف هذه الصورة من مكتبة الوسائط؟")) {
                              deleteMedia(m.id);
                              toast.success("تم الحذف من المكتبة");
                            }
                          }}
                          className="p-2.5 bg-red-600 text-white rounded-lg hover:scale-110 transition-transform shadow-lg"
                          title="حذف الصورة"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>

                    <div className="p-3 bg-black/80 border-t border-white/5 flex items-center justify-between text-[11px]">
                      <span className="truncate text-white/80 font-bold max-w-[130px]" title={m.filename}>
                        {m.filename || "صورة"}
                      </span>
                      <span className="text-white/40 dir-ltr font-mono text-[10px]">
                        {m.size ? `${(m.size / 1024).toFixed(0)} KB` : ""}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* Tab 2: Site Assets Scanner */}
      {activeTab === "scanner" && (
        <div className="space-y-3">
          {filteredAssets.length === 0 ? (
            <div className="bg-[#111] border border-[#D4AF37]/20 rounded-xl p-12 text-center text-white/50">
              <AlertCircle size={48} className="mx-auto text-amber-400 mb-3" />
              <p>لا توجد نتائج مطابقة لعملية البحث الحالية في أصول الموقع.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredAssets.map((asset, index) => (
                <div
                  key={`${asset.id}_${index}`}
                  className="bg-[#111] border border-white/10 hover:border-[#D4AF37]/50 rounded-xl p-4 flex gap-4 transition-colors"
                >
                  <div className="w-24 h-24 rounded-lg bg-black shrink-0 overflow-hidden border border-white/10 relative group">
                    <SafeImage
                      src={asset.url}
                      alt={asset.filename || "asset"}
                      fallbackType="portfolio"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-1.5 transition-opacity">
                      <button
                        onClick={() => handleCopyUrl(asset.url)}
                        className="p-2 bg-[#D4AF37] text-black rounded hover:scale-105"
                        title="نسخ الرابط"
                      >
                        <Copy size={14} />
                      </button>
                      <a
                        href={asset.url}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2 bg-white text-black rounded hover:scale-105"
                        title="عرض الصورة"
                      >
                        <ExternalLink size={14} />
                      </a>
                    </div>
                  </div>

                  <div className="flex-1 min-w-0 flex flex-col justify-between text-xs">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="px-2 py-0.5 rounded bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/30 font-bold text-[10px]">
                          {asset.page || "عام"}
                        </span>
                        <span className="text-white/40 text-[10px]">{asset.section || ""}</span>
                      </div>
                      <h4 className="font-bold text-white truncate text-sm mt-1" title={asset.filename}>
                        {asset.filename}
                      </h4>
                      <p className="text-white/60 text-[11px] leading-snug mt-1 line-clamp-2" title={asset.usage}>
                        {asset.usage || "صورة من أصول الموقع"}
                      </p>
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-white/30 pt-2 border-t border-white/5 mt-2">
                      <span>{asset.isStatic ? "أصل ثابت (System asset)" : "محتوى ديناميكي (Uploaded)"}</span>
                      <span className="dir-ltr font-mono">{asset.size ? `${(asset.size / 1024).toFixed(0)} KB` : ""}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
