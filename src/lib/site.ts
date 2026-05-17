/** Published contact, domain, and headquarters — single source of truth. */
export const SITE = {
  name: "Bank Repossessed Cars",
  domain: "bankreposessedcars.com",
  url: "https://bankreposessedcars.com",
  phone: {
    display: "+1 (409) 655-8072",
    href: "tel:+14096558072",
  },
  email: "bankrepossessedcars@gmail.com",
  headquarters: {
    label: "Headquarters",
    city: "Houston",
    state: "Texas",
    short: "Houston, TX",
    full: "Houston, Texas, United States",
    addressLines: ["Houston, Texas", "United States"],
    mapSearchUrl:
      "https://www.google.com/maps/search/?api=1&query=Houston+Texas",
  },
  /** Default when a listing has no location field */
  listingLocationDefault: "Houston, TX",
  hours: {
    weekdayLabel: "Mon–Fri",
    weekday: "8am–6pm",
    saturdayLabel: "Sat",
    saturday: "9am–4pm",
    sundayNote: "Sun: Closed",
  },
} as const;

export const SITE_METADATA = {
  title: "Bank Repossessed Cars — Save on Repo Inventory",
  description:
    "Browse bank- and lender-repossessed vehicles at transparent pricing. Verified listings and a straightforward buying experience.",
} as const;
