import { handerLiveHeart } from './../modules/course/index';
import { baseUrl, SUPPLIERID_WHITE_LIST } from '../config/index';
import errorMessage from '@/api/messageInfo';
import { ResultEnum } from '@/enums/httpEnum';
import { createErrorMessage, whiteCodeList, generateUniqueKey } from './helper';
import baseInfo from '@/build/index';
import store from '@/store/index.js';
import { BaiduChannelId, DouyinChannelId, WeixinChannelId, H5ChannelId } from '@/enums/msgEnum';
import { getUrlValue } from '@/utils/urlValue.js';
let clientOrigin = '';
let payToken = '';
// let authorization = 'Thor ' + uni.getStorageSync('token');
/* #ifdef H5 */
clientOrigin = window.location.origin;
// 统一支付域名更换clientOrigin
const payOrign = getUrlValue('payOrign', window.location.href);
if (payOrign && payOrign != '') {
  clientOrigin = decodeURIComponent(payOrign);
}
const urlToken = getUrlValue('payToken', window.location.href);
if (urlToken && urlToken != '') {
  payToken = urlToken;
}
/* #endif */
/** CONFIG: 请求头默认配置 */
const CONFIG = {
  url: '',
  data: {},
  method: 'GET',
  header: {
    'Content-Type': 'application/json;charset=UTF-8',
    platform: uni.getSystemInfoSync().uniPlatform,
    'client-origin': clientOrigin,
  },
};
/** option: 请求头变量配置 */
var option = {
  url: '',
  data: {},
  method: '',
  header: '',
  isJson: true,
  noBase: false,
};

const etagMap = new Map();

export const defHttp = {
  tag: '',
  channel() {
    let channelId = '';
    /* #ifdef H5 */
    channelId = H5ChannelId[baseInfo.CHANNEL];
    /* #endif */
    /* #ifdef MP-TOUTIAO */
    channelId = DouyinChannelId[baseInfo.CHANNEL];
    /* #endif */
    /* #ifdef MP-BAIDU */
    channelId = BaiduChannelId[baseInfo.CHANNEL];
    /* #endif */
    /* #ifdef MP-WEIXIN */
    channelId = WeixinChannelId[baseInfo.CHANNEL];
    /* #endif */
    return channelId;
  },
  /**
   * Title: get请求
   * Description: get请求,获取资源数据
   * Param: url:请求地址;data:请求参数
   * Return: 封装好的请求体
   */
  get(parms) {
    option.url = parms.url;
    option.noBase = parms.noBase;
    option.data = parms.data || CONFIG.data;
    option.method = 'GET';
    option.header = {
      ...CONFIG.header,
      ...parms.header,
      Authorization: payToken == '' ? 'Thor ' + uni.getStorageSync('token') : 'Thor ' + payToken,
      'client-channel-id': this.channel(),
    };
    return this.request(option);
  },
  /**
   * Title: post请求
   * Description: post请求,新建资源数据
   * Param: url:请求地址;data:请求参数
   * Return: 封装好的请求体
   */
  post(parms) {
    option.url = parms.url;
    option.noBase = parms.noBase;
    option.data = { ...parms.data } || CONFIG.data;
    option.method = 'POST';
    option.header = {
      ...CONFIG.header,
      ...parms.header,
      Authorization: payToken == '' ? 'Thor ' + uni.getStorageSync('token') : 'Thor ' + payToken,
      'client-channel-id': this.channel(),
      'Content-Type': 'application/json', // 百度小程序真机POST请求报错
    };
    return this.request(option);
  },
  /**
   * Title: put请求
   * Description: put请求,更新资源数据
   * Param: url:请求地址;data:请求参数
   * Return: 封装好的请求体
   */
  put(parms) {
    option.url = parms.url;
    option.data = parms.data || CONFIG.data;
    option.method = 'PUT';
    option.header = {
      ...CONFIG.header,
      ...parms.header,
      Authorization: payToken == '' ? 'Thor ' + uni.getStorageSync('token') : 'Thor ' + payToken,
      'client-channel-id': this.channel(),
    };
    return this.request(option);
  },
  /**
   * Title: delete请求
   * Description: delete请求,删除资源数据
   * Param: url:请求地址;data:请求参数
   * Return: 封装好的请求体
   */
  delete(url, data, header) {
    option.url = url;
    option.data = data;
    option.method = 'DELETE';
    option.header = header;
    return this.request(option);
  },
  /**
   * Title: 基础网络请求
   * Description: 封装uniapp自带的网络请求
   * Param: option:封装好的option对象
   * Return: 返回请求到的数据
   */
  request(option) {
    return new Promise((resolve, reject) => {
      const supplierId = store.getters.getSupplierId || '';
      let { url, data: params } = option;
      let position = url.indexOf('?');
      let tempUrl = url;
      if (position > -1) {
        tempUrl = tempUrl.substring(0, position);
      }
      console.log('tempUrl---', tempUrl);
      console.log('supplierId---', supplierId);
      if (SUPPLIERID_WHITE_LIST.includes(tempUrl) && supplierId) {
        option.header['target-tenant-id'] = supplierId;
      }
      if (!option.noBase) {
        option.url = baseUrl + url;
      }
      const unikey = generateUniqueKey(url, params);
      const tag = etagMap.get(`${unikey}-tag`);
      if (tag) {
        option['header']['If-None-Match'] = tag;
      }
      uni.request({
        header: option.header,
        url: option.url,
        data: option.data,
        method: option.method,
        success: (res: any) => {
          const { header, statusCode, data } = res;
          if (statusCode === 304) {
            // 直接返回缓存数据
            const unikey = generateUniqueKey(url, params);
            resolve(etagMap.get(`${unikey}-data`));
          } else {
            if (header['ETag']) {
              // 存储当前请求的ETag值
              const unikey = generateUniqueKey(url, params);
              etagMap.set(`${unikey}-tag`, header['ETag']);
              etagMap.set(`${unikey}-data`, data);
            }
            const isWhite = whiteCodeList.find((item) => {
              return item.code == res.data.code;
            });
            //判断是否再code白名单内，如果在就直接resolve
            if (isWhite) {
              resolve(res.data);
            } else if (option.noBase) {
              //判断是否是组装url的接口
              resolve(res.data);
            } else if (
              res.data.code == ResultEnum.DO_LOGIN ||
              res.data.code == ResultEnum.USER_NOT_EXIST
            ) {
              //其他的错误code
              createErrorMessage(errorMessage.TokenError);
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
            } else if (res.data.code == ResultEnum.SYSTEM_EXCEPTION) {
              createErrorMessage(errorMessage.NetError);
              reject('网络连接失败');
            } else {
              createErrorMessage(data?.msg || errorMessage.ServerError);
              reject('网络连接失败');
            }
          }
          uni.stopPullDownRefresh();
        },
        fail: () => {
          uni.hideLoading();
          uni.stopPullDownRefresh();
          uni.showToast({
            title: errorMessage.NetError,
            icon: 'none',
          });
          reject('网络连接失败');
        },
      });
    });
  },
};
