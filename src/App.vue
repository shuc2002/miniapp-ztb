<script>
  import { socketUrl } from './api/config/index';
  import { getChannelMsg } from '@/api/modules/user/index.ts';
  import { getPayRedicrtUrl } from '@/utils/payUrl.js';
  // import './custom-tab-bar';
  export default {
    mpType: 'app',
    data() {
      return {
        timeout: 5000,
        timeoutObj: null,
        socketUrl: socketUrl,
      };
    },
    computed: {
      tokenUser() {
        return this.$store.getters.getToken;
      },
    },
    watch: {
      tokenUser: {
        handler() {
          /* #ifndef MP-TOUTIAO */
          this.connectWebsocket();
          /* #endif */
        },
        immediate: false,
        deep: true,
      },
    },
    created() {
      /* #ifndef MP-TOUTIAO */
      //我这里是登陆之后根据token判断连接websocket
      if (this.tokenUser !== '') {
        this.connectWebsocket();
      }
      /* #endif */
    },
    onShow() {
      this.updateApp();
      uni.hideTabBar();
      // 替换h5-logo
      /* #ifdef H5 */
      const baseUrl = getPayRedicrtUrl();
      const orgUrl = window.location.origin;
      if (baseUrl.indexOf(orgUrl) == -1) {
        // 非支付域名
        this.getLogoTitle();
      }
      /* #endif */
    },
    methods: {
      /* #ifndef MP-TOUTIAO */
      //wx连接
      connectWebsocket() {
        //创建一个 WebSocket 连接
        uni.connectSocket({
          url: `${this.socketUrl}${this.tokenUser}`,
          success: () => {
            // uni.showToast({
            //   title: '连接成功',
            // });
          },
          fail() {},
        });
        //监听WebSocket连接打开事件。
        uni.onSocketOpen(() => {});
        //监听WebSocket错误  连接出错加了定时器重连
        uni.onSocketError(() => {
          setTimeout(() => {
            this.connectWebsocket();
          }, 3000);
        });
        this.onSocketMessage(); // 监听服务器返回的消息
      },
      //监听服务器返回的消息
      onSocketMessage() {
        // 消息
        this.timeout = 5000;
        this.timeoutObj = null;
        //监听WebSocket接受到服务器的消息事件
        uni.onSocketMessage((res) => {
          uni.hideLoading();
          this.getSocketMsg(res.data); // 监听到有新服务器消息
        });
      },

      //监听到有新服务器消息处理
      getSocketMsg(reData) {
        // uni.showToast({
        //   title: '触发' + `${reData}`,
        // });
        this.$store.commit('setSocketMsg', reData);
        //我的处理消息代码
        this.reset(); // 检测心跳reset,防止长时间连接导致连接关闭
      },
      //检测心跳重置
      reset() {
        clearInterval(this.timeoutObj);
        this.start(); // 启动心跳
      },
      //心跳包
      start() {
        let jsonData = JSON.stringify({
          action: 'ping',
        });
        this.timeoutObj && clearTimeout(this.timeoutObj);
        this.timeoutObj = setInterval(() => {
          uni.sendSocketMessage({
            data: jsonData,
            success: () => {},
            fail: () => {
              clearTimeout(this.timeoutObj);
              if (this.tokenUser !== '') {
                this.connectWebsocket();
              }
            },
          });
        }, this.timeout);
      },
      /* #endif */
      updateApp() {
        const updateManager = uni.getUpdateManager();
        updateManager.onCheckForUpdate(function() {
          // 请求完新版本信息的回调
        });
        updateManager.onUpdateReady(function() {
          uni.showModal({
            title: '更新提示',
            content: '新版本已经准备好，是否重启应用？',
            success(res) {
              if (res.confirm) {
                // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
                updateManager.applyUpdate();
              }
            },
          });
        });
        updateManager.onUpdateFailed(function() {
          // 新的版本下载失败
        });
      },
      async getLogoTitle() {
        const { body } = await getChannelMsg();
        /* #ifdef H5 */
        if (body.appLogo) {
          /* eslint-disable */
          let link = document.querySelector("link[rel*='icon']");
          if (!link) {
            link = document.createElement('link');
            link.rel = 'icon';
            document.getElementsByTagName('head')[0].appendChild(link);
          }
          link.type = 'image/x-icon';
          link.href = body.appLogo;
        }
        /* #endif */
      },
    },
  };
</script>

<style lang="scss">
  // uview-ui
  @import 'uview-ui/index.scss';
  /*每个页面公共css */
  @import './common/css/common.scss';
</style>
