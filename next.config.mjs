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
                   "script-src 'self' 'unsafe-inline' 'unsafe-eval' api.mapbox.com https://www.google.com/recaptcha/ https://www.gstatic.com/recaptcha/ https://cdn.jsdelivr.net; " +  // ✅ Allow Tesseract.js
                   "frame-src 'self' https://www.google.com/recaptcha/; " +  
                   "worker-src 'self' blob: https://cdn.jsdelivr.net; " +  // ✅ Allow WebAssembly worker
                   "child-src 'self' blob:; " +   
                   "style-src 'self' 'unsafe-inline' fonts.googleapis.com; " +
                   "img-src 'self' data: blob: https://*; " +
                   "connect-src 'self' https://triwatch.site api.mapbox.com https://cdn.jsdelivr.net;", // ✅ Allow fetch requests to CDN
          },
        ],
      },
    ];
  }  
};

export default nextConfig;
