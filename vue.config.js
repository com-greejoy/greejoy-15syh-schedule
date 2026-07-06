const path = require("path");

module.exports = {
  //输出目录，默认dist
  outputDir: 'dist',
  publicPath: process.env.NODE_ENV === "production" ? "/schedule/" : "/",
  devServer: {
    port: 8848,
    // 允许 Docker 容器内的截图服务通过 host.docker.internal 访问本 dev 服务
    disableHostCheck: true,
    proxy: {
      [process.env.VUE_APP_BASE_API]: {
        target: 'https://www.sichuan15sports.cn',
        changeOrigin: true
      },
      '/profile' : {
        target: 'https://www.sichuan15sports.cn',
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
        args[0].title = "\"四川银行杯\"四川省第十五届运动会 - 竞赛信息发布系统";
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
