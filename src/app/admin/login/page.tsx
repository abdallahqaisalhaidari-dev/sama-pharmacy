"use client";

import { useState } from "react";
import { supabaseBrowser as supabase } from "@/lib/supabase-browser";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Pill, Eye, EyeOff, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        setError("البريد الإلكتروني أو كلمة المرور غير صحيحة");
        return;
      }

      // Full navigation (not router.push) so the middleware re-runs
      // with the fresh auth cookies before rendering /admin.
      const params = new URLSearchParams(window.location.search);
      const redirect = params.get("redirect");
      const target =
        redirect && redirect.startsWith("/admin") ? redirect : "/admin";
      window.location.assign(target);
    } catch {
      setError("حدث خطأ غير متوقع. حاول مرة أخرى.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="flex min-h-screen items-center justify-center p-4"
      style={{
        background:
          "linear-gradient(135deg, #0F172A 0%, #1A1A2E 25%, #16213E 50%, #0F172A 75%, #1A1A2E 100%)",
      }}
    >
      {/* Decorative orbs */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-brand-purple-500/10 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-purple-500/10 blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative z-10 w-full max-w-md"
      >
        {/* Glassmorphism Card */}
        <div className="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-xl">
          {/* Logo */}
          <div className="mb-8 flex flex-col items-center gap-3">
            <div className="relative flex h-20 w-20 items-center justify-center overflow-hidden rounded-2xl bg-brand-purple-500/20 shadow-lg shadow-brand-purple-500/10">
              <img src="/logo.png" alt="صيدلية سما" className="h-full w-full object-cover" />
            </div>
            <div className="text-center">
              <h1 className="text-2xl font-bold text-white">صيدلية سما</h1>
              <p className="mt-1 text-sm text-gray-400">لوحة الإدارة</p>
            </div>
          </div>

          {/* Title */}
          <h2 className="mb-6 text-center text-lg font-semibold text-white">
            تسجيل الدخول
          </h2>

          {/* Error Alert */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400"
            >
              {error}
            </motion.div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-2">
              <Label className="text-sm text-gray-300">
                البريد الإلكتروني
              </Label>
              <Input
                type="email"
                placeholder="admin@sama-pharmacy.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-11 rounded-xl border-white/10 bg-white/5 text-white placeholder:text-gray-500 focus:border-brand-purple-500/50 focus:ring-brand-purple-500/20"
                dir="ltr"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm text-gray-300">كلمة المرور</Label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="h-11 rounded-xl border-white/10 bg-white/5 pe-10 text-white placeholder:text-gray-500 focus:border-brand-purple-500/50 focus:ring-brand-purple-500/20"
                  dir="ltr"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="h-11 w-full rounded-xl bg-brand-purple-600 text-white hover:bg-brand-purple-700 disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "تسجيل الدخول"
              )}
            </Button>
          </form>
        </div>

        {/* Bottom text */}
        <p className="mt-6 text-center text-xs text-gray-500">
          صيدلية سما السكر — الموصل
        </p>
      </motion.div>
    </div>
  );
}
