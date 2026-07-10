"use client";

import { useEffect, useState } from "react";
import BrandQr from "@/components/qr-code";

/**
 * QR that encodes the /social page of the current domain.
 * The origin is only known in the browser, so we render after mount.
 */
export default function SocialQr({ size = 200 }: { size?: number }) {
  const [url, setUrl] = useState<string | null>(null);

  useEffect(() => {
    setUrl(`${window.location.origin}/social`);
  }, []);

  if (!url) {
    return (
      <div
        style={{ width: size, height: size }}
        className="animate-pulse rounded-2xl bg-brand-purple-50"
      />
    );
  }

  return <BrandQr value={url} size={size} />;
}
