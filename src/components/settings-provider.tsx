"use client";

import { createContext, useContext } from "react";
import { DEFAULT_SETTINGS, type SiteSettings } from "@/lib/settings";

const SettingsContext = createContext<SiteSettings>(DEFAULT_SETTINGS);

export function SettingsProvider({
  settings,
  children,
}: {
  settings: SiteSettings;
  children: React.ReactNode;
}) {
  return (
    <SettingsContext.Provider value={settings}>
      {children}
    </SettingsContext.Provider>
  );
}

/** Read site settings in any client component under the store layout. */
export function useSettings(): SiteSettings {
  return useContext(SettingsContext);
}
