// 收货地址管理
import { defHttp } from '@/api/request/newIndex';

enum Api {
  Add = '/user/address/',
  Edit = '/user/address/',
  Detail = '/user/address/',
  List = '/user/address/list',
  Delete = '/user/address/delete',
  reFill = '/trade/order/address',
}

// 新增地址
export const addAddress = (data: any) => {
  return Promise.resolve(
    defHttp.post({
      url: Api.Add,
      data,
    })
  );
};
// 编辑地址
export const editAddress = (data: any) => {
  return Promise.resolve(
    defHttp.put({
      url: Api.Edit,
      data,
    })
  );
};
// 查询地址详情
export const getAddressDetail = (data: any) => {
  return Promise.resolve(
    defHttp.get({
      url: Api.Detail,
      data,
    })
  );
};
// 查询地址列表
export const getAddressList = (data: any) => {
  return Promise.resolve(
    defHttp.post({
      url: Api.List,
      data,
    })
  );
};
// 删除地址
export const deleteAddress = (data: any) => {
  return Promise.resolve(
    defHttp.put({
      url: Api.Delete + `?id=${data.id}`,
    })
  );
};
// 补填地址
export const reFillAddress = (data: any) => {
  return Promise.resolve(
    defHttp.put({
      url: Api.reFill,
      data,
    })
  );
};
