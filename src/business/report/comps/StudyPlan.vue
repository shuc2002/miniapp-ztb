<!--
* @desc 原型进度条
* @author daisitin
* @date 2022年04月25日
-->
<template>
  <view class="plan-box">
    <!-- <view class="plan-text common-text-700 common-text text-size-main">制定学习计划</view> -->
    <!-- <view class="plan-select-box flex-center-box" @tap="showTree">
      <view class="flex-center">
        <view class="t-icon t-icon-book-open" />
        <view class="common-text-400 common-text text-size-main">做题科目</view>
      </view>
      <view class="flex-center">
        <view class="common-text-400 common-message text-size-sn subject-name">{{ subject }}</view>
        <view class="t-icon t-icon-chevron-right" />
      </view>
    </view> -->
    <view class="plan-select-box flex-center-box" @tap="openPicker">
      <view class="flex-center">
        <view class="t-icon t-icon-calendar" />
        <view class="common-text-400 common-text text-size-main">每日提醒时间</view>
      </view>
      <view class="flex-center">
        <view class="common-text-400 common-message text-size-sn">{{ time }}</view>
        <view class="t-icon t-icon-chevron-right" />
      </view>
    </view>
    <TimeSelect :option="list2" v-model="value" ref="timeSelect" @change="change" />

    <SelectPicker
      ref="selectpicker"
      :list="list"
      rangeKey="name"
      @confirm="handleConfirm"
      @cancel="handleCancel"
    />
  </view>
</template>
<script>
  import SelectPicker from './SelectPicker.vue';
  import TimeSelect from './TimeSelect.vue';

  export default {
    name: 'progressLine',
    components: { SelectPicker, TimeSelect },
    data() {
      return {
        list: [],
        subject: '',
        list2: [
          {
            name: '01',
            children: [{ name: '00' }, { name: '30' }],
          },
          {
            name: '02',
            children: [{ name: '00' }, { name: '30' }],
          },
          {
            name: '03',
            children: [{ name: '00' }, { name: '30' }],
          },
          {
            name: '04',
            children: [{ name: '00' }, { name: '30' }],
          },
          {
            name: '05',
            children: [{ name: '00' }, { name: '30' }],
          },
          {
            name: '06',
            children: [{ name: '00' }, { name: '30' }],
          },
          {
            name: '07',
            children: [{ name: '00' }, { name: '30' }],
          },
          {
            name: '08',
            children: [{ name: '00' }, { name: '30' }],
          },
          {
            name: '09',
            children: [{ name: '00' }, { name: '30' }],
          },
          {
            name: '10',
            children: [{ name: '00' }, { name: '30' }],
          },
          {
            name: '11',
            children: [{ name: '00' }, { name: '30' }],
          },
          {
            name: '12',
            children: [{ name: '00' }, { name: '30' }],
          },
          {
            name: '13',
            children: [{ name: '00' }, { name: '30' }],
          },
          {
            name: '14',
            children: [{ name: '00' }, { name: '30' }],
          },
          {
            name: '15',
            children: [{ name: '00' }, { name: '30' }],
          },
          {
            name: '16',
            children: [{ name: '00' }, { name: '30' }],
          },
          {
            name: '17',
            children: [{ name: '00' }, { name: '30' }],
          },
          {
            name: '18',
            children: [{ name: '00' }, { name: '30' }],
          },
          {
            name: '19',
            children: [{ name: '00' }, { name: '30' }],
          },
          {
            name: '20',
            children: [{ name: '00' }, { name: '30' }],
          },
          {
            name: '21',
            children: [{ name: '00' }, { name: '30' }],
          },
          {
            name: '22',
            children: [{ name: '00' }, { name: '30' }],
          },
          {
            name: '23',
            children: [{ name: '00' }, { name: '30' }],
          },
          {
            name: '00',
            children: [{ name: '00' }, { name: '30' }],
          },
        ],
        value: [1, 2],
      };
    },
    props: {
      time: {
        type: String,
        default: '00:00',
      },
    },
    methods: {
      // 确定选择
      change(e) {
        let time = `${this.list2[e[0]].name}:${this.list2[e[0]].children[e[1]].name}`;
        this.$emit('getTime', time);
      },
      // 确定回调事件
      handleConfirm(e) {
        this.subject = e.name;
      },
      // 取消回调事件
      handleCancel() {},
      // 显示树形选择器
      showTree() {
        this.$refs.selectpicker._show();
      },
      // 显示
      openPicker() {
        this.$refs['timeSelect'].show();
      },
    },
  };
</script>
<style lang="scss" scoped>
  .plan-box {
    position: relative;
    // &:after {
    //   content: '';
    //   position: absolute;
    //   right: 100rpx;
    //   top: -50rpx;
    //   width: 0;
    //   height: 0;
    //   border-style: solid;
    //   border-width: 10px 10px 0 10px;
    //   border-color: #ffffff transparent transparent transparent;
    // }
    .plan-text {
      margin: 50rpx 42rpx;
    }
    .plan-select-box {
      margin: 0 32rpx;
      margin-bottom: 24rpx;
      border-radius: 16rpx;
      padding: 40rpx 32rpx;
      background-color: #ffffff;
    }
    .t-icon-book-open,
    .t-icon-calendar {
      margin-right: 20rpx;
      width: 36rpx;
      height: 36rpx;
    }
    .t-icon-chevron-right {
      margin-left: 16rpx;
    }
    .subject-name {
      width: 346rpx;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
</style>
