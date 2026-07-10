"use client";

/**
 * BrandQr — QR code rendered as SVG in the pharmacy's visual
 * identity: purple rounded modules, rounded finder "eyes" and the
 * logo in the center (error-correction level H tolerates the
 * covered area).
 *
 * Requires: npm install qrcode && npm install -D @types/qrcode
 */

import { useMemo } from "react";
import QRCode from "qrcode";
import { LOGO_PURPLE } from "@/components/logo/logo-paths";

interface BrandQrProps {
  /** Text / URL to encode */
  value: string;
  /** Rendered size in px (SVG scales losslessly for print) */
  size?: number;
  className?: string;
  /** Show the pharmacy logo in the center (default true) */
  withLogo?: boolean;
}

/** Quiet-zone padding in modules */
const PAD = 2;

export default function BrandQr({
  value,
  size = 160,
  className,
  withLogo = true,
}: BrandQrProps) {
  const qr = useMemo(() => {
    try {
      return QRCode.create(value, { errorCorrectionLevel: "H" });
    } catch {
      return null;
    }
  }, [value]);

  if (!qr) return null;

  const n = qr.modules.size;
  const data = qr.modules.data;
  const total = n + PAD * 2;

  const isFinderArea = (r: number, c: number) =>
    (r < 7 && c < 7) || (r < 7 && c >= n - 7) || (r >= n - 7 && c < 7);

  // Central area reserved for the logo (skip its modules)
  const logoModules = withLogo ? Math.floor(n * 0.3) : 0;
  const logoStart = Math.floor((n - logoModules) / 2);
  const inLogoArea = (r: number, c: number) =>
    withLogo &&
    r >= logoStart &&
    r < logoStart + logoModules &&
    c >= logoStart &&
    c < logoStart + logoModules;

  // Collect data modules
  const dots: { r: number; c: number }[] = [];
  for (let r = 0; r < n; r++) {
    for (let c = 0; c < n; c++) {
      if (!data[r * n + c]) continue;
      if (isFinderArea(r, c) || inLogoArea(r, c)) continue;
      dots.push({ r, c });
    }
  }

  /** One rounded finder eye at module position (x, y) */
  const Eye = ({ x, y }: { x: number; y: number }) => (
    <g>
      <rect x={x} y={y} width={7} height={7} rx={2.4} fill={LOGO_PURPLE} />
      <rect x={x + 1} y={y + 1} width={5} height={5} rx={1.7} fill="#ffffff" />
      <rect x={x + 2} y={y + 2} width={3} height={3} rx={1.1} fill={LOGO_PURPLE} />
    </g>
  );

  const logoBox = logoModules + 0.8;
  const logoBoxStart = (total - logoBox) / 2;

  return (
    <svg
      viewBox={`0 0 ${total} ${total}`}
      width={size}
      height={size}
      className={className}
      role="img"
      aria-label={`رمز QR — ${value}`}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Quiet zone / background */}
      <rect width={total} height={total} rx={3} fill="#ffffff" />

      <g transform={`translate(${PAD} ${PAD})`}>
        {/* Data modules — softly rounded, brand purple */}
        {dots.map(({ r, c }) => (
          <rect
            key={`${r}-${c}`}
            x={c + 0.03}
            y={r + 0.03}
            width={0.94}
            height={0.94}
            rx={0.28}
            fill={LOGO_PURPLE}
          />
        ))}

        {/* Finder eyes */}
        <Eye x={0} y={0} />
        <Eye x={n - 7} y={0} />
        <Eye x={0} y={n - 7} />
      </g>

      {/* Center logo on a white rounded plate */}
      {withLogo && (
        <>
          <rect
            x={logoBoxStart}
            y={logoBoxStart}
            width={logoBox}
            height={logoBox}
            rx={1.4}
            fill="#ffffff"
          />
          <image
            href="/logo.png"
            x={logoBoxStart + 0.5}
            y={logoBoxStart + 0.5}
            width={logoBox - 1}
            height={logoBox - 1}
            preserveAspectRatio="xMidYMid meet"
          />
        </>
      )}
    </svg>
  );
}
