import { defHttp } from '@/api/request/newIndex';

enum Api {
  MyCourseList = '/shelves/my/lessons', // 我的课程
  RecommendList = '/shelves/recommend/lessonsList', // 推荐课
  RecommendListNew = '/shelves/commodity/display/list?isSubjectProduct=true',
  WxInfo = '/base/qrcode/wxinfo', // 备考信息
  getReplayList = '/resource/lesson/live/replay', // 直播回放
  UnitDetail = '/resource/lesson', // 课程
  HeartBeat = '/resource/live/record', // 直播心跳
  ExamReminder = '/util/certificate/exams', //考试提醒
  MyCommodityCourse = '/shelves/commodity/my/sku', //我的商品课程列表
  MySkuLessons = '/shelves/my/sku/lessons',
}

// 我的课程列表
export const fetchMyCourseList = (data: any) => {
  return Promise.resolve(
    defHttp.get({
      url: Api.MyCourseList,
      data,
    })
  );
};
// 推荐课程列表
export const fetchRecommendList = (data: any) => {
  return Promise.resolve(
    defHttp.get({
      url: Api.RecommendList,
      data,
    })
  );
};
// 推荐课程列表(更换数据来源)
export const fetchRecommendListNew = (data: any) => {
  return Promise.resolve(
    defHttp.post({
      url: Api.RecommendListNew,
      data,
    })
  );
};

// 推荐课程列表
export const fetchWxInfo = (data: any) => {
  return Promise.resolve(
    defHttp.get({
      url: Api.WxInfo,
      data,
    })
  );
};

/**
 * 获取直播回放的方法
 * @param data
 * @returns
 */
export const getReplayList = (data: { productId: string; liveRoomId: string }) => {
  return Promise.resolve(
    defHttp.get({
      url: Api.getReplayList,
      data,
    })
  );
};

/*
 * 获取学习单元详情
 */
export const getUnitDetail = (data: { code: string }) => {
  return Promise.resolve(
    defHttp.get({
      url: Api.UnitDetail,
      data,
    })
  );
};

// 直播心跳
export const handerLiveHeart = (data: any) => {
  return Promise.resolve(
    defHttp.post({
      url: Api.HeartBeat,
      data,
    })
  );
};

// 考试提醒
export const getExamReminder = (data: any) => {
  return Promise.resolve(
    defHttp.get({
      url: Api.ExamReminder,
      data,
    })
  );
};
// 课程商品列表
export const getMyCommidityCourse = (data: any) => {
  return Promise.resolve(
    defHttp.get({
      url: Api.MyCommodityCourse,
      data,
    })
  );
};
// 获取我的课程列表 商品维度
export const getMySkuLessons = (data: any) => {
  return Promise.resolve(
    defHttp.get({
      url: Api.MySkuLessons,
      data,
    })
  );
};
