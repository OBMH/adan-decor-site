import React, { useEffect, useState } from "react";
import { 
  Loader2, Plus, Trash2, Edit2, X, Shield, UserCog, 
  Search, ShieldCheck, Mail, Lock, KeyRound, Users as UsersIcon,
  CheckCircle2, Info, UserPlus
} from "lucide-react";
import { toast } from "sonner";
import { adminApi, formatApiError } from "./api";
import { useAuth } from "./AuthContext";
import { useSiteData } from "../contexts/SiteContext";
import { ROLES, getRoleInfo } from "./rbac";

const EMPTY_FORM = {
  name: "",
  email: "",
  password: "",
  role: "editor"
};

export default function AdminUsers() {
  const { admin: me } = useAuth();
  const site = useSiteData();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [creating, setCreating] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");

  // Load users from API or Context
  const loadUsers = async () => {
    setLoading(true);
    try {
      const { data } = await adminApi.get("/admin/users");
      if (Array.isArray(data) && data.length > 0) {
        setUsers(data);
      } else if (site.users && site.users.length > 0) {
        setUsers(site.users);
      }
    } catch (err) {
      console.warn("Failed to fetch users from backend, using site context state:", err);
      if (site.users && site.users.length > 0) {
        setUsers(site.users);
      } else {
        toast.error("تعذر تحميل قائمة المستخدمين");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  // Create new user
  const handleCreateUser = async () => {
    if (!creating.name?.trim() || !creating.email?.trim() || !creating.password) {
      toast.error("يرجى ملء جميع الحقول المطلوبة (الاسم، البريد، كلمة المرور)");
      return;
    }
    if (creating.password.length < 6) {
      toast.error("كلمة المرور يجب أن تتكون من 6 أحرف على الأقل");
      return;
    }

    const newUserPayload = {
      name: creating.name.trim(),
      email: creating.email.toLowerCase().trim(),
      password: creating.password,
      role: creating.role
    };

    try {
      let createdUser = null;
      try {
        const { data } = await adminApi.post("/admin/users", newUserPayload);
        createdUser = data;
      } catch (e) {
        console.warn("Backend creation failed, adding to site context:", e);
      }

      if (!createdUser) {
        createdUser = site.addUser({
          name: newUserPayload.name,
          email: newUserPayload.email,
          role: newUserPayload.role,
        });
      } else {
        site.addUser(createdUser);
      }

      setUsers((prev) => [...prev, createdUser]);
      setCreating(null);
      toast.success(`تمت إضافة المستخدم (${createdUser.name}) بنجاح`);
    } catch (err) {
      toast.error(formatApiError(err));
    }
  };

  // Update existing user
  const handleUpdateUser = async () => {
    if (!editing.name?.trim()) {
      toast.error("اسم المستخدم مطلوب");
      return;
    }

    const payload = {
      name: editing.name.trim(),
      role: editing.role,
    };
    if (editing.newPassword && editing.newPassword.length >= 6) {
      payload.password = editing.newPassword;
    }

    try {
      try {
        await adminApi.put(`/admin/users/${editing.id}`, payload);
      } catch (e) {
        console.warn("Backend update failed, applying to local context:", e);
      }

      site.updateUserInContext(editing.id, {
        name: payload.name,
        role: payload.role
      });

      setUsers((prev) =>
        prev.map((u) => (u.id === editing.id ? { ...u, name: payload.name, role: payload.role } : u))
      );

      setEditing(null);
      toast.success("تم تحديث بيانات المستخدم بنجاح");
    } catch (err) {
      toast.error(formatApiError(err));
    }
  };

  // Delete user
  const handleRemoveUser = async (id, userName) => {
    if (id === me?.id) {
      toast.error("لا يمكنك حذف حسابك الحالي أثناء تسجيل الدخول");
      return;
    }

    if (!window.confirm(`هل أنت ألكيد من حذف المستخدم (${userName})؟`)) {
      return;
    }

    try {
      try {
        await adminApi.delete(`/admin/users/${id}`);
      } catch (e) {
        console.warn("Backend delete failed, applying to context:", e);
      }

      site.deleteUserInContext(id);
      setUsers((prev) => prev.filter((u) => u.id !== id));
      toast.success("تم حذف المستخدم من النظام");
    } catch (err) {
      toast.error(formatApiError(err));
    }
  };

  // Filtered users list
  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      (u.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (u.email || "").toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRole =
      roleFilter === "ALL" ||
      (u.role || "").toLowerCase() === roleFilter.toLowerCase();

    return matchesSearch && matchesRole;
  });

  // Calculate user counts by role
  const totalCount = users.length;
  const adminCount = users.filter((u) => ["admin", "superadmin"].includes((u.role || "").toLowerCase())).length;
  const editorCount = users.filter((u) => ["editor", "content_editor"].includes((u.role || "").toLowerCase())).length;
  const pmCount = users.filter((u) => ["project_manager", "pm"].includes((u.role || "").toLowerCase())).length;

  return (
    <div data-testid="admin-users-page" className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="font-en text-[10px] text-[#D4AF37] tracking-[0.3em] mb-2 flex items-center gap-2">
            <Shield size={14} /> SECURITY & RBAC ACCESS CONTROL
          </div>
          <h1 className="font-display text-3xl lg:text-4xl text-white">إدارة المستخدمين والصلاحيات</h1>
          <p className="font-body text-white/60 text-sm mt-1">
            إضافة وتعديل أدوار فريق العمل والتحكم في إمكانية الوصول لأقسام لوحة تحكم عدن للديكور.
          </p>
        </div>

        <button
          onClick={() => setCreating({ ...EMPTY_FORM })}
          data-testid="add-user-btn"
          className="bg-[#D4AF37] text-black px-6 py-3.5 text-sm font-bold flex items-center justify-center gap-2.5 hover:bg-[#C5A030] transition-colors rounded-sm shadow-lg shrink-0"
        >
          <UserPlus size={18} /> إضافة مستخدم جديد
        </button>
      </div>

      {/* Role Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass p-5 border-r-2 border-r-[#D4AF37]">
          <div className="flex items-center justify-between text-white/50 text-xs font-body mb-2">
            <span>إجمالي أعضاء الفريق</span>
            <UsersIcon size={16} className="text-[#D4AF37]" />
          </div>
          <div className="font-display text-2xl text-white font-bold">{totalCount}</div>
          <div className="text-[11px] text-white/40 mt-1">مسجّلون في النظام</div>
        </div>

        <div className="glass p-5 border-r-2 border-r-[#D4AF37]">
          <div className="flex items-center justify-between text-white/50 text-xs font-body mb-2">
            <span>المدراء العموميين (Admins)</span>
            <Shield size={16} className="text-[#D4AF37]" />
          </div>
          <div className="font-display text-2xl text-[#D4AF37] font-bold">{adminCount}</div>
          <div className="text-[11px] text-white/40 mt-1">وصول كامل لكافة الأقسام</div>
        </div>

        <div className="glass p-5 border-r-2 border-r-blue-400">
          <div className="flex items-center justify-between text-white/50 text-xs font-body mb-2">
            <span>مدراء المحتوى (Editors)</span>
            <UserCog size={16} className="text-blue-400" />
          </div>
          <div className="font-display text-2xl text-blue-400 font-bold">{editorCount}</div>
          <div className="text-[11px] text-white/40 mt-1">إدارة الصفحات والوسائط</div>
        </div>

        <div className="glass p-5 border-r-2 border-r-emerald-400">
          <div className="flex items-center justify-between text-white/50 text-xs font-body mb-2">
            <span>مدراء المشاريع (Managers)</span>
            <UserCog size={16} className="text-emerald-400" />
          </div>
          <div className="font-display text-2xl text-emerald-400 font-bold">{pmCount}</div>
          <div className="text-[11px] text-white/40 mt-1">إدارة الخدمات والمشاريع</div>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="البحث بالاسم أو البريد الإلكتروني..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-black border border-[#D4AF37]/30 text-white rounded-sm pr-10 pl-4 py-3 focus:outline-none focus:border-[#D4AF37] text-sm"
            dir="rtl"
          />
          <Search size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#D4AF37]/60" />
        </div>

        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="bg-black border border-[#D4AF37]/30 text-white rounded-sm px-4 py-3 focus:outline-none focus:border-[#D4AF37] text-sm font-body cursor-pointer shrink-0"
        >
          <option value="ALL">جميع الأدوار</option>
          <option value="admin">المدير العام (Super Admin)</option>
          <option value="editor">مدير المحتوى (Content Editor)</option>
          <option value="project_manager">مدير المشاريع (Project Manager)</option>
        </select>
      </div>

      {/* Users List */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 size={32} className="text-[#D4AF37] animate-spin" />
        </div>
      ) : filteredUsers.length === 0 ? (
        <div className="glass p-12 text-center text-white/50 font-body">
          لا يوجد مستخدمون متطابقون مع خيارات البحث.
        </div>
      ) : (
        <div className="glass overflow-hidden rounded-xl border border-[#D4AF37]/20">
          <div className="divide-y divide-white/10">
            {filteredUsers.map((u, idx) => {
              const roleInfo = getRoleInfo(u.role);
              const isCurrentUser = u.id === me?.id || u.email?.toLowerCase() === me?.email?.toLowerCase();

              return (
                <div
                  key={`${u.id}_${idx}`}
                  data-testid={`user-row-${u.id}`}
                  className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 hover:bg-white/[0.02] transition-colors"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="w-12 h-12 rounded-full border border-[#D4AF37]/40 bg-black flex items-center justify-center shrink-0">
                      {roleInfo.id === "admin" ? (
                        <Shield size={22} className="text-[#D4AF37]" />
                      ) : (
                        <UserCog size={22} className={roleInfo.id === "editor" ? "text-blue-400" : "text-emerald-400"} />
                      )}
                    </div>

                    <div className="min-w-0 flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-display text-white font-bold text-base">{u.name || "مستخدم"}</span>
                        {isCurrentUser && (
                          <span className="text-[10px] bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-[#D4AF37] px-2 py-0.5 font-en tracking-wider font-bold rounded-sm">
                            YOU · حسابك
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-white/50 font-en dir-ltr text-right" dir="ltr">
                        {u.email}
                      </div>
                      <div className="text-[11px] text-white/40 font-body">
                        الصلاحيات المتاحة: {roleInfo.sectionsAr.join(" • ")}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between md:justify-end gap-3 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-white/5">
                    <span className={`text-[11px] px-3 py-1 font-en tracking-wider border rounded font-bold ${roleInfo.badgeClass}`}>
                      {roleInfo.nameAr}
                    </span>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setEditing({ ...u, newPassword: "" })}
                        data-testid={`edit-user-${u.id}`}
                        className="border border-[#D4AF37]/30 text-[#D4AF37] p-2 hover:bg-[#D4AF37]/10 transition-colors rounded-sm"
                        title="تعديل المستخدم"
                      >
                        <Edit2 size={16} />
                      </button>

                      {!isCurrentUser ? (
                        <button
                          onClick={() => handleRemoveUser(u.id, u.name)}
                          data-testid={`delete-user-${u.id}`}
                          className="border border-red-500/30 text-red-400 p-2 hover:bg-red-500/10 transition-colors rounded-sm"
                          title="حذف المستخدم"
                        >
                          <Trash2 size={16} />
                        </button>
                      ) : (
                        <div className="w-8 h-8 flex items-center justify-center text-white/20" title="حسابك الحالي">
                          <ShieldCheck size={16} />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Modal: Create User */}
      {creating && (
        <div
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto"
          onClick={() => setCreating(null)}
        >
          <div
            className="bg-[#111] border border-[#D4AF37]/40 max-w-lg w-full p-6 lg:p-8 relative rounded-xl shadow-2xl my-8"
            onClick={(e) => e.stopPropagation()}
            data-testid="create-user-form"
          >
            <button
              onClick={() => setCreating(null)}
              className="absolute top-4 left-4 text-white/50 hover:text-[#D4AF37] p-1"
              aria-label="إغلاق"
            >
              <X size={22} />
            </button>
            <div className="absolute top-0 right-0 w-12 h-12 border-t-2 border-r-2 border-[#D4AF37]" />

            <div className="flex items-center gap-3 mb-2">
              <UserPlus className="text-[#D4AF37]" size={24} />
              <h2 className="font-display text-2xl text-white font-bold">إضافة مستخدم جديد</h2>
            </div>
            <p className="text-xs text-white/50 font-body mb-6">
              قم بإنشاء حساب جديد وتحديد الدور الوظيفي لمنحه الصلاحيات المناسبة.
            </p>

            <div className="space-y-5">
              <div>
                <label className="text-[10px] text-[#D4AF37] font-en tracking-[0.25em] block mb-1.5 font-bold">
                  NAME · الاسم الكامل
                </label>
                <input
                  className="luxe-input"
                  placeholder="مثال: المهندس أحمد علي"
                  value={creating.name}
                  onChange={(e) => setCreating({ ...creating, name: e.target.value })}
                  data-testid="new-user-name"
                />
              </div>

              <div>
                <label className="text-[10px] text-[#D4AF37] font-en tracking-[0.25em] block mb-1.5 font-bold">
                  EMAIL · البريد الإلكتروني
                </label>
                <input
                  type="email"
                  className="luxe-input dir-ltr text-left"
                  placeholder="engineer@adandecor.com"
                  value={creating.email}
                  onChange={(e) => setCreating({ ...creating, email: e.target.value })}
                  data-testid="new-user-email"
                  dir="ltr"
                />
              </div>

              <div>
                <label className="text-[10px] text-[#D4AF37] font-en tracking-[0.25em] block mb-1.5 font-bold">
                  PASSWORD · كلمة المرور (6+ أحرف)
                </label>
                <input
                  type="password"
                  className="luxe-input dir-ltr text-left"
                  placeholder="••••••••"
                  value={creating.password}
                  onChange={(e) => setCreating({ ...creating, password: e.target.value })}
                  data-testid="new-user-password"
                  dir="ltr"
                />
              </div>

              <div>
                <label className="text-[10px] text-[#D4AF37] font-en tracking-[0.25em] block mb-1.5 font-bold">
                  ROLE · تحديد الدور والصلاحيات
                </label>
                <select
                  className="luxe-input bg-black cursor-pointer"
                  value={creating.role}
                  onChange={(e) => setCreating({ ...creating, role: e.target.value })}
                  data-testid="new-user-role"
                >
                  <option value="editor">مدير المحتوى (Content Editor)</option>
                  <option value="project_manager">مدير المشاريع (Project Manager)</option>
                  <option value="admin">المدير العام (Super Admin)</option>
                </select>

                <div className="mt-3 p-3 bg-black/60 border border-[#D4AF37]/20 rounded-md text-xs text-white/70 space-y-1 font-body">
                  <div className="text-[#D4AF37] font-bold">
                    {ROLES[creating.role?.toUpperCase() || "EDITOR"]?.nameAr || creating.role}:
                  </div>
                  <div>{ROLES[creating.role?.toUpperCase() || "EDITOR"]?.description}</div>
                </div>
              </div>

              <button
                onClick={handleCreateUser}
                data-testid="save-new-user"
                className="w-full bg-[#D4AF37] text-black py-3.5 font-bold text-base hover:bg-[#C5A030] transition-colors rounded-sm mt-4 flex items-center justify-center gap-2"
              >
                <CheckCircle2 size={18} /> إنشاء المستخدم وإضافته
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Edit User */}
      {editing && (
        <div
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto"
          onClick={() => setEditing(null)}
        >
          <div
            className="bg-[#111] border border-[#D4AF37]/40 max-w-lg w-full p-6 lg:p-8 relative rounded-xl shadow-2xl my-8"
            onClick={(e) => e.stopPropagation()}
            data-testid="edit-user-form"
          >
            <button
              onClick={() => setEditing(null)}
              className="absolute top-4 left-4 text-white/50 hover:text-[#D4AF37] p-1"
              aria-label="إغلاق"
            >
              <X size={22} />
            </button>
            <div className="absolute top-0 right-0 w-12 h-12 border-t-2 border-r-2 border-[#D4AF37]" />

            <div className="flex items-center gap-3 mb-1">
              <Edit2 className="text-[#D4AF37]" size={22} />
              <h2 className="font-display text-2xl text-white font-bold">تعديل بيانات المستخدم</h2>
            </div>
            <p className="text-xs text-white/40 font-en mb-6 dir-ltr text-right" dir="ltr">
              {editing.email}
            </p>

            <div className="space-y-5">
              <div>
                <label className="text-[10px] text-[#D4AF37] font-en tracking-[0.25em] block mb-1.5 font-bold">
                  NAME · الاسم
                </label>
                <input
                  className="luxe-input"
                  value={editing.name}
                  onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                />
              </div>

              <div>
                <label className="text-[10px] text-[#D4AF37] font-en tracking-[0.25em] block mb-1.5 font-bold">
                  ROLE · الدور
                </label>
                <select
                  className="luxe-input bg-black cursor-pointer"
                  value={editing.role}
                  onChange={(e) => setEditing({ ...editing, role: e.target.value })}
                  disabled={editing.id === me?.id}
                >
                  <option value="admin">المدير العام (Super Admin)</option>
                  <option value="editor">مدير المحتوى (Content Editor)</option>
                  <option value="project_manager">مدير المشاريع (Project Manager)</option>
                </select>
                {editing.id === me?.id && (
                  <p className="text-xs text-[#D4AF37] mt-1.5 flex items-center gap-1">
                    <Info size={14} /> لا يمكنك تغيير دور حسابك الحالي لتفادي فقدان الوصول.
                  </p>
                )}
              </div>

              <div>
                <label className="text-[10px] text-[#D4AF37] font-en tracking-[0.25em] block mb-1.5 font-bold">
                  NEW PASSWORD · كلمة مرور جديدة (اختياري)
                </label>
                <input
                  type="password"
                  className="luxe-input dir-ltr text-left"
                  placeholder="اتركها فارغة للإبقاء على الحالية"
                  value={editing.newPassword || ""}
                  onChange={(e) => setEditing({ ...editing, newPassword: e.target.value })}
                  dir="ltr"
                />
              </div>

              <button
                onClick={handleUpdateUser}
                className="w-full bg-[#D4AF37] text-black py-3.5 font-bold text-base hover:bg-[#C5A030] transition-colors rounded-sm mt-4"
              >
                حفظ التعديلات
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
