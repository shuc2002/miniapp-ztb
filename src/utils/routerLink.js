import publicFun from './public.js';
export function routeTo(url) {
  // publicFun.throttle(function () {
  //   uni.navigateTo({
  //     url,
  //   });
  // }, 2000);
  const value = uni.getStorageSync('token');
  const projectId = uni.getStorageSync('projectId');
  if (value) {
    if (projectId) {
      publicFun.throttle(function () {
        uni.navigateTo({
          url,
        });
      }, 2000);
    } else {
      publicFun.throttle(function () {
        uni.navigateTo({
          url: '/business/selectExam/index',
        });
      }, 2000);
    }
  } else {
    // eslint-disable-next-line no-undef
    let pages = getCurrentPages();
    let homeURL = '/home/login/login';
    /* #ifdef H5 */
    homeURL = '/home/login/passwordLogin';
    /* #endif */
    if (pages.length == 1) {
      uni.navigateTo({
        url: homeURL,
      });
    } else {
      uni.redirectTo({
        url: homeURL,
      });
    }
  }
}

export function redirectTo(url) {
  publicFun.throttle(function () {
    uni.redirectTo({
      url,
    });
  }, 2000);
}

export function relunch(url) {
  publicFun.throttle(function () {
    try {
      uni.reLaunch({
        url,
      });
    } catch (e) {
      let homeURL = '/home/login/login';
      /* #ifdef H5 */
      homeURL = '/home/login/passwordLogin';
      /* #endif */
      uni.navigateTo({
        url: homeURL,
      });
    }
  }, 2000);
}
export function goback() {
  uni.navigateBack({});
}
export function switchTab(url) {
  try {
    uni.switchTab({
      url,
    });
  } catch (e) {
    let homeURL = '/home/login/login';
    /* #ifdef H5 */
    homeURL = '/home/login/passwordLogin';
    /* #endif */
    uni.navigateTo({
      url: homeURL,
    });
  }
}
