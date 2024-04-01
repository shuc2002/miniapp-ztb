import request from '@/api/request';
import { selectUrl } from '@/api/config/index';
import { defHttp } from '@/api/request/newIndex';

enum Api {
  Photo = 'https://app.static.wangxiao.cn/ztb/resources/users.json',
  Exam = '/base/construct/channel',
  StoragePro = '/service/base/project',
  Configure = '/service/base/setting/channel',
  Course = '/shelves/my/lessons',
  Constructs = '/shelves/my/lesson1',
  Authorize = '/shelves/my/lesson/authorize',
  NewAuthorize = '/shelves/my/v2/lesson/authorize',
  Record = '/util/advert/record',
  Socket = '/util/socket/send',
  ShareCode = '/util/mission/share/code',
  Set = '/push/push/switch/info',
  Modify = '/push/push/switch/update',
  MyExam = '/service/base/record/channel',
  ChannelId = '/base/app/channel',
  H5ChannelId = '/base/app/channel/platform',
  Replay = '/resource/lesson/live/replay',
  Mysubjects = '/service/base/subject/record',
  CommodityPro = '/shelves/commodity/sku/products',
  ExamTag = '/base/construct/tag/scene',
  PersonalCenter = '/base/shopDecorateTemplate/getTemplate',
  ChannelMsg = '/base/app/application',
  TenantInfo = '/base/app/tenant/info',
}

export const getPhotoJson = () => {
  return Promise.resolve(
    request({
      url: Api.Photo,
      method: 'GET',
      isJson: true,
      noBase: true,
    })
  );
};

// // 获取广告列表
export const getAdvertList = (data: any) => {
  const date = new Date().getTime();
  return Promise.resolve(
    request({
      url:
        selectUrl +
        `advert/${data.tenantId}/${data.type}/${data.productId}/advert.json?timestamp=${date}`,
      method: 'GET',
      isJson: true,
      noBase: true,
    })
  );
};
// 获取考试项目
export const getExamList = (data: any) => {
  return Promise.resolve(
    defHttp.get({
      url: Api.Exam,
      data,
    })
  );
};

// 获取考试项目带标签分类
export const getExamTagList = (data: any) => {
  return Promise.resolve(
    defHttp.get({
      url: Api.ExamTag,
      data,
    })
  );
};

// 存储用户项目信息
export const setProject = (data: any) => {
  return Promise.resolve(
    // defHttp.put({
    //   url: Api.StoragePro + `?id=${id}`,
    // })
    defHttp.post({
      url: Api.StoragePro,
      data,
    })
  );
};
// 获取用户基本配置
export const getConfigure = (data: any) => {
  return Promise.resolve(
    defHttp.get({
      url: Api.Configure,
      data,
    })
  );
};
// 获取用户课程
export const getCourse = (data: any) => {
  return Promise.resolve(
    defHttp.get({
      url: Api.Course,
      data,
    })
  );
};
// 获取课程的产品结构
export const getConstructs = (data: any) => {
  return Promise.resolve(
    defHttp.get({
      url: Api.Constructs,
      data,
    })
  );
};
// 获取学习单元授权
export const getAuthorize = (data: any) => {
  return Promise.resolve(
    defHttp.get({
      url: Api.Authorize,
      data,
    })
  );
};
// 获取学习单元授权和产品协议授权状态
export const getAuthorizeAndSign = (data: any) => {
  return Promise.resolve(
    defHttp.get({
      url: Api.NewAuthorize,
      data,
    })
  );
};
//广告点击记录
export const addRecord = (data: any) => {
  return Promise.resolve(
    defHttp.post({
      url: Api.Record,
      data,
    })
  );
};
//测试socket
export const getSocket = (data: any) => {
  return Promise.resolve(
    defHttp.get({
      url: Api.Socket,
      data,
    })
  );
};
//获取shareCode
export const getShareCode = (data: any) => {
  return Promise.resolve(
    defHttp.get({
      url: Api.ShareCode,
      data,
    })
  );
};
// 获取个人配置信息
export const getSetup = (data: any) => {
  return Promise.resolve(
    defHttp.get({
      url: Api.Set,
      data,
    })
  );
};
// 修改通知按钮状态
export const setModify = (data: any) => {
  return Promise.resolve(
    defHttp.get({
      url: Api.Modify,
      data,
    })
  );
};

// 获取我的考试
export const getMyExam = (data: any) => {
  return Promise.resolve(
    defHttp.get({
      url: Api.MyExam,
      data,
    })
  );
};

// 查询渠道id
export const getChannelId = (data: any) => {
  return Promise.resolve(
    defHttp.post({
      url: Api.ChannelId,
      data,
    })
  );
};

// 查询H5渠道id
export const getH5ChannelId = (data: any) => {
  return Promise.resolve(
    defHttp.get({
      url: Api.H5ChannelId,
      data,
    })
  );
};

// 获取直播间回放列表
export const getReplay = (data: any) => {
  return Promise.resolve(
    defHttp.get({
      url: Api.Replay,
      data,
    })
  );
};
// 获取用户已选择的科目
export const getMySubjects = (id: string) => {
  return Promise.resolve(
    defHttp.get({
      url: Api.Mysubjects + `?projectId=${id}`,
    })
  );
};
//获取兑换的商品课程列表
export const getCommodityProducts = (data: any) => {
  return Promise.resolve(
    defHttp.get({
      url: Api.CommodityPro,
      data,
    })
  );
};
//获取个人中心模版配置
export const getPersonalCenter = (data: any) => {
  return Promise.resolve(
    defHttp.post({
      url: Api.PersonalCenter,
      data,
    })
  );
};
// 客户端调用渠道信息
export const getChannelMsg = () => {
  return Promise.resolve(
    defHttp.get({
      url: Api.ChannelMsg,
    })
  );
};

//获取机构信息
export const getTenantInfo = () => {
  return Promise.resolve(
    defHttp.get({
      url: Api.TenantInfo,
    })
  );
};
