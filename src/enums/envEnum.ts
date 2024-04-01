/**
 * @description: 请求环境url
 */
export enum ChannelApiUrl {
  TEST = 'https://chestnut-develop.wangxiao.cn',
  DEV = 'https://embryon-develop.wangxiao.cn',
  PRODUCTION = 'https://develop.wangxiao.cn',
  MOCK = 'http://127.0.0.1:4523/mock/909170',
}
/**
 * @description: OSS环境url
 */
export enum ChannelOSSApi {
  TEST = 'https://chestnut-acc.wangxiao.cn/',
  DEV = 'https://chestnut-acc.wangxiao.cn/',
  PRODUCTION = 'https://acc.wangxiao.cn/',
}
/**
 * @description: webSocket环境url
 */
export enum ChannelSocketApi {
  TEST = 'wss://chestnut-develop.wangxiao.cn/connect/util/handshake/',
  DEV = 'wss://chestnut-develop.wangxiao.cn/connect/util/handshake/',
  PRODUCTION = 'wss://develop.wangxiao.cn/connect/util/handshake/',
}
/**
 * @description: 开发平台
 */
export enum ChannelEnum {
  Mbaidu = 'bd',
  Mtoutiao = 'dy',
  Mweixin = 'wx',
}

export enum BaseFormUrl {
  TEST = 'https://chestnut-client.wangxiao.cn',
  DEV = 'https://embryon-client.wangxiao.cn',
  PRODUCTION = 'https://client.wangxiao.cn',
}
