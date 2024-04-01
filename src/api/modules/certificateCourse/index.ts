/* 证书课程相关接口 */
import { defHttp } from '@/api/request/newIndex';
import request from '@/api/request';

enum Api {
  Status = '/util/certificate/sign/form',
  enroll = '/util/certificate/sign/up',
  Report = '/util/certificate/exam/transcripts',
  PopRecord = '/util/certificate/cert/count',
}
//获取报名状态
export const getApplicationStatus = (data: any) => {
  return Promise.resolve(
    defHttp.get({
      url: Api.Status,
      data,
    })
  );
};
//证书课程报名接口
export const certCourseRegistration = (data: any) => {
  return Promise.resolve(
    defHttp.post({
      url: Api.enroll,
      data,
    })
  );
};
//证书考试成绩单
export const getExamReports = (data: any) => {
  return Promise.resolve(
    defHttp.get({
      url: Api.Report,
      data,
    })
  );
};
//证书课程审核状态弹窗记录
export const certCoursePopRecord = (data: any) => {
  return Promise.resolve(
    defHttp.post({
      url: Api.PopRecord,
      data,
    })
  );
};
