import React, { useState, useEffect } from "react";
import {
  Users,
  Plus,
  Shield,
  Trash2,
  Edit2,
  Check,
  X,
  UserCheck,
  Mail,
  Lock,
  Loader2
} from "lucide-react";
import { toast } from "sonner";
import { adminApi, formatApiError } from "./api";
import { ROLES } from "./rbac";
import { useSiteData } from "../contexts/SiteContext";

export default function AdminUsers() {
  const { users = [], addUser, updateUserInContext, deleteUserInContext } = useSiteData();
  const [adminList, setAdminList] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({ name: "", email: "", password: "", role: "editor" });

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await adminApi.get("/admin/users");
      if (Array.isArray(res.data) && res.data.length > 0) {
        setAdminList(res.data);
      } else {
        setAdminList(users || []);
      }
    } catch (err) {
      console.warn("Could not fetch admin accounts from API, falling back to context:", err);
      setAdminList(users || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleOpenCreate = () => {
    setEditingUser(null);
    setFormData({ name: "", email: "", password: "", role: "editor" });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (user) => {
    setEditingUser(user);
    setFormData({ name: user.name || "", email: user.email || "", password: "", role: user.role || "editor" });
    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim()) {
      toast.error("الاسم والبريد الإلكتروني مطلوبان");
      return;
    }
    if (!editingUser && (!formData.password || formData.password.length < 6)) {
      toast.error("كلمة المرور مطلوبة ويجب أن تتكون من 6 أحرف على الأقل");
      return;
    }

    try {
      if (editingUser) {
        await adminApi.put(`/admin/users/${editingUser.id}`, {
          name: formData.name.trim(),
          role: formData.role,
          ...(formData.password ? { password: formData.password } : {}),
        });
        updateUserInContext(editingUser.id, { name: formData.name.trim(), role: formData.role });
        toast.success("تم تحديث بيانات المشرف بنجاح");
      } else {
        const res = await adminApi.post("/admin/users", {
          name: formData.name.trim(),
          email: formData.email.trim().toLowerCase(),
          password: formData.password,
          role: formData.role,
        });
        addUser(res.data || { ...formData, id: `u_${Date.now()}` });
        toast.success("تم إضافة الحساب الإداري الجديد بنجاح");
      }
      setIsModalOpen(false);
      fetchUsers();
    } catch (err) {
      toast.error(formatApiError(err) || "فشلت عملية الحفظ في الخادم");
    }
  };

  const handleDelete = async (id, name, email) => {
    if (email === "admin@adandecor.com") {
      toast.error("لا يمكن حذف الحساب الإداري الرئيسي للمؤسسة (Super Admin)");
      return;
    }
    if (!window.confirm(`هل أنت متأكد من رغبتك في حذف حساب المشرف "${name}"؟`)) return;

    try {
      await adminApi.delete(`/admin/users/${id}`);
      deleteUserInContext(id);
      toast.success("تم حذف الحساب بنجاح");
      fetchUsers();
    } catch (err) {
      toast.error(formatApiError(err) || "فشلت عملية الحذف");
    }
  };

  return (
    <div className="space-y-6" dir="rtl">
      {/* Header */}
      <div className="bg-[#111] border border-[#D4AF37]/30 p-6 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[#D4AF37] text-xs font-bold uppercase tracking-wide mb-1">
            <Users size={16} />
            <span>إدارة الحسابات والصلاحيات الهندسية</span>
          </div>
          <h2 className="font-display text-2xl font-bold text-white">
            المستخدمون والصلاحيات ({adminList.length})
          </h2>
          <p className="text-white/60 text-sm mt-1">
            إدراج أو تعديل حسابات المشرفين وتوزيع مهام (مدير عام، مدير محتوى، مدير مشاريع).
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="bg-[#D4AF37] text-black px-6 py-3.5 rounded-lg font-display font-bold text-sm hover:bg-[#C5A030] transition-all flex items-center gap-2 shadow-[0_0_20px_rgba(212,175,55,0.25)] shrink-0"
        >
          <Plus size={18} />
          <span>إضافة مستخدم إداري جديد</span>
        </button>
      </div>

      {/* Users Grid */}
      {loading ? (
        <div className="py-16 text-center text-white/50 flex flex-col items-center gap-3">
          <Loader2 size={32} className="text-[#D4AF37] animate-spin" />
          <span>جاري تحميل قائمة المستخدمين من الخادم...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {adminList.map((usr) => {
            const rInfo = Object.values(ROLES).find(r => r.id === (usr.role || "admin")) || ROLES.ADMIN;
            return (
              <div
                key={usr.id}
                className="bg-[#111] border border-[#D4AF37]/20 hover:border-[#D4AF37] p-6 rounded-xl transition-all flex flex-col justify-between group relative overflow-hidden"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className={`px-3 py-1 rounded text-xs border font-bold ${rInfo.badgeClass}`}>
                      {rInfo.nameAr}
                    </span>
                    {usr.email === "admin@adandecor.com" && (
                      <span className="text-[10px] text-[#D4AF37] bg-[#D4AF37]/10 px-2 py-0.5 rounded font-bold">
                        محمي (System Root)
                      </span>
                    )}
                  </div>

                  <h3 className="font-display font-bold text-lg text-white mb-1 flex items-center gap-2">
                    <UserCheck size={18} className="text-[#D4AF37]" />
                    <span>{usr.name}</span>
                  </h3>

                  <p className="text-white/50 text-xs font-mono dir-ltr mb-4">{usr.email}</p>

                  <div className="p-3 bg-black/60 rounded-lg border border-white/5 text-xs text-white/60 space-y-1">
                    <div className="font-bold text-[#D4AF37] text-[11px] mb-1">الأقسام والمهام المتاحة:</div>
                    <div className="leading-relaxed">{rInfo.sectionsAr.join(" • ")}</div>
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-white/10 flex items-center justify-between">
                  <span className="text-[10px] text-white/40">مسجل بالخادم</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleOpenEdit(usr)}
                      className="p-2 bg-[#D4AF37]/10 hover:bg-[#D4AF37] text-[#D4AF37] hover:text-black border border-[#D4AF37]/30 rounded-lg transition-all text-xs font-bold flex items-center gap-1.5"
                      title="تعديل الصلاحيات"
                    >
                      <Edit2 size={15} /> تعديل
                    </button>
                    {usr.email !== "admin@adandecor.com" && (
                      <button
                        onClick={() => handleDelete(usr.id, usr.name, usr.email)}
                        className="p-2 bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white border border-red-500/30 rounded-lg transition-all text-xs font-bold"
                        title="حذف المستخدم"
                      >
                        <Trash2 size={15} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4" onClick={() => setIsModalOpen(false)}>
          <div className="bg-[#111] border border-[#D4AF37]/40 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="p-6 bg-black border-b border-[#D4AF37]/20 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Shield size={22} className="text-[#D4AF37]" />
                <h3 className="font-display font-bold text-lg text-white">
                  {editingUser ? `تعديل صلاحيات الحساب: ${editingUser.name}` : "إدراج مستخدم إداري جديد"}
                </h3>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-white/50 hover:text-white p-1">
                <X size={22} />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-5">
              <div>
                <label className="block text-xs font-bold text-white/80 mb-2">الاسم الحقيقي أو الوظيفي <span className="text-[#D4AF37]">*</span>:</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-black border border-[#D4AF37]/30 text-white rounded-lg p-3 text-sm focus:outline-none focus:border-[#D4AF37]"
                  placeholder="مثال: المهندس صالح المرفدي"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-white/80 mb-2">البريد الإلكتروني للدخول <span className="text-[#D4AF37]">*</span>:</label>
                <input
                  type="email"
                  required={!editingUser}
                  disabled={!!editingUser}
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-black border border-[#D4AF37]/30 text-white rounded-lg p-3 text-sm focus:outline-none focus:border-[#D4AF37] dir-ltr text-right disabled:opacity-50"
                  placeholder="admin-name@adandecor.com"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-white/80 mb-2">
                  {editingUser ? "كلمة المرور الجديدة (اتركه فارغاً للاحتفاظ بالقديمة):" : "كلمة المرور (6 أحرف على الأقل):"}
                </label>
                <input
                  type="password"
                  required={!editingUser}
                  value={formData.password}
                  onChange={e => setFormData({ ...formData, password: e.target.value })}
                  className="w-full bg-black border border-[#D4AF37]/30 text-white rounded-lg p-3 text-sm focus:outline-none focus:border-[#D4AF37] dir-ltr text-right"
                  placeholder="••••••••"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-white/80 mb-2">الدور الإداري والصلاحيات <span className="text-[#D4AF37]">*</span>:</label>
                <select
                  value={formData.role}
                  onChange={e => setFormData({ ...formData, role: e.target.value })}
                  className="w-full bg-black border border-[#D4AF37]/30 text-white rounded-lg p-3 text-sm focus:outline-none focus:border-[#D4AF37]"
                >
                  <option value="admin">{ROLES.ADMIN.nameAr}</option>
                  <option value="editor">{ROLES.EDITOR.nameAr}</option>
                  <option value="project_manager">{ROLES.PROJECT_MANAGER.nameAr}</option>
                </select>
                <p className="text-[11px] text-white/50 mt-1.5 leading-relaxed">
                  {Object.values(ROLES).find(r => r.id === formData.role)?.description}
                </p>
              </div>

              <div className="pt-4 border-t border-white/10 flex items-center justify-end gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm font-bold transition-colors">
                  إلغاء
                </button>
                <button type="submit" className="px-6 py-2.5 bg-[#D4AF37] hover:bg-[#C5A030] text-black rounded-lg text-sm font-bold transition-all shadow-md flex items-center gap-2">
                  <Check size={18} />
                  <span>{editingUser ? "حفظ التعديلات" : "إعتماد وإضافة الحساب"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
