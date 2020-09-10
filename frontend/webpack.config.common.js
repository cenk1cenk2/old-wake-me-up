const ForkTypeScriptCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const path = require('path')
const TypeScriptConfigPathsPlugin = require('tsconfig-paths-webpack-plugin')
const webpack = require('webpack')

module.exports = {
  entry: {
    application: path.resolve(__dirname, 'src/index.tsx')
  },
  output: {
    filename: 'assets/js/bundle.js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/'
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [ 'style-loader', 'css-loader' ]
      },
      {
        test: /\.(woff(2)?|ttf|eot)(\?v=\d+\.\d+\.\d+)?$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[hash:7].[ext]',
              outputPath: 'assets/fonts/'
            }
          }
        ]
      },
      {
        test: /\.(jpg|png)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              outputPath: 'assets/images/',
              name: '[identifier]_[hash:7].[ext]'
            }
          }
        ]
      },
      {
        test: /\.tsx?$/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              plugins: [
                [ '@babel/plugin-proposal-decorators', { legacy: true } ],
                [ '@babel/proposal-class-properties', { loose: false } ],
                '@babel/proposal-object-rest-spread',
                'babel-plugin-styled-components',
                '@babel/plugin-transform-typescript'
              ],
              presets: [
                '@babel/preset-react',
                '@babel/preset-typescript',
                [
                  '@babel/preset-env',
                  {
                    useBuiltIns: 'usage',
                    corejs: 3,
                    targets: 'ie 11, not dead, safari > 9'
                  }
                ]
              ]
            }
          }
        ]
      }
    ]
  },
  resolve: {
    extensions: [ '.ts', '.tsx', '.mjs', '.jsx', '.js', '.json' ],
    plugins: [ new TypeScriptConfigPathsPlugin() ]
  },
  plugins: [
    new ForkTypeScriptCheckerWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: 'public/index.html'
    }),
    new webpack.DefinePlugin({
      // 'process.env': getEnvVars('./env-vars.yml'),
    })
  ]
}
