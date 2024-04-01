// @desc 学习单元接口
// @author daisitin
// @date 2022年06月17日
import { defHttp } from '@/api/request/newIndex';

enum Api {
  List = '/resource/lesson?flag=true',
  Voucher = '/shelves/my/lesson/authorize',
  Info = '/resource/lesson/exam',
  PDF = '/resource/material/record',
  Analysis = '/resource/lesson/analysis',
  AnalysisList = '/resource/lesson/analysis/detail',
  WrongList = '/resource/lesson/do/wrong',
  Start = '/resource/lesson/exam/start',
  Pause = '/resource/lesson/exam/pause',
  Record = '/resource/video/heartbeat',
  ExamCode = '/resource/lesson/review',
  TouristCode = '/shelves/my/guest/authorize',
}

//获取游客访问学习单元code
export const getTouristCode = (data: any) => {
  return Promise.resolve(
    defHttp.get({
      url: Api.TouristCode,
      data,
    })
  );
};
// 获取题目内容
export const getUnitList = (data: any) => {
  return Promise.resolve(
    defHttp.get({
      url: Api.List,
      data,
    })
  );
};
//获取访问学习单元凭证
export const getVoucher = (data: any) => {
  return Promise.resolve(
    defHttp.get({
      url: Api.Voucher,
      data,
    })
  );
};
//获取访问学习单元code
export const getExamCode = (data: any) => {
  return Promise.resolve(
    defHttp.get({
      url: Api.ExamCode,
      data,
    })
  );
};
//获考试信息
export const getExamInfo = (data: any) => {
  return Promise.resolve(
    defHttp.get({
      url: Api.Info,
      data,
    })
  );
};
// 关闭pdf页面时发送
export const setPdfData = (data: any) => {
  return Promise.resolve(
    defHttp.post({
      url: Api.PDF,
      data,
    })
  );
};
//获取解析
export const getAnalysis = (data: any) => {
  return Promise.resolve(
    defHttp.get({
      url: Api.Analysis,
      data,
    })
  );
};
//获取解析列表
export const getAnalysisList = (data: any) => {
  return Promise.resolve(
    defHttp.get({
      url: Api.AnalysisList,
      data,
    })
  );
};
//获取解析列表
export const getWrongList = (data: any) => {
  return Promise.resolve(
    defHttp.get({
      url: Api.WrongList,
      data,
    })
  );
};
export const toStart = (code: any) => {
  return Promise.resolve(
    defHttp.get({
      url: Api.Start + `?code=${code}`,
    })
  );
};
//获取解析列表
export const toPause = (code) => {
  return Promise.resolve(
    defHttp.put({
      url: Api.Pause + `?code=${code}`,
    })
  );
};
// 视频心跳
export const setRecord = (data: any) => {
  return Promise.resolve(
    defHttp.post({
      url: Api.Record,
      data,
    })
  );
};
