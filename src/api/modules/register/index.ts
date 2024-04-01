// @desc 登录和首页接口
// @author 江玉龙
// @date 2022年04月28日
import { defHttp } from '@/api/request/newIndex';
import request from '@/api/request';

enum Api {
  Phone = '/auth/login/miniapp/mobile',
  Register = '/auth/login/third',
  UserInfo = '/auth/student/info',
  Home = '/app/index',
  MiniPhone = '/auth/login/mini/mobile',
  Edit = '/auth/student/info',
  Enterprise = '/util/org/',
  tourist = '/auth/login/guest/auth',
  Official = '/auth/student/wechat/subscribe',
  Code = '/auth/login/verifyCode',
  CodeLogin = '/auth/login/mobile',
  PasswordLogin = '/auth/login/password',
  CheckMessageCode = '/auth/login/mobile/verify',
  ResetPassword = '/auth/login/password',
  CancelCode = '/auth/cancel/confirm', //注销发送验证码
  CancelCheck = '/auth/cancel', //确认注销
  GetAccordAddress = '/base/app/channelById',
  editCompany = '/auth/student/update/org',
}
// 获取短信验证码
export const getCode = (data: any) => {
  return Promise.resolve(
    defHttp.get({
      url: Api.Code,
      data,
    })
  );
};
// 手机验证码验证登录
export const goCodeLogin = (data: any) => {
  return Promise.resolve(
    defHttp.post({
      url:
        Api.CodeLogin +
        `?sessionKey=${data.sessionKey}&code=${data.code}&channelId=${data.channelId}`,
    })
  );
};
// 关注公众号
export const getOfficialAccount = (data: any) => {
  return Promise.resolve(
    defHttp.get({
      url: Api.Official,
      data,
    })
  );
};
//游客登录
export const touristSign = (data: any) => {
  return Promise.resolve(
    defHttp.post({
      url: Api.tourist,
      data,
    })
  );
};
// 第三方手机号
export const getPhone = (data: any, shareCode: any) => {
  let url = shareCode ? Api.Phone + `?shareCode=${shareCode}` : Api.Phone;
  return Promise.resolve(
    defHttp.post({
      url: url,
      data,
    })
  );
};
// 第三方手机号
export const getMiniPhone = (data: any, shareCode: any) => {
  let url = shareCode ? Api.MiniPhone + `?shareCode=${shareCode}` : Api.MiniPhone;
  return Promise.resolve(
    defHttp.post({
      url: url,
      data,
    })
  );
};
// 登录
export const getRegister = (data: any) => {
  return Promise.resolve(
    defHttp.post({
      url: Api.Register,
      data,
    })
  );
};
//获取用户信息
export const getUserInfo = () => {
  return Promise.resolve(
    defHttp.get({
      url: Api.UserInfo,
    })
  );
};
// 首页
export const homePage = (data: any) => {
  return Promise.resolve(
    request({
      url: Api.Home,
      method: 'GET',
      data,
    })
  );
};
// 修改-用户基础信息
export const editUserInfo = (data: any) => {
  return Promise.resolve(
    defHttp.put({
      url: Api.Edit,
      data,
    })
  );
};
//修改用户个人单位
export const editUserCompany = (data: any) => {
  return Promise.resolve(
    defHttp.post({
      url: Api.editCompany,
      data,
    })
  );
};
// 查询企业信息接口
export const getEnterpriseList = (data: any) => {
  return Promise.resolve(
    defHttp.post({
      url: Api.Enterprise + `?key=${data.key}&index=${data.index}&row=${data.row}`,
    })
  );
};
// 密码登录接口
export const passwordLogin = (data: any) => {
  return Promise.resolve(
    defHttp.post({
      url: Api.PasswordLogin,
      data,
    })
  );
};
// 验证验证码是否正确接口
export const checkMessageCode = (data: any) => {
  return Promise.resolve(
    defHttp.post({
      url:
        Api.CheckMessageCode +
        `?code=${data.code}&sessionKey=${data.sessionKey}&channelId=${data.channelId}`,
      // data,
    })
  );
};
// 重置密码
export const resetPassword = (data: any) => {
  return Promise.resolve(
    defHttp.put({
      url: Api.ResetPassword,
      data,
    })
  );
};
// 获取协议地址
export const getAccordAddress = (id: any) => {
  return Promise.resolve(
    defHttp.get({
      url: Api.GetAccordAddress + `?id=${id}`,
    })
  );
};
// 获取注销用户验证码
export const getCancelCode = (data: any) => {
  return Promise.resolve(
    defHttp.put({
      url: Api.CancelCode,
    })
  );
};
// 验证注销用户验证码
export const checkCancelCode = (data: any) => {
  return Promise.resolve(
    defHttp.put({
      url: Api.CancelCheck,
      data,
    })
  );
};
