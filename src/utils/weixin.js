//微信JS-SDK
// eslint-disable-next-line no-undef
var jWeixin = require('jweixin-module');
import { getWxSign, getDefaultAppId } from '@/api/modules/order/index';
export default {
  /* 判断是否在微信中 */
  isWechat: function() {
    var ua = window.navigator.userAgent.toLowerCase();
    if (ua.match(/micromessenger/i) == 'micromessenger') {
      //console.log('是微信客户端')
      return true;
    } else {
      return false;
    }
  },
  /* 获取sdk初始化配置 */
  initJssdk: async function(callback) {
    //获取当前url然后传递给后台获取授权和签名信息
    // var url = encodeURIComponent(window.location.href.split('#')[0]); //当前网页的URL，不包含#及其后面部分
    var url = window.location.href.split('#')[0]; //当前网页的URL，不包含#及其后面部分
    let appIdRes = await getDefaultAppId();
    console.log(appIdRes);
    let res = await getWxSign({ url }); //这里调用的是后端的接口，后端去获取签名以及config里面所需的信息
    //返回需要的参数appId,timestamp,noncestr,signature等
    //注入config权限配置
    const { appId, timestamp, nonceStr, signature } = res.body.msg;
    const parmes = {
      debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
      appId: appId, // 必填，公众号的唯一标识
      timestamp: timestamp, // 必填，生成签名的时间戳
      nonceStr: nonceStr, // 必填，生成签名的随机串
      signature: signature, // 必填，签名
      jsApiList: [
        // 必填，需要使用的JS接口列表
        // 'checkJsApi', //判断当前客户端版本是否支持指定JS接口
        'updateAppMessageShareData', //分享朋友
        'updateTimelineShareData', //分享朋友圈
        'onMenuShareTimeline',
        'onMenuShareAppMessage',
        'onMenuShareQQ',
        'onMenuShareQZone',
        // 'getLocation', //获取位置
        // 'openLocation', //打开位置
        // 'scanQRCode', //扫一扫接口
        // 'chooseWXPay', //微信支付
        // 'chooseImage', //拍照或从手机相册中选图接口
        // 'previewImage', //预览图片接口
        // 'uploadImage' //上传图片
      ],
    };
    console.log(parmes, '参数');
    jWeixin.config(parmes);
    if (callback) {
      callback(res);
    }
  },

  //自定义分享  这里我统一调用了分享到朋友和朋友圈，可以自行定义
  shareWx: function(shareInfo) {
    this.initJssdk(function(res) {
      console.log(res, '签名数据');
      jWeixin.ready(function() {
        jWeixin.onMenuShareAppMessage({
          //分享到朋友圈
          title: shareInfo.title,
          desc: shareInfo.desc,
          imgUrl: shareInfo.imgUrl,
          link: shareInfo.link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
          success: function() {
            // 用户确认分享后执行的回调函数
            console.log('分享成功');
          },
          cancel: function() {
            // 用户取消分享后执行的回调函数
          },
        });
        jWeixin.onMenuShareTimeline({
          title: shareInfo.title, // 分享标题
          link: shareInfo.link, // 分享链接
          desc: shareInfo.desc,
          imgUrl: shareInfo.imgUrl, // 分享图标
          success: function() {
            // 用户确认分享后执行的回调函数
            console.log('分享成功');
          },
          cancel: function() {
            // 用户取消分享后执行的回调函数
          },
        });
        // 老版本接口
        // jWeixin.updateAppMessageShareData({
        //   //分享给朋友
        //   title: shareInfo.title,
        //   desc: shareInfo.desc,
        //   imgUrl: shareInfo.imgUrl,
        //   link: shareInfo.link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
        //   success: function() {
        //     // 用户确认分享后执行的回调函数
        //     console.log('分享成功');
        //   },
        // });
        // jWeixin.updateTimelineShareData({
        //   //分享到朋友圈
        //   title: shareInfo.title,
        //   desc: shareInfo.desc,
        //   imgUrl: shareInfo.imgUrl,
        //   link: shareInfo.link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
        //   success: function() {
        //     // 用户确认分享后执行的回调函数
        //     console.log('分享成功');
        //   },
        // });
      });
    });
  },
};
