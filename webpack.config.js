const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { WebpackManifestPlugin } = require('webpack-manifest-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  mode: 'development',
  devtool: 'cheap-module-source-map',
  entry: './src/index.js',
  resolve: {
    extensions: ['.js', '.css'],
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
          // "style-loader",
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
    hot: true,
    client: {
      overlay: true,
    },
    compress: true,
  },
};
