const webpack = require('webpack'); // to access built-in plugins

const path = require('path');
const publicDir = path.join(__dirname, 'public');
const distDir = path.join(__dirname, 'dist');

const CopyPlugin = require('copy-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const WebpackModules = require('webpack-modules');
const CompressionPlugin = require('compression-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const widgetConfig = require('./widget.config.json');
const pkg = require('./package.json');

const defaultConfig = {
  mode: 'development',
  devServer: {
    contentBase: publicDir,
    port: 9000
  },
  plugins: [
    new webpack.ProgressPlugin(),
    new WebpackModules(),
    new CleanWebpackPlugin({ protectWebpackAssets: false }),
    new CopyPlugin([{ from: 'public', to: '.' }]),
    new CompressionPlugin()
  ],
  module: {
    rules: [
      {
        test: /\.ts(x?)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'ts-loader'
          }
        ]
      },
      {
        enforce: 'pre',
        test: /\.js$/,
        loader: 'source-map-loader'
      }
    ]
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
    alias: {
      react: 'preact/compat',
      'react-dom': 'preact/compat'
    }
  }
};

module.exports = [
  {
    ...defaultConfig,
    optimization: {
      minimizer: [new UglifyJsPlugin()]
    },
    entry: {
      'op-widget': './src/entry.tsx'
    },
    output: {
      path: distDir,
      publicPath: '/',
      filename: '[name]-v2.js',
      library: `${widgetConfig.widgetName}`,
      libraryExport: 'default',
      libraryTarget: 'window'
    }
  }
];
