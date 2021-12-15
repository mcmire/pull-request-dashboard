const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { WebpackManifestPlugin } = require('webpack-manifest-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  mode: 'development',
  devtool: 'cheap-module-source-map',
  entry: './src/index.js',
  resolve: {
    extensions: ['.js', '.jsx', '.css', '.jpg', '.png', '.gif', '.svg'],
  },
  module: {
    rules: [
      {
        test: /\.js$/u,
        exclude: /node_modules/u,
        use: {
          loader: 'babel-loader',
          options: {
            cacheDirectory: true,
          },
        },
      },
      {
        test: /\.css$/iu,
        exclude: /node_modules/u,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              sourceMap: true,
              importLoaders: 2,
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              sourceMap: true,
            },
          },
        ],
      },
      {
        test: /\.(png|jpg|gif)$/iu,
        type: 'asset/resource',
      },
      {
        test: /\.svg$/iu,
        loader: '@svgr/webpack',
        options: {
          // Adds types to generated JS
          typescript: true,
          // Removes width and height from the SVG so that dimensions can be
          // specified using CSS
          dimensions: false,
        },
      },
    ],
  },
  output: {
    filename: 'js/[name]-[contenthash].js',
    chunkFilename: 'js/[name]-[contenthash].chunk.js',
    path: path.resolve(__dirname, 'dist'),
    clean: true,
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Pull Request Dashboard',
      template: 'src/index.html',
    }),
    new WebpackManifestPlugin({
      filename: 'css/[name]-[contenthash:8].css',
      chunkFilename: 'css/[id]-[contenthash:8].css',
    }),
    new MiniCssExtractPlugin(),
  ],
  /*
  optimization: {
    removeAvailableModules: false,
    removeEmptyChunks: false,
    splitChunks: false,
  },
  */
  devServer: {
    // TODO: Implement React Fast Refresh
    // hot: 'only',
    client: {
      overlay: true,
    },
    compress: true,
  },
};
