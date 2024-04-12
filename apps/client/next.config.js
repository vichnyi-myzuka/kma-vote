/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  compress: true,
  env: {
    DOMAIN: process.env.DOMAIN,
  },
  trailingSlash: true,
  webpack: (config) => {
    config.module.rules.push({
      test: /\.(ts)x?$/,
      use: [
        {
          loader: 'ts-loader',
          options: {
            transpileOnly: true,
            experimentalWatchApi: true,
            onlyCompileBundledFiles: true,
          },
        },
      ],
    });

    return config;
  },
};

module.exports = nextConfig;
