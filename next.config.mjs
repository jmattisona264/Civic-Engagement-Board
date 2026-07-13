/** @type {import('next').NextConfig} */
const nextConfig = {
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
  
  allowedDevOrigins: ['192.168.1.195'], 
};

export default nextConfig;