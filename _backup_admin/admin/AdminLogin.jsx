import React, { useState } from "react";
import { Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Loader2, Lock, Mail, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "./AuthContext";
import { formatApiError } from "./api";
import { BRAND } from "../data/content";
import SafeImage from "../components/SafeImage";

export default function AdminLogin() {
  const { admin, login, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 size={32} className="text-[#D4AF37] animate-spin" />
      </div>
    );
  }
  if (admin) return <Navigate to="/admin" replace />;

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("يرجى إدخال البريد وكلمة المرور");
      return;
    }
    setSubmitting(true);
    try {
      await login(email, password);
      toast.success("مرحباً بعودتك");
    } catch (err) {
      toast.error(formatApiError(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4 grain" dir="rtl">
      {/* Gold glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(212,175,55,0.08) 0%, transparent 60%)" }}
      />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full max-w-md"
      >
        {/* Logo */}
        <div className="flex flex-col items-center mb-10">
          <div className="w-24 h-24 rounded-full overflow-hidden border border-[#D4AF37] relative bg-black flex items-center justify-center mb-5">
            <SafeImage src={BRAND.logo} alt="Adan Decor" fallbackType="logo" loading="eager" fetchPriority="high" className="w-full h-full object-cover scale-[1.05]" />
          </div>
          <div className="font-display text-2xl text-white">{BRAND.nameAr}</div>
          <div className="font-en text-[10px] text-[#D4AF37] tracking-[0.3em] mt-1">ADMIN PANEL</div>
        </div>

        {/* Form */}
        <form
          onSubmit={onSubmit}
          data-testid="admin-login-form"
          className="glass p-8 lg:p-10 relative"
        >
          <div className="absolute top-0 right-0 w-10 h-10 border-t border-r border-[#D4AF37]" />
          <div className="absolute top-0 left-0 w-10 h-10 border-t border-l border-[#D4AF37]" />
          <div className="absolute bottom-0 right-0 w-10 h-10 border-b border-r border-[#D4AF37]" />
          <div className="absolute bottom-0 left-0 w-10 h-10 border-b border-l border-[#D4AF37]" />

          <div className="flex items-center gap-3 mb-2">
            <ShieldCheck size={20} className="text-[#D4AF37]" />
            <h1 className="font-display text-2xl text-white">تسجيل الدخول</h1>
          </div>
          <p className="font-body text-sm text-white/50 mb-8">دخول لوحة الإدارة المحمي</p>

          <div className="space-y-6">
            <div>
              <label className="font-en text-[10px] text-[#D4AF37] tracking-[0.25em] flex items-center gap-2 mb-1">
                <Mail size={12} /> EMAIL · البريد
              </label>
              <input
                type="email"
                className="luxe-input"
                placeholder="admin@adandecor.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                data-testid="admin-email"
                dir="ltr"
                required
              />
            </div>
            <div>
              <label className="font-en text-[10px] text-[#D4AF37] tracking-[0.25em] flex items-center gap-2 mb-1">
                <Lock size={12} /> PASSWORD · كلمة المرور
              </label>
              <input
                type="password"
                className="luxe-input"
                placeholder="******"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                data-testid="admin-password"
                dir="ltr"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            data-testid="admin-login-submit"
            className="btn-sweep mt-10 w-full bg-[#D4AF37] text-black px-8 py-4 text-base font-bold tracking-wide hover:bg-[#C5A030] transition-colors duration-300 flex items-center justify-center gap-3 disabled:opacity-60"
          >
            {submitting ? <Loader2 size={20} className="animate-spin" /> : "دخول"}
          </button>
        </form>

        <a
          href="/"
          className="block text-center mt-6 font-en text-[10px] text-white/40 tracking-[0.25em] hover:text-[#D4AF37] transition-colors"
        >
          ← BACK TO WEBSITE
        </a>
      </motion.div>
    </div>
  );
}
