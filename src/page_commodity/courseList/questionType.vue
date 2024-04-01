<!-- 练习模式 筛选页 -->
<template>
  <view class="page-bg">
    <view class="type-1-text">题型</view>
    <view class="type-box">
      <view v-for="(item, index) in typeList" :key="index">
        <view
          :class="item.value == current1 ? 'active-box type-round-box' : 'type-round-box'"
          @tap="handleSelect1(item.value)"
          >{{ item.name }}</view
        >
      </view>
    </view>
    <view class="type-2-text">选择</view>
    <view class="type-box-2">
      <view v-for="(item, index) in selectList" :key="index">
        <view
          :class="item.value == current2 ? 'active-box type-round-box-2' : 'type-round-box-2'"
          @tap="handleSelect2(item.value)"
          >{{ item.name }}</view
        >
      </view>
    </view>
    <view class="type-2-text">题量</view>
    <view class="type-box-2">
      <view v-for="(item, index) in numList" :key="index">
        <view
          :class="item.value == current3 ? 'active-box type-round-box-2' : 'type-round-box-2'"
          @tap="handleSelect3(item.value)"
          >{{ item.name }}</view
        >
      </view>
    </view>
    <view class="start-btn" @tap="start">
      开始答题
    </view>
  </view>
</template>

<script>
  // import PopupWindow from '@/components/PopupComp/PopupWindow.vue';
  // import { getShopProduct } from '@/api/modules/commodity/index';
  import { getQuestionType } from '@/api/modules/question/index.ts';
  // import { submitQuestion } from '@/api/modules/question/index.ts';
  export default {
    name: 'questionType',
    components: {
      // PopupWindow,
    },
    data() {
      return {
        typeList: [
          {
            name: '全部',
            value: 10,
          },
        ],
        selectList: [
          {
            name: '全部',
            value: 0,
          },
          {
            name: '已答题',
            value: 2,
          },
          {
            name: '未答题',
            value: 1,
          },
          {
            name: '错题',
            value: 3,
          },
        ],
        numList: [
          {
            name: '30道',
            value: 30,
          },
          {
            name: '50道',
            value: 50,
          },
          {
            name: '100道',
            value: 100,
          },
          {
            name: '不限',
            value: -1,
          },
        ],
        current1: 10,
        current2: 0,
        current3: 30,
        productId:'',
        unit:'',
        code:'',
      };
    },
    onLoad(options) {
      this.productId = options.productId;
      this.unit = options.unit;
      this.code = options.code;
      if (options.code) {
        this.getTypeList(options.code);
      }
    },
    onReady() {
      // this.getCourse();
    },
    computed: {
      // projectId() {
      //   return this.$store.getters.getProjectId;
      // },
    },
    methods: {
      //获取类型列表
      async getTypeList(data) {
        const res = await getQuestionType(data);
        console.log(res, 'ccccc');
        if (res.body) {
          res.body.map((item) => {
            this.typeList.push(item);
          });
        }
      },
      // 选择点击事件
      handleSelect1(val) {
        this.current1 = val;
      },
      handleSelect2(val) {
        this.current2 = val;
      },
      handleSelect3(val) {
        this.current3 = val;
      },
      //开始答题 整理参数 去往答题页 
      start(){
        // await submitQuestion({ code: this.code, answers: [] });
        uni.navigateTo({
          url: `/page_commodity/courseList/courseQuestion?productId=${this.productId}&unit=${this.unit}&code=${this.code}&questionType=${this.current1}&count=${this.current3}&recordType=${this.current2}`,
        });
      }
    },
  };
</script>

<style lang="scss">
  .type-1-text {
    color: #333333ff;
    font-size: 24rpx;
    font-weight: 400;
    font-family: 'PingFang SC';
    text-align: left;
    line-height: 24rpx;
    margin-top: 32rpx;
    margin-left: 30rpx;
  }
  .type-box {
    margin-left: 30rpx;
    display: flex;
    flex-wrap: wrap;
  }
  .type-round-box {
    margin-top: 16rpx;
    border-radius: 72rpx;
    opacity: 1;
    background: #f2f3f5ff;
    // text-align: center;
    height: 56rpx;
    // min-width: 148rpx;
    margin-right: 24rpx;
    color: #4e5969ff;
    font-size: 28rpx;
    font-weight: 400;
    font-family: 'PingFang SC';
    text-align: left;
    line-height: 56rpx;
    padding-right: 32rpx;
    padding-left: 32rpx;
  }
  .type-2-text {
    color: #333333ff;
    font-size: 24rpx;
    font-weight: 400;
    font-family: 'PingFang SC';
    text-align: left;
    line-height: 24rpx;
    margin-top: 64rpx;
    margin-left: 30rpx;
  }
  .type-box-2 {
    display: flex;
    flex-wrap: wrap;
    margin-left: 30rpx;
  }
  .type-round-box-2 {
    margin-top: 16rpx;
    border-radius: 72rpx;
    opacity: 1;
    background: #f2f3f5ff;
    height: 56rpx;
    width: 148rpx;
    margin-right: 24rpx;
    color: #4e5969ff;
    font-size: 28rpx;
    font-weight: 400;
    font-family: 'PingFang SC';
    text-align: center;
    line-height: 56rpx;
  }
  .start-btn {
    width: 590rpx;
    height: 96rpx;
    border-radius: 72rpx;
    opacity: 1;
    background: #e51600ff;
    margin: 562rpx auto 0rpx;
    text-align: center;
    line-height: 96rpx;
    color: #ffffffff;
    font-size: 32rpx;
    font-weight: 600;
    font-family: 'PingFang SC';
  }
  .active-box {
    background: #fde8e6ff;
    color: #e51600ff;
  }
</style>
