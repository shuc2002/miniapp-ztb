import { defHttp } from '@/api/request/newIndex';

enum Api {
  fetchCourseInfo = '/shelves/commodity/tiled/byType1',
}

// 获取章节课信息
export const fetchCourseInfo = (data: any) => {
  return Promise.resolve(
    defHttp.post({
      url: Api.fetchCourseInfo,
      data,
    })
  );
};
