<template>
  <view class="chapter-time-line">
    <view v-for="item in list" :key="item.id" class="chapter-title-item">
      <view class="chapter-list-wrap">
        <view>
          <text
            v-if="!item.isExpand"
            @tap="$emit('currentType', item)"
            class="iconfont icon-directory_expand_1"
            style="color: #e51600;"
          ></text>
          <text
            v-if="item.isExpand"
            @tap="$emit('currentType', item)"
            class="iconfont icon-directory_retract-1"
            style="color: #e51600;"
          ></text>
          <text class="chapter-title-name">{{ item.name }}</text>
        </view>
        <view class="chapter-action">
          <text
            v-show="current === CHAPTER_TYPE.VIDEO || current == CHAPTER_TYPE.LIVE"
            class="iconfont icon-play"
          >
            <text class="chapter-action-btn">播放</text>
          </text>
          <text v-show="current == CHAPTER_TYPE.DATA" class="iconfont icon-check">
            <text class="chapter-action-btn">查看</text>
          </text>
          <text v-show="current == CHAPTER_TYPE.TOPIC" class="iconfont icon-test">
            <text class="chapter-action-btn">练习</text>
          </text>
        </view>
      </view>
      <view v-if="item.isExpand && item.children && item.children.length > 0">
        <view v-for="second in item.children" :key="second.id" class="chapter-title-item">
          <view class="chapter-list-wrap">
            <view>
              <text
                @tap="$emit('currentType', second)"
                class="iconfont icon-directory_retract-2"
                style="color: #e51600;"
              ></text>
              <text class="chapter-title-name">{{ second.name }}</text>
            </view>
            <view class="chapter-action">
              <span
                v-show="current === CHAPTER_TYPE.VIDEO || current == CHAPTER_TYPE.LIVE"
                class="iconfont icon-play"
                >播放</span
              >
              <span v-show="current == CHAPTER_TYPE.DATA" class="iconfont icon-check">查看</span>
              <span v-show="current == CHAPTER_TYPE.TOPIC" class="iconfont icon-test">练习</span>
            </view>
          </view>
          <view v-if="second.isExpand && second.children && second.children.length > 0">
            <view v-for="third in second.children" :key="third.id" class="chapter-title-item">
              <view class="chapter-list-wrap">
                <view>
                  <text
                    @tap="$emit('currentType', third)"
                    class="iconfont icon-Select_circular_1_3"
                    style="color: #e51600; font-size: 20rpx;"
                  ></text>
                  <text class="chapter-title-name">{{ third.name }}</text>
                </view>
                <view class="chapter-action">
                  <span
                    v-show="current === CHAPTER_TYPE.VIDEO || current == CHAPTER_TYPE.LIVE"
                    class="iconfont icon-play"
                    >播放</span
                  >
                  <span v-show="current == CHAPTER_TYPE.DATA" class="iconfont icon-check"
                    >查看</span
                  >
                  <span v-show="current == CHAPTER_TYPE.TOPIC" class="iconfont icon-test"
                    >练习</span
                  >
                </view>
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
  import { COURSE_TYPE, CHAPTER_TYPE } from '@/consts/index.ts';
  export default {
    name: 'home',
    props: {
      list: {
        type: Array,
        default: () => [],
      },
      current: {
        type: Number,
        default: 0,
      },
    },
    components: {},
    data() {
      return {
        COURSE_TYPE,
        CHAPTER_TYPE,
      };
    },
    onLoad() {
      console.log('props--', this.list);
    },
  };
</script>

<style lang="scss" scoped>
  .chapter-time-line {
    padding: 0rpx 40rpx 0 40rpx;
    .chapter-title-item {
      margin-top: 80rpx;
      position: relative;
    }
    .chapter-title-item::before {
      content: ' ';
      position: absolute;
      left: 16rpx;
      top: 12rpx;
      width: 1px;
      bottom: 0;
      // border-left: 1px solid #E51600;
      -webkit-transform-origin: 0 0;
      transform-origin: 0 0;
      -webkit-transform: scaleX(0.5);
      transform: scaleX(0.5);
      border-left-width: 1px;
      border-left-style: solid;
      border-left-color: #e51600;
    }
    .chapter-list-wrap {
      display: flex;
      justify-content: space-between;
      .chapter-title-name {
        padding-left: 8rpx;
        color: #333333ff;
        font-size: 32rpx;
        font-weight: 500;
      }
      .chapter-action {
        display: flex;
        justify-content: center;
        align-items: center;
        color: #e51600ff;
        width: 120rpx;
        height: 48rpx;
        border-radius: 72rpx;
        background: #fde8e6ff;
        .chapter-action-btn {
          // width: 24px;
          // height: 17px;
          // opacity: 1;
          color: #e51600ff;
          font-size: 24rpx;
          font-weight: 400;
          text-align: left;
          line-height: 33rpx;
        }
      }
    }
    .chapter-content {
      display: flex;
      justify-content: space-between;
    }
  }
  .u-node {
    width: 44rpx;
    height: 44rpx;
    border-radius: 100rpx;
    display: flex;
    justify-content: center;
    align-items: center;
    background: #d0d0d0;
  }

  .u-order-title {
    color: #333333;
    font-weight: bold;
    font-size: 32rpx;
  }

  .u-order-desc {
    color: rgb(150, 150, 150);
    font-size: 28rpx;
    margin-bottom: 6rpx;
  }

  .u-order-time {
    color: rgb(200, 200, 200);
    font-size: 26rpx;
  }
</style>
