import { certCourseRegistration } from './../certificateCourse/index';
// @desc 证书课程
import { defHttp } from '@/api/request/newIndex';
import request from '@/api/request';

enum Api {
  certificateList = '/util/certificate/list',
  certificateDetail = '/util/certificate/detail',
  certificateExam = '/util/certificate/exam/list',
  certificateCheckExam = '/util/certificate/check/exam',
  certificateExamAnalysis = '/resource/lesson/certificate/exam/analysis',
  certificateLessons = '/shelves/my/certificate/lessons',
}
// 获取证书列表
export const fetchCertificateList = (data: any) => {
  return Promise.resolve(
    defHttp.post({
      url: Api.certificateList,
      data,
    })
  );
};

// 获取证书详情
export const fetchCertificateDetail = (data: any) => {
  return Promise.resolve(
    defHttp.get({
      url: Api.certificateDetail,
      data,
    })
  );
};
// 获取证书考试
export const fetchCertificateExam = (data: any) => {
  return Promise.resolve(
    defHttp.get({
      url: Api.certificateExam,
      data,
    })
  );
};

// 获取证书考试
export const fetchCheckExam = (data: any) => {
  return Promise.resolve(
    defHttp.post({
      url: Api.certificateCheckExam,
      data,
    })
  );
};

// 获取单科成绩单
export const fetchExamAnalysis = (data: any) => {
  return Promise.resolve(
    defHttp.get({
      url: Api.certificateExamAnalysis,
      data,
    })
  );
};

// 获取证书课程
export const fetchCertificateLessons = (data: any) => {
  return Promise.resolve(
    defHttp.get({
      url: Api.certificateLessons,
      data,
    })
  );
};
