import Vue from 'vue'
import App from './Demo.vue'

//fontawesome
import 'assets/js/icon.js';
//fileter
import 'common/filter.js';

Vue.config.productionTip = false

new Vue({
  render: h => h(App)
}).$mount('#app')
