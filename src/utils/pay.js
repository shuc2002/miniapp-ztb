import publicFun from './public.js';
import baseInfo from '@/build/index';
import { payment, getOrderStatus } from '@/api/modules/order/index.ts';
import { ChannelAppId, DouyinAppId, WeixinAppId, sucRefundTip } from '@/enums/msgEnum';
import { BaiduChannelId, WeixinChannelId, DouyinChannelId } from '@/enums/msgEnum';
import { getPayRedicrtUrl } from '@/utils/payUrl.js';
import store from '@/store/index.js';

// import { channel } from 'pingpp-js/src/payment_elements.js';

// eslint-disable-next-line no-unused-vars
// let requstNum = 0,
// eslint-disable-next-line no-unused-vars
// datas = {};
export const pollingOrder = async (id) => {
  let counts = 3;
  let timer;
  return new Promise((resolve) => {
    timer = setInterval(async () => {
      const res = await getOrderStatus({ id });
      counts--;
      if (res.body.status == 1) {
        clearInterval(timer);
        resolve(true);
      }
      if (res.body.status == 5) {
        clearInterval(timer);
        resolve(true);
      }
      if (counts == 0) {
        clearInterval(timer);
        resolve(false);
      }
    }, 1000);
  });
};
export function handlePay(
  openId = '',
  commodityType,
  orderId,
  toLast = false,
  payIndex,
  commodityId,
  groupId,
  channelId,
  payOrign = '' //跳转一个地址之后的回调页面
) {
  publicFun.throttle(async function() {
    uni.showLoading({
      title: '支付中',
    });
    let payChannel = '';
    let thirdAppId = '';
    /* #ifdef MP-TOUTIAO */
    thirdAppId = DouyinAppId[baseInfo.CHANNEL];
    channelId = DouyinChannelId[baseInfo.CHANNEL];
    /* #endif */
    /* #ifdef MP-BAIDU */
    thirdAppId = ChannelAppId[baseInfo.CHANNEL];
    // payChannel = payIndex == 0 ? 'BAIDU_WECHAT' : 'BAIDU_ALIPAY';
    // payChannel = 'BAIDU_ALIPAY';
    // payChannel = payIndex == 0 ? 'baidu_wechat' : 'baidu_wechat';
    channelId = BaiduChannelId[baseInfo.CHANNEL];
    /* #endif */
    /* #ifdef MP-WEIXIN || H5 */
    thirdAppId = WeixinAppId[baseInfo.CHANNEL];
    payChannel = 'wx_lite';
    channelId = WeixinChannelId[baseInfo.CHANNEL];
    /* #endif */
    /* #ifdef H5 */
    thirdAppId = '';
    payChannel = payIndex == 1 ? 'wx_wap' : payIndex == 3 ? 'wx_pub' : 'alipay_wap';
    // channelId = 'default_pc_channel_o1wq9q3khag';
    channelId = '';
    /* #endif */

    let params = { orderId, payChannel, thirdAppId, channelId, openId };
    /* #ifdef H5 */
    // H5加下支付成功后跳转地址
    // https://uat-fxs209.wangxiao.cn/siteH5/#/page_commodity/order/pages/orderDetails?id=297204856424103936&showSuccess=true
    const { origin, pathname } = window.location;

    let extra = null;
    const userAgent = window.navigator.userAgent.toLowerCase();
    if (!userAgent.includes('micromessenger')) {
      const success_url = selectUrl(commodityType, commodityId, groupId, orderId);
      const cancel_url = `/page_commodity/order/pages/${
        commodityType == 3 ? 'entityDetail' : 'orderDetails'
      }?id=${orderId}&showSuccess=false`;
      // 不在微信内
      extra = {
        result_url: `${payOrign || origin}${pathname}#${success_url}`,
      };
      if (payChannel == 'alipay_wap') {
        extra = {
          success_url: `${payOrign || origin}${pathname}#${success_url}`,
          cancel_url: `${payOrign || origin}${pathname}#${cancel_url}`,
        };
      }
    }
    if (extra) {
      params = {
        ...params,
        extra,
      };
    }
    /* #endif */
    console.log('params22---', params);
    const res = await payment(params);

    console.log('res22---', res);

    const data = JSON.parse(res.body);
    let url = '';
    if (commodityType == 3) {
      url = `/page_commodity/order/pages/entityDetail?id=${orderId}&showSuccess=false`;
    } else {
      url = `/page_commodity/order/pages/orderDetails?id=${orderId}&showSuccess=false`;
    }
    /* #ifdef MP-WEIXIN || H5 */
    // eslint-disable-next-line no-undef
    var pingpp = require('pingpp-js');
    pingpp.createPayment(data, async function(result) {
      /* #ifdef MP-WEIXIN */
      wx.requestSubscribeMessage({
        tmplIds: [sucRefundTip[baseInfo.CHANNEL]],
      });
      /* #endif */
      const pollingResult = await pollingOrder(orderId);
      uni.hideLoading();
      if (pollingResult) {
        if (result == 'success') {
          uni.showToast({
            title: '支付成功',
            icon: 'none',
          });
          url = selectUrl(commodityType, commodityId, groupId, orderId);
        } else if (result == 'fail') {
          uni.showToast({
            title: '支付失败',
            icon: 'none',
          });
        } else if (result == 'cancel') {
          uni.showToast({
            title: '取消支付',
            icon: 'none',
          });
        }
      } else {
        console.log('aaaaaaaaaa', result);
        console.log('bbbbbbbbbbbbb', pollingResult);
        uni.showToast({
          title: '支付超时',
          icon: 'none',
        });
        // url = '';
      }
      goTo(url, toLast, payOrign);
    });
    /* #endif */
    /* #ifdef MP-TOUTIAO */
    tt.pay({
      orderInfo: data,
      service: 5,
      success(res) {
        uni.hideLoading();
        if (res.code == 0) {
          uni.showToast({
            title: '支付成功',
            icon: 'none',
          });
          url = selectUrl(commodityType, commodityId, groupId, orderId);
        } else if (res.code == 1) {
          uni.showToast({
            title: '支付超时',
            icon: 'none',
          });
          url = '';
        } else if (res.code == 2) {
          uni.showToast({
            title: '支付失败',
            icon: 'none',
          });
          url = '';
        } else if (res.code == 3) {
          uni.showToast({
            title: '支付关闭',
            icon: 'none',
          });
          url = '';
        } else if (res.code == 4) {
          uni.showToast({
            title: '取消支付',
            icon: 'none',
          });
          url = '';
        }
        console.log('success:aaaaaaa' + JSON.stringify(res));
        goTo(url, toLast, payOrign);
      },
      fail(err) {
        // 调起收银台失败处理逻辑
        uni.hideLoading();
        uni.showToast({
          title: '支付失败',
          icon: 'none',
        });
        url = '';
        console.log('fail:zzzzzzz' + JSON.stringify(err));
        goTo(url, toLast, payOrign);
      },
    });
    /* #endif */
    /* #ifdef MP-BAIDU */
    uni.requestPayment({
      provider: 'baidu',
      orderInfo: data,
      bannedChannels: ['BDWallet'],
      success(res) {
        uni.hideLoading();
        if (res.code == 0) {
          uni.showToast({
            title: '支付成功',
            icon: 'none',
          });
          url = selectUrl(commodityType, commodityId, groupId, orderId);
        } else if (res.code == 1) {
          uni.showToast({
            title: '支付超时',
            icon: 'none',
          });
          url = '';
        } else if (res.code == 2) {
          uni.showToast({
            title: '支付失败',
            icon: 'none',
          });
          url = '';
        } else if (res.code == 3) {
          uni.showToast({
            title: '支付关闭',
            icon: 'none',
          });
          url = '';
        } else if (res.code == 4) {
          uni.showToast({
            title: '取消支付',
            icon: 'none',
          });
          url = '';
        }
        goTo(url, toLast, payOrign);
      },
      fail(err) {
        uni.hideLoading();
        uni.showToast({
          title: '支付失败',
          icon: 'none',
        });
        url = '';
        console.log('fail:' + JSON.stringify(err));
        goTo(url, toLast, payOrign);
      },
    });
    /* #endif */
  }, 1000);
}
function goTo(url, toLast, payOrign) {
  let gotoUrl = url;
  /* #ifdef H5 */
  payOrign = decodeURIComponent(payOrign);
  if (payOrign && payOrign != '') {
    gotoUrl = payOrign + '/#' + url;
    console.log(gotoUrl, '支付成功跳转');
  }
  /* #endif */
  setTimeout(() => {
    if (toLast) {
      if (gotoUrl) {
        /* #ifdef H5 */
        gotoUrl = payOrign + '/#' + url;
        // window.location.href = gotoUrl;
        location.replace(gotoUrl);
        /* #endif */
        /* #ifndef H5 */
        uni.redirectTo({
          gotoUrl,
        });
        /* #endif */
      } else {
        uni.navigateBack();
      }
    } else {
      if (gotoUrl) {
        /* #ifdef H5 */
        gotoUrl = payOrign + '/#' + url;
        // window.location.href = gotoUrl;
        location.replace(gotoUrl);
        /* #endif */
        /* #ifndef H5 */
        uni.navigateTo({
          gotoUrl,
        });
        /* #endif */
      } else {
        uni.navigateBack();
      }
    }
  }, 500);
}
function selectUrl(commodityType, commodityId, groupId, orderId) {
  if (commodityId) {
    // 拼团需要传商品id
    if (groupId) {
      return `/page_commodity/order/pages/collageDetail?id=${orderId}&groupId=${groupId}`;
    } else {
      return `/page_commodity/order/pages/collageDetail?id=${orderId}&commodityId=${commodityId}`;
    }
  } else {
    if (commodityType == 3) {
      return `/page_commodity/order/pages/entityDetail?id=${orderId}&showSuccess=true`;
    } else {
      return `/page_commodity/order/pages/orderDetails?id=${orderId}&showSuccess=true`;
    }
  }
}

export function wxJsPay(openId = '', commodityType, orderId, commodityId = '', groupId = '') {
  const baseUrl = getPayRedicrtUrl();
  const payOrign = window.location.origin;
  const payToken = store.getters.getToken;
  console.log(payToken, 'token', openId);
  const clearOpenId = ''; //临时方案openId不拿loacal的值，每次都去获取
  const EncodeUrl = `page_commodity/order/pages/redirctPage?openId=${clearOpenId}&orderId=${orderId}&commodityType=${commodityType}&commodityId=${commodityId}&payOrign=${payOrign}&groupId=${groupId}&payToken=${payToken}`;
  const redirectUrl = baseUrl + EncodeUrl;
  window.location.href = redirectUrl;
}
