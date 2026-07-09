/**
 * animation.ts
 * ─────────────────────────────────────────────────────────────────
 * GSAP timeline factory for the Sama Pharmacy animated logo.
 *
 * Motion language: Apple / Dior Beauty / Aesop — slow sine and
 * power easings, opacity + transform only (GPU-composited),
 * no bouncing, no scaling of the artwork, no rotation.
 *
 * Two phases:
 *  1. INTRO  (plays once, ~2.8s)
 *     capsule outline draws on → artwork fades in → outline
 *     dissolves into the filled artwork.
 *  2. AMBIENT (6s, loops forever)
 *     hair breeze → lavender shimmer through the hair →
 *     sparkle twinkles once → luxury light sweep.
 *     A continuous ±3px float runs underneath (6s period).
 *
 * All targets are looked up with a scoped selector (GSAP context),
 * so multiple logos can coexist on one page.
 */

import gsap from "gsap";

/** Scoped selector returned by gsap.utils.selector(rootEl) */
export type LogoSelector = (sel: string) => Element[];

export interface LogoAnimationControls {
  intro: gsap.core.Timeline;
  ambient: gsap.core.Timeline;
  float: gsap.core.Tween;
  kill: () => void;
}

/**
 * Build every tween for the logo. Call once on mount
 * (inside gsap.context) and `kill()` on unmount.
 */
export function createLogoAnimation(q: LogoSelector): LogoAnimationControls {
  const stroke = q("[data-logo-stroke]");
  const art = q("[data-logo-art]");
  const disp = q("[data-logo-disp]"); // feDisplacementMap (hair breeze)
  const shimmer = q("[data-logo-shimmer]");
  const sweep = q("[data-logo-sweep]");
  const sparkle = q("[data-logo-sparkle]");
  const float = q("[data-logo-float]");

  /* ───────────────────────── initial state ─────────────────────
   * Set via GSAP (not CSS) so a reduced-motion variant can simply
   * skip this call and show the finished logo.                    */
  gsap.set(stroke, { strokeDashoffset: 1, opacity: 1 });
  gsap.set(art, { opacity: 0 });
  gsap.set(sparkle, { opacity: 0 });
  gsap.set(shimmer, { x: -340 });
  gsap.set(sweep, { x: -420 });

  /* ───────────────────────── 1 · INTRO ───────────────────────── */
  const intro = gsap.timeline({ paused: true, defaults: { force3D: true } });

  // 1a. Capsule outline draws on smoothly (pathLength-normalised
  //     dash, so strokeDashoffset 1 → 0 = 0% → 100% drawn).
  intro.to(stroke, {
    strokeDashoffset: 0,
    duration: 1.6,
    ease: "power2.inOut",
  });

  // 1b. The full artwork (purple + cream fills) breathes in while
  //     the outline finishes — a quiet cross-fade, no movement.
  intro.to(art, { opacity: 1, duration: 1.0, ease: "sine.inOut" }, 1.15);

  // 1c. The construction stroke dissolves into the filled logo.
  intro.to(stroke, { opacity: 0, duration: 0.6, ease: "sine.out" }, 1.9);

  /* ──────────────────────── 2 · AMBIENT (6s loop) ──────────────── */
  const ambient = gsap.timeline({
    paused: true,
    repeat: -1,
    defaults: { force3D: true },
  });

  // 2a. Hair breeze — a fractal-noise displacement, applied only to
  //     a clipped copy of the hair region, swells 0 → 2.6px → 0.
  //     Sub-3px amplitude reads as silk in a draft, never distortion.
  ambient
    .to(disp, { attr: { scale: 2.6 }, duration: 3, ease: "sine.inOut" }, 0)
    .to(disp, { attr: { scale: 0 }, duration: 3, ease: "sine.inOut" }, 3);

  // 2b. Lavender shimmer — a soft gradient band drifts through the
  //     hair mass (clipped to the hair only) while the breeze peaks.
  ambient.to(
    shimmer,
    { x: 340, duration: 2.4, ease: "power1.inOut" },
    0.7
  );

  // 2c. Sparkle twinkles once — pure opacity glow on a duplicate of
  //     the original sparkle path. No scale, no rotation.
  ambient
    .to(sparkle, { opacity: 0.95, duration: 0.4, ease: "sine.out" }, 2.7)
    .to(sparkle, { opacity: 0, duration: 0.7, ease: "sine.in" }, 3.1);

  // 2d. Luxury light sweep — a skewed white gradient crosses the
  //     capsule once per loop, clipped to the capsule contour.
  ambient.to(sweep, { x: 420, duration: 1.25, ease: "power2.inOut" }, 4.1);

  // Reset sweep/shimmer instantly (invisible off-canvas) for the next pass.
  ambient.set(shimmer, { x: -340 }, 5.9);
  ambient.set(sweep, { x: -420 }, 5.9);

  /* ─────────────────────── 3 · FLOAT (continuous) ──────────────
   * The whole logo drifts ±3px on a 6s sine — transform-only,
   * GPU-composited, imperceptible but alive.                     */
  const floatTween = gsap.to(float, {
    y: 3,
    duration: 3,
    ease: "sine.inOut",
    yoyo: true,
    repeat: -1,
    paused: true,
    force3D: true,
  });
  gsap.set(float, { y: -3 });

  // Chain: intro → ambient + float
  intro.eventCallback("onComplete", () => {
    ambient.play();
    floatTween.play();
  });

  return {
    intro,
    ambient,
    float: floatTween,
    kill: () => {
      intro.kill();
      ambient.kill();
      floatTween.kill();
    },
  };
}

/**
 * Reduced-motion variant: show the finished logo, no animation.
 */
export function setLogoStatic(q: LogoSelector): void {
  gsap.set(q("[data-logo-art]"), { opacity: 1 });
  gsap.set(q("[data-logo-stroke]"), { opacity: 0 });
  gsap.set(q("[data-logo-sparkle]"), { opacity: 0 });
  gsap.set(q("[data-logo-float]"), { y: 0 });
}
