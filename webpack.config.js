const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
  // context: path.resolve(__dirname, 'src'),
  mode: process.env.NODE_ENV || 'development',
  entry: {
    main: './src/index.js',
  },
  // entry: ['webpack/hot/dev-server', './src/index.js'],
  output: {
    path: path.resolve(__dirname, 'dist/'),
    filename: '[name].[contenthash].js',
  },
  devtool: 'inline-source-map',
  watchOptions: {
    poll: true,
    ignored: /node_modules/,
  },
  devServer: {
    historyApiFallback: true,
    contentBase: path.resolve(__dirname, './src'),
    // contentBase: path.resolve(__dirname, './dist/'),
    watchContentBase: true,
    open: true,
    compress: true,
    hot: true,
    port: 4300,
    inline: true,
    watchOptions: {
      poll: true,
      ignored: /node_modules/,
    },
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.s[ac]ss$/i,
        use: ['style-loader', 'css-loader', 'sass-loader'],
      },
      // {
      //   test: /\.js$/,
      //   exclude: /node_modules/,
      //   use: {
      //     loader: 'babel-loader',
      //   },
      // },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'RSS reader',
      favicon: './src/images/favicon.png',
      template: 'index.html',
    }),
    new CleanWebpackPlugin(),
    // new HotModuleReplacementPlugin(),
  ],
};
