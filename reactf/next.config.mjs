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
            destination: `http://images:88/:path*`
          }
        ]
    },
    reactStrictMode: false,
    compiler: {
        // Enables the styled-components SWC transform
        styledComponents: true
    },
    images: {
      domains: ['robohash.org'], // Make sure this domain is allowed
    },
};

export default nextConfig;
