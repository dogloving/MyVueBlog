import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ViewUI from 'view-design'
// import 'view-design/dist/styles/iview.css'
import mavonEditor from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'
import Highlight from './highlight'

Vue.config.productionTip = false
Vue.use(ViewUI)
Vue.use(mavonEditor)
Vue.use(Highlight)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
