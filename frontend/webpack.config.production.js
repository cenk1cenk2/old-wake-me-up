const TerserPlugin = require('terser-webpack-plugin')
const { merge } = require('webpack-merge')

const common = require('./webpack.config.common.js')

module.exports = merge(common, {
  mode: 'production',
  optimization: {
    minimizer: [ new TerserPlugin() ],
    splitChunks: {
      chunks: 'all',
      maxSize: '50k'
    }
  }
})