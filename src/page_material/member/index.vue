<template>
  <view class="common-bg" :class="{ 'white-bg': memberInfo.status == 1 }">
    <view
      class="member-page"
      :style="{ paddingBottom: memberInfo.status == 1 ? '0rpx' : '160rpx' }"
    >
      <view
        class="member-vip-bg"
        :class="{ 'member-plus-bg': memberInfo.style == 2 }"
        :style="{ paddingBottom: memberInfo.status == 1 ? '50rpx' : '0' }"
      >
        <!-- vip卡片类型 -->
        <swiper
          class="member-swiper"
          :current="currentIndex"
          @change="swiperChange"
          :next-margin="currentIndex == memberArr.length - 1 ? '0rpx' : '60rpx'"
          :previous-margin="currentIndex == 0 ? '0rpx' : '60rpx'"
        >
          <swiper-item v-for="(listItem, listIndex) in memberArr" :key="listIndex">
            <view class="member-swiper-box">
              <image
                :src="
                  listItem.style == 2
                    ? `${baseStatic}/member/plus.png`
                    : `${baseStatic}/images/vip.png`
                "
              ></image>
              <text
                class="top-text"
                :style="{ color: listItem.style == 1 ? '#66758D' : '#FFE7D1' }"
                >{{ memberInfo.purchased ? '已解锁' : '暂未开通' }}</text
              >
              <text
                class="bottom-text"
                :style="{ color: listItem.style == 1 ? '#66758D' : '#FFE7D1' }"
                >{{
                  memberInfo.purchased
                    ? `${memberInfo.cardName}有效期至:${memberInfo.maxExpireDate}~`
                    : `快去开通${memberInfo.cardName}享受畅学服务吧~`
                }}</text
              >
            </view>
          </swiper-item>
        </swiper>
        <!-- 区域 -->
        <view v-if="memberInfo.status != 1" class="member-area-box">
          <view class="member-auth">
            <text class="member-auth-title">{{ memberInfo.cardName }}享{{ areaNum }}大特权</text>
            <view class="member-unfold" @tap="upfoldChange">
              <text>{{ unfold ? '收起' : '展开' }}</text>
              <view
                :class="
                  unfold ? 'icon iconfont icon-chevron-up' : 'icon iconfont icon-chevron-down '
                "
              ></view>
            </view>
          </view>
          <view v-if="unfold">
            <view v-for="area in memberInfo.areas" :key="area.name">
              <view class="member-area-title">
                <view class="member-line"></view>
                <text>{{ area.title }}</text>
                <view class="member-line"> </view>
              </view>
              <view class="member-auth-area">
                <view
                  class="member-auth-item"
                  v-for="areaItem in area.equities"
                  :key="areaItem.name"
                >
                  <image :src="areaItem.iconUrl"></image>
                  <text class="auth-item-title">{{ areaItem.name }}</text>
                  <text class="auth-item-subtitle">{{ areaItem.title }}</text>
                </view>
              </view>
            </view>
          </view>
          <view class="member-auth-area" v-else>
            <view
              class="member-auth-item"
              v-for="areaItem in areaList.slice(0, 4)"
              :key="areaItem.name"
            >
              <image :src="areaItem.iconUrl"></image>
              <text class="auth-item-title">{{ areaItem.name }}</text>
              <text class="auth-item-subtitle">{{ areaItem.title }}</text>
            </view>
          </view>
        </view>
      </view>
      <view class="empty-info" v-if="memberInfo.status == 1">
        <image :src="`${baseStatic}/member/member_empty.png`"></image>
        <text>您的会员卡权益正在升级...</text>
      </view>
      <view v-if="memberInfo.status != 1">
        <!-- 背景 -->
        <image
          class="member-bg-bottom"
          :src="
            memberInfo.style == 2
              ? `${baseStatic}/member/bg_dark.png`
              : `${baseStatic}/member/bg_light.png`
          "
        ></image>
        <!-- 单科购买 -->
        <view v-if="memberInfo.property === 1">
          <!-- 选择课程 -->
          <view class="member-subject-box" v-if="subjectList && subjectList.length > 0">
            <view class="member-sub-header">
              <text class="sub-title">购买科目</text>
              <text class="sub-info">可多选</text>
            </view>
            <view
              v-for="(subject, subjectIndex) in subjectList"
              :key="subject.name"
              class="member-subject-item"
              :style="{
                border: subject.checked
                  ? memberInfo.style == 1
                    ? '2rpx solid #758ab1'
                    : '2rpx solid #6f5435'
                  : '2rpx solid #dee0e7',
                background: subject.checked
                  ? memberInfo.style == 1
                    ? '#758ab114'
                    : '#ffaa3b0a'
                  : '#ffffff',
              }"
              @tap="subjectClick(subjectIndex)"
            >
              <view class="member-subject-title">
                <text
                  class="ellipsis-one"
                  :class="{
                    'member-purchased-top': memberInfo.skuData[0].purchaseData[subject.subjectItem],
                  }"
                  >{{ subject.name }}</text
                >
                <text
                  class="member-subject-time"
                  v-if="memberInfo.skuData[0].purchaseData[subject.subjectItem]"
                >
                  有效期至：{{ memberInfo.skuData[0].purchaseData[subject.subjectItem] }}
                </text>
              </view>
              <view class="member-price">
                <text class="price-icon">￥</text>
                {{ memberInfo.minPrice }}
                <text class="price-num">起</text>
              </view>
              <!-- 已购买 -->
              <text
                v-if="memberInfo.skuData[0].purchaseData[subject.subjectItem]"
                class="member-subject-purchased"
                >已购买</text
              >
              <view
                v-if="subject.checked"
                :style="{ color: memberInfo.style == 1 ? '#758AB1' : '#6F5435' }"
                class="member-icon-selected iconfont icon-vip"
              />
            </view>
          </view>
          <!-- 选择时长 -->
          <view class="member-date-box" v-if="dateList && dateList.length > 0">
            <view class="member-sub-header">
              <text class="sub-title">选择时长</text>
            </view>
            <view class="member-date-all">
              <view
                class="member-date-item"
                v-for="(date, index) in dateList"
                @tap="dateClick(index)"
                :style="{
                  marginRight: (index + 1) % 3 == 0 ? '0rpx' : '20rpx',
                  border: date.checked
                    ? memberInfo.style == 1
                      ? '2rpx solid #758ab1'
                      : '2rpx solid #6f5435'
                    : '2rpx solid #dee0e7',
                  background: date.checked
                    ? memberInfo.style == 1
                      ? '#758ab114'
                      : '#ffaa3b0a'
                    : '#ffffff',
                }"
                :key="date.name"
              >
                {{ date.name }}
                <view
                  v-if="date.checked"
                  :style="{ color: memberInfo.style == 1 ? '#758AB1' : '#6F5435' }"
                  class="member-icon-selected iconfont icon-vip"
                />
              </view>
            </view>
          </view>
        </view>
        <!-- 全科购买 -->
        <view v-if="memberInfo.property === 2">
          <view class="member-date-box" v-if="dateList && dateList.length > 0">
            <view class="member-sub-header">
              <text class="sub-title">选择时长</text>
            </view>
            <view class="member-date-all">
              <view
                class="member-date-item member-all-item"
                v-for="(date, index) in dateList"
                @tap="dateClick(index)"
                :key="date.name"
                :style="{
                  marginRight: (index + 1) % 3 == 0 ? '0rpx' : '20rpx',
                  border: date.checked
                    ? memberInfo.style == 1
                      ? '2rpx solid #758ab1'
                      : '2rpx solid #6f5435'
                    : '2rpx solid #dee0e7',
                  background: date.checked
                    ? memberInfo.style == 1
                      ? '#758ab114'
                      : '#ffaa3b0a'
                    : '#ffffff',
                }"
              >
                <text class="member-all-name">{{ date.name }}</text>
                <view class="member-all-price">
                  ¥<text>{{ date.price }}</text>
                </view>
                <text class="member-all-linprice">¥{{ date.linePrice }}</text>
                <text
                  class="member-day-price"
                  :class="{
                    'member-price-checked': date.checked && memberInfo.style == 2,
                    'member-price-checked2': date.checked && memberInfo.style == 1,
                  }"
                  >仅{{ date.dayPrice }}元/天</text
                >
                <view
                  v-if="date.checked"
                  :style="{ color: memberInfo.style == 1 ? '#758AB1' : '#6F5435' }"
                  class="member-icon-selected iconfont icon-vip"
                />
              </view>
            </view>
          </view>
        </view>
        <!-- 会员说明 -->
        <view class="member-introduce-box">
          <view class="member-introduce-item">
            <text>会员说明</text>
            <view class="member-introduce-bar"></view>
            <rich-text :nodes="memberInfo.introduce"></rich-text>
          </view>
        </view>
        <view @tap="goQuestion" class="member-question-item">
          <view class="member-question">常见问题</view>
          <view class="member-icon-wenhao iconfont icon-wenhao"></view
        ></view>
        <!-- 购买 -->
        <view class="member-pay-box">
          <view
            class="member-pay-bar"
            @tap="goPay"
            :class="{ 'member-pay-plus-bar': memberInfo.style == 2 }"
          >
            <image
              class="member-right-bar"
              :src="
                memberInfo.style == 2
                  ? `${baseStatic}/member/bar_dark.png`
                  : `${baseStatic}/member/bar_light.png`
              "
            ></image>
            <text
              class="member-text-bar"
              :style="{ color: memberInfo.style == 1 ? '#3E4A5EFF' : '#FFF2E6FF' }"
              >快速开通</text
            >
            <text
              class="member-pay-symbo"
              :style="{ color: memberInfo.style == 1 ? '#F9FAFF' : '#3D3B38' }"
              >¥</text
            >
            <text
              class="member-pay-price"
              :style="{ color: memberInfo.style == 1 ? '#F9FAFF' : '#3D3B38' }"
              >{{ goodsData.price }}</text
            >
            <view
              class="member-pay-info"
              :style="{ color: memberInfo.style == 1 ? '#C8C9D1' : '#928681' }"
            >
              <text class="line-through-price">¥{{ goodsData.price }}</text>
              <text
                >{{
                  memberInfo.property === 2
                    ? `购买${goodsData.dateName ? goodsData.dateName : '--'}会员`
                    : `已选：${goodsData.subjectNum}个科目`
                }}
              </text>
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>
<script>
  import { getMemberCard } from '@/api/modules/user/member.ts';
  import { baseStatic } from '@/api/config/index';

  export default {
    name: 'member',
    data() {
      return {
        baseStatic: baseStatic,
        currentIndex: 0,
        areaList: [],
        areaNum: 0,
        subjectList: [],
        dateList: [],
        memberInfo: {},
        skuArr: [],
        unfold: false,
        memberArr: [],
        goodsData: {
          subjectNum: 0,
          price: 0,
          linePrice: 0,
        },
      };
    },
    computed: {
      projectId() {
        return this.$store.getters.getProjectId;
      },
    },
    onLoad() {
      this.getMemberData();
    },
    watch: {},
    methods: {
      // 获取所有会员卡
      async getMemberData() {
        let res = await getMemberCard(this.projectId);
        // 过滤下架会员卡
        this.memberArr = res.body.filter((item) => {
          return item.status === 0 || item.purchased;
        });
        this.getCurData();
      },
      // 获取当前会员卡片数据
      getCurData() {
        this.memberInfo = this.memberArr[this.currentIndex];
        let arr = [];
        this.memberInfo.areas.forEach((item) => {
          item.equities?.forEach((i) => {
            arr.push(i);
          });
        });
        this.areaList = arr;
        this.areaNum = arr.length;
        if (this.memberInfo.property == 2) {
          const data = [];
          const lenth =
            (this.memberInfo.skuList.length || 1) /
            (this.memberInfo.skuData?.[1]?.values.length || 0);
          for (let i = 0; i < lenth; i++) {
            data.push({
              checked: true,
              subjectIndex: i,
              name: this.memberInfo.skuList[i].skuName[0],
            });
          }
          this.subjectList = data;
        } else {
          this.subjectList = this.memberInfo.skuData[0].values.map((item) => {
            const arr = item.split(':');
            const subArr = arr[1].split('/');
            return {
              name: `单科【${subArr[0]}】 ${subArr[1]}`,
              checked: this.memberInfo.property == 2 ? true : false,
              subjectIndex: arr[0],
              subjectItem: arr[1],
            };
          });
        }

        if (this.memberInfo.skuData.length > 1) {
          this.dateList = this.memberInfo.skuData[1].values.map((item, index) => {
            let date = {
              name: item,
              checked: false,
              dateIndex: index,
            };
            if (this.memberInfo.allSkuCount) {
              let allDate = this.memberInfo.allSkuCount[index];
              if (this.memberInfo.property == 2) {
                date.price = allDate.price;
                date.linePrice = allDate.linePrice;
                date.dayPrice = allDate.dayPrice;
              }
            }
            return date;
          });
        }
      },
      //切换会员卡片
      swiperChange(e) {
        this.currentIndex = e.target.current;
        this.getCurData();
      },
      // 展开收起
      upfoldChange() {
        this.unfold = !this.unfold;
      },
      // 选择科目点击
      subjectClick(subjectIndex) {
        this.subjectList[subjectIndex].checked = !this.subjectList[subjectIndex].checked;
        this.subjectList = [].concat(this.subjectList);
        this.getGoodsData();
      },
      // 选择时长
      dateClick(dateIndex) {
        this.dateList = this.dateList.map((item) => {
          item.checked = false;
          return item;
        });
        this.dateList[dateIndex].checked = true;
        this.getGoodsData();
      },
      //获取当前的商品和科目信息
      getGoodsData() {
        let subjectSelected = this.subjectList.filter((item) => {
          return item.checked;
        });
        console.log(subjectSelected, '选中');
        let dateSelected = this.dateList.find((item) => {
          return item.checked;
        });
        let goodsData = {
          subjectNum: subjectSelected.length || 0,
          price: 0,
          linePrice: 0,
          dateName: dateSelected ? dateSelected.name : '',
        };
        if (subjectSelected && subjectSelected.length > 0 && dateSelected) {
          const skuList = this.memberInfo.skuList;
          this.skuArr = subjectSelected.map((item) => {
            const skuCode = item.subjectIndex + ':' + dateSelected.dateIndex;
            const sku = skuList.find((i) => i.skuCode === skuCode);
            sku.number = 1;
            sku.subName = `${item.name},${dateSelected.name}`;
            return sku;
          });
          console.log(this.skuArr, 'sku');
          let price = this.skuArr.reduce((pre, cur) => {
            return pre + cur.price;
          }, 0);
          let linePrice = this.skuArr.reduce((pre, cur) => {
            return pre + cur.linePrice;
          }, 0);
          goodsData.price = parseFloat(price.toFixed(2));
          goodsData.linePrice = parseFloat(linePrice.toFixed(2));
        }
        this.goodsData = goodsData;
        console.log(goodsData, '选择的sku');
      },
      goQuestion() {
        uni.navigateTo({
          url: '/page_material/member/question',
        });
      },
      // 支付
      goPay() {
        let subjectSelected = this.subjectList.filter((item) => {
          return item.checked;
        });

        let dateSelected = this.dateList.find((item) => {
          return item.checked;
        });

        if (subjectSelected.length === 0) {
          uni.showToast({
            title: '请选择科目',
            icon: 'none',
          });
        } else if (!dateSelected) {
          uni.showToast({
            title: '请选择时长',
            icon: 'none',
          });
        } else {
          let goodsCart = this.skuArr.map((sku) => {
            console.log(sku, '价格');
            let goods = {
              id: this.memberInfo.cardId,
              skuCode: sku.skuCode,
              number: 1,
              subName: sku.subName,
              name: this.memberInfo.cardName,
              price: sku.price,
              linePrice: sku.linePrice,
              thumbnail: this.memberInfo.thumbnail,
              commodityType: 1,
            };
            return goods;
          });
          uni.navigateTo({
            url: `/page_commodity/order/pages/collageOrder?commodityList=${JSON.stringify(
              goodsCart
            )}&isCollage=false&ifActivity=false&isMember=ture`,
          });
        }
      },
    },
  };
</script>
<style lang="scss" scoped>
  .white-bg {
    background: #666666;
  }
  .member-page {
    background: #ffffff;
    position: relative;
    .empty-info {
      position: absolute;
      width: 100%;
      height: 370rpx;
      display: flex;
      flex-direction: column;
      align-items: center;
      image {
        width: 334rpx;
        height: 370rpx;
      }
      text {
        margin-top: -30rpx;
        color: #9fa1a4;
        font-size: 28rpx;
      }
      top: 500rpx;
      left: 0;
      right: 0;
    }
    .member-vip-bg {
      padding-top: 10rpx;
      background: linear-gradient(180deg, #c3dff4 0%, #687ca5 100%);
    }
    .member-plus-bg {
      padding-top: 10rpx;
      background: #161311;
    }
    .member-swiper {
      height: 260rpx;
    }
    .member-swiper-box {
      position: relative;
      margin-left: 30rpx;
      width: 660rpx;
      height: 260rpx;
      image {
        width: 660rpx;
        height: 260rpx;
      }
      .top-text {
        position: absolute;
        top: 10rpx;
        line-height: 22rpx;
        left: 40rpx;
        font-size: 22rpx;
        color: '#FFE7D1';
      }
      .bottom-text {
        position: absolute;
        bottom: 24rpx;
        left: 30rpx;
        font-size: 22rpx;
        color: '#FFE7D1';
      }
    }
    .member-area-box {
      padding: 40rpx 30rpx 0;
      .member-area-title {
        display: flex;
        justify-content: space-between;
        margin-top: 24rpx;
        font-size: 24rpx;
        color: #aabfdd;
        align-items: center;
        text {
          margin: 0 40rpx;
        }
        .member-line {
          height: 1rpx;
          flex: 1;
          background: #aabfdd;
        }
      }
      .member-auth {
        display: flex;
        justify-content: space-between;
        .member-auth-title {
          font-weight: 600;
          color: #ffffff;
          font-size: 28rpx;
        }
        .member-unfold {
          display: flex;
          align-items: center;
          color: rgba(255, 255, 255, 0.8);
          font-size: 24rpx;
        }
      }
      .member-auth-area {
        display: flex;
        flex-wrap: wrap;
        position: relative;
        z-index: 9;
        .member-auth-item {
          margin-top: 22rpx;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          width: 168rpx;
          height: 148rpx;
          image {
            width: 80rpx;
            height: 80rpx;
          }
          .auth-item-title {
            font-size: 24rpx;
            color: #f0f3fc;
            margin-top: 14rpx;
          }
          .auth-item-subtitle {
            margin-top: 6rpx;
            font-size: 20rpx;
            color: rgba(240, 243, 252, 0.5);
          }
        }
      }
    }
    .member-bg-bottom {
      width: 100%;
      height: 60rpx;
      margin-top: -5rpx;
    }
    .member-subject-box {
      padding: 0 30rpx;
      .member-sub-header {
        display: flex;
        justify-content: space-between;
        .sub-title {
          color: #344049;
          font-size: 34rpx;
          font-weight: 600;
        }
        .sub-info {
          color: #999eb5;
          font-size: 28rpx;
        }
      }
      .member-subject-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        position: relative;
        width: 690rpx;
        // height: 120rpx;
        border-radius: 20rpx;
        margin-top: 20rpx;
        opacity: 1;
        padding: 0 20rpx;
        padding-top: 22rpx;
        .member-subject-title {
          display: flex;
          flex-direction: column;
          color: #344049;
          font-size: 30rpx;
          font-weight: 600;
          padding-bottom: 22rpx;
          .ellipsis-one {
            width: 500rpx;
            // overflow: hidden;
            text-overflow: ellipsis;
            white-space: wrap;
          }
        }
        .member-subject-time {
          color: #999eb5;
          font-size: 22rpx;
          font-weight: 400;
          line-height: 32rpx;
        }
        .member-subject-purchased {
          position: absolute;
          left: 0;
          top: 0;
          color: #ffffff;
          font-size: 20rpx;
          text-align: center;
          width: 92rpx;
          height: 32rpx;
          border-radius: 20rpx 0 20rpx 0;
          opacity: 1;
          background: #758ab1;
        }
        .member-purchased-top {
          margin-top: 20rpx;
        }
        .member-price {
          font-weight: 600;
          color: #f0522f;
          font-size: 32rpx;
          .price-num {
            color: #999eb5;
            font-size: 22rpx;
          }
          .price-icon {
            font-size: 24rpx;
          }
        }
      }
    }

    .member-date-box {
      margin-top: 48rpx;
      padding: 0 30rpx;
      .member-sub-header {
        display: flex;
        justify-content: space-between;
        .sub-title {
          color: #344049;
          font-size: 34rpx;
          font-weight: 600;
        }
      }
      .member-date-all {
        display: flex;
        flex-wrap: wrap;
        .member-date-item {
          position: relative;
          display: flex;
          justify-content: center;
          align-items: center;
          width: 216rpx;
          height: 88rpx;
          border-radius: 20rpx;
          opacity: 1;
          border: 2rpx solid #dee0e7;
          margin-top: 20rpx;
          margin-right: 20rpx;
        }
        .member-all-item {
          height: 250rpx;
          display: flex;
          flex-direction: column;
          justify-content: center;
          border: 2rpx solid #dee0e7;
          .member-all-name {
            color: #344049;
            font-size: 28rpx;
            font-weight: 600;
          }
          .member-all-price {
            color: #e51600;
            font-weight: 600;
            text-align: center;
            font-size: 24rpx;
            width: 220rpx;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            text {
              font-size: 66rpx;
            }
          }
          .member-all-linprice {
            color: #999eb5;
            font-size: 24rpx;
            text-decoration: line-through;
          }
          .member-day-price {
            margin-top: 16rpx;
            display: flex;
            justify-content: center;
            align-items: center;
            width: 168rpx;
            height: 44rpx;
            border-radius: 20rpx;
            background: #e9ebee;
            color: #6f758f;
            font-size: 24rpx;
          }
          .member-price-checked {
            background: #6f5435;
            color: #ffffff;
          }
          .member-price-checked2 {
            background: #758ab1;
            color: #ffffff;
          }
        }
      }
    }
    .member-introduce-box {
      padding: 0 30rpx 30rpx;
      margin-top: 64rpx;
      .member-introduce-item {
        position: relative;
        width: 690rpx;
        border-radius: 20rpx;
        opacity: 1;
        border: 0 solid #979797;
        background: #f8f9fa;
        padding: 26rpx 30rpx;
        .member-introduce-bar {
          width: 160rpx;
          height: 12rpx;
          margin-top: -10rpx;
          margin-left: -6rpx;
          margin-bottom: 20rpx;
          border-radius: 6rpx;
          border: 0 solid #979797;
          background: rgba(117, 138, 177, 0.4);
        }
      }
    }
    .member-pay-box {
      position: fixed;
      padding: 30rpx;
      bottom: 0;
      background: #ffffff;
      .member-pay-bar {
        display: flex;
        align-items: center;
        position: relative;
        padding: 0 30rpx;
        width: 690rpx;
        height: 100rpx;
        border-radius: 50rpx;
        background: #7186adff;
        .member-right-bar {
          height: 100rpx;
          width: 260rpx;
          position: absolute;
          top: 0;
          right: 0;
        }
        .member-text-bar {
          height: 100rpx;
          width: 240rpx;
          position: absolute;
          display: flex;
          justify-content: center;
          align-items: center;
          font-size: 34rpx;
          font-weight: 600;
          top: 0;
          right: 0;
        }
        .member-pay-symbo {
          font-weight: 500;
          margin-top: 16rpx;
          font-size: 24rpx;
        }
        .member-pay-price {
          font-weight: 500;
          font-size: 56rpx;
          margin-right: 12rpx;
        }
        .member-pay-info {
          .line-through-price {
            text-decoration: line-through;
          }
          display: flex;
          flex-direction: column;
          font-size: 20rpx;
          font-weight: 400;
        }
      }
      .member-pay-plus-bar {
        background: #fff2e6ff;
      }
    }
    .member-icon-selected {
      position: absolute;
      right: 0rpx;
      width: 48rpx;
      height: 48rpx;
      bottom: 0rpx;
      font-size: 48rpx;
      line-height: 48rpx;
    }
    .member-question-item {
      display: flex;
      justify-content: center;
      align-items: center;
      // border: 1px solid red;
    }
    .member-question {
      color: #4e5969;
      font-size: 24rpx;
    }
    .member-icon-wenhao {
      margin-left: 7rpx;
      font-size: 28rpx;
      color: #4e5969;
    }
  }
</style>
