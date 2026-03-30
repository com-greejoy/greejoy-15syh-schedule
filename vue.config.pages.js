const path = require("path");

const views = [
  {page: 'demo', title: 'DemoPage'}
]

let pages = {};

views.forEach(v => {
  let pageName = v.page;
  let pageTitle = v.title;
  pages[v.page] = {
    entry: `src/pages/${pageName}/${pageName}.js`,
    template: `src/pages/${pageName}/${pageName}.html`,
    filename: `${pageName}/${pageName}.html`,
    title: pageTitle,
    chunks: ['chunk-vendors', 'chunk-common', `${pageName}`],
    //html压缩选项
    minify: true
  }
});

module.exports = {
  //部署在服务器的子路径下
  publicPath: '/',
  //输出目录，默认dist
  outputDir: 'dist',
  configureWebpack: {
    resolve: {
      alias: {
        'comps': '@/components',
        'common': '@/common',
        'assets': '@/assets',
        'network': '@/network',
        'views': '@/views'
      }
    },
    optimization: {
      splitChunks: {
        cacheGroups: {
          //将每个页面都引入的依赖打包到dist/js/chunk-vendor.js
          //将每个页面剩余的js打包到dist/js/xxx(页面的名字).js
          //https://ddxg638.github.io/2019/08/11/vue-cli3-pages/
          vendors: {
            name: 'chunk-vendors',
            minChunks: views.length,
            chunks: 'initial'
          },
          common: {}
        }
      }
    }
  },
  pages,
  pluginOptions: {
    'style-resources-loader': {
      preProcessor: 'less',
      patterns: [
        path.resolve(__dirname, "src/assets/less/common.less"),
        path.resolve(__dirname, "src/assets/less/theme.less")
      ]
    }
  },
  devServer: {
    disableHostCheck: true
  }
}
