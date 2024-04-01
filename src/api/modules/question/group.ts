// @desc 学习小组接口
// @author 江玉龙
// @date 2022年06月16日

import { defHttp } from '@/api/request/newIndex';

enum Api {
  Secede = '/service/group/quit',
  Edit = '/service/group/',
  Info = '/service/group/',
  Week = '/service/group/rank/week',
  Day = '/service/group/rank/day',
  Join = '/service/group/join',
  Remind = '/service/group/reminder',
  Our = '/service/group/rank/member',
  Key = '/service/group/invite',
}

// 退出小组
export const secedeGroup = (data: any) => {
  return Promise.resolve(
    defHttp.put({
      url: Api.Secede,
      data,
    })
  );
};
// 修改小组
export const editGroup = (data: any) => {
  return Promise.resolve(
    defHttp.put({
      url: Api.Edit,
      data,
    })
  );
};
// 获取小组信息
export const getGroupInfo = (data: any) => {
  return Promise.resolve(
    defHttp.get({
      url: Api.Info,
      data,
    })
  );
};
// 周榜
export const getWeekList = (data: any) => {
  return Promise.resolve(
    defHttp.get({
      url: Api.Week,
      data,
    })
  );
};
// 日榜
export const getDayList = (data: any) => {
  return Promise.resolve(
    defHttp.get({
      url: Api.Day,
      data,
    })
  );
};
// 邀请流程 加入小组
export const joinGroup = (data: any) => {
  return Promise.resolve(
    defHttp.put({
      url: Api.Join + `?shareCode=${data.shareCode}`,
    })
  );
};
// 一键提醒
export const goRemind = (data: any) => {
  return Promise.resolve(
    defHttp.get({
      url: Api.Remind,
      data,
    })
  );
};
// 我的小组人员的排行榜
export const getOurGroup = (data: any) => {
  return Promise.resolve(
    defHttp.get({
      url: Api.Our,
      data,
    })
  );
};
// 获取临时code
export const getCode = (data: any) => {
  return Promise.resolve(
    defHttp.get({
      url: Api.Key,
      data,
    })
  );
};
