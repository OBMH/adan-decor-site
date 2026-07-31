import React from "react";
import { Navigate } from "react-router-dom";
import { ShieldAlert, ArrowRight, UserCheck } from "lucide-react";
import { useAuth } from "./AuthContext";
import { hasPermission, getRoleInfo } from "./rbac";

export function PermissionGuard({ section, children }) {
  const { admin } = useAuth();

  if (!admin) {
    return <Navigate to="/admin/login" replace />;
  }

  if (!hasPermission(admin.role, section)) {
    const roleInfo = getRoleInfo(admin.role);
    return (
      <div 
        className="glass p-8 lg:p-12 text-center max-w-2xl mx-auto my-12 border border-red-500/30 relative overflow-hidden rounded-xl"
        data-testid="permission-denied-notice"
      >
        <div className="absolute top-0 right-0 w-12 h-12 border-t-2 border-r-2 border-red-500/50" />
        <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center mx-auto mb-6 text-red-400">
          <ShieldAlert size={32} />
        </div>
        <h2 className="font-display text-2xl lg:text-3xl text-white mb-3">غير مصرح لك بالوصول</h2>
        <p className="font-body text-white/60 text-sm lg:text-base leading-relaxed mb-6">
          عذراً، دورك الحالي (<span className="text-[#D4AF37] font-bold">{roleInfo.nameAr}</span>) لا يملك صلاحية الوصول إلى قسم <span className="text-white font-bold">{section}</span>.
        </p>
        <div className="p-4 bg-black/60 border border-white/10 rounded-lg mb-8 text-right font-body text-xs text-white/60 space-y-2">
          <div className="flex items-center gap-2 text-[#D4AF37] font-bold">
            <UserCheck size={16} />
            <span>الأقسام المتاحة لدورك الحالي:</span>
          </div>
          <div className="pr-6 text-white/80 leading-relaxed">
            {roleInfo.sectionsAr.join(" • ")}
          </div>
        </div>
        <a
          href="/admin"
          className="inline-flex items-center gap-2 bg-[#D4AF37] text-black px-6 py-3.5 font-bold text-sm hover:bg-[#C5A030] transition-colors rounded-sm"
        >
          العودة للوحة الرئيسية <ArrowRight size={16} />
        </a>
      </div>
    );
  }

  return children;
}
