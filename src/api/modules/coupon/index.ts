// @desc 优惠券接口
// @author 江玉龙
// @date 2022年08月12日
import { defHttp } from '@/api/request/newIndex';

enum Api {
  List = '/util/coupon/records',
  Commodity = '/util/coupon/list',
  Pay = '/util/coupon/usable/list',
  Receive = '/util/coupon/receive',
  Relevant = '/util/coupon/range/channel',
}

// 查询用户已领优惠卷列表
export const getCouponList = (data: any) => {
  return Promise.resolve(
    defHttp.get({
      url: Api.List,
      data,
    })
  );
};
// 查询商品有效优惠卷列表
export const getCommodityCoupon = (data: any) => {
  return Promise.resolve(
    defHttp.get({
      url: Api.Commodity,
      data,
    })
  );
};
// 查询此商品用户已领取待使用优惠卷列表
export const getPayCoupon = (data: any) => {
  return Promise.resolve(
    defHttp.get({
      url: Api.Pay,
      data,
    })
  );
};
// 领取优惠券
export const receiveCoupon = (data: any) => {
  return Promise.resolve(
    defHttp.post({
      url: Api.Receive + `?id=${data.id}`,
    })
  );
};
// 获取优惠卷商品信息
export const getRelevantCommodity = (data: any) => {
  return Promise.resolve(
    defHttp.get({
      url: Api.Relevant,
      data,
    })
  );
};
