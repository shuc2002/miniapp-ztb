<template>
  <BottomModal ref="popup">
    <view slot="head">
      <view class="title">
        请选择所在地区
        <view @tap="close" class="close t-icon t-icon-x-circle" />
      </view>
    </view>
    <view slot="body">
      <view class="region-container">
        <view class="nav-list">
          <view class="head line1" :class="tabIndex == 0 ? 'selected' : ''" @tap="changeNav(0)">{{
            province ? province.name : '请选择'
          }}</view>
          <view
            v-if="tabIndex > 0"
            class="head line1"
            :class="tabIndex == 1 ? 'selected' : ''"
            @tap="changeNav(1)"
            >{{ city ? city.name : '请选择' }}</view
          >
          <view
            v-if="tabIndex > 1"
            class="head line1"
            :class="tabIndex == 2 ? 'selected' : ''"
            @tap="changeNav(2)"
            >{{ district ? district.name : '请选择' }}</view
          >
        </view>
        <scroll-view class="address-list" scroll-y>
          <view v-if="tabIndex == 0">
            <view
              class="a-item"
              :class="province.id == item.id ? 'common-blue' : ''"
              v-for="(item, index) in provinceArray"
              :key="index"
              @tap="selectItem(item)"
            >
              <view class="text line1">{{ item.name }}</view>
              <image class="selected-icon t-icon t-icon-Followed" v-if="province.id == item.id" />
            </view>
          </view>
          <view v-if="tabIndex == 1">
            <view
              class="a-item"
              :class="city.id == item.id ? 'common-blue' : ''"
              v-for="(item, index) in cityArray"
              :key="index"
              @tap="selectItem(item)"
            >
              <view class="text line1">{{ item.name }}</view>
              <image class="selected-icon t-icon t-icon-Followed" v-if="city.id == item.id" />
            </view>
          </view>
          <view v-if="tabIndex == 2">
            <view
              class="a-item"
              :class="district.id == item.id ? 'common-blue' : ''"
              v-for="(item, index) in districtArray"
              :key="index"
              @tap="selectItem(item)"
            >
              <view class="text line1">{{ item.name }}</view>
              <image class="selected-icon t-icon t-icon-Followed" v-if="district.id == item.id" />
            </view>
          </view>
        </scroll-view>
      </view>
    </view>
  </BottomModal>
</template>

<script>
  import BottomModal from '@/components/BottomModal/BottomModal.vue';
  import AddressData from './AddressData.json';
  export default {
    components: { BottomModal },
    computed: {
      provinceArray() {
        return AddressData;
      },
      cityArray() {
        if (this.province) {
          return this.province.children;
        } else {
          return [];
        }
      },
      districtArray() {
        if (this.city) {
          return this.city.children;
        } else {
          return [];
        }
      },
    },
    data() {
      return {
        tabIndex: 0,
        province: '', //省
        city: '', //市
        district: '', //区
      };
    },
    methods: {
      /**
       * 重选地区
       */
      changeNav(key) {
        if (key === 0) {
          this.province = '';
          this.city = '';
          this.district = '';
          this.tabIndex = 0;
        } else if (key === 1) {
          this.city = '';
          this.district = '';
          this.tabIndex = 1;
        }
      },
      /**
       * 选择地址
       */
      selectItem(item) {
        this.tabIndex == 0
          ? (this.province = item)
          : this.tabIndex == 1
          ? (this.city = item)
          : (this.district = item);
        if (this.tabIndex == 2) {
          this.$emit('finish', this.province, this.city, this.district);
          this.close();
        }
        if (this.tabIndex < 2) {
          this.tabIndex++;
        }
      },
      // 关闭弹窗
      close() {
        this.$refs.popup.cancel();
      },
      // 打开弹窗
      open() {
        this.$refs.popup.showCover = true;
        this.province = '';
        this.city = '';
        this.district = '';
        this.tabIndex = 0;
      },
    },
  };
</script>

<style lang="scss" scoped>
  .title {
    color: #333333;
    font-size: 32rpx;
    padding: 20rpx 0;
    text-align: center;
    position: relative;
    font-weight: 600;
    .close {
      width: 48rpx;
      height: 48rpx;
      position: absolute;
      right: 24rpx;
      top: 16rpx;
    }
  }
  .region-container {
    height: 700rpx;
    display: flex;
    flex-wrap: wrap;
    flex-direction: column;
    .line1 {
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
    }
    .nav-list {
      width: 100%;
      height: 100rpx;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      .head {
        width: 25%;
        font-size: 28rpx;
        font-weight: 600;
        position: relative;
        height: 50rpx;
        text-align: center;
        color: #323949;
        &::after {
          content: '';
          display: block;
          height: 4rpx;
          width: 32rpx;
          position: absolute;
          bottom: 0rpx;
          left: 50%;
          transform: translateX(-50%);
          background-color: transform;
          transition: background-color 0.3s;
        }
        &.selected {
          font-weight: 500;
          &::after {
            background-color: #475ffd;
          }
        }
      }
    }
    .address-list {
      position: relative;
      flex: 1;
      height: 1rpx;
      .a-item {
        padding: 0 48rpx;
        height: 88rpx;
        transition: background-color 0.1s;
        display: flex;
        justify-content: space-between;
        align-items: center;
        .text {
          width: 90%;
        }
        .selected-icon {
          width: 40rpx;
          height: 40rpx;
        }
      }
    }
  }
</style>
