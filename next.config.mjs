/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    config.module.rules.push({
      test: /node-pre-gyp/,
      use: "ignore-loader",
    });
    return config;
  },
};

export default nextConfig;
