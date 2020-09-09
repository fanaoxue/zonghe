import Vue from 'vue'
import App from './App'
import './api/server.config.js'
import router from './router'
import FastClick from 'fastclick'
import store from './store'
import commonPlugin from '../src/components/common'
import { AppHowtoBack } from './utils/app.js'
import vfilters from "./utils/vfilters.js";
import Utils from "./utils/util.js";
import './utils/h5.js'
import './assets/fonts/iconfont.css'
import 'vant/lib/index.css'
require('es6-promise').polyfill()
FastClick.prototype.focus = function (targetElement) {
  let deviceIsWindowsPhone = navigator.userAgent.indexOf("Windows Phone") >= 0;
  let deviceIsIOS = /iP(ad|hone|od)/.test(navigator.userAgent) && !deviceIsWindowsPhone;
  let length;

  // Issue #160: on iOS 7, some input elements (e.g. date datetime month) throw a vague TypeError on setSelectionRange. These elements don't have an integer value for the selectionStart and selectionEnd properties, but unfortunately that can't be used for detection because accessing the properties also throws a TypeError. Just check the type instead. Filed as Apple bug #15122724.
  if (deviceIsIOS && targetElement.setSelectionRange && targetElement.type.indexOf('date') !== 0 && targetElement.type !== 'time' && targetElement.type !== 'month') {
    length = targetElement.value.length;
    try {
      targetElement.setSelectionRange(length, length);
    } catch (error) { }
    targetElement.focus();
  } else {
    targetElement.focus();
  }
};
FastClick.attach(document.body)
Vue.config.productionTip = false
Vue.use(commonPlugin)
Vue.use(Utils);
Object.keys(vfilters).forEach(key => {
  Vue.filter(key, vfilters[key]);
});
router.beforeEach(function (to, from, next) {
  Vue.$vux.alert.hide()
  Vue.$vux1.confirm.hide()
  window.document.title = to.meta.title !== undefined ? (to.meta.title) : '快路宝'
  store.commit('updateLoadingStatus', {
    isLoading: true
  })
  AppHowtoBack('0') // 每次跳转进入页面前将AppHowtoBack中type类型置为默认值"0"
  next()
})

router.afterEach(function (to) {
  // store.commit('updateLoadingStatus', {isLoading: false}) //此步骤交给每个页面（路由）自行处理
})
import { getToken } from '@/api/server.config.js'
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: {
    App
  },
  mounted() {
    getToken()
  },
  template: '<App/>'
})
