<!--
* @desc 协商记录
* @author 江玉龙
* @date 2022年08月20日
-->
<template>
  <view class="common-bg">
    <view v-if="list.length > 0">
      <view v-for="(item, key) in list" :key="key">
        <view class="list-box">
          <view class="flex">
            <image :src="item.avatar" />
            <view>
              <p class="text-size-sn common-text">{{
                item.identity == 'system' ? appletName : item.action
              }}</p>
              <p class="text-size-xxs common-text-400 common-tip time-text">{{ item.time }}</p>
            </view>
          </view>
          <view class="divider" />
          <p class="text-size-xxs common-text-400 common-tip">{{
            item.identity == 'system' ? item.action : '备注：' + item.remark
          }}</p>
        </view>
      </view>
    </view>
    <image
      class="noCard"
      v-if="list.length === 0"
      src="@/static/img/empty/order.png"
      mode="scaleToFill"
    />
  </view>
</template>
<script>
  import { getConsult } from '@/api/modules/order/index';
  import baseInfo from '@/build/index';
  import { ChannelName } from '@/enums/msgEnum';
  export default {
    name: 'consult',
    onLoad(options) {
      this.getConsultData(options.id);
      this.appletName = ChannelName[baseInfo.CHANNEL];
    },
    data() {
      return {
        list: [],
        appletName: '',
      };
    },
    methods: {
      // 获取协商数据
      async getConsultData(orderId) {
        const res = await getConsult({ orderId });
        this.list = res.body;
      },
    },
  };
</script>
<style lang="scss" scoped>
  .common-bg {
    padding-top: 16rpx;
  }
  .list-box {
    margin: 0 24rpx 24rpx 24rpx;
    padding: 32rpx;
    background-color: #ffffff;
    border-radius: 24rpx;
    image {
      width: 80rpx;
      height: 80rpx;
      border-radius: 8rpx;
      border: 2px solid #f5f6fa;
      margin-right: 24rpx;
    }
    .time-text {
      margin-top: 8rpx;
    }
    .divider {
      width: 100%;
      height: 2rpx;
      background-color: #f5f6fa;
      margin: 32rpx 0;
    }
  }

  .noCard {
    width: 344rpx;
    height: 344rpx;
    position: absolute;
    top: 30%;
    left: 50%;
    transform: translate(-50%);
  }
</style>
