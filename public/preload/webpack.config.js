const path = require('path')
const TerserPlugin = require('terser-webpack-plugin')
// 引入clean-webpack-plugin插件
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

module.exports = {
  target: 'electron-renderer',
  mode: 'production',
  entry: path.join(__dirname, './src/index.js'),
  output: {
    path: path.join(__dirname, './dist'),
    filename: 'index.js'
  },

  resolve: {
    // 不需要node polyfilss
    alias: {
      crypto: false
    }
  },

  plugins: [new CleanWebpackPlugin()],

  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        extractComments: false // 不将注释提取到单独的文件中
      })
    ]
  },

  module: {
    unknownContextCritical: false
  }
}
