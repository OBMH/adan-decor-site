export const ROLES = {
  ADMIN: {
    id: "admin",
    nameAr: "المدير العام (Super Admin)",
    description: "وصول شامل لكافة أقسام وإعدادات اللوحة والمستخدمين.",
    sections: ["dashboard", "pages", "notifications", "projects", "services", "testimonials", "media", "settings", "users"],
    sectionsAr: ["الإحصائيات", "الصفحات", "الإشعارات", "المشاريع", "الخدمات", "الشهادات", "الوسائط", "الإعدادات", "المستخدمون"],
    badgeClass: "border-[#D4AF37] text-[#D4AF37] bg-[#D4AF37]/10"
  },
  EDITOR: {
    id: "editor",
    nameAr: "مدير المحتوى (Content Editor)",
    description: "وصول حصري لقسم إدارة الصفحات والوسائط وسجل التتبع.",
    sections: ["dashboard", "pages", "media", "notifications"],
    sectionsAr: ["الإحصائيات", "إدارة الصفحات", "الوسائط والملفات", "سجل التتبع والإشعارات"],
    badgeClass: "border-blue-400/50 text-blue-400 bg-blue-400/10"
  },
  PROJECT_MANAGER: {
    id: "project_manager",
    nameAr: "مدير المشاريع (Project Manager)",
    description: "وصول حصري لقسم الخدمات والمشاريع والشهادات وسجل التتبع.",
    sections: ["dashboard", "services", "projects", "testimonials", "notifications"],
    sectionsAr: ["الإحصائيات", "إدارة الخدمات", "إدارة المشاريع", "آراء العملاء والشهادات", "سجل التتبع"],
    badgeClass: "border-emerald-400/50 text-emerald-400 bg-emerald-400/10"
  }
};

export function hasPermission(userRole, requiredSection) {
  if (!requiredSection) return true;
  const r = (userRole || "").toLowerCase();
  
  if (r === "admin" || r === "superadmin" || r === "super_admin") return true;
  if (requiredSection === "dashboard" || requiredSection === "notifications") return true;

  if (r === "editor" || r === "content_editor") {
    return ["pages", "media", "dashboard", "notifications"].includes(requiredSection);
  }

  if (r === "project_manager" || r === "pm" || r === "manager") {
    return ["projects", "services", "testimonials", "dashboard", "notifications"].includes(requiredSection);
  }

  return false;
}

export function getRoleInfo(userRole) {
  const r = (userRole || "").toLowerCase();
  if (r === "admin" || r === "superadmin" || r === "super_admin") {
    return ROLES.ADMIN;
  }
  if (r === "editor" || r === "content_editor") {
    return ROLES.EDITOR;
  }
  if (r === "project_manager" || r === "pm" || r === "manager") {
    return ROLES.PROJECT_MANAGER;
  }
  return {
    id: r || "unknown",
    nameAr: r.toUpperCase() || "مستخدم",
    description: "مستخدم ذو صلاحيات مخصصة",
    sections: ["dashboard"],
    sectionsAr: ["الإحصائيات"],
    badgeClass: "border-white/30 text-white/70 bg-white/5"
  };
}
