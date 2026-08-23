import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Crawlers only ever GET these, which the route handlers reject anyway.
      disallow: "/api/",
    },
  };
}
