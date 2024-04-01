<template>
  <scroll-view scroll-y style="height: 100%">
    <ul>
      <li
        v-for="(item, index) in dataList"
        :key="index"
        @click="clickItem(item, index)"
        :class="{ active: activeNum == index, nomoarl: !ifMine }"
      >
        <view
          v-if="!ifMine"
          class="sub-projuct-box label-font common-text-400 common-text text-size-sn"
        >
          <view class="tag-projuct-box">
            <view v-if="item.type == 0 && level == 2" class="tag-label iconfont icon-Label"></view>
            <text
              class="truncate"
              :style="{ color: level == 1 && activeNum == index ? '#E51600' : '#323949' }"
              >{{ item.value }}</text
            >
          </view>
          <view
            v-if="item.type == 0 && level == 2"
            class="tag-more icon-chevron-right iconfont"
          ></view>
        </view>
        <view v-if="ifMine" class="mine-projuct-box">
          <view class="flex">
            <image
              class="vipIcon"
              v-show="item.vip"
              src="../../static/vipIcon.png"
              mode="scaleToFill"
            />
            <view class="label-font common-text-400 common-text text-size-sn">{{
              item.title
            }}</view>
          </view>
          <view class="flex-center-box number-box">
            <!-- <view> 总计做题： {{ item.total }} </view>
            <view> 正确率： {{ item.rate }}% </view> -->
          </view>
        </view>
      </li>
    </ul>
  </scroll-view>
</template>

<script>
  export default {
    props: {
      dataList: { type: Array, default: () => [] },
      level: { type: Number, default: () => 1 },
      ifMine: { type: Boolean, default: () => false },
    },
    data() {
      return {
        activeNum: -1,
      };
    },
    methods: {
      clickItem(item, index) {
        this.activeNum = index;
        this.$emit('clickItem', item, index);
      },
    },
  };
</script>

<style lang="scss" scoped>
  ul {
    width: 100%;
    height: calc(100% - 40px);
    list-style: none;
    padding: 0;
    margin: 0;
    .mine-projuct-box {
      padding: 32rpx;
      .vipIcon {
        margin-right: 8rpx;
        width: 48rpx;
        height: 48rpx;
      }
      .number-box {
        color: #989ead;
        margin-top: 16rpx;
        font-size: 24rpx;
        font-weight: 400;
      }
    }
    .sub-projuct-box {
      width: 100%;
      display: flex;
      justify-content: space-between;
      .tag-label {
        margin-right: 10rpx;
        color: #e51600;
      }
      .tag-more {
        color: #9fa1a4;
      }
      .tag-projuct-box {
        width: 100%;
        display: flex;
        text {
          width: 100%;
        }
      }
    }

    .nomoarl {
      width: 100%;
      height: 108rpx;
      line-height: 108rpx;
      position: relative;
      display: flex;
      align-items: center;
      .label-font {
        padding: 0 32rpx;
        line-height: inherit;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        -webkit-text-overflow: ellipsis;
      }
      &.active {
        color: #475ffd;
        background-color: #f5f6fa;
        &::before {
          content: '';
          // background-color: #475ffd;
          background-color: #e51600;
          position: absolute;
          top: 40rpx;
          left: 0;
          width: 4rpx;
          height: 28rpx;
          border-radius: 4rpx;
        }
      }
    }
  }
</style>
