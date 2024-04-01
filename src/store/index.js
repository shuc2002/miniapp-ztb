import Vuex from 'vuex';
import Vue from 'vue';
Vue.use(Vuex);
import functionTime from '@/store/modules/functionTime.js';
import channel from '@/store/modules/channel.js';
import user from '@/store/modules/user.js';
import textSize from '@/store/modules/textSize.js';
import exam from '@/store/modules/exam.js';
import daily from '@/store/modules/daily.js';
import webSocket from '@/store/modules/webSocket.js';

let store = new Vuex.Store({
  modules: {
    functionTime,
    channel,
    user,
    textSize,
    exam,
    daily,
    webSocket,
  },
});
export default store;
