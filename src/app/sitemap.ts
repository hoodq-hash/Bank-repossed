import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  const routes = [
    "",
    "/shop",
    "/about",
    "/contact",
    "/testimonials",
    "/compare",
    "/sell",
  ];

  return routes.map((path) => ({
    url: `${SITE.url}${path}`,
    lastModified,
    changeFrequency: path === "" || path === "/shop" ? "daily" : "weekly",
    priority: path === "" ? 1 : path === "/shop" ? 0.9 : 0.7,
  }));
}
