"use client";

/**
 * AnimatedLogo.tsx
 * ─────────────────────────────────────────────────────────────────
 * Premium animated logo for Sama Al-Sukkar Pharmacy.
 *
 * • Artwork = exact vector trace of the approved logo — colors,
 *   proportions and shapes are untouched (see logo-paths.ts).
 * • GSAP drives one intro pass + a 6-second ambient loop
 *   (see animation.ts for the full timeline).
 * • 60fps: every animated property is opacity / transform, plus one
 *   small clipped SVG displacement filter for the hair breeze.
 * • Respects prefers-reduced-motion (static logo).
 * • Dark-mode ready: brand colors stay identical (the cream capsule
 *   is opaque, so it reads perfectly on dark backgrounds); a soft
 *   glow can be added via the `className` prop, e.g.
 *   `dark:drop-shadow-[0_0_24px_rgba(124,79,136,0.35)]`.
 *
 * Usage:
 *   import AnimatedLogo from "@/components/logo/AnimatedLogo";
 *   <AnimatedLogo className="w-24 md:w-32" />
 */

import { useLayoutEffect, useRef, useId } from "react";
import gsap from "gsap";
import { createLogoAnimation, setLogoStatic } from "./animation";
import {
  VIEWBOX,
  CAPSULE,
  FULL_LOGO,
  SPARKLE,
  LOGO_PURPLE,
  LOGO_CREAM,
} from "./logo-paths";

interface AnimatedLogoProps {
  /** Tailwind / CSS classes for sizing, e.g. "w-24 md:w-32" */
  className?: string;
  /** Accessible name (defaults to the pharmacy name) */
  label?: string;
}

export default function AnimatedLogo({
  className,
  label = "صيدلية سما السكر — Sama Pharmacy",
}: AnimatedLogoProps) {
  const rootRef = useRef<SVGSVGElement>(null);
  // Unique ids so several logos can live on one page without
  // their gradients / filters / clip-paths colliding.
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");
  const id = (name: string) => `sama-logo-${uid}-${name}`;

  useLayoutEffect(() => {
    if (!rootRef.current) return;

    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(rootRef.current);
      const mm = gsap.matchMedia();

      // Full experience
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const controls = createLogoAnimation(q);
        controls.intro.play();
        return () => controls.kill();
      });

      // Accessibility: static finished logo, zero motion
      mm.add("(prefers-reduced-motion: reduce)", () => {
        setLogoStatic(q);
      });

      return () => mm.revert();
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <svg
      ref={rootRef}
      viewBox={VIEWBOX}
      role="img"
      aria-label={label}
      className={className}
      style={{ willChange: "transform", display: "block" }}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* Clip: everything decorative stays inside the capsule */}
        <clipPath id={id("capsule")}>
          <path d={CAPSULE} />
        </clipPath>

        {/* Clip: hair region only (left of the face profile, inset
            from the capsule ring so the ring itself never moves) */}
        <clipPath id={id("hair")}>
          <rect x="38" y="104" width="122" height="288" rx="24" />
        </clipPath>

        {/* Hair breeze: gentle fractal-noise displacement.
            scale is animated 0 → 2.6 → 0 by GSAP. */}
        <filter
          id={id("breeze")}
          x="-8%"
          y="-8%"
          width="116%"
          height="116%"
          colorInterpolationFilters="sRGB"
        >
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.012 0.02"
            numOctaves="2"
            seed="7"
            result="noise"
          />
          <feDisplacementMap
            data-logo-disp
            in="SourceGraphic"
            in2="noise"
            scale="0"
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>

        {/* Lavender shimmer band (drifts through the hair) */}
        <linearGradient id={id("shimmer")} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#C9A7DC" stopOpacity="0" />
          <stop offset="0.5" stopColor="#C9A7DC" stopOpacity="0.35" />
          <stop offset="1" stopColor="#C9A7DC" stopOpacity="0" />
        </linearGradient>

        {/* Luxury light sweep band */}
        <linearGradient id={id("sweep")} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#FFFFFF" stopOpacity="0" />
          <stop offset="0.5" stopColor="#FFFFFF" stopOpacity="0.28" />
          <stop offset="1" stopColor="#FFFFFF" stopOpacity="0" />
        </linearGradient>

        {/* Soft glow for the sparkle twinkle */}
        <filter id={id("glow")} x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="3.5" />
        </filter>
      </defs>

      {/* Float wrapper — ±3px vertical drift, GPU transform only */}
      <g data-logo-float>
        {/* ── The artwork (fades in during the intro) ── */}
        <g data-logo-art>
          {/* Cream base: capsule silhouette (shows through the holes) */}
          <path d={CAPSULE} fill={LOGO_CREAM} />

          {/* Purple artwork: capsule + hair with the cream areas
              (arc, face, sparkle) cut out via evenodd */}
          <path d={FULL_LOGO} fill={LOGO_PURPLE} fillRule="evenodd" />

          {/* Breeze layer: identical copy, clipped to the hair region
              and displaced ≤2.6px. Solid areas hide the seam; only
              the hair edges appear to move. The face and the capsule
              ring sit outside the clip and never move. */}
          <g clipPath={`url(#${id("hair")})`} filter={`url(#${id("breeze")})`}>
            <path d={CAPSULE} fill={LOGO_CREAM} />
            <path d={FULL_LOGO} fill={LOGO_PURPLE} fillRule="evenodd" />
          </g>

          {/* Decorative bands, strictly inside the capsule */}
          <g clipPath={`url(#${id("capsule")})`}>
            {/* Lavender shimmer through the hair only */}
            <g clipPath={`url(#${id("hair")})`}>
              <rect
                data-logo-shimmer
                x="0"
                y="0"
                width="300"
                height="425"
                fill={`url(#${id("shimmer")})`}
              />
            </g>
            {/* Light sweep across the whole logo, skewed like a
                pane of studio light */}
            <g transform="skewX(-16)">
              <rect
                data-logo-sweep
                x="40"
                y="-40"
                width="220"
                height="520"
                fill={`url(#${id("sweep")})`}
              />
            </g>
          </g>

          {/* Sparkle twinkle: duplicate of the original sparkle path,
              pure opacity glow — no scale, no rotation */}
          <path
            data-logo-sparkle
            d={SPARKLE}
            fill="#FFF8FC"
            filter={`url(#${id("glow")})`}
            opacity="0"
          />
        </g>

        {/* ── Intro construction stroke (draws on, then dissolves) ──
            pathLength=1 normalises the dash so GSAP can animate
            strokeDashoffset 1 → 0 as a clean 0→100% draw. */}
        <path
          data-logo-stroke
          d={CAPSULE}
          fill="none"
          stroke={LOGO_PURPLE}
          strokeWidth="4"
          strokeLinecap="round"
          pathLength={1}
          strokeDasharray="1"
          strokeDashoffset="1"
        />
      </g>
    </svg>
  );
}
