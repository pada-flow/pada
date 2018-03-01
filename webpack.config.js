const path = require('path');
const webpack = require('webpack');

module.exports = {
  devtool: 'inline-source-map',
  entry: {
    'pada': './src/bin/pada.ts',
    'pada-add': './src/bin/pada-add.ts',
    'pada-del': './src/bin/pada-del.ts',
    'pada-update': './src/bin/pada-update.ts',
    'pada-lang': './src/bin/pada-lang.ts',
    'pada-list': './src/bin/pada-list.ts',
    'sql': './src/utils/taskDB.ts' 
  },
  target: 'node',
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist/@pada')
  },
  node: {
    __dirname: false,
    __filename: true,
  },
  resolve: {
    // Add `.ts` and `.tsx` as a resolvable extension.
    extensions: ['.ts', '.tsx', '.js'],
    modules: ['node_modules'],
    alias: {
      utils: path.resolve(__dirname, 'src/utils')
    }
  },
  module: {
    rules: [
      // all files with a `.ts` or `.tsx` extension will be handled by `ts-loader`
      { test: /\.tsx?$/, loader: 'ts-loader' },
      {
        test: /\.ts$/,
        enforce: 'pre',
        loader: 'tslint-loader',
        options: { /* Loader options go here */ }
      }
    ]
  },
  plugins: [
    new webpack.BannerPlugin({ banner: '#!/usr/bin/env node', raw: true })
  ]
}