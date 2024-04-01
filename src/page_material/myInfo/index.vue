<!--
* @desc 个人信息编辑
* @author 江玉龙
* @date 2022年07月06日
-->
<template>
  <view class="common-bg">
    <view class="mine-Name" @tap="handlePhoto()">
      <image :src="avatar" class="img-portrait" mode="aspectFill" />
      <image src="@/page_material/static/photo.png" class="img-photo" />
      <p class="text-size-xxs common-text-400 common-tip info-text">点击更换头像</p>
    </view>
    <view
      class="info-box"
      @tap="commonFun.routeTo(`/page_material/myInfo/myName?name=${nickName}`)"
    >
      <p class="text-size-sn common-text-400 common-text">昵称</p>
      <view class="flex-center">
        <p class="text-size-sn common-text-500 common-text">{{ nickName }}</p>
        <view class="t-icon t-icon-chevron-right icon-right" />
      </view>
    </view>
    <view class="info-box" @tap="commonFun.routeTo('/page_material/myInfo/myCompany')">
      <p class="text-size-sn common-text-400 common-text">工作单位</p>
      <view class="flex-center">
        <p
          class="text-size-sn enterprise-length truncate"
          :class="org ? 'common-text-500 common-text' : 'common-text-400 common-tip'"
          >{{ org ? org : '请选择' }}</p
        >
        <view class="t-icon t-icon-chevron-right icon-right" />
      </view>
    </view>
    <GetIntegral
      ref="integral"
      :num="socketMsgs.integral ? socketMsgs.integral : 0"
      :name="socketMsgs.name ? socketMsgs.name : '隐藏任务'"
    />
  </view>
</template>
<script>
  import { editUserInfo } from '@/api/modules/register/index.ts';
  import { uploadFiles } from '@/api/request/upload.ts';
  import GetIntegral from '@/components/GetIntegral/GetIntegral.vue';

  export default {
    name: 'myInfo',
    components: { GetIntegral },
    data() {
      return {
        socketMsgs: {},
      };
    },
    computed: {
      nickName() {
        return this.$store.getters.getNickName;
      },
      avatar() {
        return this.$store.getters.getAvatar;
      },
      org() {
        return this.$store.getters.getOrg;
      },
      socketMsg() {
        return this.$store.getters.getSocketMsg;
      },
    },
    watch: {
      socketMsg: {
        handler(nv) {
          this.socketMsgs = JSON.parse(nv);
          this.$refs.integral.showModal = true;
        },
        immediate: false,
        deep: true,
      },
    },
    methods: {
      // 调用手机相机和获取相册功能
      handlePhoto() {
        uni.chooseImage({
          count: 1,
          sizeType: ['original', 'compressed'],
          sourceType: ['camera', 'album'], //这要注意，camera掉拍照，album是打开手机相册
          success: async (res) => {
            const file = await uploadFiles('/upload/avatar', res.tempFilePaths[0]);
            if (file.code === 1000) {
              const data = await editUserInfo({
                nickname: this.nickName,
                avatar: file.body,
                gender: 0,
                org: this.org,
              });
              if (data.code === 1000) {
                this.$store.commit('setAvatar', file.body);
              }
            }
          },
        });
      },
    },
  };
</script>
<style lang="scss" scoped>
  .mine-Name {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-flow: column;
    position: relative;
    .img-portrait {
      width: 192rpx;
      height: 192rpx;
      border-radius: 50%;
      border: 4rpx solid #ffffff;
    }
    /* #ifndef MP-WEIXIN || H5 */
    .img-photo {
      width: 48rpx;
      height: 48rpx;
      position: absolute;
      margin-left: 9vw;
      margin-top: 32rpx;
    }
    /* #endif */
    /* #ifdef MP-WEIXIN || H5 */
    .img-photo {
      width: 48rpx;
      height: 48rpx;
      position: absolute;
      margin-left: 18vw;
      margin-top: 52rpx;
    }
    /* #endif */
    .info-text {
      margin-top: 16rpx;
      margin-bottom: 40rpx;
    }
  }
  .info-box {
    height: 96rpx;
    margin: 24rpx 32rpx 0 32rpx;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #ffffff;
    padding: 0 32rpx;
    border-radius: 16rpx;
    .icon-right {
      margin-left: 16rpx;
      width: 28rpx;
      height: 28rpx;
    }
    .enterprise-length {
      width: 440rpx;
      text-align: end;
    }
  }
</style>
