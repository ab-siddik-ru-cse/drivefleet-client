/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  unoptimized: true, // Opt out of Next.js's built-in image optimization since we're using external URLs
  images: { remotePatterns: [{ protocol: "https", hostname: "**" }] },
};

module.exports = nextConfig;
