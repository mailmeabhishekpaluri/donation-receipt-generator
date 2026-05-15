/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    // @react-pdf/renderer uses canvas on the server; exclude it from server bundle
    config.externals = [...(config.externals || []), { canvas: "canvas" }];
    return config;
  },
};

export default nextConfig;
