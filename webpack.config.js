const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const webpack = require('webpack');

module.exports = {
  mode: 'development',
  entry: {
    app: './src/index.ts'
  },
  devtool: 'source-map', // Generate separate source map files
  output: {
    path: path.resolve(__dirname, './docs')
  },
  devServer: {
    contentBase: './docs',
    overlay: true // Show errors in overlay on the website
  },
  module: {
    rules: [
      {
        test: /\.(js|ts)$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      },
      {
        test: /\.html$/, // All Knockout.js component HTML templates
        use: 'html-loader' // Adds the component templates to the bundle
      },
      {
        test: /\.(s[ac]|c)ss$/i, // /\.(le|c)ss$/i если вы используете less
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'postcss-loader',
          'sass-loader',
        ],
      }, // Добавляем загрузчики стилей
      {
        test: /\.json$/,
        loader: 'json-loader'
      },
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './webpack-template/index.html',
      minify: false
    }),
    new MiniCssExtractPlugin({
      filename: '[name].[contenthash].css', // Формат имени файла
    }), // Добавляем в список плагинов
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
    }),
  ],
  resolve: {
    extensions: ['.js', '.ts']
  },
  stats: {
    children: true
  }
};
