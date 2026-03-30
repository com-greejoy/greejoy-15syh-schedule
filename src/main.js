import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

//fontawesome
//import './assets/js/icon.js';
//fileter
import './common/filter.js';
//permission
import './router/permission';
//element
import './plugins/element';
//dayjs
import dayjs from 'dayjs';

import { getDicts } from "./network/system/dict/data";
import { selectDictLabel } from "./common/utils";


Vue.prototype.dayjs = dayjs;
Vue.prototype.getDicts = getDicts;
Vue.prototype.selectDictLabel = selectDictLabel;


Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
