!(function (e, n) {
  'object' == typeof exports && 'undefined' != typeof module
    ? (module.exports = n())
    : 'function' == typeof define && define.amd
    ? define(n)
    : ((e = e || self).uni = n());
})(this, function () {
  'use strict';
  try {
    var e = {};
    Object.defineProperty(e, 'passive', {
      get: function () {
        !0;
      },
    }),
      window.addEventListener('test-passive', null, e);
  } catch (e) {}
  var n = Object.prototype.hasOwnProperty;
  function i(e, i) {
    return n.call(e, i);
  }
  var t = [];
  function r() {
    return window.__dcloud_weex_postMessage || window.__dcloud_weex_;
  }
  var o = function (e, n) {
      var i = { options: { timestamp: +new Date() }, name: e, arg: n };
      if (r()) {
        if ('postMessage' === e) {
          var o = { data: [n] };
          return window.__dcloud_weex_postMessage
            ? window.__dcloud_weex_postMessage(o)
            : window.__dcloud_weex_.postMessage(JSON.stringify(o));
        }
        var a = { type: 'WEB_INVOKE_APPSERVICE', args: { data: i, webviewIds: t } };
        window.__dcloud_weex_postMessage
          ? window.__dcloud_weex_postMessageToService(a)
          : window.__dcloud_weex_.postMessageToService(JSON.stringify(a));
      }
      if (!window.plus)
        return window.parent.postMessage(
          { type: 'WEB_INVOKE_APPSERVICE', data: i, pageId: '' },
          '*'
        );
      if (0 === t.length) {
        var d = plus.webview.currentWebview();
        if (!d) throw new Error('plus.webview.currentWebview() is undefined');
        var s = d.parent(),
          w = '';
        (w = s ? s.id : d.id), t.push(w);
      }
      if (plus.webview.getWebviewById('__uniapp__service'))
        plus.webview.postMessageToUniNView(
          { type: 'WEB_INVOKE_APPSERVICE', args: { data: i, webviewIds: t } },
          '__uniapp__service'
        );
      else {
        var u = JSON.stringify(i);
        plus.webview
          .getLaunchWebview()
          .evalJS(
            'UniPlusBridge.subscribeHandler("'
              .concat('WEB_INVOKE_APPSERVICE', '",')
              .concat(u, ',')
              .concat(JSON.stringify(t), ');')
          );
      }
    },
    a = {
      navigateTo: function () {
        var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {},
          n = e.url;
        o('navigateTo', { url: encodeURI(n) });
      },
      navigateBack: function () {
        var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {},
          n = e.delta;
        o('navigateBack', { delta: parseInt(n) || 1 });
      },
      switchTab: function () {
        var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {},
          n = e.url;
        o('switchTab', { url: encodeURI(n) });
      },
      reLaunch: function () {
        var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {},
          n = e.url;
        o('reLaunch', { url: encodeURI(n) });
      },
      redirectTo: function () {
        var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {},
          n = e.url;
        o('redirectTo', { url: encodeURI(n) });
      },
      getEnv: function (e) {
        r() ? e({ nvue: !0 }) : window.plus ? e({ plus: !0 }) : e({ h5: !0 });
      },
      postMessage: function () {
        var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
        o('postMessage', e.data || {});
      },
    },
    d = /uni-app/i.test(navigator.userAgent),
    s = /Html5Plus/i.test(navigator.userAgent),
    w = /complete|loaded|interactive/;
  var u =
    window.my &&
    navigator.userAgent.indexOf(
      ['t', 'n', 'e', 'i', 'l', 'C', 'y', 'a', 'p', 'i', 'l', 'A'].reverse().join('')
    ) > -1;
  var g = window.swan && window.swan.webView && /swan/i.test(navigator.userAgent);
  var v =
    window.qq &&
    window.qq.miniProgram &&
    /QQ/i.test(navigator.userAgent) &&
    /miniProgram/i.test(navigator.userAgent);
  var c = window.tt && window.tt.miniProgram && /toutiaomicroapp/i.test(navigator.userAgent);
  var m =
    window.wx &&
    window.wx.miniProgram &&
    /micromessenger/i.test(navigator.userAgent) &&
    /miniProgram/i.test(navigator.userAgent);
  var p = window.qa && /quickapp/i.test(navigator.userAgent);
  var f =
    window.ks &&
    window.ks.miniProgram &&
    /micromessenger/i.test(navigator.userAgent) &&
    /miniProgram/i.test(navigator.userAgent);
  var l = window.tt && window.tt.miniProgram && /Lark|Feishu/i.test(navigator.userAgent);
  var _ =
    window.jd &&
    window.jd.miniProgram &&
    /micromessenger/i.test(navigator.userAgent) &&
    /miniProgram/i.test(navigator.userAgent);
  var E = window.xhs && window.xhs.miniProgram && /xhsminiapp/i.test(navigator.userAgent);
  for (
    var h,
      P = function () {
        (window.UniAppJSBridge = !0),
          document.dispatchEvent(
            new CustomEvent('UniAppJSBridgeReady', { bubbles: !0, cancelable: !0 })
          );
      },
      b = [
        function (e) {
          if (d || s)
            return (
              window.__dcloud_weex_postMessage || window.__dcloud_weex_
                ? document.addEventListener('DOMContentLoaded', e)
                : window.plus && w.test(document.readyState)
                ? setTimeout(e, 0)
                : document.addEventListener('plusready', e),
              a
            );
        },
        function (e) {
          if (m)
            return (
              window.WeixinJSBridge && window.WeixinJSBridge.invoke
                ? setTimeout(e, 0)
                : document.addEventListener('WeixinJSBridgeReady', e),
              window.wx.miniProgram
            );
        },
        function (e) {
          if (v)
            return (
              window.QQJSBridge && window.QQJSBridge.invoke
                ? setTimeout(e, 0)
                : document.addEventListener('QQJSBridgeReady', e),
              window.qq.miniProgram
            );
        },
        function (e) {
          if (u) {
            document.addEventListener('DOMContentLoaded', e);
            var n = window.my;
            return {
              navigateTo: n.navigateTo,
              navigateBack: n.navigateBack,
              switchTab: n.switchTab,
              reLaunch: n.reLaunch,
              redirectTo: n.redirectTo,
              postMessage: n.postMessage,
              getEnv: n.getEnv,
            };
          }
        },
        function (e) {
          if (g) return document.addEventListener('DOMContentLoaded', e), window.swan.webView;
        },
        function (e) {
          if (c) return document.addEventListener('DOMContentLoaded', e), window.tt.miniProgram;
        },
        function (e) {
          if (p) {
            window.QaJSBridge && window.QaJSBridge.invoke
              ? setTimeout(e, 0)
              : document.addEventListener('QaJSBridgeReady', e);
            var n = window.qa;
            return {
              navigateTo: n.navigateTo,
              navigateBack: n.navigateBack,
              switchTab: n.switchTab,
              reLaunch: n.reLaunch,
              redirectTo: n.redirectTo,
              postMessage: n.postMessage,
              getEnv: n.getEnv,
            };
          }
        },
        function (e) {
          if (f)
            return (
              window.WeixinJSBridge && window.WeixinJSBridge.invoke
                ? setTimeout(e, 0)
                : document.addEventListener('WeixinJSBridgeReady', e),
              window.ks.miniProgram
            );
        },
        function (e) {
          if (l) return document.addEventListener('DOMContentLoaded', e), window.tt.miniProgram;
        },
        function (e) {
          if (_)
            return (
              window.JDJSBridgeReady && window.JDJSBridgeReady.invoke
                ? setTimeout(e, 0)
                : document.addEventListener('JDJSBridgeReady', e),
              window.jd.miniProgram
            );
        },
        function (e) {
          if (E) return window.xhs.miniProgram;
        },
        function (e) {
          return document.addEventListener('DOMContentLoaded', e), a;
        },
      ],
      y = 0;
    y < b.length && !(h = b[y](P));
    y++
  );
  h || (h = {});
  var B = 'undefined' != typeof uni ? uni : {};
  if (!B.navigateTo) for (var S in h) i(h, S) && (B[S] = h[S]);
  return (B.webView = h), B;
});
