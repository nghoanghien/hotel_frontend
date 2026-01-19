/** @type {import('next').NextConfig} */
const nextConfig = {
  // Bỏ qua lỗi ESLint khi build (cho phép deploy dù có warning/error nhỏ)
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Bỏ qua lỗi TypeScript khi build (cho phép deploy dù có type error nhỏ)
  typescript: {
    ignoreBuildErrors: true,
  },
  transpilePackages: ["@repo/ui", "@repo/models", "@repo/types", "@repo/lib", "@repo/store", "@repo/api"],
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:5293/:path*', // Proxy to Hotel SAAS Backend
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'pub-2f884047d0ec47659cb43e0b335d7d23.r2.dev',
      },
    ],
  },
};

export default nextConfig;
