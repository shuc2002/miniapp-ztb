<template>
  <view class="mask-box" v-if="show_picker">
    <view
      class="km-select"
      :class="{
        'km-select-eff': show_picker,
      }"
    >
      <view class="picker-box">
        <view class="km-btns">
          <button @click="hide">取消</button>
          <button @click="updateInput" class="confirm">确定</button>
        </view>
        <picker-view
          class="picker-view"
          :style="{
            height: `${height}px`,
          }"
          :value="default_value"
          @change="bindChange"
        >
          <template v-for="(item, index) in list">
            <picker-view-column v-if="item.length" :key="index">
              <view class="item" v-for="(item2, index2) in item" :key="index2">{{
                item2[label]
              }}</view>
            </picker-view-column>
          </template>
        </picker-view>
      </view>
    </view>
  </view>
</template>

<script>
  export default {
    props: {
      option: {
        // 数据源
        type: Array,
        default: () => [],
      },
      label: {
        // 显示的 key
        type: String,
        default: 'name',
      },
      concatKey: {
        // 列 连接 字段名
        type: String,
        default: 'children',
      },
      value: {
        // 绑定的值
        type: Array,
        default: () => [0, 0, 0],
      },
      height: {
        // 盒子高度
        type: Number,
        default: 300,
      },
    },
    data() {
      return {
        list: [], // 数据列表
        default_value: [], // picker 绑定的值
        show_picker: false, // 是否显示
      };
    },
    watch: {
      option: {
        handler() {
          this.parseOption('option'); // 解析数据源结构
        },
      },
      value: {
        handler(n) {
          this.default_value = n;
        },
      },
    },
    mounted() {
      this.default_value = this.value.length ? this.value : [0, 0, 0];
      this.list = this.option.length ? this.option : [];
      this.parseOption('mounted'); // 解析数据源结构
    },
    methods: {
      // 解析数据源结构
      parseOption() {
        const _this = this;
        let list = [];
        this.default_value.reduce((pre, item, index, res) => {
          // console.log(`${index} => `, pre)
          let arr = pre.map((e) => {
            return {
              [_this.label]: e[_this.label],
            };
          });
          list[index] = arr;

          if (pre[res[index]] && pre[res[index]][_this.concatKey]) {
            return pre[res[index]][_this.concatKey];
          } else return [];
        }, this.option);
        this.list = list;
      },
      // 列修改
      bindChange(e) {
        const _this = this;
        let value = e.detail.value;
        // 将滑动之后的列置 0
        let obj = value.reduce(
          (pre, item, index) => {
            let data = pre.data;
            if (pre.flag) data[index] = 0;
            else {
              if (item != _this.default_value[index]) {
                data[index] = item;
                pre.flag = true;
              } else {
                data[index] = item;
              }
            }
            return {
              ...pre,
              data,
            };
          },
          {
            flag: false, // true: 当前往后值置 0
            data: [],
          }
        );
        this.default_value = obj.data;
        this.parseOption();
      },
      // 提交值
      updateInput() {
        let value = JSON.parse(JSON.stringify(this.default_value));
        this.$emit('input', value);
        this.$emit('change', value);
        this.hide();
      },
      // 显示
      show() {
        this.show_picker = true;
      },
      // 隐藏
      hide() {
        this.show_picker = false;
      },
    },
  };
</script>

<style scoped>
  .mask-box {
    position: fixed;
    top: 0;
    left: 0;
    height: 100vh;
    width: 100vw;
    background: rgba(0, 0, 0, 0.4);
    z-index: 998;
  }
  .km-select {
    border-radius: 50px 50px 0 0;
    position: fixed;
    bottom: 0;
    width: 100%;
    transition: all 0.5s;
    transform: translateY(120%);
    padding-bottom: constant(safe-area-inset-bottom);
    padding-bottom: env(safe-area-inset-bottom);
    opacity: 0;
    z-index: 999;
    background-color: #fff;
  }
  .km-select-eff {
    transform: translateY(0);
    opacity: 1;
  }
  .km-btns {
    display: flex;
    background-color: #fff;
    padding-top: 10px;
  }
  .km-btns button {
    font-size: 32rpx;
    font-weight: 400;
    background-color: #fff;
    outline: none;
  }
  .km-btns .confirm {
    color: #475ffd;
  }
  .km-btns .confirm::after {
    border: none;
  }

  .picker-view {
    text-align: center;
  }
  .picker-view .item {
    display: flex;
    justify-content: center;
    align-items: center;
  }
</style>
