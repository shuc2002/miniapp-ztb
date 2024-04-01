// @desc 消息接口
// @author 江玉龙
// @date 2022年08月12日
import { defHttp } from '@/api/request/newIndex';

enum Api {
  Info = '/util/info/latest',
}

// 获取最新考试资讯
export const getInformation = (data: any) => {
  return Promise.resolve(
    defHttp.get({
      url: Api.Info,
      data,
    })
  );
};
