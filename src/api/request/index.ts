import { baseUrl } from '../config/index';
import errorMessage from '@/api/messageInfo';
import { ResultEnum, RequestEnum, ContentTypeEnum } from '@/enums/httpEnum';
interface RequestOptionsRquest {
  url: string;
  method?: 'OPTIONS' | 'GET' | 'HEAD' | 'POST' | 'PUT' | 'DELETE' | 'TRACE' | 'CONNECT';
  data?: {};
  page?: {};
  isJson?: boolean;
  noBase?: boolean; //不需要baseUrl拼接
}

export default ({
  url,
  method = RequestEnum.GET,
  data = {},
  page = {},
  isJson = true,
  noBase = false,
}: RequestOptionsRquest) => {
  const contentType = isJson ? ContentTypeEnum.JSON : ContentTypeEnum.FORM_URLENCODED;
  if (!noBase) {
    url = baseUrl + url;
  }
  if (method == RequestEnum.POST) {
    data = { bizBody: data, page: page };
  }
  return new Promise((resolve, reject) => {
    uni.request({
      url: url,
      method,
      data,
      header: {
        'content-type': contentType,
        token: uni.getStorageSync('token'),
      },
      success: (res: any) => {
        if (noBase) {
          if (res.statusCode == 404) {
            resolve(null);
          } else {
            resolve(res.data);
          }
        } else {
          // if (res.data.code == ResultEnum.SUCCESS) {
          resolve(res.data.biz_body);
          // } else if (res.data.code == ResultEnum.TOKEN_ERROR) {
          //   uni.showToast({
          //     title: errorMessage.ServerError,
          //     icon: 'none',
          //   });
          //   uni.navigateTo({
          //     url: '/home/login/login',
          //   });
          // } else {
          //   uni.showToast({
          //     title: errorMessage.requestError,
          //     icon: 'none',
          //   });
          //   reject('网络连接失败');
          // }
        }
        uni.stopPullDownRefresh();
      },
      fail: () => {
        if (noBase) {
          resolve([]);
        }
        uni.hideLoading();
        uni.stopPullDownRefresh();
        uni.showToast({
          title: errorMessage.NetError,
          icon: 'none',
        });
        reject('网络连接失败');
      },
    });
  });
};
