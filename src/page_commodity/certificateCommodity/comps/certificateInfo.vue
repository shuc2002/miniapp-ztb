<template>
  <view class="info-box certificate-info-box">
    <text class="info-header">证书信息</text>
    <view v-if="item.url">
      <view class="info-image-box">
        <image mode="aspectFit" :src="item.url"></image>
      </view>
      <view class="info-action">
        <view class="info-button" @tap="downloadPic">下载证书</view>
        <view class="info-button info-active-button" @tap="preCert">查看证书</view>
      </view>
    </view>
    <view class="flex-item-center" v-else>
      <text class="info-tips" :class="{ 'warn-tips': item.type == 1 }">{{ item.info }}</text>
    </view>
  </view>
</template>
<script>
  import { BaseFormUrl } from '@/enums/envEnum';
  import baseInfo from '@/build/index';
  import { downH5 } from '@/utils/downH5.js';
  export default {
    name: 'certificate-info',
    props: {
      item: {
        type: Object,
      },
    },
    data() {
      return {
        isAuthorize: false,
      };
    },
    computed: {
      channelId() {
        return this.$store.getters.getChannelId;
      },
    },
    methods: {
      downloadPic() {
        /* #ifndef H5 */
        this.checkAppRight();
        /* #endif */
        /* #ifdef H5 */
        var ua = window.navigator.userAgent.toLowerCase();
        if (ua.match(/micromessenger/i) == 'micromessenger') {
          this.$emit('showShare');
        } else {
          downH5(this.item.url);
        }
        // this.downloadH5Image();
        /* #endif */
      },
      // 先校验权限
      checkAppRight() {
        // 检查是否之前就调用过uni.authorize
        if (!this.isAuthorize) {
          uni.authorize({
            // 请求相册写入权限
            scope: 'scope.writePhotosAlbum',
            success: () => {
              this.isAuthorize = true;
              this.downloadImgOnPhone();
            },
            fail: () => {
              console.log('授权失败');
            },
          });
          return;
        }
        // 检查当前小程序的设置信息，这个设置可以看下面的图片说明是什么设置
        uni.getSetting({
          // 这里可能会触发报错：this 为 undefined，建议使用箭头函数，不要使用普通函数，否则在小程序中调用this会报错。
          success: (res) => {
            // 如果没有相册写入权限，需要先引导用户打开设置权限
            if (!res.authSetting['scope.writePhotosAlbum']) {
              /* 打开设置的方法 */
              uni.showModal({
                title: '提示',
                content: '请先在设置页面打开“保存相册”使用权限',
                confirmText: '去设置',
                cancelText: '取消',
                success: (data) => {
                  if (data.confirm) {
                    uni.openSetting();
                  }
                },
              });
            } else {
              this.downloadImgOnPhone();
            }
          },
        });
      },
      // 开始下载图片
      downloadImgOnPhone() {
        // 下载文件，必须先调用downloadFile，不然会报错。
        uni.downloadFile({
          url: this.item.url, // 图片链接
          success: (res) => {
            if (res.statusCode === 200) {
              // 保存下载的文件到相册
              uni.saveImageToPhotosAlbum({
                filePath: res.tempFilePath,
                success: () => {
                  this.isLoading = false;
                  uni.showToast({
                    title: '下载成功',
                    icon: 'none',
                    duration: 5000,
                  });
                },
                fail: (err) => {
                  console.log(err);
                  uni.showToast({
                    title: '下载失败',
                    icon: 'none',
                    duration: 5000,
                  });
                },
              });
            }
          },
          fail: (err) => {
            this.isLoading = false;
            uni.showToast({
              title: JSON.stringify(err),
              icon: 'none',
              duration: 5000,
            });
          },
        });
      },
      downloadH5Image() {
        var oA = document.createElement('a');
        oA.download = '证书'; // 设置下载的文件名，默认是'下载'
        oA.href = this.item.url;
        document.body.appendChild(oA);
        oA.click();
        oA.remove(); // 下载之后把创建的元素删除
      },

      preCert() {
        const baseUrl = BaseFormUrl[baseInfo.ENV];
        let clientOrigin = '';
        /* #ifdef H5 */
        clientOrigin = window.location.origin;
        /* #endif */
        const uri = encodeURIComponent(
          `${baseUrl}/h5/#/previewCert?id=${this.item.certCourseRecordId}&channelId=${
            this.channelId
          }&clientOrigin=${clientOrigin}&platform=${uni.getSystemInfoSync().uniPlatform}`
        );
        const url = `/page_common/iframe/index?uri=${uri}`;
        uni.navigateTo({
          url,
        });
      },
    },
  };
</script>
<style lang="scss" scoped>
  @import './info.scss';
  .certificate-info-box {
    position: relative;
    .info-image-box {
      margin-top: 24rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 220rpx;
      height: 220rpx;
      border-radius: 8rpx;
      background: #f6f6f6;
      image {
        max-width: 220rpx;
        max-height: 220rpx;
      }
    }
  }
</style>
