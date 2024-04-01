import baseInfo from '@/build/index';
export const payRedirctURl = {
  // DEV: 'https://embryon-platform.wangxiao.cn/siteH5/#/',
  // TEST: 'https://chestnut-platform.wangxiao.cn/siteH5/#/',
  // PRODUCTION: 'https://platform.wangxiao.cn/siteH5/#/',
  DEV: 'https://sh5xpay.wangxiao.cn/#/',
  TEST: 'https://uh5xpay.wangxiao.cn/#/',
  PRODUCTION: 'https://h5xpay.wangxiao.cn/#/',
};
export function getPayRedicrtUrl() {
  const mode = baseInfo.ENV;
  return payRedirctURl[mode];
}
//证书查询对应地址
export const queryCertificateUrl = {
  DEV: 'https://embryon-platform.wangxiao.cn/h5/#/queryCertificate',
  TEST: 'https://chestnut-platform.wangxiao.cn/h5/#/queryCertificate',
  PRODUCTION: 'https://platform.wangxiao.cn/h5/#/queryCertificate',
};
export function getQueryCertificateUrl() {
  const mode = baseInfo.ENV;
  return queryCertificateUrl[mode];
}
