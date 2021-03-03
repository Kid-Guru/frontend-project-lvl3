const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
// const { NormalModuleReplacementPlugin } = require('webpack');
// const { LoaderOptionsPlugin } = require('webpack');

module.exports = {
  // context: path.resolve(__dirname, 'src'),
  mode: process.env.NODE_ENV || 'development',
  entry: {
    main: './src/index.js',
  },
  output: {
    filename: '[name].[contenthash].js',
    path: path.resolve(__dirname, 'dist'),
  },
  watchOptions: {
    poll: true,
    ignored: /node_modules/,
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
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
      template: './src/template.html',
    }),
    new CleanWebpackPlugin(),
    // new NormalModuleReplacementPlugin(
    //   /yup\/lib\/locale\.js/,
    //   path.resolve(process.cwd(), './src/utils/validate.js'),
    // ),

  ],
};
