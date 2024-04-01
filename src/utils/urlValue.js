/**
 * @name getUrlValue
 * @description 获取url中的某个参数的值
 * @param attr 获取参数的key(必填项)
 * @param url http://xxx.com?a=1&b=qqq
 * @returns
 * @example getUrlValue('a','http://jjjjj?a=1&b=2')).toBe('1')
 */
export function getUrlValue(attr, url) {
  url = url ? url : window.location.href;
  const index = url.indexOf('?');
  return url
    .slice(index + 1)
    .split('&')
    .reduce((pre, cur) => {
      pre[cur.split('=')[0]] = cur.split('=')[1];
      return pre;
    }, {})[attr];
}
