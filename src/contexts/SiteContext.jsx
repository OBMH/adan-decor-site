import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from "react";
import { preloadCriticalImages } from "../components/SafeImage";
import {
  BRAND,
  HERO_IMAGE,
  ABOUT_IMAGE,
  SERVICES,
  PORTFOLIO,
  TESTIMONIALS,
} from "../data/content";
import interiorCardBg from "../assets/images/interior_card_bg_1784515033104.jpg";
import aluminumCardBg from "../assets/images/aluminum_card_bg_1784516085266.jpg";
import carpentryCardBg from "../assets/images/carpentry_card_bg_1784516477737.jpg";
import commercialCardBg from "../assets/images/interior_card_bg_1784515033104.jpg";
import insulationCardBg from "../assets/images/insulation_card_bg_1784517415029.jpg";

// ── Initial data definitions (fallback defaults only) ──

export const INITIAL_SERVICES = [
  { id: "s1", categoryId: "interior", categoryTitle: "الديكور الداخلي والتشطيبات", icon: "LayoutPanelTop", title: "تخطيط المساحات", desc: "نستغل كل متر في منزلك! نقدم حلولاً ذكية لتوزيع الأثاث والحركة لضمان الانسيابية والراحة، مع مراعاة أبعاد الفراغ لتحقيق توازن مثالي بين الجمال والوظيفة.", order: 1 },
  { id: "s2", categoryId: "interior", categoryTitle: "الديكور الداخلي والتشطيبات", icon: "PaintBucket", title: "أعمال الجبس", desc: "ديكورات جبسية فنية للأسقف والجدران بتصاميم كلاسيكية وعصرية فاخرة.", order: 2 },
  { id: "s3", categoryId: "interior", categoryTitle: "الديكور الداخلي والتشطيبات", icon: "Sofa", title: "تصميم غرف المعيشة", desc: "غرف معيشة عصرية وفاخرة تجمع بين الراحة والذوق الرفيع.", order: 3 },
  { id: "s4", categoryId: "interior", categoryTitle: "الديكور الداخلي والتشطيبات", icon: "BedDouble", title: "تصميم الغرف", desc: "غرف مصممة بعناية تعكس شخصية ساكنيها وتمنحهم الراحة المطلقة.", order: 4 },
  { id: "s5", categoryId: "interior", categoryTitle: "الديكور الداخلي والتشطيبات", icon: "Boxes", title: "تجهيز العقارات", desc: "تجهيز كامل للعقارات بأثاث ومفروشات ومستلزمات بأعلى المعايير.", order: 5 },
  { id: "s6", categoryId: "aluminum", categoryTitle: "أعمال الألمنيوم والواجهات", icon: "RectangleHorizontal", title: "تصميم النوافذ", desc: "نوافذ فاخرة تجمع بين الإطلالة المثالية والعزل الحراري والأناقة المعمارية.", order: 6 },
  { id: "s7", categoryId: "aluminum", categoryTitle: "أعمال الألمنيوم والواجهات", icon: "Layers3", title: "ألوكوبوند", desc: "تنفيذ ألوكوبوند احترافي للواجهات الخارجية والداخلية بأعلى معايير الجودة.", order: 7 },
  { id: "s8", categoryId: "aluminum", categoryTitle: "أعمال الألمنيوم والواجهات", icon: "Building2", title: "ديكور الأسمنت الخارجي", desc: "تصاميم أسمنتية خارجية فنية تمنح الواجهات هوية معمارية فريدة.", order: 8 },
  { id: "s9", categoryId: "aluminum", categoryTitle: "أعمال الألمنيوم والواجهات", icon: "GlassWater", title: "الزجاج المعشّق", desc: "زجاج معشّق فني بنقوش وألوان كلاسيكية وعصرية لإضافة لمسة من الفن.", order: 9 },
  { id: "s10", categoryId: "aluminum", categoryTitle: "أعمال الألمنيوم والواجهات", icon: "Mountain", title: "تصميم الحجر والطوب والجبس", desc: "تصميم وتنفيذ واجهات وجدران بالحجر الطبيعي والطوب والجبس بلمسات فنية راقية.", order: 10 },
  { id: "s11", categoryId: "carpentry", categoryTitle: "النجارة والديكور الخشبي المخصص", icon: "Hammer", title: "أعمال الخشب", desc: "أعمال نجارة فاخرة بأخشاب نبيلة ولمسات يدوية دقيقة تخلّد التميّز.", order: 11 },
  { id: "s12", categoryId: "carpentry", categoryTitle: "النجارة والديكور الخشبي المخصص", icon: "Trees", title: "التصميم الداخلي الخشبي", desc: "ديكورات خشبية داخلية فخمة تضفي دفئاً وعراقة على كل مساحة.", order: 12 },
  { id: "s13", categoryId: "commercial", categoryTitle: "المشاريع التجارية والطبية", icon: "Briefcase", title: "تصميم المساحات المكتبية", desc: "بيئات عمل راقية تعزّز الإنتاجية وتعكس هوية علامتك التجارية.", order: 13 },
  { id: "s14", categoryId: "commercial", categoryTitle: "المشاريع التجارية والطبية", icon: "Utensils", title: "تصميم المطاعم", desc: "تصميم مطاعم فاخرة تخلق تجربة طعام لا تُنسى لروّاد المكان.", order: 14 },
  { id: "s15", categoryId: "construction", categoryTitle: "العوازل والترميم الإنشائي", icon: "Construction", title: "البناء بالحجر", desc: "بناء حجري احترافي يعكس الأصالة المعمارية بأيدي خبرة تمتد لسنوات.", order: 15 },
  { id: "s16", categoryId: "construction", categoryTitle: "العوازل والترميم الإنشائي", icon: "Sparkles", title: "صقل وجلي الحجر", desc: "خدمات صقل وجلي الحجر الطبيعي والرخام لإحياء بريقها الأصلي وحمايتها.", order: 16 },
  { id: "s17", categoryId: "construction", categoryTitle: "العوازل والترميم الإنشائي", icon: "Home", title: "القرميد", desc: "تركيب القرميد للأسقف بمختلف الأنواع والألوان بإتقان وضمان طويل المدى.", order: 17 },
  { id: "s18", categoryId: "construction", categoryTitle: "العوازل والترميم الإنشائي", icon: "TreePine", title: "تجديد الحدائق", desc: "تصميم وتجديد الحدائق والمساحات الخارجية بلمسة طبيعية فاخرة.", order: 18 },
];

export const INITIAL_PROJECTS = PORTFOLIO.map(p => ({
  ...p,
  gallery: Array.isArray(p.gallery) && p.gallery.length > 0 ? p.gallery : (p.image ? [`${p.image}?g=1`, `${p.image}?g=2`, `${p.image}?g=3`] : [])
}));

export const INITIAL_TESTIMONIALS = TESTIMONIALS.map((t, idx) => ({
  id: `t_${idx + 1}`,
  name: t.name,
  role: t.role,
  quote: t.quote,
  order: idx + 1,
}));

export const INITIAL_MEDIA = [
  { id: "m1", filename: "adan_decor_logo.png", url: BRAND.logo, size: 45000, uploaded_at: new Date().toISOString() },
  { id: "m2", filename: "hero_interior.jpg", url: HERO_IMAGE, size: 180000, uploaded_at: new Date().toISOString() },
  { id: "m3", filename: "about_interior.jpg", url: ABOUT_IMAGE, size: 120000, uploaded_at: new Date().toISOString() },
];

export const INITIAL_USERS = [
  { id: "u_admin_1", name: "المسؤول الرئيسي (Super Admin)", email: "admin@adandecor.com", role: "admin", created_at: new Date().toISOString() },
];

export const INITIAL_BRAND = {
  nameAr: BRAND.nameAr || "عدن للديكور",
  nameEn: BRAND.name || "Adan Decor",
  tagline: BRAND.tagline || "عدن للديكور — حلول متكاملة في التصميم الداخلي والتنفيذ، نحول الأفكار إلى مساحات عصرية تجمع بين الجودة، الدقة، وجمال التفاصيل.",
  logo: BRAND.logo,
  whatsapp: BRAND.whatsapp || "+967771258215",
  whatsappLink: BRAND.whatsappLink || "https://wa.me/967771258215",
  phone: "+967771258215",
  phone2: "",
  email: "",
  instagram: BRAND.instagram || "https://www.instagram.com/adendecor/",
  youtube: BRAND.youtube || "https://www.youtube.com/@Aden_decor",
  facebook: "",
  snapchat: "",
  tiktok: BRAND.tiktok || "https://www.tiktok.com/@yemen_decor_771258215",
  maps: BRAND.maps || "https://maps.app.goo.gl/6EwDsAe3HLmS1FNh7",
  location: BRAND.location || "عدن — اليمن",
  address: "عدن، خور مكسر، الشارع العام - اليمن",
  hours: BRAND.hoursAr || "مفتوح 24 ساعة",
  seoTitle: "عدن للديكور | تصميم داخلي فاخر وتنفيذ ديكورات في عدن واليمن",
  seoDescription: "مؤسسة عدن للديكور رائدة في تقديم حلول التصميم الداخلي الفاخر، الديكورات المودرن والكلاسيكية، والتشطيبات الراقية في اليمن.",
  whatsappDefaultMsg: "مرحباً عدن للديكور، أرغب في حجز استشارة تصميم واستفسار عن المشاريع",
};

export const INITIAL_PAGE_CONFIG = {
  homePage: {
    hero: {
      headlinePart1: "نصمم الفخامة...",
      headlinePart2: "وننفذها بإتقان.",
      subtitle: "حلول متكاملة في التصميم الداخلي، التشطيبات، الواجهات، والأعمال المتخصصة، لتحول رؤيتك إلى واقع يجمع بين الجمال والجودة والدقة.",
      bgImage: "",
      ctaPrimaryText: "اطلب استشارة مجانية",
      ctaSecondaryText: "شاهد أعمالنا",
    },
    trust: {
      title: "لماذا عدن للديكور؟",
      subtitle: "نضع معايير الفخامة والاحترافية في كل مشروع ننفذه.",
    }
  },
  aboutPage: {
    eyebrow: "من نحن",
    title: "حلول متكاملة للتصميم والتنفيذ",
    paragraph1: "في عدن للديكور، نقدم حلولاً متكاملة في التصميم الداخلي، التشطيبات، وأعمال التنفيذ، مع التزام كامل بأعلى معايير الجودة والدقة في كل مشروع.",
    paragraph2: "تشمل خدماتنا الديكور الداخلي، أعمال الجبس، تكسيات الجدران، أنظمة الإضاءة الحديثة، أعمال الألومنيوم والواجهات، النجارة المخصصة، المشاريع التجارية والطبية، بالإضافة إلى أنظمة العزل والترميم، لنقدم لعملائنا حلولاً متكاملة تحت سقف واحد.",
    paragraph3: "نعتمد على فريق متخصص، ومواد عالية الجودة، وتنفيذ احترافي يراعي أدق التفاصيل، لنحول الأفكار إلى مساحات عملية وأنيقة تلبي تطلعات عملائنا وتمنحهم قيمة تدوم.",
    philosophyTitle: "فلسفتنا في العمل",
    philosophyText: "نؤمن أن كل مساحة تدير قصتها الخاصة. نعمل بجد لتحويل الفراغات المعمارية إلى تجارب بصرية استثنائية.",
    mainImage: "",
  },
  servicesPage: {
    title: "خدماتنا الفاخرة",
    subtitle: "نقدم مجموعة متكاملة من الخدمات التخصصية بمستوى عالٍ من الدقة والإتقان.",
    sectors: [
      { id: "interior", title: "الديكور الداخلي والتشطيبات", image: interiorCardBg },
      { id: "aluminum", title: "أعمال الألمنيوم والواجهات", image: aluminumCardBg },
      { id: "carpentry", title: "النجارة والديكور الخشبي المخصص", image: carpentryCardBg },
      { id: "commercial", title: "المشاريع التجارية والطبية", image: commercialCardBg },
      { id: "construction", title: "العوازل والترميم الإنشائي", image: insulationCardBg },
    ]
  },
  portfolioPage: {
    title: "معرض الأعمال",
    subtitle: "استعرض أبرز المشاريع والتحف الفنية التي نفذناها للفلل والمجالس والمشاريع التجارية.",
  },
  footer: {
    copyright: "جميع الحقوق محفوظة © عدن للديكور",
    aboutText: "مؤسسة متخصصة في الديكور الداخلي والتصميم المعماري الفاخر في عدن واليمن."
  }
};

// ── Context ──
const SiteContext = createContext();

// Helper: build default data object
function buildDefaults() {
  return {
    services: INITIAL_SERVICES,
    projects: INITIAL_PROJECTS,
    testimonials: INITIAL_TESTIMONIALS,
    media: INITIAL_MEDIA,
    users: INITIAL_USERS,
    brand: INITIAL_BRAND,
    pageConfig: INITIAL_PAGE_CONFIG,
  };
}

// Helper: merge server data with defaults (server data wins)
function mergeWithDefaults(serverData) {
  const defaults = buildDefaults();
  return {
    services: serverData.services?.length ? serverData.services : defaults.services,
    projects: serverData.projects?.length ? serverData.projects : defaults.projects,
    testimonials: serverData.testimonials?.length ? serverData.testimonials : defaults.testimonials,
    media: serverData.media?.length ? serverData.media : defaults.media,
    users: serverData.users?.length ? serverData.users : defaults.users,
    brand: { ...defaults.brand, ...(serverData.brand || {}) },
    pageConfig: {
      ...defaults.pageConfig,
      ...(serverData.pageConfig || {}),
      homePage: { ...defaults.pageConfig.homePage, ...(serverData.pageConfig?.homePage || {}) },
      aboutPage: { ...defaults.pageConfig.aboutPage, ...(serverData.pageConfig?.aboutPage || {}) },
      servicesPage: { ...defaults.pageConfig.servicesPage, ...(serverData.pageConfig?.servicesPage || {}) },
      portfolioPage: { ...defaults.pageConfig.portfolioPage, ...(serverData.pageConfig?.portfolioPage || {}) },
      footer: { ...defaults.pageConfig.footer, ...(serverData.pageConfig?.footer || {}) },
    },
  };
}

// ── Helper: save a section to server ──
async function saveSection(section, data) {
  try {
    await fetch(`/api/site-data/${section}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
  } catch (err) {
    console.warn(`Failed to save ${section}:`, err);
  }
}

// ── Helper: save entire siteData to server ──
async function saveAll(data) {
  try {
    await fetch("/api/site-data", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
  } catch (err) {
    console.warn("Failed to save all data:", err);
  }
}

export function SiteProvider({ children }) {
  const [siteData, setSiteData] = useState(buildDefaults);
  const [syncStatus, setSyncStatus] = useState("synced");
  const [lastSyncedAt, setLastSyncedAt] = useState(() => new Date().toLocaleTimeString("ar-YE", { hour: "2-digit", minute: "2-digit" }));
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const saveTimerRef = useRef(null);

  // ── Load data from server on mount (single source of truth) ──
  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const res = await fetch("/api/site-data");
        if (res.ok) {
          const data = await res.json();
          if (!cancelled && data && data.services) {
            setSiteData(mergeWithDefaults(data));
          }
        }
      } catch (err) {
        console.warn("Failed to load site data from server, using defaults:", err);
      } finally {
        if (!cancelled) setIsInitialLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, []);

  // ── Helper to update state + save to server ──
  const updateAndSave = useCallback((updater, section) => {
    setSyncStatus("saving");
    setSiteData(prev => {
      const next = typeof updater === "function" ? updater(prev) : updater;
      // Save to server
      if (section) {
        saveSection(section, next[section]);
      } else {
        saveAll(next);
      }
      // Update sync status
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
      saveTimerRef.current = setTimeout(() => {
        setSyncStatus("synced");
        setLastSyncedAt(new Date().toLocaleTimeString("ar-YE", { hour: "2-digit", minute: "2-digit" }));
      }, 300);
      return next;
    });
  }, []);

  // ══════════════════════════════════════
  // ── CRUD Actions (same API as before) ──
  // ══════════════════════════════════════

  const updateServices = (services) => {
    updateAndSave(prev => ({ ...prev, services }), "services");
  };

  const addService = (service) => {
    const newService = {
      ...service,
      id: service.id || `s_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
      order: service.order || (siteData.services?.length || 0) + 1,
    };
    updateAndSave(prev => ({ ...prev, services: [...prev.services, newService] }), "services");
  };

  const updateService = (id, updatedFields) => {
    updateAndSave(prev => ({
      ...prev,
      services: prev.services.map(s => s.id === id ? { ...s, ...updatedFields } : s),
    }), "services");
  };

  const deleteService = (id) => {
    updateAndSave(prev => ({
      ...prev,
      services: prev.services.filter(s => s.id !== id),
    }), "services");
  };

  const updateProjects = (projects) => {
    updateAndSave(prev => ({ ...prev, projects }), "projects");
  };

  const addProject = (project) => {
    const newProject = {
      ...project,
      id: project.id || `p_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
      order: project.order || (siteData.projects?.length || 0) + 1,
    };
    updateAndSave(prev => ({ ...prev, projects: [...prev.projects, newProject] }), "projects");
  };

  const updateProject = (id, updatedFields) => {
    updateAndSave(prev => ({
      ...prev,
      projects: prev.projects.map(p => p.id === id ? { ...p, ...updatedFields } : p),
    }), "projects");
  };

  const deleteProject = (id) => {
    updateAndSave(prev => ({
      ...prev,
      projects: prev.projects.filter(p => p.id !== id),
    }), "projects");
  };

  const updateTestimonials = (testimonials) => {
    updateAndSave(prev => ({ ...prev, testimonials }), "testimonials");
  };

  const addTestimonial = (testimonial) => {
    const newTestimonial = {
      ...testimonial,
      id: testimonial.id || `t_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
      order: testimonial.order || (siteData.testimonials?.length || 0) + 1,
    };
    updateAndSave(prev => ({ ...prev, testimonials: [...prev.testimonials, newTestimonial] }), "testimonials");
  };

  const updateTestimonial = (id, updatedFields) => {
    updateAndSave(prev => ({
      ...prev,
      testimonials: prev.testimonials.map(t => t.id === id ? { ...t, ...updatedFields } : t),
    }), "testimonials");
  };

  const deleteTestimonial = (id) => {
    updateAndSave(prev => ({
      ...prev,
      testimonials: prev.testimonials.filter(t => t.id !== id),
    }), "testimonials");
  };

  const addMedia = (mediaItem) => {
    const newMedia = {
      ...mediaItem,
      id: mediaItem.id || `m_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
      uploaded_at: mediaItem.uploaded_at || new Date().toISOString(),
    };
    updateAndSave(prev => ({ ...prev, media: [newMedia, ...prev.media] }), "media");
    return newMedia;
  };

  const deleteMedia = (id) => {
    updateAndSave(prev => ({
      ...prev,
      media: prev.media.filter(m => m.id !== id),
    }), "media");
  };

  const addUser = (user) => {
    const newUser = {
      ...user,
      id: user.id || `u_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
      created_at: user.created_at || new Date().toISOString(),
    };
    updateAndSave(prev => ({ ...prev, users: [...(prev.users || []), newUser] }), "users");
    return newUser;
  };

  const updateUserInContext = (id, fields) => {
    updateAndSave(prev => ({
      ...prev,
      users: (prev.users || []).map(u => u.id === id ? { ...u, ...fields } : u),
    }), "users");
  };

  const deleteUserInContext = (id) => {
    updateAndSave(prev => ({
      ...prev,
      users: (prev.users || []).filter(u => u.id !== id),
    }), "users");
  };

  const updateBrand = (newBrand) => {
    updateAndSave(prev => ({
      ...prev,
      brand: { ...prev.brand, ...newBrand },
    }), "brand");
  };

  const updatePageConfig = (pageKey, sectionKey, fields) => {
    updateAndSave(prev => ({
      ...prev,
      pageConfig: {
        ...prev.pageConfig,
        [pageKey]: {
          ...prev.pageConfig[pageKey],
          [sectionKey]: {
            ...(prev.pageConfig[pageKey]?.[sectionKey] || {}),
            ...fields,
          },
        },
      },
    }), "pageConfig");
  };

  const setEntirePageConfig = (newConfig) => {
    updateAndSave(prev => ({
      ...prev,
      pageConfig: {
        ...prev.pageConfig,
        ...newConfig,
      },
    }), "pageConfig");
  };

  // Backup System: Export JSON
  const exportAllData = () => {
    const dataToExport = {
      ...siteData,
      exportMeta: {
        exportedAt: new Date().toISOString(),
        version: "4.0",
        appName: "Aden Decor Admin Panel",
      },
    };
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(dataToExport, null, 2));
    const downloadAnchor = document.createElement("a");
    const dateStr = new Date().toISOString().slice(0, 10);
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `aden_decor_backup_${dateStr}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Backup System: Import JSON
  const importAllData = (importedData) => {
    if (!importedData || typeof importedData !== "object") {
      throw new Error("ملف البيانات غير صالح");
    }
    const merged = mergeWithDefaults(importedData);
    updateAndSave(() => merged, null);
  };

  const resetDefaults = () => {
    const defaults = buildDefaults();
    updateAndSave(() => defaults, null);
  };

  if (isInitialLoading) {
    return (
      <div className="fixed inset-0 bg-[#0a0a0a] flex items-center justify-center z-[9999]">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-[#D4AF37] border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-[#D4AF37] font-body text-lg">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  return (
    <SiteContext.Provider
      value={{
        siteData,
        services: siteData.services,
        projects: siteData.projects,
        testimonials: siteData.testimonials,
        media: siteData.media,
        users: siteData.users || [],
        brand: siteData.brand,
        pageConfig: siteData.pageConfig,
        syncStatus,
        lastSyncedAt,
        exportAllData,
        importAllData,
        updateServices,
        addService,
        updateService,
        deleteService,
        updateProjects,
        addProject,
        updateProject,
        deleteProject,
        updateTestimonials,
        addTestimonial,
        updateTestimonial,
        deleteTestimonial,
        addMedia,
        deleteMedia,
        addUser,
        updateUserInContext,
        deleteUserInContext,
        updateBrand,
        updatePageConfig,
        setEntirePageConfig,
        resetDefaults,
      }}
    >
      {children}
    </SiteContext.Provider>
  );
}

export function useSiteData() {
  const ctx = useContext(SiteContext);
  if (!ctx) {
    throw new Error("useSiteData must be used within a SiteProvider");
  }
  return ctx;
}
