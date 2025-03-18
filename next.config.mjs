/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
  env: {
    TZ: "Asia/Manila",
  },
  experimental: {
    appDir: true, // Ensure Next.js uses the new App Router (if applicable)
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Content-Security-Policy",
            value: "default-src 'self' 'unsafe-inline' 'unsafe-eval';",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
