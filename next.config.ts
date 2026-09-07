import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  async redirects() {
    return [
      {
        source: "/",
        destination: "/map",
        permanent: true,
      },
      // The blog used to live at /news. Keep the old paths working for search
      // engines and anyone who bookmarked a post.
      {
        source: "/news",
        destination: "/blog",
        permanent: true,
      },
      {
        source: "/news/:slug",
        destination: "/blog/:slug",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
