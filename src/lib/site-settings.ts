import connectToDatabase from "@/lib/mongodb";
import { phoneToHref } from "@/lib/phone";
import { SITE } from "@/lib/site";
import SiteSettings from "@/models/SiteSettings";

const SETTINGS_KEY = "default";

export type SitePhone = {
  display: string;
  href: string;
};

export async function getSitePhone(): Promise<SitePhone> {
  try {
    await connectToDatabase();
    const doc = await SiteSettings.findOne({ key: SETTINGS_KEY }).lean<{
      phoneDisplay?: string;
      phoneHref?: string;
    } | null>();

    if (doc?.phoneDisplay && doc?.phoneHref) {
      return { display: doc.phoneDisplay, href: doc.phoneHref };
    }
  } catch (error) {
    console.error("Failed to load site phone:", error);
  }

  return { display: SITE.phone.display, href: SITE.phone.href };
}

export async function updateSitePhone(display: string): Promise<SitePhone> {
  const trimmed = display.trim();
  if (!trimmed) {
    throw new Error("Phone number is required");
  }

  const digits = trimmed.replace(/\D/g, "");
  if (digits.length < 10) {
    throw new Error("Enter a valid phone number");
  }

  const phone = {
    phoneDisplay: trimmed,
    phoneHref: phoneToHref(trimmed),
  };

  await connectToDatabase();
  const doc = await SiteSettings.findOneAndUpdate(
    { key: SETTINGS_KEY },
    phone,
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  return {
    display: doc.phoneDisplay,
    href: doc.phoneHref,
  };
}
