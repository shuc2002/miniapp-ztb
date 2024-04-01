/* eslint-disable no-undef */
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
// const path = require('path');

module.exports = {
  transpileDependencies: ['sass-loader', 'uview-ui'],
  // configureWebpack: {
  //   plugins: [new BundleAnalyzerPlugin()],
  //   resolve: {
  //     alias: {
  //       'regenerator-runtime': path.resolve(__dirname, 'node_modules/regenerator-runtime'),
  //     },
  //   },
  // },
};
