import { defHttp } from '@/api/request/newIndex';

enum Api {
  AgreeList = '/trade/order/contract/my/history',
}

// 获取协议列表
export const getAgreementList = (data: any) => {
  return Promise.resolve(
    defHttp.get({
      url: Api.AgreeList,
      data,
    })
  );
};
