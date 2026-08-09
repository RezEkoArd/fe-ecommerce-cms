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
    remotePatterns: [{
      protocol: "http",
      hostname: "localhost"
    }]
  }
};

// Browser → localhost:3000/api/products   (browser lihat: same-origin ✓)
//            ↓ Next.js meneruskan di server
//         localhost:8080/api/products


export default nextConfig;


