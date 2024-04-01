<!--
* @desc 下载pdf
* @author 江玉龙
* @date 2022年07月01日
-->
<template>
  <view class="download-box" v-if="savedFilePath">
    <view class="t-icon t-icon-xuanze icon-style" />
    <view class="text-download">下载成功</view>
    <view class="address-box">
      <span>本地路径：</span>
      <p>{{ savedFilePath }}</p>
    </view>
    <view class="open-btm flex-center" @tap="handleOpen()">打开文件</view>
  </view>
</template>
<script>
  export default {
    onLoad(options) {
      this.handleMessage(options.pdf);
    },
    data() {
      return {
        savedFilePath: '',
      };
    },
    methods: {
      // 下载文件
      handleMessage(pdf) {
        uni.downloadFile({
          url: pdf,
          success: (res) => {
            uni.saveFile({
              tempFilePath: res.tempFilePath,
              success: (data) => {
                this.savedFilePath = data.savedFilePath;
              },
              fail: () => {
                uni.showToast({
                  title: '下载失败',
                  icon: 'none',
                });
                setTimeout(() => {
                  uni.navigateBack();
                }, 1500);
              },
            });
          },
          fail: () => {
            uni.showToast({
              title: '下载失败',
              icon: 'none',
            });
            setTimeout(() => {
              uni.navigateBack();
            }, 1500);
          },
        });
      },
      // 打开文件
      handleOpen() {
        uni.openDocument({
          filePath: this.savedFilePath,
        });
      },
    },
  };
</script>
<style lang="scss" scoped>
  .download-box {
    display: flex;
    flex-flow: column;
    align-items: center;
    background-color: #ffffff;
    padding-top: 280rpx;
    .icon-style {
      width: 122rpx;
      height: 122rpx;
    }
    .text-download {
      font-size: 40rpx;
      font-weight: 700;
      color: #000000;
      margin-top: 98rpx;
      margin-bottom: 24rpx;
    }
    .address-box {
      display: flex;
      width: 622rpx;
      margin: 0;
      span {
        flex-shrink: 0;
      }
      p {
        word-break: break-all;
      }
    }
    .open-btm {
      width: 654rpx;
      height: 96rpx;
      border-radius: 24rpx;
      color: #ffffff;
      background-color: #475ffd;
      font-size: 32rpx;
      margin: auto;
      margin-top: 324rpx;
    }
  }
</style>
