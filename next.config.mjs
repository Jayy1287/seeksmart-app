import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** @type {import('next').NextConfig} */
const nextConfig = {
  typedRoutes: true,
  devIndicators: false,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "www.google.com",
        pathname: "/s2/favicons"
      },
      {
        protocol: "https",
        hostname: "logotyp.us",
        pathname: "/file/*"
      }
    ]
  },
  outputFileTracingRoot: __dirname
};

export default nextConfig;
