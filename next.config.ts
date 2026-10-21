import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: __dirname,
  },
  // Dev only: lets a phone on the same Wi-Fi load the dev server by LAN IP.
  allowedDevOrigins: ["192.168.1.19"],
};

export default nextConfig;
