const path = require('path');
const webpack = require('webpack');

module.exports = {
  entry: './src/script1.js',
  mode: 'development',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'main.js',
  },
  module: {
    rules: [
      { test: /\.css/i, use: ['style-loader', 'css-loader']},
      { test: /\.(jpg|jpeg|png|svg|gif|ico)/i, type: 'asset/resource' },
      { test: /\.(woff|woff2|eot|ttf|otf)/i, type: 'asset/resource' }
    ]
  },
  plugins: [
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery'
    }),
  ]
}
