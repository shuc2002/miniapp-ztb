<!-- 新的公众号弹窗 -->

<template>
    <view>
      <view class="popup-mask"  v-if="showModal" @tap.stop="canClose ? close() : ''">
        <view :class=" step == 2 ? 'popup-box-2' :  'popup-box'" @tap.stop :style="{ height: height }">
          <!-- <p class="text-size-xl common-text-700 common-text text-item" v-if="title">{{ title }}</p> -->
          <!-- <div class="cancel-box"></div> -->
          <slot></slot>
          <!-- 底部按钮 -->
          <!-- <view class="nav-btn" v-if="cancelShow">
            <button class="cancel-btn flex-center" @tap.stop="cancel()">{{ cancelTitle }}</button>
            <button
              class="success-btn flex-center"
              :open-type="openType"
              @tap.stop="setConfirm ? confirm() : success()"
              >{{ confirmTitle }}</button
            >
          </view> -->
          <view class="help-btn-1 flex-center" v-if="step == 1"  @tap.stop="success()">
              <view class="wechat-logo iconfont icon-WeChat"> </view>
              <p>{{ confirmTitle }}</p>
          </view>
          <button v-else
            :class=" step == 2 ?   'help-btn-2 flex-center' : 'help-btn-3 flex-center' "
            :open-type="openType"
            @tap.stop="success()"
            >{{ confirmTitle }}</button
          >
        </view>
      </view>
    </view>
  </template>
  <script>
    export default {
      name: 'NewPopupWindow',
      components: {},
      data() {
        return {
          showModal: false,
        };
      },
      props: {
        title: {
          type: String,
          default: '',
        },
        confirmTitle: {
          type: String,
          default: '确定',
        },
        cancelTitle: { type: String, default: '取消' },
        cancelShow: {
          type: Boolean,
          default: false,
        },
        canClose: {
          //能否点击遮罩关闭
          type: Boolean,
          default: true,
        },
        content: {
          type: Number,
          default: 0,
        },
        height: {
          type: String,
          default: '390rpx',
        },
        openType: {
          type: String,
          default: '',
        },
        setConfirm: {
          type: Boolean,
          default: true,
        },
        // 按钮是否展示微信图标
        showImg:{
            type:Boolean,
            default:true,
        },
        step:{
            type:Number,
            default:1
        }
      },
      methods: {
        // 关闭弹窗
        cancel() {
          this.showModal = false;
          this.$emit('cancel');
        },
        close() {
          this.showModal = false;
        },
        // 确认
        confirm() {
          this.showModal = false;
          this.$emit('confirm');
        },
        // 自定义确认
        success() {
          this.$emit('success');
        },
      },
    };
  </script>
  <style lang="scss" scoped>
    .popup-mask {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.4);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 9999;
      .popup-box {
        width: 620rpx;
        height: 696rpx;
        border-radius: 24rpx;
        display: flex;
        flex-direction: column;
        align-items: center;
        background: #fff;
        padding-bottom: 30rpx;
        z-index: 9999;
        .help-btn-1 {
          width: 460rpx;
          height: 96rpx;
          border-radius: 72rpx;
          background: #e51600;
          color: #ffffff;
          font-size: 32rpx;
          font-weight: 600;
          margin-top: 32rpx;
          &:active {
            opacity: 0.8;
          }
        }
        .help-btn-2 {
          width: 506rpx;
          height: 96rpx;
          border-radius: 72rpx;
          background: #e51600;
          color: #ffffff;
          font-size: 32rpx;
          font-weight: 600;
          margin-top: 32rpx;
          &:active {
            opacity: 0.8;
          }
        }
        .help-btn-3 {
          width: 460rpx;
          height: 96rpx;
          border-radius: 72rpx;
          background: #e51600;
          color: #ffffff;
          font-size: 32rpx;
          font-weight: 600;
          margin-top: 64rpx;
          &:active {
            opacity: 0.8;
          }
        }
      }
      .popup-box-2 {
        width: 602rpx;
        height: 640rpx;
        border-radius: 24rpx;
        display: flex;
        flex-direction: column;
        align-items: center;
        background: #fff;
        padding-bottom: 30rpx;
        z-index: 9999;
        .help-btn-1 {
          width: 460rpx;
          height: 96rpx;
          border-radius: 72rpx;
          background: #e51600;
          color: #ffffff;
          font-size: 32rpx;
          font-weight: 600;
          margin-top: 32rpx;
          &:active {
            opacity: 0.8;
          }
        }
        .help-btn-2 {
          width: 506rpx;
          height: 96rpx;
          border-radius: 72rpx;
          background: #e51600;
          color: #ffffff;
          font-size: 32rpx;
          font-weight: 600;
          margin-top: 54rpx;
          &:active {
            opacity: 0.8;
          }
        }
        .help-btn-3 {
          width: 460rpx;
          height: 96rpx;
          border-radius: 72rpx;
          background: #e51600;
          color: #ffffff;
          font-size: 32rpx;
          font-weight: 600;
          margin-top: 64rpx;
          &:active {
            opacity: 0.8;
          }
        }
      }
    }
    .help-box {
      margin-left: 48rpx;
      margin-right: 48rpx;
      p {
        margin-bottom: 16rpx;
      }
    }
    .wechat-logo {
        font-size: 48rpx;
        color: #ffffff;
        // height: 24rpx;
        // width: 24rpx;
        line-height: 96rpx;
        margin-right: 20rpx;
    }
  </style>
  