import { defHttp } from '@/api/request/newIndex';

enum Api {
  MemberCard = '/shelves/member/card/list',
  MaxCard = '/shelves/member/max/card',
}
// 获取会员卡列表
export const getMemberCard = (id: string) => {
  return Promise.resolve(
    defHttp.get({
      url: Api.MemberCard + `?projectId=${id}`,
    })
  );
};

//  获取会员卡信息
export const getMaxCard = (id: string) => {
  return Promise.resolve(
    defHttp.get({
      url: Api.MaxCard + `?projectId=${id}`,
    })
  );
};
