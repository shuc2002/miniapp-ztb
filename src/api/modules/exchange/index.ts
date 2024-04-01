// @desc 兑换码接口
// @author 江玉龙
// @date 2023年02月01日
import { defHttp } from '@/api/request/newIndex';

enum Api {
  Exchange = '/util/activity/code/exchange',
  List = '/util/activity/redeem/records',
  Course = '/util/activity/redeem/products',
  activationCode = '/agent/activation/code/exchange', //激活码激活
  GoodsRechargeList = '/agent/activation/code/records',
}

// 兑换接口
export const submitExchange = (data: any) => {
  return Promise.resolve(
    defHttp.post({
      url: Api.Exchange,
      data,
    })
  );
};
// 兑换记录列表
export const getExchangeList = (data: any) => {
  return Promise.resolve(
    defHttp.get({
      url: Api.List,
      data,
    })
  );
};
// 兑换码兑换课程列表
export const getCourseList = (data: any) => {
  return Promise.resolve(
    defHttp.get({
      url: Api.Course,
      data,
    })
  );
};
//激活码激活
export const exchangeActivation = (data: any) => {
  return Promise.resolve(
    defHttp.get({
      url: Api.activationCode,
      data,
    })
  );
};
//商品兑换记录
export const getGoodsRechargeList = (data: any) => {
  return Promise.resolve(
    defHttp.get({
      url: Api.GoodsRechargeList,
      data,
    })
  );
};
