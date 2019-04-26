const path = require('path');
let phaser = path.join(__dirname, '../../node_modules/phaser/dist/phaser.js');

module.exports = {
  entry: '../../public/scripts/client/index.js',
  output: {
    path: path.resolve(__dirname, '../../public'),
    filename: 'bundle.js',
  },
  module: {
    rules: [
      { test: /\.ts$/, loader: 'ts-loader', exclude: [path.resolve(__dirname, "/node_modules")] , options: {configFile: path.resolve(__dirname, "tsconfig.json")}},
      { test: /phaser\.js$/, loader: 'expose-loader?Phaser' }
    ]
  },
  devServer: {
    contentBase: path.resolve(__dirname, './'),
    publicPath: '../../',
    host: '127.0.0.1',
    port: 3000,
    open: true
  },
  resolve: {
    extensions: ['.ts', '.js'],
    alias: {
      phaser: phaser
    }
  }
};
