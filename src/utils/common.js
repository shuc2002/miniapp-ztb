import { routeTo, relunch, goback, redirectTo } from './routerLink';
import store from '@/store/index.js';
// 跳转底部导航主页面的公共方法 type 1 switchTab 2 reLunch
export function bottomNavTo(url, type) {
  // 获取index
  let list = store.getters.getPageTabList;
  if (list.tabList && list.tabList.length > 0) {
    list.tabList.map((item, index) => {
      if (item.url == url) {
        store.commit('setCurrentTab', index);
        // console.log(item, 'itemitem');
        if (item?.pageId) {
          uni.setStorageSync('pageId', item.pageId);
        }
      }
    });
  }

  if (type == 1) {
    uni.switchTab({ url });
  } else {
    // console.log('来了reK', url);
    uni.reLaunch({ url });
  }
}
export default {
  routeTo,
  relunch,
  goback,
  redirectTo,
};
