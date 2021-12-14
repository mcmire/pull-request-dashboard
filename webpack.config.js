const path = require('path');
// const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { WebpackManifestPlugin } = require('webpack-manifest-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  mode: 'development',
  devtool: 'cheap-module-source-map',
  entry: './src/index.tsx',
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.css'],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/u,
        loader: 'ts-loader',
        exclude: /node_modules/u,
        options: {
          // disable type checker - we will use it in fork plugin
          transpileOnly: true,
        },
      },
      {
        test: /\.css$/iu,
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
        exclude: /node_modules/u,
      },
    ],
  },
  output: {
    filename: 'js/[name]-[contenthash].js',
    chunkFilename: 'js/[name]-[contenthash].chunk.js',
    // hotUpdateChunkFilename: 'js/[id]-[contenthash].hot-update.js',
    path: path.resolve(__dirname, 'dist'),
    // publicPath: "/",
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
    new ForkTsCheckerWebpackPlugin(),
    new MiniCssExtractPlugin(),
    // new webpack.HotModuleReplacementPlugin(),
  ],
  /*
  optimization: {
    removeAvailableModules: false,
    removeEmptyChunks: false,
    splitChunks: false,
  },
  */
  devServer: {
    // contentBase: './dist',
    // TODO: Implement React Fast Refresh
    hot: true,
    // injectClient: true,
    client: {
      overlay: true,
    },
    compress: true,
  },
};
