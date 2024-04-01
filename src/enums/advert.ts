import { ChannelOSSApi } from '@/enums/envEnum';
import baseInfo from '@/build/index';
export const baseUrl = ChannelOSSApi[baseInfo.ENV] + 'inner/image/';
/**
 * @description: 广告地址
 */
export const AdertUrl = {
  Home: baseUrl + '7a5c8440da484523bb8ffa1e03af1937.png',
  Mine: baseUrl + '8f92cb8f216d4edeade1692c611617c1.png',
  Info: baseUrl + 'd6dc9ec1ce784a08abf109bba7030b86.png',
  Material: baseUrl + '02fef59cae7f4c4a876b0cfc1f783d04.png',
};
// 首页 ：https://chestnut-acc.wangxiao.cn/inner/image/7a5c8440da484523bb8ffa1e03af1937.png
// 个人中心：https://chestnut-acc.wangxiao.cn/inner/image/8f92cb8f216d4edeade1692c611617c1.png
// 资讯详情：https://chestnut-acc.wangxiao.cn/inner/image/d6dc9ec1ce784a08abf109bba7030b86.png
// 考点资料：https://chestnut-acc.wangxiao.cn/inner/image/02fef59cae7f4c4a876b0cfc1f783d04.png
