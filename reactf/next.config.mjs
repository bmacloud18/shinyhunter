/** @type {import('next').NextConfig} */
const nextConfig = {
    // async rewrites() {
    //     return [
    //       {
    //         source: '/api/:path*',
    //         destination: `${process.env.BACKEND_ADDRESS}/:path*`
    //       },
    //       {
    //         source: '/images/:path*',
    //         destination: `${process.env.IMAGES_ADDRESS}/:path*`
    //       }
    //     ]
    //   }
    reactStrictMode: false,
    compiler: {
        // Enables the styled-components SWC transform
        styledComponents: true
    }
};

export default nextConfig;
