const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const EncodingPlugin = require('webpack-encoding-plugin');

module.exports = {
  mode: 'development',
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'public/index.html', // specify your HTML template
    }),
    new EncodingPlugin({
      encoding: 'utf-8',
    }),
  ],
};
