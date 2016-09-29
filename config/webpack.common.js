require('dotenv').config({silent: true}); // get local environment variables from .env

const path = require('path');
const webpack = require('webpack');
const autoprefixer = require('autoprefixer');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const pkg = require('../package.json');

const sassLoaders = [
  'css-loader?-url',
  'postcss-loader',
  'sass-loader?includePaths[]=' + path.resolve(__dirname, './src'),
];

module.exports = {
  context: './src/',
  entry: {
    app: './main.js',
    vendor: './vendor.js',
  },
  output: {
    path: 'dist/main',
    filename: '[name].js', // Notice we use a variable
  },
  resolve: {
    root: [
      path.resolve('./dist/_build'),
      path.resolve('./dist/_build/vendor'),
      path.resolve('./src/'),
      path.resolve('./src/common/vendor'),
    ],
    alias: {
      app: 'app',
      config: 'common/config',
      helpers: 'common/helpers/main',

      // vendor
      jquery: 'jquery/js/jquery',
      lodash: 'lodash/js/lodash',
      fastclick: 'fastclick/js/fastclick',
      typeahead: 'typeahead.js/js/typeahead.jquery',
      bootstrap: 'bootstrap/js/bootstrap',
      ratchet: 'ratchet/js/ratchet',
      indexedDBShim: 'IndexedDBShim/js/IndexedDBShim',
      hammer: 'hammerjs/js/hammer',
      underscore: 'lodash/js/lodash',
      backbone: 'backbone/js/backbone',
      'backbone.localStorage': 'backbone.localStorage/js/backbone.localStorage',
      'backbone.radio': 'backbone.radio/js/backbone.radio',
      marionette: 'marionette/js/backbone.marionette',
      morel: 'morel/js/morel',
      touchswipe: 'touchswipe/js/jquery.touchSwipe.min',
      leaflet: 'leaflet/js/leaflet',
      OSOpenSpace: 'os-leaflet/js/OSOpenSpace',
      'Leaflet.GridRef': 'leaflet.gridref/js/L.GridRef',
      proj4: 'proj4/js/proj4',
      proj4leaflet: 'proj4Leaflet/js/proj4leaflet',
      LatLon: 'latlon/js/latlon-ellipsoidal',
      OsGridRef: 'latlon/js/osgridref',
      'latlon-ellipsoidal': 'latlon/js/latlon-ellipsoidal',
      'photoswipe-lib': 'photoswipe/js/photoswipe',
      'photoswipe-ui-default': 'photoswipe/js/photoswipe-ui-default',
},
  },
  module: {
    loaders: [
      {
        test: /^((?!data\.).)*\.js$/,
        exclude: /(node_modules|bower_components|vendor(?!\.js))/,
        loader: 'babel-loader',
      },
      { test: /\.json/, loader: 'json' },
      { test: /(\.png)|(\.svg)|(\.jpg)/, loader: 'file?name=images/[name].[ext]' },
      {
        test: /\.s?css$/,
        loader: ExtractTextPlugin.extract('style-loader', sassLoaders.join('!'))
      },
    ],
  },
  plugins: [
    new ExtractTextPlugin('[name].css'),
    new webpack.optimize.CommonsChunkPlugin({
      name: ['app', 'vendor'],
    }),
    new HtmlWebpackPlugin({
      template: 'index.html',
    }),
    new webpack.DefinePlugin({
      APP_BUILD: JSON.stringify(process.env.TRAVIS_BUILD_ID || new Date().getTime()),
      'APP_NAME': JSON.stringify(pkg.name),
      'APP_VERSION': JSON.stringify(pkg.version),
      REGISTER_URL: JSON.stringify(process.env.REGISTER_URL || ''),
      REPORT_URL: JSON.stringify(process.env.REPORT_URL || ''),
      RECORD_URL: JSON.stringify(process.env.RECORD_URL || ''),
      STATISTICS_URL: JSON.stringify(process.env.STATISTICS_URL || ''),
      API_SECRET: JSON.stringify(process.env.API_SECRET || ''),
      API_KEY: JSON.stringify(process.env.API_KEY || ''),
    }),
  ],
  postcss: [
    autoprefixer({
      browsers: ['last 2 versions'],
    }),
  ],
  stats: {
    children: false
  },
  cache: true,
};
