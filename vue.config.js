const path = require("path");

module.exports = {
  //输出目录，默认dist
  outputDir: 'dist',
  publicPath: process.env.NODE_ENV === "production" ? "/schedule/" : "/",
  devServer: {
    port: 8848,
    proxy: {
      [process.env.VUE_APP_BASE_API]: {
        target: 'http://localhost:8081',
        changeOrigin: true,
        pathRewrite: {
          ['^' + process.env.VUE_APP_BASE_API]: ''
        }
      },
      '/profile' : {
        target: 'http://localhost:8081',
        secure: false
      },
      '/api/game/sporter/slavePhoto' : {
        target: 'http://localhost:8081',
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
        args[0].title = "四川省第十五届运动会 - 竞赛信息发布系统";
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
