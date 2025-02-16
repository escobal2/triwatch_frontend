/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // Enables static export
  images: {
    unoptimized: true, // Disables the Image Optimization API
  }, // <-- Corrected closing bracket placement
  trailingSlash: true, // Add trailing slashes for better static compatibility
  env: {
    TZ: 'Asia/Manila',
  },
};

export default nextConfig;
