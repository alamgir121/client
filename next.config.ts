import type { NextConfig } from "next";

const API =
  (process.env.NEXT_PUBLIC_API_URL || "https://helping-hands-server-tau.vercel.app").replace(/\/+$/, "");

const nextConfig: NextConfig = {
  reactStrictMode: true,
 
  async rewrites() {
    return [{ source: "/backend/:path*", destination: `${API}/:path*` }];
  },
};

export default nextConfig;