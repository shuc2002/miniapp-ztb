<!-- 根据模版渲染首页 -->
<template>
  <view class="page-home">
    <!-- 状态卡片 -->
    <!-- <StateCard /> -->
    <!-- 金刚区 -->
    <view class="area-jinggang" :style="[config.style]">
      <swiper style="min-height: 318rpx;" :current="currentTab" @change="swiperTab">
        <swiper-item v-for="(item3, index3) in pageListAll" :key="index3">
          <!-- 一行一行 -->
          <!-- <view class="row-jinggang" v-for="(item, index) in getLineArr(pageListAll[currentTab])" :key="index"> -->
          <view v-if="Array.isArray(currentListNow[0])">
            <view
              class="row-jinggang"
              v-for="(item, index) in currentListNow"
              :key="index"
              :style="{ width: (720 * item.length) / maxLine + 'rpx' }"
            >
              <!-- 一个一个 -->
              <view
                class="one-jinggang"
                v-for="(child, index2) in item"
                :key="index2"
                @tap="jinggangClick(child.click)"
                :style="{
                  width:
                    (750 -
                      Number(config.style.paddingLeft) -
                      Number(config.style.paddingRight - 10)) /
                      maxLine +
                    'rpx',
                }"
              >
                <!-- child.text -->
                <!-- <view @tap="()=>(jinggangClick(child))" > -->
                <img class="one-jinggang-logo" :src="child.val" />
                <view
                  :style="{
                    width:
                      (720 -
                        Number(config.style.paddingLeft) -
                        Number(config.style.paddingRight - 10)) /
                        maxLine +
                      'rpx',
                  }"
                  class="one-jinggang-text"
                  >{{ child.text }}</view
                >
                <!-- </view> -->
              </view>
            </view>
          </view>

          <view
            class="row-jinggang"
            v-if="!Array.isArray(currentListNow[0])"
            :style="{ width: (750 * currentListNow.length) / maxLine + 'rpx' }"
          >
            <!-- 一个一个 -->
            <view
              class="one-jinggang"
              :style="{
                width:
                  ((750 * currentListNow.length) / maxLine -
                    140 -
                    Number(config.style.paddingLeft) -
                    Number(config.style.paddingRight)) /
                    currentListNow.length +
                  'rpx',
              }"
              v-for="(item, index) in currentListNow"
              :key="index"
              @tap="jinggangClick(item.click)"
            >
              <img class="one-jinggang-logo" :src="item.val" />
              <view class="one-jinggang-text">{{ item.text }}</view>
            </view>
          </view>
        </swiper-item>
      </swiper>
      <!-- 分页的小点 -->
    </view>
    <view class="cicle-box" v-if="pageListAll.length > 1">
      <view
        :class="currentTab == index ? 'page-cicle page-cicle-now' : 'page-cicle'"
        v-for="(item, index) in pageListAll"
        :key="index"
        @tap="changePage(index)"
      >
      </view>
    </view>
    <!-- <button @tap="test2">点击</button> -->
    <!-- 金刚区 -->
    <!-- {{ config }} -->
    <!-- <button @tap="show">点击</button> -->
  </view>
</template>

<script>
  // import StateCard from './StateCard.vue';
  import { getEmpower } from '@/api/modules/question/exercise';
  export default {
    name: 'RenderHomePage',
    props: {
      subjectId: { type: String || Number, default: '' },
      config: { type: Object, default: () => {} },
      activeSubjectId: { type: String, default: '' },
      subjectList: { type: Array, default: () => [] },
      projectId: { type: Number || String, default: '' },
      currentProp: { type: Number || String, default: '' },
    },
    components: {
      // StateCard,
    },
    computed: {
      isTryOut() {
        return uni.getStorageSync('isTryOut');
      },
      pageListAll() {
        return this.getListByPage(this.config);
      },
      currentListNow() {
        return this.getLineArr(this.pageListAll[this.currentTab]);
      },
      token() {
        return this.$store.getters.getToken;
      },
    },
    data() {
      return {
        //   code: '',
        test: 'color:red',
        text2: {},
        maxLine: 4,
        // pageListAll:[], //按页面分的数组
        currentList: [],
        currentTab: 0,
      };
    },
    onLoad() {
      // console.log(this.props.config, 'yyyyyyyyyyyye');
      // const res = this.getStyleByTemplate(this.config);
      // console.log(1234, 'dddddddd');
    },
    // onShow() {
    //   console.log(this.subjectId, 'p');
    // },
    methods: {
      //滑动
      swiperTab(e) {
        let index = e.detail.current; //获取索引
        this.currentTab = index;
      },
      // 点击分页小球
      changePage(index) {
        this.currentTab = index;
      },
      // 根据最大列数 实际个数 分页数组
      getListByPage(data) {
        let pageList = [];
        this.maxLine = data.base[0].val;
        if (data.action.config.length > 2 * data.base[0].val) {
          pageList = this.toSplice(data.action.config, 2 * data.base[0].val);
          // console.log('1');
        } else {
          pageList.push(data.action.config);
        }
        // this.pageListAll = pageList;
        // this.currentList = pageList[0];
        return pageList;
      },

      // 根据最大列数 细分数组
      getLineArr(data) {
        let list = [];
        // if (data.action.config.length > data.base[0].val) {
        //   list = this.toSplice(data.action.config, data.base[0].val);
        // } else {
        //   list = data.action.config;
        // }
        if (data.length > this.maxLine) {
          // list = this.toSplice(data.action.config, data.base[0].val);
          list = this.toSplice(data, this.maxLine);
        } else {
          // list = data.action.config;
          list = data;
        }
        return list;
      },
      // 根据数组 数字 拆分成小数组
      toSplice(arr, num) {
        let result = [];
        for (var i = 0; i < arr.length; i += num) {
          result.push(arr.slice(i, i + num));
        }
        return result;
      },
      // 金刚区按钮点击跳转
      jinggangClick(i) {
        // 没有token直接登录页
        if (!this.token) {
          let homeURL = '/home/login/login';
          /* #ifdef H5 */
          homeURL = '/home/login/passwordLogin';
          /* #endif */
          uni.navigateTo({
            url: homeURL,
          });
          return;
        }
        const href = i.href[1];
        //错题
        if (href === '错题集') {
          uni.navigateTo({
            url: '/business/myRecords/index?activeNum=0',
          });
          return;
        }
        if (href === '收藏') {
          uni.navigateTo({
            url: '/business/myRecords/index?activeNum=1',
          });
          return;
        }
        if (href === '会员中心') {
          uni.navigateTo({
            url: '/page_material/member/index',
          });
          return;
        }
        if (href === '每日一练') {
          this.$emit('handleDailyExercise');
          // this.goExercise();
        } else {
          // 跳转商品
          // areaId: string; //金刚区ID
          // // 0 单商品，1多商品
          // single: 0 | 1;
          // // 0 商品模式 1产品模式 2协议模式
          // mode: 0 | 1 | 2;
          // 科目id subjectId
          let areaId = href;
          let single = i.single;
          let mode = i.mode;
          uni.navigateTo({
            url: `/page_commodity/commodityList/index?projectId=${
              this.projectId
            }&areaId=${areaId}&current=${
              this.currentProp
            }&single=${single}&mode=${mode}&subjectId=${
              this.subjectId
            }&subjectList=${JSON.stringify(this.subjectList)}`,
          });
        }
      },
      //去往每日一练
      async goExercise() {
        let res = await getEmpower(this.subjectId);
        uni.navigateTo({
          url: `/business/brushQuestions/index?code=${res.body.code}`,
        });
      },
    },
  };
</script>

<style lang="scss" scoped>
  .area-jinggang {
    margin-top: 64rpx;
    .row-jinggang {
      display: flex;
      justify-content: center;
      margin-bottom: 36rpx;
      // margin-left: 70rpx;
      // margin-right: 70rpx;
      // flex-direction: row;
      // justify-content: space-around;
    }
    .one-jinggang {
      flex: 1;
      .one-jinggang-logo {
        height: 80rpx;
        width: 80rpx;
        margin: 0rpx auto 16rpx;
        margin-bottom: 16rpx;
        display: flex;
        justify-content: center;
      }
      .one-jinggang-text {
        color: #4e4e4eff;
        font-size: 22rpx;
        font-weight: 400;
        font-family: 'PingFang SC';
        text-align: center;
        white-space: nowrap;
        // max-width: 100rpx;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
  }
  .cicle-box {
    display: flex;
    justify-content: center;
    margin-top: 6rpx;
    .page-cicle {
      width: 10rpx;
      height: 10rpx;
      border: 0 solid #979797ff;
      background: #eeeeeeff;
      border-radius: 50%;
      margin-right: 12rpx;
    }
    .page-cicle-now {
      width: 10rpx;
      height: 10rpx;
      border: 0 solid #979797ff;
      background: #e51600ff;
      border-radius: 50%;
    }
  }
</style>
