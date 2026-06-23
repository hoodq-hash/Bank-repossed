"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { SITE } from "@/lib/site";
import type { SitePhone } from "@/lib/site-settings";

const SitePhoneContext = createContext<{
  phone: SitePhone;
  refreshPhone: () => Promise<void>;
}>({
  phone: { display: SITE.phone.display, href: SITE.phone.href },
  refreshPhone: async () => {},
});

export function SitePhoneProvider({ children }: { children: React.ReactNode }) {
  const [phone, setPhone] = useState<SitePhone>({
    display: SITE.phone.display,
    href: SITE.phone.href,
  });

  const refreshPhone = useCallback(async () => {
    try {
      const response = await fetch("/api/settings");
      if (!response.ok) return;
      const data = await response.json();
      if (data?.phone?.display && data?.phone?.href) {
        setPhone(data.phone);
      }
    } catch {
      // Keep fallback from SITE defaults
    }
  }, []);

  useEffect(() => {
    void refreshPhone();
  }, [refreshPhone]);

  return (
    <SitePhoneContext.Provider value={{ phone, refreshPhone }}>
      {children}
    </SitePhoneContext.Provider>
  );
}

export function useSitePhone() {
  return useContext(SitePhoneContext);
}
