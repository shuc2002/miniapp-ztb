<template>
  <view class="page-bg padding-box">
    <!-- 订单列表 -->
    <view v-if="list.length > 0">
      <view v-for="(item, key) in list" :key="key">
        <view
          class="list-box"
          @tap="commonFun.routeTo(`/page_commodity/courseList/courseDetail?productId=${item.k}`)"
        >
          <view class="catalogue">
            <view class="flex-item-center">
              <view class="t-icon icon-style t-icon-Product-PutAway" />
              <view class="text-size-main common-black common-text-600 truncate w-text"
                >{{ item.v }}
              </view>
            </view>
            <view class="t-icon t-icon-chevron-right icon-height" />
          </view>
        </view>
      </view>
    </view>
    <image
      class="no-card"
      v-if="list.length === 0"
      src="@/static/img/empty/order.png"
      mode="scaleToFill"
    />
  </view>
</template>

<script>
  import { getCourseList } from '@/api/modules/exchange/index.ts';
  import { getCommodityProducts } from '@/api/modules/user/index.ts';

  export default {
    name: 'exchangeCourse',
    data() {
      return {
        list: [],
      };
    },
    onLoad(options) {
      options.id ? this.getCourseList(options.id) : this.getActivationList(options.skuId);
      // this.getCourseList(options.id);
    },
    methods: {
      // 获取兑换码课程
      async getCourseList(id) {
        let res = await getCourseList({ id });
        this.list = res.body;
      },
      //获取激活码课程
      async getActivationList(skuId) {
        let res = await getCommodityProducts({ skuId });
        this.list = res.body;
      },
    },
  };
</script>

<style lang="scss">
  .list-box {
    margin: 0 32rpx 24rpx 32rpx;
    border-radius: 24rpx;
    background: #f5f6fa;
    padding: 34rpx 32rpx;
    .catalogue {
      display: flex;
      justify-content: space-between;
      align-items: center;
      .space-height {
        margin-top: 16rpx;
      }
      .icon-style {
        width: 40rpx;
        height: 40rpx;
        margin-right: 24rpx;
      }
      .w-text {
        width: 500rpx;
      }
      .icon-height {
        width: 40rpx;
        height: 40rpx;
      }
    }
  }
  .padding-box {
    padding-top: 32rpx;
  }
  .no-card {
    width: 344rpx;
    height: 344rpx;
    position: absolute;
    top: 33%;
    left: 50%;
    transform: translate(-50%);
  }
  .expired-Btn {
    width: 76rpx;
    height: 36rpx;
    border-radius: 8rpx;
    background: #989ead;
    font-size: 20rpx;
    color: #ffffff;
    margin-right: 16rpx;
  }
  .time-expired {
    margin-top: 18rpx;
    margin-left: 64rpx;
  }
</style>
