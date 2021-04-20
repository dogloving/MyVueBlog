const externals = {
  'axios': 'axios',
  'vue': 'Vue',
  'vuex': 'Vuex',
  'vue-router': 'VueRouter',
  'highlight.js': 'hljs',
  "view-design": 'iview',
  "iview": 'ViewUI',
  'mavon-editor':'MavonEditor'
}
const cdn = {
  css: [
    'https://cdn.bootcdn.net/ajax/libs/view-design/4.2.0/styles/iview.min.css'
  ],
  js: [
    'https://cdn.bootcdn.net/ajax/libs/axios/0.21.1/axios.min.js',
    'https://cdn.bootcdn.net/ajax/libs/vue/2.6.11/vue.min.js',
    'https://cdn.bootcdn.net/ajax/libs/vue-router/3.2.0/vue-router.min.js',
    'https://cdn.bootcdn.net/ajax/libs/vuex/3.5.1/vuex.min.js',
    'https://cdn.bootcdn.net/ajax/libs/view-design/4.2.0/iview.min.js',
    'https://cdn.bootcdn.net/ajax/libs/highlight.js/9.18.1/highlight.min.js',
    'https://unpkg.com/mavon-editor@2.9.0/dist/mavon-editor.js'
  ]
}

module.exports = {
  publicPath: process.env.NODE_ENV === "production" ? "/" : "/", //部署应用包时的基本 URL
  outputDir: "dist", //打包目录
  indexPath: "index.html",
  productionSourceMap: false,
  configureWebpack: {
    resolve: {
      extensions: [],
      alias: {
        'assets': '@/assets',
        'common': '@/common',
        'components': '@/components',
        'network': '@/network',
        'views': '@/views'
      }
    },
    externals
    // externals: {
    //   'axios': 'axios',
    //   'vue': 'Vue',
    //   'vuex': 'Vuex',
    //   'vue-router': 'VueRouter',
    //   'highlight.js': 'hljs',
    //   "view-design": 'iview',
    //   "iview": 'ViewUI',
    //   'mavon-editor':'MavonEditor'
    // }
  }
}