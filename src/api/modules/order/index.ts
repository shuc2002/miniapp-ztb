// @desc 订单与支付接口
// @author 江玉龙
// @date 2022年04月28日

import request from '@/api/request';
import { defHttp } from '@/api/request/newIndex';

enum Api {
  PayWay = '/order/play/way',
  Num = '/order/unpaid',
  Status = '/trade/order/status',
  Refund = '/trade/order/refund',
  Payment = '/trade/payment',
  PaymentV2 = '/trade/v2/payment',
  Detail = '/trade/order/detail',
  Create = '/trade/order',
  OrderList = '/trade/order/channel',
  Cancel = '/trade/order/refund/cancel',
  Nopay = '/trade/order/cancel',
  IntegralNum = '/trade/integral/',
  IntegralOrder = '/trade/order/integral/channel',
  IntegralPay = '/trade/payment/integral',
  Collage = '/util/activity/group',
  Grouping = '/util/activity/grouping',
  Lately = '/util/activity/group/user',
  Consult = '/trade/order/negotiations',
  OrderNum = '/trade/order/unpaid/channel',
  Unfinished = '/trade/order/unfinished',
  IntegralDetail = '/trade/integral/detail',
  Receipt = '/trade/order/received',
  IntegralReceipt = '/trade/order/integral/received',
  SignAgreement = '/trade/order/contract/authentication', // 签署协议
  SignRecord = '/trade/order/contract/sign',
  SignStatus = '/trade/order/contract/info',
  defaultAppId = '/base/app/channel/default', //获取机构下默认应用的默认渠道appID
  CodeToOpenId = '/base/app/wx/authorize', //根据code获取openId
  wxSign = '/base/wx/sign', //获取签名
}
//获取未支付订单
export const getUnFinishedOrder = (data: any) => {
  return Promise.resolve(
    defHttp.post({
      url: Api.Unfinished,
      data,
    })
  );
};
//支付接口
export const payment = (data: any) => {
  return Promise.resolve(
    defHttp.post({
      url: Api.Payment,
      data,
    })
  );
};
//支付接口
export const paymentV2 = (data: any) => {
  return Promise.resolve(
    defHttp.post({
      url: Api.PaymentV2,
      data,
    })
  );
};
//取消退款接口
export const cancelOrder = (id) => {
  return Promise.resolve(
    defHttp.put({
      url: Api.Cancel + `?id=${id}`,
    })
  );
};
// 用户订单列表
export const getOrderList = (data: any) => {
  return Promise.resolve(
    defHttp.get({
      url: Api.OrderList,
      data,
    })
  );
};
// 获取订单详情
export const getOrderDetail = (data: any) => {
  return Promise.resolve(
    defHttp.get({
      url: Api.Detail,
      data,
    })
  );
};
// 创建订单
export const createOrder = (data: any) => {
  return Promise.resolve(
    defHttp.post({
      url: Api.Create,
      data,
    })
  );
};
// 退款
export const setRefund = (data: any) => {
  return Promise.resolve(
    defHttp.post({
      url: Api.Refund,
      data,
    })
  );
};
// 查询订单状态
export const getOrderStatus = (data: any) => {
  return Promise.resolve(
    defHttp.get({
      url: Api.Status,
      data,
    })
  );
};
// 订单支付方式确定
export const getPayWay = (data: any) => {
  return Promise.resolve(
    request({
      url: Api.PayWay,
      method: 'POST',
      data,
    })
  );
};
// 待支付订单数量
export const getPayNum = (data: any) => {
  return Promise.resolve(
    request({
      url: Api.Num,
      method: 'GET',
      data,
    })
  );
};
// 取消支付
export const cancelPay = (id) => {
  return Promise.resolve(
    defHttp.put({
      url: Api.Nopay + `?id=${id}`,
    })
  );
};
// 查询积分数据
export const getIntegralNum = () => {
  return Promise.resolve(
    defHttp.get({
      url: Api.IntegralNum,
    })
  );
};
// 查询积分订单列表
export const getIntegralOrder = (data: any) => {
  return Promise.resolve(
    defHttp.get({
      url: Api.IntegralOrder,
      data,
    })
  );
};
// 积分支付
export const integralPay = (data: any) => {
  return Promise.resolve(
    defHttp.post({
      url: Api.IntegralPay + `?commodityId=${data.commodityId}&addressId=${data.addressId}`,
    })
  );
};
// 查询商品活动详情
export const getCollageOrder = (data: any) => {
  return Promise.resolve(
    defHttp.get({
      url: Api.Collage,
      data,
    })
  );
};
// 查询当前用户最近一次拼团详情
export const getLately = (data: any) => {
  return Promise.resolve(
    defHttp.get({
      url: Api.Lately,
      data,
    })
  );
};
// 分享界面拼团数据获取
export const getGrouping = (data: any) => {
  return Promise.resolve(
    defHttp.get({
      url: Api.Grouping,
      data,
    })
  );
};
// 根据订单id查询协商历史
export const getConsult = (data: any) => {
  return Promise.resolve(
    defHttp.get({
      url: Api.Consult,
      data,
    })
  );
};
// 获取订单详情
export const getIntegralDetail = (data: any) => {
  return Promise.resolve(
    defHttp.get({
      url: Api.IntegralDetail,
      data,
    })
  );
};
// 现金订单确认收货接口
export const setReceipt = (id) => {
  return Promise.resolve(
    defHttp.put({
      url: Api.Receipt + `?id=${id}`,
    })
  );
};
// 积分订单确认收货接口
export const setIntegralReceipt = (id) => {
  return Promise.resolve(
    defHttp.put({
      url: Api.IntegralReceipt + `?id=${id}`,
    })
  );
};
// 签署协议
export const postSignAgreement = (data) => {
  return Promise.resolve(
    defHttp.post({
      url: Api.SignAgreement,
      data,
    })
  );
};
//获取未支付订单
export const setSignRecord = (data: any) => {
  return Promise.resolve(
    defHttp.post({
      url: Api.SignRecord,
      data,
    })
  );
};
// 获取协议记录状态
export const getSignStatus = (data: any) => {
  return Promise.resolve(
    defHttp.get({
      url: Api.SignStatus,
      data,
    })
  );
};
//获取默认appid
export const getDefaultAppId = () => {
  return Promise.resolve(
    defHttp.get({
      url: Api.defaultAppId,
    })
  );
};
//获取OpenId
export const getOpenId = (code) => {
  return Promise.resolve(
    defHttp.get({
      url: Api.CodeToOpenId + `?code=${code}`,
    })
  );
};

// 获取js-sdk签名
export const getWxSign = (data: any) => {
  return Promise.resolve(
    defHttp.post({
      url: Api.wxSign,
      data,
    })
  );
};
