const path = require('path')

module.exports = {
  target: 'electron-renderer',
  mode: 'production',
  entry: path.join(__dirname, './src/index.js'),
  output: {
    path: path.join(__dirname, './'),
    filename: 'index.js'
  },

  resolve: {
    // 不需要node polyfilss
    alias: {
      crypto: false
    }
  }
}
