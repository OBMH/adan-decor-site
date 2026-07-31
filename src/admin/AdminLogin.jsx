import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, Mail, ArrowLeft, Loader2, Sparkles, AlertCircle } from "lucide-react";
import { useAuth } from "./AuthContext";
import { useSiteData } from "../contexts/SiteContext";

export default function AdminLogin() {
  const { login } = useAuth();
  const { brand } = useSiteData();
  const navigate = useNavigate();

  const [email, setEmail] = useState("admin@adandecor.com");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError("يرجى إدخال البريد الإلكتروني وكلمة المرور.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await login(email.trim(), password);
      navigate("/admin", { replace: true });
    } catch (err) {
      setError("بيانات الدخول غير صحيحة، يرجى التحقق وإعادة المحاولة.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white flex items-center justify-center p-4 relative overflow-hidden font-body" dir="rtl">
      {/* Background decoration */}
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-[#D4AF37]/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-[#D4AF37]/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        {/* Back to site link */}
        <a
          href="/"
          className="inline-flex items-center gap-2 text-white/60 hover:text-[#D4AF37] text-sm font-medium mb-6 transition-colors"
        >
          <ArrowLeft size={16} />
          <span>العودة للموقع العام</span>
        </a>

        {/* Card */}
        <div className="bg-[#111] border border-[#D4AF37]/40 p-8 lg:p-10 rounded-2xl shadow-2xl relative">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent rounded-t-2xl" />
          
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-[#D4AF37]/10 border border-[#D4AF37]/30 rounded-2xl flex items-center justify-center mx-auto mb-4 text-[#D4AF37] shadow-[0_0_20px_rgba(212,175,55,0.2)]">
              <Lock size={28} />
            </div>
            <h1 className="font-display text-2xl lg:text-3xl font-bold text-white mb-2">
              تسجيل الدخول للإدارة
            </h1>
            <p className="text-white/50 text-sm">
              {brand?.nameAr || "عدن للديكور"} — لوحة التحكم الهندسية
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 text-red-300 text-sm rounded-lg flex items-center gap-3">
              <AlertCircle size={18} className="text-red-400 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-[#D4AF37] mb-2 uppercase tracking-wide">
                البريد الإلكتروني للإدارة
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@adandecor.com"
                  className="w-full bg-black border border-[#D4AF37]/30 text-white rounded-lg pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-[#D4AF37] transition-colors dir-ltr text-right"
                  required
                />
                <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#D4AF37] mb-2 uppercase tracking-wide">
                كلمة المرور
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-black border border-[#D4AF37]/30 text-white rounded-lg pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-[#D4AF37] transition-colors dir-ltr text-right"
                  required
                />
                <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#D4AF37] text-black hover:bg-[#C5A030] font-display font-bold py-3.5 rounded-lg transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(212,175,55,0.3)] disabled:opacity-50 mt-2"
            >
              {loading ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  <span>جاري التحقق والدخول...</span>
                </>
              ) : (
                <>
                  <Sparkles size={18} />
                  <span>تسجيل الدخول</span>
                </>
              )}
            </button>
          </form>

          {/* Credentials helper for easy login */}
          <div className="mt-8 p-4 bg-black/60 rounded-xl border border-white/5 text-center text-xs text-white/50 space-y-1">
            <p className="font-bold text-[#D4AF37]/80">بيانات الحساب الرئيسي (Super Admin):</p>
            <p className="dir-ltr text-white/70 font-mono">admin@adandecor.com / Adan12345</p>
          </div>
        </div>
      </div>
    </div>
  );
}
