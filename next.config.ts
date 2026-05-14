import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  
  // Increase the body size limit for Server Actions to allow image uploads
  // Default is 1MB, we are increasing it to 10MB
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },
};

export default nextConfig;