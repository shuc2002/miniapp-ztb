<!-- 切换科目 页面 -->

<template>
  <view class="select-subject-bg">
    <view class="select-all-box">
      <!-- 我的科目盒子 -->
      <view class="my-subject-box">
        <view class="my-subject-title"
          >我的科目<span class="my-subject-title-extra">长按可以拖动排序</span></view
        >
        <template v-if="movableShow">
          <movable-area class="my-subject-content" :style="{ height: height }">
            <movable-view
              :class="(index + 1) % 3 == 0 ? 'red-subject-box ' : 'red-subject-box box-right'"
              v-for="(item, index) in mySubject"
              :key="index"
              :x="item.x ? item.x : 0"
              :y="item.y ? item.y : 0"
              @tap="deleteSubject(item)"
              direction="all"
              :animation="false"
              :disabled="!isMove"
              :data-moveid="index"
              @change="moveChange"
              @touchend="touchOver"
              @longpress="moveStart"
              :style="{
                zIndex: index == moveId ? 2 : 1,
              }"
            >
              {{ item.v }}
              <view class="close-select-subject iconfont icon-close"></view>
            </movable-view>
          </movable-area>
        </template>
      </view>
      <!-- 其他科目盒子 -->
      <view class="other-subject-box">
        <view class="other-subject-title">点击添加科目</view>
        <view class="other-subject-content">
          <view
            :class="(index + 1) % 3 == 0 ? 'white-subject-box ' : 'white-subject-box box-right'"
            v-for="(item, index) in otherSubject"
            :key="index"
            @tap="addSubject(item)"
          >
            {{ item.v }}
            <view class="close-select-subject iconfont icon-addition"></view>
          </view>
        </view>
      </view>
    </view>
    <view class="bottom-btn">
      <button class="select-ready" @tap="handSelect">我选好了</button>
    </view>
  </view>
</template>

<script>
  import { getSubjectList } from '@/api/modules/commodity/index';
  import { setProject, getMySubjects } from '@/api/modules/user/index.ts';
  import { bottomNavTo } from '@/utils/common.js';
  export default {
    name: 'SelectSubject',
    data() {
      return {
        mySubject: [],
        otherSubject: [],
        projectId: '',
        projectName: '',
        fromCommList: false,
        areaId: 0,
        single: 0,
        isMove: false,
        x: 0, // 横向移动距离
        y: 0, // 纵向移动距离
        moveId: -1, //移动的是哪个元素块
        moveToId: -1, //移动到是哪个元素块
        movableShow: true,
      };
    },
    computed: {
      token() {
        return this.$store.getters.getToken;
      },
      tourist() {
        return uni.getStorageSync('tourist');
      },
      list() {
        return this.$store.getters.getDailyAnalysis;
      },
      channelId() {
        return this.$store.getters.getChannelId;
      },
      tenantId() {
        return this.$store.getters.getTenantId;
      },
      height() {
        return Math.ceil(this.mySubject.length / 3) * 120 + 'rpx';
      },
    },
    onLoad(options) {
      this.phone = options.phone;
      this.uid = options.uid;
      this.projectId = options.projectId;
      this.projectName = options.projectName;
      this.areaId = options.areaId;
      this.single = options.single;
      this.getSubject();
      if (options.fromCommList) {
        this.fromCommList = true;
      }
      /* #ifdef H5 */
      // this.thirdAppId = WeixinAppId[baseInfo.CHANNEL];
      // this.channelId = WeixinChannelId[baseInfo.CHANNEL];
      /* #endif */
      /* #ifdef MP-TOUTIAO */
      // this.thirdAppId = DouyinAppId[baseInfo.CHANNEL];
      // this.channelId = DouyinChannelId[baseInfo.CHANNEL];
      /* #endif */
      /* #ifdef MP-BAIDU */
      // this.thirdAppId = ChannelAppId[baseInfo.CHANNEL];
      // this.channelId = BaiduChannelId[baseInfo.CHANNEL];
      /* #endif */
      /* #ifdef MP-WEIXIN */
      // this.thirdAppId = WeixinAppId[baseInfo.CHANNEL];
      // this.channelId = WeixinChannelId[baseInfo.CHANNEL];
      /* #endif  */
    },
    methods: {
      // 添加科目
      addSubject(data) {
        // 新增
        let arr = this.mySubject;
        arr.push(data);
        this.mySubject = arr;
        // 删除
        let newOtherArr = [];
        this.otherSubject.map((item) => {
          if (item.k != data.k) {
            newOtherArr.push(item);
          }
        });
        this.otherSubject = newOtherArr;
      },
      // 取消科目
      deleteSubject(data) {
        let newMyArr = [],
          newOtherArr = this.otherSubject;
        //删除
        this.mySubject.map((item) => {
          if (item.k != data.k) {
            newMyArr.push(item);
          }
        });
        //新增
        newOtherArr.push(data);
        this.mySubject = newMyArr;
        this.otherSubject = newOtherArr;
      },
      // 选择好了
      async handSelect() {
        if (this.mySubject.length == 0) {
          uni.showToast({
            title: '至少要保留一个科目哦~',
            icon: 'none',
          });
        } else {
          let subjectId = [];
          this.mySubject.map((item) => {
            subjectId.push(item.k);
          });
          this.$store.commit('setProjectId', this.projectId);
          this.$store.commit('setProjectName', this.projectName);
          // await setProject({ projectId: items.projectId });
          const res = await setProject({ projectId: this.projectId, subjectIds: subjectId });
          console.log(res);
          if (res.code == 1000) {
            if (this.fromCommList) {
              let subjectList = [];
              this.mySubject.map((item) => {
                subjectList.push({ name: item.v, id: item.k });
              });
              uni.navigateTo({
                url: `/page_commodity/commodityList/index?projectId=${this.projectId}&areaId=${
                  this.areaId
                }&single=${this.single}&&subjectList=${JSON.stringify(subjectList)}`,
              });
            } else {
              // uni.reLaunch({
              //   url: '/pages/home/index',
              // });
              bottomNavTo('/pages/realHome/index', 2);
            }
          }
        }
      },
      //获取 科目数据
      async getSubject() {
        let allSubjectList = [];
        // 获取全部科目列表
        const res = await getSubjectList({ id: this.projectId });
        if (res.body) {
          allSubjectList = res.body;
          if (this.token) {
            // 获取我的科目列表 并筛出未选择的科目列表
            const data = await getMySubjects(this.projectId);
            if (data.body.length > 0) {
              this.mySubject = data.body;
              allSubjectList.map((item) => {
                let isOther = true;
                this.mySubject.map((child) => {
                  if (child.k == item.k) {
                    isOther = false;
                  }
                });
                if (isOther) {
                  this.otherSubject.push(item);
                }
              });
            } else {
              this.mySubject = [];
              this.otherSubject = allSubjectList;
            }
          } else {
            this.mySubject = [];
            this.otherSubject = allSubjectList;
          }
          this.mySubject.forEach((item) => {
            item.x = 0;
            item.y = 0;
          });
          this.otherSubject.forEach((item) => {
            item.x = 0;
            item.y = 0;
          });
        }
      },
      // px转rpx
      pxToRpx(px) {
        const screenWidth = uni.getSystemInfoSync().screenWidth;
        return (750 * Number.parseInt(px)) / screenWidth;
      },

      // 拖动开始事件 获取移动元素的index
      moveStart(e) {
        // 开启移动
        this.isMove = true;
        // 记录移动元素的index
        this.moveId = e.currentTarget.dataset.moveid;
        // 初始化moveToId
        this.moveToId = this.moveId;
      },
      // 拖动的事件 捕捉移动后的x y
      moveChange(e) {
        if (!this.isMove) {
          return;
        }
        this.x = this.pxToRpx(e.detail.x);
        this.y = this.pxToRpx(e.detail.y);
      },
      // 拖动离开事件
      touchOver() {
        if (!this.isMove) {
          return;
        }
        if (this.x < 0) {
          let xNum = Math.floor(Math.abs(this.x) / 234);
          // this.moveToId = this.moveId - xNum - 1;
          this.moveToId = this.getMoveToId(xNum, this.x, this.y);
          this.mySubject.forEach((item) => {
            item.x = 2;
            item.y = 2;
          });
          // 将重新排序的数组归坑
          this.$nextTick(function() {
            setTimeout(() => {
              this.handleChange();
            }, 100);
          });
        } else if (this.x > 0) {
          let xNum = Math.floor(Math.abs(this.x) / 234);
          // this.moveToId = this.moveId + xNum + 1;
          this.moveToId = this.getMoveToId(xNum, this.x, this.y);
          this.mySubject.forEach((item) => {
            item.x = 2;
            item.y = 2;
          });
          // 将重新排序的数组归坑
          this.$nextTick(function() {
            setTimeout(() => {
              this.handleChange();
            }, 100);
          });
        } else if (this.x == 0) {
          let xNum = 1;
          this.moveToId = this.getMoveToId(xNum, this.x, this.y);
          this.mySubject.forEach((item) => {
            item.x = 2;
            item.y = 2;
          });
          // 将重新排序的数组归坑
          this.$nextTick(function() {
            setTimeout(() => {
              this.handleChange();
            }, 100);
          });
        }
        this.x = 0;
        this.y = 0;
        // }
      },
      // 根据已知内容 计算移动后的index
      getMoveToId(xNum, x, y) {
        // 左
        if (x < 0) {
          if (Math.abs(y) < 40) {
            return this.moveId - xNum - 1;
          } else if (y < 0) {
            // 上移
            let yNum = Math.floor(Math.abs(y) / 200);
            // console.log(this.moveId,'iddddddd',this.moveId - (xNum + 1) - (yNum + 1 ) * 3);
            return this.moveId - (xNum + 1) - (yNum + 1) * 3;
          } else if (y > 0) {
            // 下移
            let yNum = Math.floor(Math.abs(y) / 120);
            // let temp = this.moveId;
            // this.moveId = this.moveId - (xNum + 1) + (yNum + 1) * 3;
            // return temp;
            return this.moveId - (xNum + 1) + (yNum + 1) * 3;
          }
        } else if (x > 0) {
          // 右
          if (Math.abs(y) < 40) {
            return this.moveId + xNum + 1;
          } else if (y < 0) {
            // 上移
            let yNum = Math.floor(Math.abs(y) / 200);
            return this.moveId + (xNum + 1) - (yNum + 1) * 3;
          } else if (y > 0) {
            // 下移
            let yNum = Math.floor(Math.abs(y) / 120);
            return this.moveId + (xNum + 1) + (yNum + 1) * 3;
            // let temp = this.moveId;
            // this.moveId = this.moveId + (xNum + 1) + (yNum + 1) * 3;
            // return temp;
          }
        } else if (x == 0) {
          // 中
          if (Math.abs(y) < 40) {
            return this.moveId;
          } else if (y < 0) {
            // 上移
            let yNum = Math.floor(Math.abs(y) / 240);
            return this.moveId - (yNum + 1) * 3;
          } else if (y > 0) {
            // 下移
            let yNum = Math.floor(Math.abs(y) / 120);
            return this.moveId + (yNum + 1) * 3;
          }
        }
      },
      // 交换位置 重新排放
      handleChange() {
        if (!this.isMove) {
          return;
        }
        // let oldArr1 = this.mySubject.concat();
        // let tempObj1 = oldArr1[this.moveId];
        // let tempObj2 = oldArr1[this.moveToId];
        // oldArr1[this.moveToId] = tempObj1;
        // oldArr1[this.moveId] = tempObj2;
        // console.log(oldArr1, 'arrr3');
        // this.mySubject = oldArr1;
        // this.$forceUpdate();
        // // 按顺序归位（移动，添加，删除）
        // let list1 = this.mySubject.concat();
        // list1.forEach((item) => {
        //   item.x = 0;
        //   item.y = 0;
        // });
        // // 样式回归(选中的透明度和移动结束位置的遮罩样式根据moveId和moveToId变化)
        // this.moveId = -1;
        // this.moveToId = -1;
        // this.isMove = false;
        // return;
        let oldArr = this.mySubject;
        let tempObj = oldArr[this.moveId];
        let newArr = [];
        oldArr.map((item, index) => {
          if (index != this.moveId) {
            newArr.push(item);
          }
        });
        newArr.splice(this.moveToId, 0, tempObj);
        // console.log(oldArr, 'old-new', newArr);
        // return;
        this.mySubject = newArr;
        console.log(oldArr, 'ARR-erer', newArr);
        // this.$forceUpdate();
        // 按顺序归位（移动，添加，删除）
        let list = this.mySubject.concat();
        list.forEach((item) => {
          item.x = 0;
          item.y = 0;
        });
        // 样式回归(选中的透明度和移动结束位置的遮罩样式根据moveId和moveToId变化)
        this.moveId = -1;
        this.moveToId = -1;
        this.isMove = false;
        this.mySubject = this.mySubject.concat([]);
        /* #ifdef H5 */
        this.movableShow = false;
        setTimeout(() => {
          this.movableShow = true;
        }, 100);
        /* #endif */
      },
      // 转发页面
      async onShareAppMessage() {
        return {
          path: '/home/SelectSubject',
          // imageUrl: 'https://app.static.wangxiao.cn/ykmf/images/zuduishuati.png',
        };
      },
    },
  };
</script>

<style lang="scss" scoped>
  .select-subject-bg {
    background-color: #ffffff;
    width: 100%;
    height: 100%;
    background-color: #ffffff;
    .select-all-box {
      .my-subject-box {
        .my-subject-title {
          margin-top: 32rpx;
          height: 90rpx;
          color: #333333ff;
          font-size: 36rpx;
          font-weight: 600;
          font-family: 'PingFang SC';
          text-align: left;
          line-height: 90rpx;
          margin-left: 30rpx;
          position: relative;
          .my-subject-title-extra {
            color: #9fa1a4ff;
            font-size: 24rpx;
            font-weight: 500;
            font-family: 'PingFang SC';
            line-height: 34rpx;
            text-align: left;
            position: absolute;
            left: 156rpx;
            bottom: 20rpx;
          }
        }
        .my-subject-content {
          margin: 10rpx 30rpx 0rpx;
          display: flex;
          width: 730rpx;
          flex-wrap: wrap;
          .red-subject-box {
            width: 222rpx;
            height: 90rpx;
            line-height: 90rpx;
            text-align: center;
            border-radius: 8rpx;
            border: 0 solid #ccccccff;
            background: #fdf3f2ff;
            color: #e51600ff;
            font-size: 26rpx;
            font-weight: 500;
            font-family: 'PingFang SC';
            margin-bottom: 16rpx;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            position: relative;
            .close-select-subject {
              position: absolute;
              right: 8rpx;
              top: 8rpx;
              font-size: 20rpx;
              line-height: 20rpx;
            }
          }
          .box-right {
            margin-right: 12rpx;
          }
        }
      }
      .other-subject-box {
        margin-top: 90rpx;
        .other-subject-title {
          height: 90rpx;
          color: #333333ff;
          font-size: 36rpx;
          font-weight: 600;
          font-family: 'PingFang SC';
          text-align: left;
          line-height: 90rpx;
          margin-left: 30rpx;
          position: relative;
        }
        .other-subject-content {
          margin: 10rpx 30rpx 0rpx;
          display: flex;
          flex-wrap: wrap;
          .white-subject-box {
            width: 222rpx;
            height: 90rpx;
            line-height: 90rpx;
            text-align: center;
            border-radius: 8rpx;
            border: 0 solid #d0d0d0ff;
            background: #f2f3f5ff;
            color: #4e5969ff;
            font-size: 26rpx;
            font-weight: 500;
            font-family: 'PingFang SC';
            margin-bottom: 16rpx;
            overflow: hidden;
            max-width: 222rpx;
            text-overflow: ellipsis;
            white-space: nowrap;
            position: relative;
            .close-select-subject {
              position: absolute;
              right: 8rpx;
              top: 8rpx;
              font-size: 20rpx;
              color: #c9cdd4ff;
              line-height: 20rpx;
            }
          }
          .box-right {
            margin-right: 12rpx;
          }
        }
      }
    }
    .bottom-btn {
      height: 212rpx;
      width: 100%;
      background: #ffffffff;
      position: fixed;
      bottom: 0rpx;
      .select-ready {
        width: 550rpx;
        height: 96rpx;
        border-radius: 16rpx;
        border: 0 solid #e51600ff;
        background: #e51600ff;
        color: #ffffffff;
        font-size: 32rpx;
        font-weight: 500;
        line-height: 96rpx;
        font-family: 'PingFang SC';
        margin-top: 16rpx;
      }
    }
  }
</style>
