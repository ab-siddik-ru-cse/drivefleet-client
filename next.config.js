/**
 * Reverse proxy /api/* to drivefleet-server.
 *
 * Why? Browser sees ALL requests going to OUR domain (drivefleet-client-phi.vercel.app),
 * so cookies set by Better Auth are first-party cookies, not cross-origin.
 * Cookies work naturally, no SameSite=None hacks, no localStorage tokens.
 *
 * Set the API_URL env var to your Express server's URL.
 * Locally: API_URL=http://localhost:5000
 * In production: API_URL=https://drivefleet-server-eight.vercel.app
 */
const API_URL = process.env.API_URL || "http://localhost:5000";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true,
    remotePatterns: [{ protocol: "https", hostname: "**" }],
  },

  async rewrites() {
    return [
      {
        // Anything the browser sends to /api/* gets forwarded to the
        // Express server. The browser never knows — it's seamless.
        source: "/api/:path*",
        destination: `${API_URL}/api/:path*`,
      },
    ];
  },
};

module.exports = nextConfig;
