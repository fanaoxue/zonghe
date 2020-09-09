'use strict'
const path = require('path')
const fs = require('fs')
var defaultproxyTableObj = {
  proxy: { //默认为测试地址做代理
    '/api': {
      // 创建一个axios的对象
      target: "https://test-microservice.log56.com/luge",
      changeOrigin: true,
      pathRewrite: {
        '^/api': ''
      }
    }
  },
  host: '192.168.210.14'
};
var proxyTableObj = fs.existsSync('./config/dev_poxy.js') ? require('./dev_poxy') : defaultproxyTableObj;
module.exports = {
  dev: {
    // Paths
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
    proxyTable: proxyTableObj.proxy,
    host: proxyTableObj.host, // can be overwritten by process.env.HOST
    port: 8090,
    autoOpenBrowser: true,
    errorOverlay: true,
    notifyOnErrors: true,
    poll: false,
    useEslint: true,
    showEslintErrorsInOverlay: false,
    devtool: 'cheap-module-eval-source-map',
    cacheBusting: true,
    cssSourceMap: true
  },
  build: {
    // Template for index.html
    index: path.resolve(__dirname, '../ngcbapp_h5/dist/index.html'),
    // Paths
    assetsRoot: path.resolve(__dirname, '../ngcbapp_h5/dist'),
    assetsSubDirectory: 'static',
    assetsPublicPath: process.env.NODE_ENV === 'ktesting' || process.env.NODE_ENV === 'pre' ? '/ngcbapp_h5/dist/' : '//imgt.log56.com/ngcbapp_h5/dist/',
    productionSourceMap: process.env.NODE_ENV === 'ktesting' || process.env.NODE_ENV === 'pre',
    devtool: '#source-map',
    productionGzip: false,
    productionGzipExtensions: ['js', 'css'],
    bundleAnalyzerReport: process.env.npm_config_report
  }
}
