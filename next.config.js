module.exports = {
  images: {
    domains: ['avatars.githubusercontent.com'],
  },
  reactStrictMode: true,
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/u,
      loader: '@svgr/webpack',
      options: {
        // Adds types to generated JS
        typescript: true,
        // Removes width and height from the SVG so that dimensions can be
        // specified using CSS
        dimensions: false,
      },
    });

    return config;
  },
};
