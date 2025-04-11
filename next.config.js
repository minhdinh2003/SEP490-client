/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    typedRoutes: true,
    turbo: {
      loaders: {
        // Bạn có thể thêm các loader tùy chỉnh ở đây nếu cần
      },
    },
  },
  images: {
    domains: ["localhost", "cms.anycar.vn"],
    remotePatterns: [
      { hostname: "tse3.mm.bing.net" },
      { hostname: "i.pinimg.com" },
      { hostname: "tse2.mm.bing.net" },
      { hostname: "doctruyentranh.net.vn" },
      { hostname: "firebasestorage.googleapis.com" },
      { hostname: "bid.modeltheme.com" },
      { hostname: "images.search.yahoo.com" },
      { hostname: "tse4.mm.bing.net" },
      {
        protocol: "https",
        hostname: "cdn.sanity.io"
      },
      {
        protocol: "https",
        hostname: "utfs.io"
      }
    ],
  },
  reactStrictMode: true,
  swcMinify: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  webpack: (config, { dev }) => {
    if (!dev) {
      // Chỉ cấu hình TerserPlugin nếu không phải là môi trường phát triển
      const TerserPlugin = require("terser-webpack-plugin");

      config.optimization.minimizer = [
        new TerserPlugin({
          terserOptions: {
            // Để bỏ qua lỗi Unicode, bạn có thể thử thêm tùy chọn này
            format: {
              comments: false, // Bỏ qua các bình luận
            },
            compress: {
              warnings: false, // Bỏ qua các cảnh báo
            },
          },
          extractComments: false, // Không trích xuất bình luận
        }),
      ];
    }

    return config;
  },
};

module.exports = nextConfig;
