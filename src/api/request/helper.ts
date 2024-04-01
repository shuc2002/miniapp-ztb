const qs = require('qs');

/**
 * 通过防抖函数来优化同时出现多个请求错误提示
 * @param errMessage {string} 错误提示信息
 */
export function createErrorMessage(errMessage: string) {
  uni.showToast({
    title: errMessage,
    icon: 'none',
  });
}
/**
 * @description:code白名单
 */
export const whiteCodeList = [
  { code: 1000 },
  { code: 3503, des: '不能加入自己的组' },
  { code: 3500, des: '重复加入组' },
  { code: 2029, des: '每日一练授权' },
  { code: 2061, des: '没有获取到小组id' },
  // { code: 2064, des: '没有考试次数了' },
  { code: 2038, des: '没有足够的积分' },
  { code: 2037, des: '选中项目' },
  { code: 2068, des: '商品已购买' },
  { code: 2069, des: '优惠券已领完' },
  { code: 2003, des: '操作太频繁' },
  { code: 2088, des: '兑换码无效' },
  { code: 2085, des: '兑换码已兑换' },
  { code: 2087, des: '超出商品限购数量' },
  { code: 3505, des: '小组已经提醒' },
  { code: 2086, des: '商品不在购买时间' },
  { code: 2005, des: '验证码错误' },
  { code: 2004, des: '验证码已过期，请重试' },
  { code: 1001, des: '操作太频繁' },
  { code: 1017, des: '手机号或密码错误' },
];

/**
 * @description 生成唯一的key，标识缓存
 */
export function generateUniqueKey(url, params) {
  // 对参数进行排序
  const sortedParams = Object.fromEntries(
    Object.entries(params).sort(([aKey], [bKey]) => aKey.localeCompare(bKey))
  );

  // 将URL和参数组合成一个字符串
  const urlWithParams = url + '?' + qs.stringify(sortedParams);

  // 使用哈希算法对排序后的字符串进行计算，生成唯一的key
  // const uniqueKey = crypto.createHash('sha256').update(urlWithParams).digest('hex');

  return urlWithParams;
}
