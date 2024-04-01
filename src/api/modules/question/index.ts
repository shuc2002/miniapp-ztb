// @desc 学习单元接口
// @author daisitin
// @date 2022年06月17日
import { defHttp } from '@/api/request/newIndex';

enum Api {
  Collect = '/resource/my/collect',
  Record = '/resource/question/record',
  Submit = '/resource/lesson/submit',
  DailySubmit = '/resource/daily/submit',
  TypeList = '/resource/lesson/get/Propertice/types',
  QuestionByType = '/resource/lesson/get/questions?flag=true',
  ExamineQuestion = '/resource/lesson?flag=true', // 试学练习
}
//收藏
export const doCollect = (data: any) => {
  return Promise.resolve(
    defHttp.post({
      url: Api.Collect + `?code=${data.code}&id=${data.id}&index=${data.index}`,
      data,
    })
  );
};

//单题提交
export const questionRecord = (data: any) => {
  return Promise.resolve(
    defHttp.post({
      url: Api.Record,
      data,
    })
  );
};

//提交答题卡
export const submitQuestion = (data) => {
  return Promise.resolve(
    defHttp.put({
      url: Api.Submit,
      data,
    })
  );
};
//提交答题卡
export const submitDaily = (data) => {
  return Promise.resolve(
    defHttp.put({
      url: Api.DailySubmit,
      data,
    })
  );
};

// 查询练习模式筛选项
export const getQuestionType = (data) => {
  return Promise.resolve(
    defHttp.get({
      url: Api.TypeList + `?code=${data}`,
    })
  );
};

// 练习模式获取题目
export const getUnitListByType = (data) => {
  return Promise.resolve(
    defHttp.post({
      url: Api.QuestionByType,
      data,
    })
  );
};

// 试学练习
export const getExamineQuestion = (data) => {
  return Promise.resolve(
    defHttp.post({
      url: Api.ExamineQuestion,
      data,
    })
  );
};
