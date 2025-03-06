/** @type {import('next').NextConfig} */
const nextConfig = {
    async rewrites() {
        return [
          {
            source: '/api/:path*',
            destination: `/:path*`
          },
          {
            source: '/images/:path*',
            destination: `/:path*`
          }
        ]
    },
    reactStrictMode: false,
    compiler: {
        // Enables the styled-components SWC transform
        styledComponents: true
    }
};

export default nextConfig;
