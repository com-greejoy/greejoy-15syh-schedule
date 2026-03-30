const path = require("path");

module.exports = {
  //输出目录，默认dist
  outputDir: 'dist',
  publicPath: process.env.NODE_ENV === "production" ? "/15cdsport/match/" : "/",
  devServer: {
    port: 8848,
    proxy: {
      [process.env.VUE_APP_BASE_API]: {
        target: 'http://1.95.11.97/15cdsport/back',
        changeOrigin: true,
        pathRewrite: {
          ['^' + process.env.VUE_APP_BASE_API]: ''
        }
      },
      '/profile' : {
        target: 'http://1.95.11.97/15cdsport/back',
        secure: false
      },
      '/api/game/sporter/slavePhoto' : {
        target: 'http://1.95.11.97/15cdsport/back',
        secure: false
      }
    }
  },
  configureWebpack: {
    resolve: {
      alias: {
        'comps': '@/components',
        'common': '@/common',
        'assets': '@/assets',
        'network': '@/network',
        'views': '@/views',
        'mock': '@/mock'
      }
    }
  },
  chainWebpack: config =>{
    config.plugin('html')
      .tap(args => {
        args[0].title = "成都市第十五届运动会 - 竞赛信息发布系统";
        return args;
      })
  },
  pluginOptions: {
    'style-resources-loader': {
      preProcessor: 'less',
      patterns: [
        path.resolve(__dirname, "src/assets/less/common.less"),
        path.resolve(__dirname, "src/assets/less/theme.less")
      ]
    }
  }
}
