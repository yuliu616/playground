const path = require('path');
const webpack = require('webpack');

module.exports = {
  configureWebpack: {
    // config belows will be merged to the webpack config object
    plugins: [
      new webpack.ProvidePlugin({
        $: 'jquery',
        jQuery: 'jquery'
      }),
    ]
  }
}