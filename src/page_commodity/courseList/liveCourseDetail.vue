<!--
* @desc 课程树
* @author 江玉龙
* @date 2022年06月14日
-->
<template>
  <view>
    <view class="product-box">
      <view class="top-introduce">
        <!-- <view class="img-introduce"></view> -->
        <view class="product-title-box">
          <view class="title-text">中级经济师零基础取证特训营-24期</view>
          <view class="teacher-name">胡芳老师</view>
        </view>
        <view class="tip-box">
          <view class="tip-box-status">
            <view class="status-text">直播中</view>
            <view class="time-text">18:30-20:00</view>
          </view>
          <view class="tip-box-title"
            >第一课 中级经济师入门课 (听课送入门的优惠卷哦一二三四五六)</view
          >
        </view>
        <view class="directory-box">
          <view class="directory-icon"></view>
          <view class="directory-text">目录</view>
        </view>
      </view>
      <view class="center-line"></view>
      <view v-for="(item, key) in list" :key="key">
        <view class="for-box">
          <!-- 第一层 -->
          <view class="second-item flex" @tap="handleTree(key)">
            <view
              class="t-icon analysis-icon"
              :class="item.checked ? 't-icon-list-1-Expand' : 't-icon-list-1-PutAway'"
            />
            <p class="text-size-main common-text common-text-700 truncate-two"
              >{{ item.name }}3333</p
            >
          </view>
          <!-- 第二层 -->
          <view v-if="item.checked">
            <ProductList
              :treeData="value"
              v-for="(value, num) in item.units"
              :key="num"
              :productId="productId"
            />
            <view v-if="item.next && item.next.length > 0">
              <view v-for="(record, sign) in item.next" :key="sign">
                <view class="three-item flex" @tap="handleTree(key, sign)">
                  <view
                    class="t-icon analysis-icon"
                    :class="record.checked ? 't-icon-list-2-Expand' : 't-icon-list-2-PutAway'"
                  />
                  <p class="text-size-main common-text common-text-400 truncate-two">{{
                    record.name
                  }}</p>
                </view>
                <view v-if="record.checked">
                  <ProductList
                    :treeData="value"
                    v-for="(value, num) in record.units"
                    :key="num"
                    :productId="productId"
                  />
                </view>
              </view>
            </view>
          </view>
        </view>
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
  import ProductList from './comps/CourseTree.vue';
  import { getConstructs } from '@/api/modules/user/index.ts';
  import GetIntegral from '@/components/GetIntegral/GetIntegral.vue';

  export default {
    name: 'liveCourseDetail',
    components: {
      ProductList,
      GetIntegral,
    },
    computed: {
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
    data() {
      return {
        list: [],
        productId: '',
        ifShow: false,
        socketMsgs: {},
      };
    },
    onLoad(options) {
      this.productId = options.productId;
      this.getConstructs(this.productId);
    },
    onShow() {
      if (this.ifShow) {
        this.getConstructs(this.productId);
      }
    },
    methods: {
      // 获取课程的产品结构
      async getConstructs(id) {
        let res = await getConstructs({ id });
        this.list = res.body.constructs;
        this.ifShow = true;
        this.setChecked(this.list);
      },
      // 树增加判断节点字段checked
      setChecked(treeList) {
        treeList?.map((item) => {
          item.checked = true;
          if (item.next?.length > 0) {
            item.next.map((data) => {
              data.checked = true;
            });
          }
        });
        return treeList;
      },
      // 树节点点击
      handleTree(key, sign) {
        this.handleLoop(this.list, key, sign);
        this.$forceUpdate();
      },
      handleLoop(data, key = -1, sign = -1) {
        if ((key > -1) & (sign == -1)) {
          data[key].checked = !data[key].checked;
        } else if ((key > -1) & (sign > -1)) {
          data[key].next[sign].checked = !data[key].next[sign].checked;
        }
      },
    },
  };
</script>

<style lang="scss" scoped>
  .product-box {
    width: 750rpx;
    height: 100vh;
    background-color: #ffffff;
    .top-introduce {
      .img-introduce {
        width: 750rpx;
        height: 422rpx;
        background-color: aqua;
      }
      .product-title-box {
        margin-top: 32rpx;
        padding-left: 30rpx;
        .title-text {
          //   width: 658rpx;
          height: 56rpx;
          font-family: PingFang-SC-Bold;
          font-weight: 700;
          font-size: 40rpx;
          color: #2e2e2e;
          line-height: 40rpx;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .teacher-name {
          height: 40rpx;
          //   margin-top: 8rpx;
          font-family: PingFang-SC-Medium;
          font-weight: 500;
          font-size: 28rpx;
          color: #999eb5;
          line-height: 40rpx;
        }
      }
      .tip-box {
        display: flex;
        margin-top: 30rpx;
        margin-left: 30rpx;
        .tip-box-status {
          width: 180rpx;
          height: 100rpx;
          background: rgba(255, 29, 29, 0.1);
          border-radius: 20rpx 0 0 20rpx;
          border-radius: 20rpx 0 0 20rpx;
          .status-text {
            font-family: PingFang-SC-Medium;
            font-weight: 500;
            font-size: 28rpx;
            color: #ff1d1d;
            text-align: center;
            line-height: 28rpx;
            padding-top: 20rpx;
          }
          .time-text {
            font-family: PingFang-SC-Medium;
            font-weight: 500;
            font-size: 24rpx;
            color: #ff1d1d;
            text-align: center;
            line-height: 24rpx;
            padding-top: 8rpx;
          }
        }
        .tip-box-title {
          width: 510rpx;
          height: 100rpx;
          //   transform: scaleX(-1);
          background-image: linear-gradient(270deg, #fff3f3 0%, #fff6f6 100%);
          border-radius: 0 20rpx 20rpx 0;
          padding-left: 20rpx;
          font-size: 26rpx;
          color: #2e2e2e;
          line-height: 100rpx;
          //   padding-top: 32rpx;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      }
      .directory-box {
        display: flex;
        margin-top: 28rpx;
        margin-bottom: 28rpx;
        .directory-icon {
          width: 8rpx;
          height: 32rpx;
          background: #e51600;
          border-radius: 20rpx;
          border-radius: 5rpx;
          margin-left: 30rpx;
        }
        .directory-text {
          font-family: PingFang-SC-Medium;
          font-weight: 500;
          font-size: 32rpx;
          color: #344049;
          line-height: 32rpx;
          margin-left: 10rpx;
        }
      }
    }
    .center-line {
        height: 20rpx;
        width: 100%;
        background-color: #F5F7FB;
    }
    .for-box {
      margin-bottom: 24rpx;
      .second-item {
        min-height: 48rpx;
        padding: 32rpx 0;
        margin: 0 24rpx;
        border-bottom: 2rpx solid #f5f6fa;
        p {
          width: 588rpx;
          margin-left: 16rpx;
        }
      }
      .three-item {
        min-height: 48rpx;
        padding: 32rpx 24rpx 32rpx 32rpx;
        p {
          width: 588rpx;
          margin-left: 16rpx;
        }
      }
    }
  }
</style>
