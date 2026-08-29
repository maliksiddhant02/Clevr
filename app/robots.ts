import type { MetadataRoute } from "next";

// Disallow everything except /landing.
// This is what actually stops app URLs appearing in search results.
// A robots.txt is not a security control; the dev door (proxy.ts) is.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/landing",
        disallow: "/",
      },
    ],
  };
}
