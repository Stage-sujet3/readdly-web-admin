/** @type {import('next').NextConfig} */
const path = require("path");
const API_GATEWAY = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
const USER_SERVICE_URL = process.env.NEXT_PUBLIC_USER_SERVICE_URL || "http://localhost:3001";

const nextConfig = {
  turbopack: {
    root: __dirname,
    resolveAlias: {
      tailwindcss: path.resolve(__dirname, "node_modules/tailwindcss"),
    },
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${API_GATEWAY}/:path*`,
      },
      // Proxy uploaded files (CIN, verification photos) from user-service
      // This avoids CORS errors when loading images in the admin dashboard
      {
        source: "/uploads/:path*",
        destination: `${USER_SERVICE_URL}/uploads/:path*`,
      },
    ]
  },
};

module.exports = nextConfig;
