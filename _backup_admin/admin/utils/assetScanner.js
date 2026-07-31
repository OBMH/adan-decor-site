import { BRAND, HERO_IMAGE, ABOUT_IMAGE, ABOUT_IMAGES, PHILOSOPHY_IMAGE } from "../../data/content";
import interiorCardBg from "../../assets/images/interior_card_bg_1784515033104.jpg";
import aluminumCardBg from "../../assets/images/aluminum_card_bg_1784516085266.jpg";
import carpentryCardBg from "../../assets/images/carpentry_card_bg_1784516477737.jpg";
import commercialCardBg from "../../assets/images/interior_card_bg_1784515033104.jpg";
import insulationCardBg from "../../assets/images/insulation_card_bg_1784517415029.jpg";

/**
 * Dynamic Asset Scanner Utility
 * Automatically scans all data structures (siteData, pageConfig, services, projects, media, static assets)
 * and extracts all images dynamically with rich usage context and metadata.
 */
export function scanSiteAssets(siteData) {
  const assetsMap = new Map();

  const addAsset = (item) => {
    if (!item.url || typeof item.url !== "string") return;
    const url = item.url.trim();
    if (!url) return;

    if (assetsMap.has(url)) {
      // Merge usage locations if already registered
      const existing = assetsMap.get(url);
      if (!existing.locations.includes(item.usage)) {
        existing.locations.push(item.usage);
      }
      return;
    }

    const baseId = item.id ? `asset_${item.id}` : `asset_${assetsMap.size}`;
    const assetId = `${baseId}_${assetsMap.size}_${Math.random().toString(36).substring(2, 7)}`;

    assetsMap.set(url, {
      id: assetId,
      filename: item.filename || getFilenameFromUrl(url),
      url: url,
      page: item.page || "الموقع العام",
      section: item.section || "عام",
      usage: item.usage || "صورة في الموقع",
      locations: [item.usage || "صورة في الموقع"],
      uploaded_at: item.uploaded_at || new Date().toISOString(),
      size: item.size !== undefined ? item.size : (url.startsWith("data:image") ? Math.round(url.length * 0.75) : 0),
      sourceKey: item.sourceKey || "dynamic",
      isStatic: !!item.isStatic,
      mediaId: item.mediaId || null,
    });
  };

  function getFilenameFromUrl(u) {
    if (u.startsWith("data:image")) {
      return "صورة مرفوعة (Base64)";
    }
    try {
      const parts = u.split("/");
      const last = parts[parts.length - 1].split("?")[0];
      return decodeURIComponent(last) || "صورة غير معنونة";
    } catch (e) {
      return "صورة غير معنونة";
    }
  }

  // 1. Scan Brand & Identity
  if (siteData?.brand?.logo || BRAND.logo) {
    addAsset({
      url: siteData?.brand?.logo || BRAND.logo,
      filename: "شعار مؤسسة عدن للديكور.png",
      page: "جميع الصفحات",
      section: "الهوية والفوتر",
      usage: "شعار الهوية البصرية (Logo) بالهيدر والفوتر",
      isStatic: true,
      sourceKey: "brand.logo",
    });
  }

  // 2. Scan Homepage Hero Background & Config
  const heroBg = siteData?.pageConfig?.homePage?.hero?.bgImage || HERO_IMAGE;
  if (heroBg) {
    addAsset({
      url: heroBg,
      filename: "خلفية غلاف البطل (Hero).jpg",
      page: "الرئيسية",
      section: "الغلاف الرئيسي (Hero)",
      usage: "الصورة الرئيسية الخفية لقسم البطل الهيرو",
      isStatic: true,
      sourceKey: "pageConfig.homePage.hero.bgImage",
    });
  }

  // 3. Scan About Us Images
  const aboutMain = siteData?.pageConfig?.aboutPage?.mainImage || ABOUT_IMAGE;
  if (aboutMain) {
    addAsset({
      url: aboutMain,
      filename: "صورة من نحن الرئيسية.jpg",
      page: "الرئيسية / من نحن",
      section: "عن عدن للديكور",
      usage: "الصورة الرئيسية البارزة في قسم من نحن",
      isStatic: true,
      sourceKey: "pageConfig.aboutPage.mainImage",
    });
  }

  if (Array.isArray(ABOUT_IMAGES)) {
    ABOUT_IMAGES.forEach((img, idx) => {
      if (img) {
        addAsset({
          url: img,
          filename: `معرض من نحن - صورة ${idx + 1}.jpg`,
          page: "من نحن",
          section: "عن عدن للديكور",
          usage: `صورة ثانوية رقم ${idx + 1} في معرض قسم من نحن`,
          isStatic: true,
        });
      }
    });
  }

  if (siteData?.pageConfig?.aboutPage?.secondaryImages && Array.isArray(siteData.pageConfig.aboutPage.secondaryImages)) {
    siteData.pageConfig.aboutPage.secondaryImages.forEach((img, idx) => {
      if (img) {
        addAsset({
          url: img,
          filename: `صورة إضافية عن عدن ${idx + 1}.jpg`,
          page: "من نحن",
          section: "عن عدن للديكور",
          usage: `معرض الصور الثانوي لصفحة من نحن (${idx + 1})`,
        });
      }
    });
  }

  if (PHILOSOPHY_IMAGE) {
    addAsset({
      url: PHILOSOPHY_IMAGE,
      filename: "صورة فلسفة العمل والخبرة.jpg",
      page: "من نحن",
      section: "عن عدن للديكور",
      usage: "صورة خلفية فلسفة العمل والتميز المعماري",
      isStatic: true,
    });
  }

  // 4. Scan Sectors Background Images
  const sectors = siteData?.pageConfig?.servicesPage?.sectors || [
    { id: "interior", title: "الديكور الداخلي والتشطيبات", image: interiorCardBg },
    { id: "aluminum", title: "أعمال الألمنيوم والواجهات", image: aluminumCardBg },
    { id: "carpentry", title: "النجارة والديكور الخشبي المخصص", image: carpentryCardBg },
    { id: "commercial", title: "المشاريع التجارية والطبية", image: commercialCardBg },
    { id: "construction", title: "العوازل والترميم الإنشائي", image: insulationCardBg },
  ];

  sectors.forEach((sec, idx) => {
    if (sec.image) {
      addAsset({
        url: sec.image,
        filename: `بطاقة قطاع - ${sec.title || sec.id}.jpg`,
        page: "الخدمات",
        section: "القطاعات الرئيسية",
        usage: `صورة بطاقة القطاع (${sec.title || sec.id})`,
        sourceKey: `pageConfig.servicesPage.sectors.${idx}.image`,
      });
    }
  });

  // 5. Scan Services Images & Internal Service Galleries
  if (Array.isArray(siteData?.services)) {
    siteData.services.forEach((s) => {
      if (s.image) {
        addAsset({
          url: s.image,
          filename: `صورة خدمة - ${s.title}.jpg`,
          page: "الخدمات",
          section: "الخدمات التفصيلية",
          usage: `الصورة الرئيسية لخدمة: ${s.title}`,
        });
      }
      if (Array.isArray(s.gallery)) {
        s.gallery.forEach((gImg, gIdx) => {
          if (gImg) {
            addAsset({
              url: gImg,
              filename: `معرض خدمة (${s.title}) - ${gIdx + 1}.jpg`,
              page: `الخدمات / ${s.title}`,
              section: "معرض صور الخدمة",
              usage: `صورة رقم ${gIdx + 1} في المعرض الداخلي لخدمة ${s.title}`,
            });
          }
        });
      }
    });
  }

  // 6. Scan Projects Images & Multi-Image Galleries
  if (Array.isArray(siteData?.projects)) {
    siteData.projects.forEach((p) => {
      if (p.image) {
        addAsset({
          url: p.image,
          filename: `غلاف مشروع - ${p.title}.jpg`,
          page: "معرض الأعمال",
          section: "المشاريع",
          usage: `غلاف مشروع: ${p.title} (${p.category_label || p.category || "عام"})`,
        });
      }
      if (Array.isArray(p.gallery)) {
        p.gallery.forEach((pImg, pIdx) => {
          if (pImg) {
            addAsset({
              url: pImg,
              filename: `معرض مشروع (${p.title}) - ${pIdx + 1}.jpg`,
              page: `المشاريع / ${p.title}`,
              section: "معرض صور المشروع",
              usage: `صورة رقم ${pIdx + 1} بالمعرض الداخلي لمشروع ${p.title}`,
            });
          }
        });
      }
    });
  }

  // 7. Scan Uploaded Media Library
  if (Array.isArray(siteData?.media)) {
    siteData.media.forEach((m) => {
      if (m.data_url || m.url) {
        addAsset({
          id: m.id,
          url: m.data_url || m.url,
          filename: m.filename || "ملف وسائط مرفوع",
          page: "مكتبة الوسائط",
          section: "الوسائط المرفوعة",
          usage: "مستودع الوسائط والملفات المرفوعة",
          uploaded_at: m.uploaded_at,
          size: m.size,
          mediaId: m.id,
        });
      }
    });
  }

  return Array.from(assetsMap.values());
}
