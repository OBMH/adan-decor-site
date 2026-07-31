import React, { useState } from "react";
import { X, Search, CheckCircle2, Image as ImageIcon, Upload, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useSiteData } from "../contexts/SiteContext";
import SafeImage from "./SafeImage";

export function MediaPickerModal({ isOpen, onClose, onSelectImage }) {
  const { media, addMedia } = useSiteData();
  const [searchTerm, setSearchTerm] = useState("");
  const [uploading, setUploading] = useState(false);

  if (!isOpen) return null;

  const handleFileUpload = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    try {
      for (const file of Array.from(files)) {
        if (!file.type.startsWith("image/")) {
          toast.error("يرجى اختيار صور فقط");
          continue;
        }
        // Upload file to server
        const formData = new FormData();
        formData.append("file", file);
        const res = await fetch("/api/upload", { method: "POST", body: formData });
        if (!res.ok) {
          toast.error("فشل رفع الصورة");
          continue;
        }
        const result = await res.json();
        const newMedia = addMedia({
          filename: result.originalName || file.name,
          url: result.url,
          size: result.size || file.size,
        });
        toast.success(`تم رفع الصورة ${file.name} بنجاح`);
        if (files.length === 1 && newMedia) {
          onSelectImage(newMedia.url);
          onClose();
          return;
        }
      }
    } catch (err) {
      console.error(err);
      toast.error("حدث خطأ أثناء رفع الصورة");
    } finally {
      setUploading(false);
    }
  };

  // Get display URL for media items (support both url and data_url for backward compat)
  const getMediaUrl = (m) => m.url || m.data_url || "";

  const filteredMedia = (media || []).filter((m) =>
    (m.filename || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center z-[100] p-4" onClick={onClose}>
      <div 
        className="bg-[#111] border border-[#D4AF37]/40 p-6 lg:p-8 rounded-xl w-full max-w-5xl shadow-2xl flex flex-col h-[85vh] relative"
        onClick={(e) => e.stopPropagation()}
        data-testid="media-picker-modal"
      >
        <div className="absolute top-0 right-0 w-12 h-12 border-t-2 border-r-2 border-[#D4AF37]" />
        
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#D4AF37]/20">
          <div>
            <h3 className="text-[#D4AF37] font-display text-2xl font-bold">
              اختر صورة من مكتبة الوسائط
            </h3>
            <p className="text-white/50 text-xs mt-1 font-body">انقر على أي صورة لاختيارها فوراً للمشروع أو الصفحة</p>
          </div>
          <button
            onClick={onClose}
            className="text-white/50 hover:text-[#D4AF37] transition-colors p-2"
            aria-label="إغلاق"
          >
            <X size={24} />
          </button>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="ابحث عن صورة باسم الملف..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-black border border-[#D4AF37]/30 text-white rounded-sm pr-10 pl-4 py-3 focus:outline-none focus:border-[#D4AF37] text-sm"
              dir="rtl"
            />
            <Search
              size={18}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#D4AF37]/60"
            />
          </div>

          <label className="bg-[#D4AF37] text-black px-5 py-3 text-sm font-bold flex items-center justify-center gap-2 hover:bg-[#C5A030] transition-colors cursor-pointer rounded-sm shrink-0">
            {uploading ? <Loader2 size={18} className="animate-spin" /> : <Upload size={18} />}
            {uploading ? "جاري الرفع..." : "رفع صورة جديدة"}
            <input
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleFileUpload}
            />
          </label>
        </div>

        <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
          {filteredMedia.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-12">
              <ImageIcon
                size={56}
                strokeWidth={1}
                className="text-[#D4AF37]/30 mb-4"
              />
              <p className="text-white/50 font-body text-base">لا توجد وسائط متطابقة.</p>
              <p className="text-white/30 text-xs mt-1">يمكنك رفع صورة جديدة مباشرة باستخدام الزر أعلاه.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {filteredMedia.map((img, idx) => {
                const imgUrl = getMediaUrl(img);
                return (
                  <div
                    key={`${img.id}_${idx}`}
                    onClick={() => {
                      onSelectImage(imgUrl);
                      onClose();
                    }}
                    className="group relative cursor-pointer aspect-square bg-black border border-[#D4AF37]/20 rounded-lg overflow-hidden hover:border-[#D4AF37] hover:shadow-[0_0_15px_rgba(212,175,55,0.3)] transition-all flex flex-col justify-between"
                    title={img.filename}
                  >
                    <SafeImage
                      src={imgUrl}
                      alt={img.filename || "media"}
                      fallbackType="portfolio"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center gap-2 transition-opacity p-2 text-center">
                      <span className="bg-[#D4AF37] text-black px-3 py-1.5 rounded text-xs font-bold flex items-center gap-1.5 shadow-lg">
                        <CheckCircle2 size={14} /> اختر هذه الصورة
                      </span>
                      <span className="text-[10px] text-white/80 truncate max-w-full dir-ltr px-1">
                        {img.filename}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
