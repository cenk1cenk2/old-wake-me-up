const path = require('path')
const { merge } = require('webpack-merge')

const common = require('./webpack.config.common.js')

module.exports = merge(common, {
  mode: 'development',
  devtool: 'source-map',
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    historyApiFallback: true,
    host: '0.0.0.0',
    port: 8080,
    writeToDisk: true
  }
})
