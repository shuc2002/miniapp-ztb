// @desc 商品、课程详情接口
// @author 江玉龙
// @date 2022年04月28日
import { defHttp } from '@/api/request/newIndex';
import request from '@/api/request';

enum Api {
  Detail = '/shelves/commodity/?isSubjectProduct=true',
  Display = '/shelves/commodity/display',
  VIP = '/shelves/commodity/vip',
  IntegralList = '/shelves/commodity/integral',
  VideoList = '/commodity/video/list',
  Course = '/curriculum/list',
  Units = '/shelves/commodity/units',
  Desc = '/shelves/commodity/desc',
  Product = '/shelves/commodity/products',
  Material = '/shelves/commodity/datum',
  Relevant = '/shelves/commodity/relevant',
  Subject = '/base/construct/subjects',
  tourist = '/shelves/commodity/guest/authorize',
  InfoList = '/util/info/list',
  InfoDetail = '/util/info/detail',
  Status = '/shelves/commodity/bought',
  DisplayList = '/shelves/commodity/display/list?isSubjectProduct=true', // 后端要求用这种方式
  LiveStatus = '/util/activity/live/subscribe', // 直播活动是否预约
  FollowersNum = '/shelves/commodity/getCommodityStudyStat', //商品详情的已关注人数
  SalesVolume = '/shelves/commodity/getCommodityStudyStat',
}

// 获取商品详情
export const getCommodityDetail = (data: any) => {
  return Promise.resolve(
    defHttp.get({
      url: Api.Detail,
      data,
    })
  );
};

// 获取商品销量
export const getSalesVolume = (data: any) => {
  return Promise.resolve(
    defHttp.get({
      url: Api.SalesVolume,
      data,
    })
  );
};
// 根据项目和科目获取对应陈列商品
export const getCommodityDisplay = (data: any) => {
  return Promise.resolve(
    defHttp.get({
      url: Api.Display,
      data,
    })
  );
};
// 获取VIP商品
export const getVIPCommodity = (data: any) => {
  return Promise.resolve(
    defHttp.get({
      url: Api.VIP,
      data,
    })
  );
};
// 获取积分商品
export const getIntegralList = (data: any) => {
  return Promise.resolve(
    defHttp.get({
      url: Api.IntegralList,
      data,
    })
  );
};
// 视频产品的资源列表
export const getVideoList = (data: any) => {
  return Promise.resolve(
    request({
      url: Api.VideoList,
      method: 'POST',
      data,
    })
  );
};
// 我的课程列表
export const getCourseList = (data: any) => {
  return Promise.resolve(
    request({
      url: Api.Course,
      method: 'POST',
      data,
    })
  );
};
//  学习单元列表
export const getUnitsList = (data: any) => {
  return Promise.resolve(
    defHttp.get({
      url: Api.Units,
      data,
    })
  );
};
//弹窗商品信息
export const getDesc = (data: any) => {
  return Promise.resolve(
    defHttp.get({
      url: Api.Desc,
      data,
    })
  );
};
// 获取商品下的产品列表
export const getShopProduct = (data: any) => {
  return Promise.resolve(
    defHttp.get({
      url: Api.Product,
      data,
    })
  );
};
// 获取对应资料商品
export const getMaterial = (data: any) => {
  return Promise.resolve(
    defHttp.get({
      url: Api.Material,
      data,
    })
  );
};
// 获取相关阅读资料
export const getRelevant = (data: any) => {
  return Promise.resolve(
    defHttp.get({
      url: Api.Relevant,
      data,
    })
  );
};
// 获取科目列表
export const getSubjectList = (data: any) => {
  return Promise.resolve(
    defHttp.get({
      url: Api.Subject,
      data,
    })
  );
};
//  学习单元列表
export const getTourist = (data: any) => {
  return Promise.resolve(
    defHttp.get({
      url: Api.tourist,
      data,
    })
  );
};
// 根据项目获取对应资讯列表
export const getInfoList = (data: any) => {
  return Promise.resolve(
    defHttp.get({
      url: Api.InfoList,
      data,
    })
  );
};
// 获取资讯详情
export const getInfoDetail = (data: any) => {
  return Promise.resolve(
    defHttp.get({
      url: Api.InfoDetail,
      data,
    })
  );
};
// 获取商品状态
export const getCommodityStatus = (data: any) => {
  return Promise.resolve(
    defHttp.get({
      url: Api.Status,
      data,
    })
  );
};
//获取指定项目科目的商品列表
export const getDisplayList = (data: any) => {
  return Promise.resolve(
    defHttp.post({
      url: Api.DisplayList,
      data,
    })
  );
};

// 查询是否预约直播
export const getLiveReserveStatus = (id: any) => {
  return Promise.resolve(
    defHttp.get({
      url: Api.LiveStatus + `?activityId=${id}`,
    })
  );
};

// 查询商品的已关注人数
export const getCommodityFollowersNum = (id: string) => {
  return Promise.resolve(
    defHttp.get({
      url: Api.FollowersNum + `?commodityId=${id}`,
    })
  );
};
