import { RequestEnum, ResultEnum, ContentTypeEnum } from '@/enums/httpEnum';
import { baseUrl } from '../config/index';
import baseInfo from '@/build/index';
import { BaiduChannelId, DouyinChannelId, WeixinChannelId, H5ChannelId } from '@/enums/msgEnum';
// import { createErrorMessage } from '@/api/request/helper';

function uploadFiles(baseUploadUrl: string, filepath: any, formdata: any) {
  let channelId = '';
  /* #ifdef H5 */
  channelId = H5ChannelId[baseInfo.CHANNEL];
  /* #endif */
  /* #ifdef MP-TOUTIAO */
  channelId = DouyinChannelId[baseInfo.CHANNEL];
  /* #endif */
  /* #ifdef MP-BAIDU */
  channelId = BaiduChannelId[baseInfo.CHANNEL];
  /* #endif */
  /* #ifdef MP-WEIXIN */
  channelId = WeixinChannelId[baseInfo.CHANNEL];
  /* #endif */
  // baseUploadUrl:cos上传地址
  //filepath:文件地址
  //formdata:表单元素

  let clientOrigin = '';
  /* #ifdef H5 */
  clientOrigin = window.location.origin;
  /* #endif */
  return new Promise((resolve, reject) => {
    uni.uploadFile({
      url: baseUrl + baseUploadUrl,
      filePath: filepath,
      name: 'file',
      header: {
        Authorization: 'Thor ' + uni.getStorageSync('token'),
        'client-channel-id': channelId,
        /* #ifdef H5 */
        platform: uni.getSystemInfoSync().uniPlatform,
        'client-origin': clientOrigin,
        /* #endif */
      },
      formData: {
        'Content-Type': ContentTypeEnum.FORM_DATA,
      },
      success: async (response) => {
        console.log(response);
        if (response.statusCode !== 200) {
          uni.showToast({
            title: '上传失败',
            icon: 'none',
          });
        } else {
          // let url = baseUploadUrl + formdata.data.key;
          /* #ifndef MP-WEIXIN || H5 */
          resolve(response.data);
          /* #endif */
          /* #ifdef MP-WEIXIN || H5 */
          resolve(JSON.parse(response.data));
          /* #endif */
        }
      },
      fail(error) {
        reject(error);
      },
    });
  });
}

function downloadFiles(url: string) {
  return new Promise((resolve, reject) => {
    uni.downloadFile({
      url, //仅为示例，并非真实的资源
      success: (res) => {
        if (res.statusCode === 200) {
          uni.showToast({
            title: '下载成功',
            icon: 'none',
          });
        }
      },
      fail(error) {
        reject(error);
      },
    });
  });
}
module.exports = {
  uploadFiles,
  downloadFiles,
};
