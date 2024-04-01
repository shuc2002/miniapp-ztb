<!-- jsapi支付统一中转页面 -->
<template>
  <view></view>
</template>
<script>
  import { getDefaultAppId, getOpenId } from '@/api/modules/order/index';
  import { getUrlValue } from '@/utils/urlValue.js';
  import { handlePay } from '@/utils/pay.js';
  export default {
    name: 'redirctPage',
    data() {
      return {
        wxUrl: '',
      };
    },
    async onLoad() {
      console.log(window.location.href, '当前链接');
      console.log(getUrlValue('orderId', '支付订单'));
      const code = getUrlValue('code');
      const orderId = getUrlValue('orderId');
      if (code) {
        let payObj = uni.getStorageSync('PAY_OBJ');
        if (payObj) {
          this.payRedirctPage(code);
        } else {
          this.redirctPage(code);
        }
      } else if (orderId) {
        this.redirctPay(orderId);
      } else {
        this.redirectUrl();
      }
    },

    methods: {
      /*******单独获取OpenId回调后存储******/
      // 跳转微信获取openId
      async redirectUrl() {
        const state = getUrlValue('state');
        console.log(state, '22222');
        const baseUrl = encodeURIComponent(window.location.origin);
        const EncodeUrl = encodeURIComponent('/#/page_commodity/order/pages/redirctPage');
        const res = await getDefaultAppId();
        const redirectUrl = baseUrl + EncodeUrl;
        this.wxUrl = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${res.body}&state=${state}&redirect_uri=${redirectUrl}&response_type=code&scope=snsapi_base#wechat_redirect`;
        // window.location.href = this.wxUrl;
        location.replace(this.wxUrl);
      },
      // 获取openId并重定向
      async redirctPage(code) {
        let goUrl = getUrlValue('state');
        goUrl = decodeURIComponent(goUrl.split('#')[0]);
        const testUrl = window.location.href;
        console.log(goUrl, '3333');
        console.log(testUrl, '4444');
        const res = await getOpenId(code);
        console.log(`${goUrl}/#/pages/home/index?openId=${res.body}`, '11111');
        location.replace(`${goUrl}/#/pages/home/index?openId=${res.body}`);
      },
      /*******支付流程直接单独拿openId不存储******/
      // 支付后跳转
      async redirctPay(orderId) {
        const openId = getUrlValue('openId') || '';
        const commodityType = getUrlValue('commodityType') || '';
        const groupId = getUrlValue('groupId') || '';
        const commodityId = getUrlValue('commodityId') || '';
        const payOrign = getUrlValue('payOrign') || '';
        const payToken = getUrlValue('payToken') || '';
        uni.setStorageSync(
          'PAY_OBJ',
          JSON.stringify({
            commodityType,
            groupId,
            commodityId,
            payOrign,
            payToken,
            orderId,
          })
        );
        console.log(openId, openId != undefined, '入参');
        if (openId && openId != '' && openId != 'undefined') {
          console.log(openId, 'handlePay');
          handlePay(
            openId,
            commodityType,
            orderId,
            true,
            3,
            commodityId,
            groupId,
            '',
            decodeURIComponent(payOrign)
          );
        } else {
          console.log(openId, 'payRedirectUrl');
          this.payRedirectUrl(payOrign, payToken);
        }
      },
      // 支付直接获取openId
      async payRedirectUrl(payOrign, payToken) {
        const state = payOrign;
        const baseUrl = encodeURIComponent(window.location.origin);
        const EncodeUrl = encodeURIComponent(
          `/#/page_commodity/order/pages/redirctPage?time=1&payOrign=${payOrign}&payToken=${payToken}`
        );
        const res = await getDefaultAppId();
        const redirectUrl = baseUrl + EncodeUrl;
        this.wxUrl = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${res.body}&state=${state}&redirect_uri=${redirectUrl}&response_type=code&scope=snsapi_base#wechat_redirect`;
        location.replace(this.wxUrl);
      },
      // 拿到OpenId利用缓存数据支付
      async payRedirctPage(code) {
        console.log(code, 'payRedirctPage');
        let payObj = uni.getStorageSync('PAY_OBJ');
        payObj = JSON.parse(payObj);
        const res = await getOpenId(code);
        const openId = res.body;
        const commodityType = payObj.commodityType;
        const groupId = payObj.groupId;
        const commodityId = payObj.commodityId;
        const payOrign = payObj.payOrign;
        const orderId = payObj.orderId;
        console.log(res, 'payRedirctPage');
        handlePay(
          openId,
          commodityType,
          orderId,
          true,
          3,
          commodityId,
          groupId,
          '',
          decodeURIComponent(payOrign)
        );
      },
    },
  };
</script>
