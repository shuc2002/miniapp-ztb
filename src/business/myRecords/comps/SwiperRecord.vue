<!--
* @desc 左右滑动及上下滑动
* @author 江玉龙
* @date 2022年05月05日
-->
<template>
  <view>
    <!-- swiper切换 swiper-item表示一页 scroll-view表示滚动视窗 -->
    <swiper style="min-height: 100vh" :current="currentTab" @change="swiperTab">
      <swiper-item v-for="(listItem, listIndex) in list" :key="listIndex">
        <scroll-view
          style="height: 100%"
          scroll-y="true"
          scroll-with-animation
          :scroll-into-view="toView"
        >
          <!-- 占位容器 -->
          <view :id="'top' + listIndex" style="width: 100%; height: 116rpx" />
          <view class="content" v-if="listItem.length > 0">
            <!-- 订单列表 -->
            <view v-for="(item, key) in listItem" :key="key"  v-show="currentTab === 0">
              <view
                class="list-box"
                @tap="
                  commonFun.routeTo(
                    `/business/myRecords/wrongOrCollection?activeNum=${currentTab}&subjectId=${item.subjectId}&subjectName=${item.subjectName}`
                  )
                "
              >
                <view class="catalogue">
                  <view>
                    <view class="text-size-sn common-black common-text-600 truncate w-text"
                      >{{ item.subjectName }}
                    </view>
                    <view class="text-size-xxs common-tip space-height">{{
                      item.number + ' ' + '道题'
                    }}</view>
                  </view>
                  <view class="t-icon t-icon-chevron-right icon-height" />
                </view>
              </view>
            </view>
            <view v-for="(item, key) in listItem" :key="key"  v-show="currentTab === 1">
              <view
                class="list-box"
                @tap="
                  commonFun.routeTo(
                    `/business/myRecords/onlyCollection?activeNum=${currentTab}&subjectId=${item.subjectId}&subjectName=${item.subjectName}`
                  )
                "
              >
                <view class="catalogue">
                  <view>
                    <view class="text-size-sn common-black common-text-600 truncate w-text"
                      >{{ item.subjectName }}
                    </view>
                    <view class="text-size-xxs common-tip space-height">{{
                      item.number + ' ' + '道题'
                    }}</view>
                  </view>
                  <view class="t-icon t-icon-chevron-right icon-height" />
                </view>
              </view>
            </view>
          </view>
          <image
            class="no-card"
            v-if="listItem.length === 0"
            src="@/static/img/empty/order.png"
            mode="scaleToFill"
          />
          <!-- 占位容器 -->
          <view style="width: 100%; height: 50upx; opacity: 0" />
        </scroll-view>
      </swiper-item>
    </swiper>
  </view>
</template>
<script>
  export default {
    name: 'swiperRecord',
    props: {
      currentTab: {
        type: Number,
        default: 0,
      },
      list: {
        type: Array,
        default: () => [],
      },
      toView: {
        type: String,
        default: '',
      },
    },
    data() {
      return {};
    },
    methods: {
      // 轮播图切换
      swiperTab(e) {
        this.$emit('swiperTab', e);
      },
    },
  };
</script>
<style lang="scss" scoped>
  .content {
    width: 100%;
  }
  .no-card {
    width: 344rpx;
    height: 344rpx;
    position: absolute;
    top: 40%;
    left: 50%;
    transform: translate(-50%);
  }
  .list-box {
    margin: 24rpx 32rpx;
    border-radius: 24rpx;
    background: #ffffff;
    padding: 32rpx;
    .catalogue {
      display: flex;
      justify-content: space-between;
      align-items: center;
      .space-height {
        margin-top: 16rpx;
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
  .no-more {
    font-size: 28rpx;
    font-weight: 400;
    text-align: center;
    width: 100%;
    height: 100upx;
    color: #989ead;
    line-height: 50upx;
  }
</style>
