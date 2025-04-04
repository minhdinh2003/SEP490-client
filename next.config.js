/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["localhost", "cms.anycar.vn"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
        port: "",
      },
    ],
  },
};

module.exports = nextConfig;
