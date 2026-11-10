import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  images: {
    // Docs screenshots live in the `doc-media` storage bucket of the Forge
    // Supabase project (see src/lib/docMedia.ts).
    remotePatterns: [
      {
        protocol: "https",
        hostname: "daquiwsaqffoxtqijwzo.supabase.co",
        pathname: "/storage/v1/object/public/doc-media/**",
      },
    ],
  },
};

export default nextConfig;
