// @desc 每日一练接口
// @author 江玉龙
// @date 2022年04月28日
import { defHttp } from '@/api/request/newIndex';

enum Api {
  Sign = '/service/daily',
  Calendar = '/service/daily/calendar',
  SumNum = '/service/daily/sum',
  Empower = '/service/daily/receive',
  Content = '/resource/daily',
  Setting = '/service/daily/setting',
  Statistics = '/service/daily/statistics',
  Replace = '/service/daily/replacement',
  Share = '/service/daily/share',
  TrialPractice = '/resource/lesson?flag=true',
  SaveDaily = '/resource/daily/middle/submit',
}

// 检测是否领取
export const checkSign = () => {
  return Promise.resolve(
    defHttp.get({
      url: Api.Sign,
    })
  );
};
// 每日一练分享
export const dailyShare = (code) => {
  return Promise.resolve(
    defHttp.put({
      url: Api.Share + `?code=${code}`,
    })
  );
};
// 日历
export const getCalendar = () => {
  return Promise.resolve(
    defHttp.get({
      url: Api.Calendar,
    })
  );
};
// 获取首页每日一练打卡人数
export const getBrushList = (data) => {
  return Promise.resolve(
    defHttp.get({
      url: Api.SumNum,
      data,
    })
  );
};
// 授权
export const getEmpower = (id) => {
  return Promise.resolve(
    defHttp.put({
      url: Api.Empower + `?subjectId=${id}`,
    })
  );
};
// 获取每日一练内容
export const getBrushContent = (data: any) => {
  return Promise.resolve(
    defHttp.get({
      url: Api.Content,
      data,
    })
  );
};
// 获取每日一练设置
export const getSetting = (data: any) => {
  return Promise.resolve(
    defHttp.get({
      url: Api.Setting,
      data,
    })
  );
};
// 设置
export const toSetting = (data: any) => {
  return Promise.resolve(
    defHttp.put({
      url: Api.Setting + `?minutes=${data.minutes}&hour=${data.hour}`,
      data: [],
    })
  );
};
// 获取每日一练统计
export const getStatistics = (data: any) => {
  return Promise.resolve(
    defHttp.get({
      url: Api.Statistics,
      data,
    })
  );
};
// 积分补卡
export const replaceCard = (data: any) => {
  return Promise.resolve(
    defHttp.put({
      url: Api.Replace + `?day=${data.day}`,
    })
  );
};
// 试学练习
export const getTrialPractice = (data: any) => {
  console.log('data---', data);
  return Promise.resolve(
    defHttp.get({
      url: Api.TrialPractice,
      data,
    })
  );
};
// 暂存每日一练
export const saveDailyExercise = (data: any) => {
  return Promise.resolve(
    defHttp.put({
      url: Api.SaveDaily,
      data,
    })
  );
};
