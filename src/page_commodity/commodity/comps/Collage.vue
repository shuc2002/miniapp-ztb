<!--
* @desc 商品拼团组件
* @author 江玉龙
* @date 2022年07月20日
-->
<template>
  <view class="collage-box" v-if="activity.groupList && activity.groupList.length > 0">
    <p class="collage-title"
      ><span>{{ activity.groupList.length }}</span
      >人在拼单，可直接参与
    </p>
    <view class="divider" />
    <view class="team-box" v-for="(item, key) in activity.groupList" :key="key">
      <view class="flex-center">
        <image :src="item.userInfos[0].avatar" mode="aspectFill" />
        <p class="text-size-sn common-text name-width truncate">{{ item.userInfos[0].nickname }}</p>
      </view>
      <view class="flex-center">
        <view class="team-people">
          <p class="text-size-sn common-text">还差{{ item.lackNum }}人拼成</p>
          <view class="flex-center">
            <p class="text-size-xxs common-tip common-text-400">剩余&nbsp;</p>
            <NewCountdown
              backgroundColor="#ffffff"
              textColor="#989EAD"
              :remain="item.inDate ? item.inDate : 0"
              :showBox="false"
            />
          </view>
        </view>
        <button class="collage-btn flex-center" @tap="handleCollage(item)">去拼单</button>
      </view>
    </view>
  </view>
</template>
<script>
  import NewCountdown from '@/components/Countdown/NewCountdown.vue';
  import baseInfo from '@/build/index';
  import { sucCollageTip, failCollageTip } from '@/enums/msgEnum';
  export default {
    name: 'collage',
    components: {
      NewCountdown,
    },
    computed: {
      uid() {
        return this.$store.getters.getUid;
      },
    },
    props: {
      data: {
        type: Object,
      },
      activity: {
        type: Object,
      },
    },
    methods: {
      // 加入拼单
      handleCollage(item) {
        if (item.userIds.indexOf(this.uid) > -1) {
          uni.showToast({
            title: '不能重复拼团',
            icon: 'none',
          });
        } else {
          if (this.data.type == 3) {
            uni.navigateTo({
              url: `/page_commodity/order/pages/entityOrder?commodityId=${this.data.id}&isCollage=true&groupId=${item.groupId}&ifActivity=true`,
            });
          } else {
            uni.navigateTo({
              url: `/page_commodity/order/pages/buyOrder?commodityId=${this.data.id}&isCollage=true&groupId=${item.groupId}&ifActivity=true`,
            });
          }
          wx.requestSubscribeMessage({
            tmplIds: [sucCollageTip[baseInfo.CHANNEL], failCollageTip[baseInfo.CHANNEL]],
          });
        }
      },
    },
  };
</script>
<style lang="scss" scoped>
  .collage-box {
    width: 100vw;
    background-color: #ffffff;
    padding: 24rpx 0;
    margin-bottom: 20rpx;
    .collage-title {
      margin: 0 32rpx 24rpx 32rpx;
      font-size: 32rpx;
      font-weight: 700;
      color: #323949;
      span {
        margin-right: 8rpx;
        color: #475ffd;
      }
    }
    .divider {
      width: 100vw;
      height: 2rpx;
      background-color: #f5f6fa;
      margin-bottom: 8rpx;
    }
    .team-box {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 32rpx;
      margin-bottom: 16rpx;
      .name-width {
        width: 180rpx;
      }
      image {
        width: 80rpx;
        height: 80rpx;
        margin-right: 24rpx;
        margin-left: 32rpx;
      }
      .team-people {
        text-align: end;
      }
      .collage-btn {
        width: 160rpx;
        height: 64rpx;
        border-radius: 68rpx;
        background-color: #f0522f;
        font-size: 28rpx;
        font-weight: 400;
        color: #ffffff;
        margin-left: 24rpx;
        margin-right: 32rpx;
      }
    }
  }
</style>
