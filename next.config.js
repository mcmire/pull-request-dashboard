module.exports = {
  images: {
    domains: ['avatars.githubusercontent.com'],
  },
  reactStrictMode: true,
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/u,
      use: ['@svgr/webpack'],
    });

    return config;
  },
};
