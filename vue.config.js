//chainWebpack: config => {        // 修复HMR
//  config.resolve.symlinks(true);
//};
//devServer: {
//	disableHostCheck: true; // 禁用webpack热重载检查 解决热更新失效问题
//};
//
//
//const webpack = require('webpack')
//const CompressionWebpackPlugin = require('compression-webpack-plugin')
//const productionGzipExtensions = ['js', 'css']
//const isProduction = process.env.NODE_ENV === 'production'
//
//configureWebpack: {
//  plugins: [
//    // Ignore all locale files of moment.js
//    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
////    new UglifyJsPlugin({
////      uglifyOptions: {
////        compress: {
////          drop_debugger: true,
////          drop_console: true
////        }
////      },
////      sourceMap: false,
////      parallel: true
////    }),
//    // 配置compression-webpack-plugin压缩
//    new CompressionWebpackPlugin({
//      algorithm: 'gzip',
//      test: new RegExp('\\.(' + productionGzipExtensions.join('|') + ')$'),
//      threshold: 10240,
//      minRatio: 0.8
//    })
//  ]
//}