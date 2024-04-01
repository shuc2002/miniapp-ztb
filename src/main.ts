import Vue from 'vue';
import uView from 'uview-ui';
import App from '@/App.vue';
import './common/icon/iconfont-weapp-icon.css';
import './common/icon/iconfont.css';
import mixins from '@/mixins/browserDetectMixin.js';

import commonFun from './utils/common.js';
import store from '@/store/index.js';
Vue.prototype.commonFun = commonFun;
Vue.config.productionTip = false;
Vue.prototype.$store = store;
Vue.use(uView);
// #ifdef H5
Vue.mixin(mixins);
// #endif

const app = new Vue({
  ...App,
  store,
});
app.$mount();
