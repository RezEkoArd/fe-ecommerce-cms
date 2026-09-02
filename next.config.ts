import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${process.env.BACKEND_URL ?? "http://localhost:8080"}/api/:path*`,
      },
    ];
  },
  images: {
    remotePatterns: [
      { protocol: "http", hostname: "localhost" },
      { protocol: "http", hostname: "rezekoard.web.id", port: "9000" },
      { protocol: "https", hostname: "storage.rezekoard.web.id" },

    ],
  },
  output: "standalone",
};



export default nextConfig;


