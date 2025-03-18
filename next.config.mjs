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
    appDir: true,
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Content-Security-Policy",
            value: "default-src 'self'; " + 
                   "script-src 'self' 'unsafe-inline' 'unsafe-eval' api.mapbox.com; " +
                   "worker-src 'self' blob:; " +  // ✅ Allow Web Workers
                   "child-src 'self' blob:; " +   // ✅ Allow Web Workers in WebView
                   "style-src 'self' 'unsafe-inline' fonts.googleapis.com; " +
                   "img-src 'self' data: blob: https://*; " +
                   "connect-src 'self' https://triwatch.site api.mapbox.com;",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
