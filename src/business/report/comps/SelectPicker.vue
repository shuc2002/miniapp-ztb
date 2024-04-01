<template xlang="wxml">
  <view class="select-picker">
    <!-- 遮罩层 -->
    <view class="select-picker-mask" :class="{ show: showMask }" @tap="_cancel" />
    <!-- 选择主体 -->
    <view class="select-picker-cnt" :class="{ show: showMask }">
      <view class="select-picker-bar flex-center">
        <view class="common-text-400 common-tip text-size-xxs">{{ title }}</view>
      </view>
      <view class="select-picker-view">
        <scroll-view class="select-picker-view-sc" :scroll-y="true">
          <block v-for="(item, index) in dataList" :key="index">
            <view class="flex-center-box select-picker-item" @tap="choiceOne(index)">
              <view class="flex-center text-size-sn common-text common-text-500">
                {{ item.name }}
              </view>
              <view class="flex-center">
                <view class="t-icon t-icon-xuanze" v-if="item.checked" />
                <view class="select-picker-check-no" v-else />
              </view>
            </view>
          </block>
          <view class="common-button flex-center" @tap="_confirm">确定</view>
        </scroll-view>
      </view>
    </view>
  </view>
</template>

<script>
  export default {
    name: 'select-picker',
    props: {
      list: {
        type: Array,
        default: function() {
          return [];
        },
      },
      title: {
        type: String,
        default: '每日一练将会根据您所选科目出题，修改后次日生效',
      },
    },
    data() {
      return {
        showMask: false,
        dataList: [
          {
            id: 1,
            name: '全选',
            checked: true,
          },
          {
            id: 2,
            name: '建设工程项目的组织与管理',
            checked: false,
          },
          {
            id: 3,
            name: '建设工程项目进度控制',
            checked: false,
          },
          {
            id: 4,
            name: '建设工程职业健康安全与环境管理',
            checked: false,
          },
        ],
      };
    },
    methods: {
      _show() {
        this.showMask = true;
      },
      _hide() {
        this.showMask = false;
      },
      _cancel() {
        this._hide();
        this.$emit('cancel', '');
      },
      _confirm() {
        // 处理所选数据
        this.dataList.forEach((v, i) => {
          if (i === 0) {
            this.$emit('confirm', { name: '全部' });
          } else {
            if (this.dataList[i].checked) {
              this.$emit('confirm', v);
            }
          }
          this._hide();
        });
      },
      // 选择某项
      choiceOne(index) {
        this.dataList.forEach((v, i) => {
          if (i != index) {
            this.dataList[i].checked = false;
          } else {
            this.dataList[i].checked = true;
          }
        });
      },
    },
  };
</script>

<style scoped>
  @import './style.scss';
</style>
