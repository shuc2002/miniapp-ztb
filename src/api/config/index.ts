import { ChannelApiUrl, ChannelOSSApi, ChannelSocketApi, BaseFormUrl } from '@/enums/envEnum';
import baseInfo from '@/build/index';

export const baseUrl = ChannelApiUrl[baseInfo.ENV];
export const clientUrl = BaseFormUrl[baseInfo.ENV];
export const selectUrl = ChannelOSSApi[baseInfo.ENV];
export const socketUrl = ChannelSocketApi[baseInfo.ENV];
export const baseStatic = 'https://app.static.wangxiao.cn/miniprogram';

// 需要加供应商id的地址白名单
export const SUPPLIERID_WHITE_LIST = [
  '/shelves/my/sku/lessons',
  '/shelves/my/lesson',
  '/shelves/my/lesson1',
  '/shelves/commodity/getStudyStat',
  '/shelves/my/v2/lesson/authorize',
  '/resource/lesson',
  '/resource/lesson/get/Propertice/types',
  '/resource/lesson/get/questions',
  '/resource/lesson/review',
  '/resource/lesson/submit',
  '/resource/lesson/analysis',
  '/resource/lesson/do/wrong',
  '/resource/lesson/certificate/exam/analysis',
  '/resource/lesson/analysis/detail',
  '/resource/lesson/exam/pause',
  '/resource/lesson/exam/start',
  '/resource/video/heartbeat',
  '/resource/question/record',
  '/resource/material/record',
  '/resource/material/study/record',
  '/resource/live/record',
  '/resource/lesson/live/replay/record',
  '/resource/lesson/live/replay',
  '/resource/lesson/exam',
  '/trade/order',
  '/trade/order/detail',
  '/shelves/commodity/products',
  '/trade/order/contract/sign',
  '/trade/order/contract/authentication',
  '/trade/order/contract/my/history',
  '/trade/order/contract/info',
  '/trade/payment',
  '/trade/v2/payment',
  '/trade/order/cancel',
  '/trade/order/address',
  '/trade/order/refund',
  '/trade/order/refund/cancel',
  '/trade/order/negotiations',
  '/trade/order/received',
  '/resource/my/mistakes/remove',
  '/resource/mistakes/submit',
  '/resource/my/collect',
  '/resource/collection/remove',
  '/resource/collection/check',
  '/resource/collect/mistake',
  '/resource/collect/submit',
  '/shelves/commodity/',
  '/trade/v2/payment/request',
];
