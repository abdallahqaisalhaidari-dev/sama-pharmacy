"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AnimatedLogo from "@/components/logo/AnimatedLogo";

export function SplashScreen() {
  const [show, setShow] = useState(true);

  useEffect(() => {
    // Hide the splash screen after 6 seconds to allow the initial logo animation to play fully
    const timer = setTimeout(() => {
      setShow(false);
    }, 6000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-brand-cream-dark"
        >
          <AnimatedLogo className="w-40 md:w-56" />
          
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.5, ease: "easeOut" }}
            className="mt-6 flex flex-col items-center text-center"
          >
            <span className="block font-heading text-3xl md:text-4xl font-bold text-brand-purple-900 leading-tight">
              صيدلية سما السكر
            </span>
            <span className="block mt-2 text-sm md:text-base tracking-[0.3em] text-brand-purple-400 uppercase">
              Sama Pharmacy
            </span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
