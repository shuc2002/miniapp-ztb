import { defHttp } from '@/api/request/newIndex';

enum Api {
  getChapterTabs = '/resource/lesson/getChapterTab',
  getCourseInfo = '/resource/lesson/getCourseInfo',
  getPageInfo = '/base/shopDecorateTemplate/getHomePage',
  getDailyExerciseRecord = '/resource/daily/daily/record',
  InfoList = '/util/info/page/list',
  DefaultProject = '/base/construct/channel/default',
}

// 获取章节课tabs
export const getChapterTabs = (data: any) => {
  return Promise.resolve(
    defHttp.post({
      url: Api.getChapterTabs,
      data,
    })
  );
};

// 获取课程信息
export const getCourseInfo = (data: any) => {
  return Promise.resolve(
    defHttp.post({
      url: Api.getCourseInfo,
      data,
    })
  );
};

// 获取首页模板
export const getHomePage = (data: any) => {
  return Promise.resolve(
    defHttp.post({
      url: Api.getPageInfo,
      data,
    })
  );
};

// 获取每日一练的记录
export const getDailyExerciseRecord = (data: any) => {
  return Promise.resolve(
    defHttp.get({
      url: Api.getDailyExerciseRecord + `?projectId=${data.projectId}&subjectId=${data.subjectId}`,
    })
  );
};

// 获取资讯列表
export const getInfoList = (data: any) => {
  return Promise.resolve(
    defHttp.post({
      url: Api.InfoList,
      data,
    })
  );
};

// 未登录状态下-获取默认项目科目
export const getDefaultProject = (data: any) => {
  return Promise.resolve(
    defHttp.get({
      url: Api.DefaultProject,
      data,
    })
  );
};
