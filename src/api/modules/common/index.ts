import { defHttp } from '@/api/request/newIndex';

enum Api {
  GetStudyStat = '/shelves/commodity/getStudyStat',
  NavInfo = '/base/shopDecorateTemplate/getTemplate',
  PageInfo = '/base/shopDecorateTemplate/getTemplate',
  ComodityInfoByIds = '/shelves/commodity/find/commodity',
}

// 获取学习进度统计计息
export const fetchGetStudyStat = (data: any) => {
  return Promise.resolve(
    defHttp.post({
      url: Api.GetStudyStat,
      data,
    })
  );
};
// 获取底部导航信息
export const getNavInfo = (data: any) => {
  return Promise.resolve(
    defHttp.post({
      url: Api.NavInfo,
      data,
    })
  );
};
// 获取页面信息
export const getPageTempalte = (data: any) => {
  return Promise.resolve(
    defHttp.post({
      url: Api.PageInfo,
      data,
    })
  );
};
// 根据商品id数组获取对应商品的信息
export const getCommodityInfoByIds = (data: any) => {
  return Promise.resolve(
    defHttp.post({
      url: Api.ComodityInfoByIds,
      data,
    })
  );
};
