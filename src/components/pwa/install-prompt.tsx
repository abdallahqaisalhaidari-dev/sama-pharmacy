"use client";

/**
 * InstallPrompt — smart "install the app" experience:
 *
 *  • Android / Desktop Chrome & Edge:
 *      captures `beforeinstallprompt` and installs DIRECTLY
 *      with one tap via the native prompt.
 *  • iPhone / iPad (Safari has no install API):
 *      shows an instructions sheet in the style the user expects —
 *      "tap Share, then Add to Home Screen".
 *  • Hidden entirely when already installed (standalone mode),
 *    and stays quiet for 14 days after being dismissed.
 *
 * Also registers the service worker (required for installability).
 */

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, Download, Share, SquarePlus, MonitorDown } from "lucide-react";

const DISMISS_KEY = "sama-pwa-dismissed-at";
const DISMISS_DAYS = 14;

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

function isStandalone(): boolean {
  if (typeof window === "undefined") return true;
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    // iOS Safari
    (window.navigator as unknown as { standalone?: boolean }).standalone === true
  );
}

function isIos(): boolean {
  if (typeof window === "undefined") return false;
  const ua = window.navigator.userAgent;
  const iOS = /iPhone|iPad|iPod/i.test(ua);
  // iPadOS 13+ reports as Macintosh but supports touch
  const iPadOs = /Macintosh/i.test(ua) && navigator.maxTouchPoints > 1;
  return iOS || iPadOs;
}

function recentlyDismissed(): boolean {
  try {
    const at = localStorage.getItem(DISMISS_KEY);
    if (!at) return false;
    return Date.now() - Number(at) < DISMISS_DAYS * 24 * 60 * 60 * 1000;
  } catch {
    return false;
  }
}

export default function InstallPrompt() {
  const [mode, setMode] = useState<"android" | "ios" | null>(null);
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(
    null
  );
  const [showIosSheet, setShowIosSheet] = useState(false);

  useEffect(() => {
    // Register the service worker regardless of banner visibility
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {});
    }

    if (isStandalone() || recentlyDismissed()) return;

    if (isIos()) {
      // Give the visitor a moment before suggesting the install
      const t = setTimeout(() => setMode("ios"), 2500);
      return () => clearTimeout(t);
    }

    const onPrompt = (e: Event) => {
      e.preventDefault();
      setDeferred(e as BeforeInstallPromptEvent);
      setMode("android");
    };
    const onInstalled = () => {
      setMode(null);
      setDeferred(null);
    };

    window.addEventListener("beforeinstallprompt", onPrompt);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onPrompt);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  const dismiss = () => {
    try {
      localStorage.setItem(DISMISS_KEY, String(Date.now()));
    } catch {
      /* private mode */
    }
    setMode(null);
    setShowIosSheet(false);
  };

  const install = async () => {
    if (mode === "ios") {
      setShowIosSheet(true);
      return;
    }
    if (!deferred) return;
    await deferred.prompt();
    const { outcome } = await deferred.userChoice;
    if (outcome === "accepted") setMode(null);
    setDeferred(null);
  };

  return (
    <>
      {/* ── Floating install banner ── */}
      <AnimatePresence>
        {mode && !showIosSheet && (
          <motion.div
            initial={{ y: 90, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 90, opacity: 0 }}
            transition={{ type: "spring", damping: 26, stiffness: 300 }}
            className="fixed inset-x-4 bottom-4 z-50 mx-auto max-w-md"
            dir="rtl"
          >
            <div className="flex items-center gap-3 rounded-2xl border border-brand-purple-100 bg-white p-3.5 shadow-2xl shadow-brand-purple-900/20">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/icon-192.png"
                alt=""
                className="size-12 shrink-0 rounded-xl shadow-sm"
              />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold text-brand-purple-900">
                  تطبيق صيدلية سما السكر
                </p>
                <p className="mt-0.5 text-xs leading-snug text-gray-500">
                  ثبتيه على جهازك للوصول السريع وتجربة أفضل
                </p>
              </div>
              <button
                onClick={install}
                className="inline-flex shrink-0 items-center gap-1.5 rounded-xl bg-brand-purple-600 px-3.5 py-2 text-xs font-bold text-white shadow-md shadow-brand-purple-600/25 transition-colors hover:bg-brand-purple-700"
              >
                {mode === "android" ? (
                  <MonitorDown className="size-4" />
                ) : (
                  <Download className="size-4" />
                )}
                تثبيت
              </button>
              <button
                onClick={dismiss}
                aria-label="إغلاق"
                className="shrink-0 rounded-full p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
              >
                <X className="size-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── iOS instructions sheet (like the reference design) ── */}
      <AnimatePresence>
        {showIosSheet && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={dismiss}
              className="fixed inset-0 z-50 bg-brand-purple-900/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 300 }}
              className="fixed inset-x-0 bottom-0 z-50 rounded-t-[2rem] bg-white p-6 pb-10 shadow-2xl"
              dir="rtl"
            >
              {/* Grabber */}
              <div className="mx-auto mb-6 h-1.5 w-12 rounded-full bg-gray-200" />

              <div className="mx-auto flex max-w-sm flex-col items-center text-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/icon-192.png"
                  alt="تطبيق صيدلية سما السكر"
                  className="size-20 rounded-2xl shadow-lg shadow-brand-purple-900/15"
                />
                <h3 className="mt-4 text-2xl font-extrabold text-gray-900">
                  تثبيت التطبيق
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-500">
                  أضف التطبيق إلى شاشتك الرئيسية للوصول السريع والحصول على
                  تجربة أفضل.
                </p>

                {/* Steps box */}
                <div className="mt-6 w-full space-y-3 rounded-2xl bg-gray-100 p-4 text-sm leading-relaxed text-gray-700">
                  <p className="flex flex-wrap items-center justify-center gap-1.5">
                    اضغطي على زر المشاركة
                    <Share className="inline size-4.5 text-blue-500" />
                    (share) في شريط المتصفح
                  </p>
                  <p className="flex flex-wrap items-center justify-center gap-1.5">
                    ثم اختاري
                    <SquarePlus className="inline size-4.5 text-gray-600" />
                    &quot;إضافة إلى الشاشة الرئيسية&quot;
                  </p>
                </div>

                <button
                  onClick={dismiss}
                  className="mt-6 w-full rounded-2xl bg-brand-purple-600 py-3.5 text-sm font-bold text-white transition-colors hover:bg-brand-purple-700"
                >
                  فهمت
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
