<!-- tab组件 -->
<template>
  <view class="nav-tabBox common-tip text-size-sn">
    <view class="longTab">
      <scroll-view
        scroll-x="true"
        style="white-space: nowrap; display: flex"
        scroll-with-animation
        :scroll-left="tabLeft"
      >
        <view
          class="longItem"
          :style="'width:' + isWidth + 'px'"
          :data-index="index"
          :class="index === tabClick ? 'text-size-main common-text common-text-700' : ''"
          v-for="(item, index) in tabTitle"
          :key="index"
          :id="'id' + index"
          @click="longClick(index)"
          >{{ item }}</view
        >
        <view
          class="underline-box"
          :style="'transform:translateX(' + isLeft + 'px);width:' + isWidth + 'px'"
        >
          <view class="underline" />
        </view>
      </scroll-view>
    </view>
  </view>
</template>

<script>
  export default {
    name: 'navTab',
    props: {
      tabTitle: {
        type: Array,
        default: () => [],
      },
      defaultIndex: {
        type: Number,
        default: 0,
      },
    },
    data() {
      return {
        tabClick: 0, //导航栏被点击
        isLeft: 0, //导航栏下划线位置
        isWidth: 0, //每个导航栏占位
        tabLeft: 0,
      };
    },
    created() {
      var that = this;
      // 获取设备宽度
      uni.getSystemInfo({
        success(e) {
          if (that.tabTitle.length <= 5) {
            that.isWidth = e.windowWidth / that.tabTitle.length; //宽度除以导航标题个数=一个导航所占宽度
          } else {
            that.isWidth = e.windowWidth / 5;
          }
        },
      });
    },
    watch: {
      defaultIndex: {
        handler(nv) {
          this.longClick(nv);
        },
        immediate: false,
        deep: true,
      },
    },
    methods: {
      // 导航栏点击
      longClick(index) {
        if (this.tabTitle.length > 5) {
          this.tabLeft = (index - 2) * this.isWidth; //设置下划线位置
        }
        this.tabClick = index; //设置导航点击了哪一个
        this.isLeft = index * this.isWidth; //设置下划线位置
        this.$emit('changeTab', index); //设置swiper的第几页
      },
    },
  };
</script>

<style lang="scss">
  .nav-tabBox {
    width: 100vw;
    .longTab {
      width: 100%;
      .longItem {
        height: 88rpx;
        display: inline-block;
        line-height: 88rpx;
        text-align: center;
      }
      .underline-box {
        height: 3px;
        width: 20%;
        display: flex;
        align-content: center;
        justify-content: center;
        transition: 0.5s;
        .underline {
          width: 40rpx;
          height: 8rpx;
          border-radius: 4rpx;
          background-color: #e51600;
        }
      }
    }
  }
</style>
