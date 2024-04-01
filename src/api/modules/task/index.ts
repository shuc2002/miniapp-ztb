// @desc 任务模块接口
// @author 戴聪杰
// @date 2022年07月12日
import { defHttp } from '@/api/request/newIndex';

enum Api {
  List = '/util/mission/list',
  Sign = '/util/mission/finish',
  GetSign = '/util/mission/sign',
  Record = '/trade/integral/record',
}

// 获取渠道任务列表（除签到）
export const getTaskList = (data: any) => {
  return Promise.resolve(
    defHttp.get({
      url: Api.List,
      data,
    })
  );
};
// 获取签到任务内容
export const getSign = (data: any) => {
  return Promise.resolve(
    defHttp.get({
      url: Api.GetSign,
      data,
    })
  );
};
// 每日签到
export const finishTask = (data) => {
  return Promise.resolve(
    defHttp.put({
      url: Api.Sign + `?missionId=${data.missionId}`,
    })
  );
};
// 查询积分记录
export const getRecord = (data: any) => {
  return Promise.resolve(
    defHttp.post({
      url: Api.Record,
      data,
    })
  );
};
