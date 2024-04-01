<!--
* @desc 个人中心
* @author 戴聪杰
* @date 2021年12月30日
-->
<template>
  <view>
    <view class="mypage-bg">
      <!-- 头部信息 -->
      <view class="mine-headBg">
        <view
          class="iconfont icon-settings"
          @tap="token && !isTryOut ? commonFun.routeTo('/page_material/setUp/index') : goLogin"
        ></view>
        <view
          class="mine-headMsg"
          @tap="token && !isTryOut ? commonFun.routeTo('/page_material/myInfo/index') : goLogin"
        >
          <view class="mine-Name flex">
            <!-- 用户头像 -->
            <image
              :src="token && !isTryOut ? avatar : '../../static/img/mine/default-Avatar.png'"
              mode="aspectFill"
            />
            <view class="mine-namebox">
              <!-- 用户名 -->
              <view
                class="text-size-xl common-text-700 common-text name-width truncate bold-text"
                v-show="token && !isTryOut"
                >{{ nickName }}
                <image
                  class="purchased-vip-icon"
                  v-if="memberInfo.purchased"
                  :src="
                    memberInfo.style == 1
                      ? `${baseStatic}/mine/vipIcon.png`
                      : `${baseStatic}/mine/plusIcon.png`
                  "
                ></image>
              </view>
              <!-- 用户登录 -->
              <view
                class="text-size-1xl common-text-700 text-user bold-text"
                @tap.stop="goLogin()"
                v-show="!token"
              >
                未登录
              </view>
              <view
                class="text-size-xl common-text-700 common-text name-width truncate bold-text"
                v-show="token && isTryOut"
                @tap.stop="goLogin()"
                >未登录</view
              >

              <view class="text-size-xxs common-logintip login-box"
                >ID:{{ token && !isTryOut ? uid : '点击登录，享受更多权益~' }}</view
              >
            </view>
          </view>
          <image
            class="purchased-no-icon"
            v-if="!memberInfo.purchased"
            :src="`${baseStatic}/mine/noMember.png`"
          ></image>
          <view class="iconfont icon-more_large" />
        </view>
      </view>
      <!-- 会员 -->
      <view
        class="mine-card"
        v-if="memberInfo.style"
        @tap="commonFun.routeTo(`/page_material/member/index`)"
      >
        <image
          class="no-card"
          :src="
            memberInfo.purchased && memberInfo.style == 1
              ? `${baseStatic}/mine/vip1.png`
              : memberInfo.purchased && memberInfo.style == 2
              ? `${baseStatic}/mine/vip2.png`
              : `${baseStatic}/mine/no_card.png`
          "
        ></image>
      </view>
      <!-- 积分和优惠卷 -->
      <view
        class="personal-box"
        :class="{
          'vip-mt-20': memberInfo.purchased && (memberInfo.style == 1 || memberInfo.style == 2),
        }"
      >
        <view v-for="(item, index) in oneSettingList" :key="index" @tap="goTo(item.name)">
          <view v-if="item.ifshow" class="flex-column-center personal-item">
            <image :src="item.icon" />
            <view class="text-size-xxs common-text-400 common-text">{{ item.alias }}</view>
          </view>
        </view>
      </view>
      <!-- 我的学习 -->
      <view class="mystudy-box">
        <view class="mystudy-tit" v-if="myStudyShow">{{ myStudyTit[0] }}</view>
        <view class="mystudy-flex">
          <view
            @tap="goTo(item.name)"
            v-for="(item, index) in myStudyList"
            :key="index"
            class="mystudy-item"
          >
            <view class="flex-column-center ">
              <image :src="item.icon" />
              <view class="text-size-xxs common-text-400 common-text">{{ item.alias }}</view>
            </view>
          </view>
          <view class="mystudy-item">
            <view class="flex-column-center" @tap="goTo('我的证书')">
              <image :src="`${baseStatic}/certificate/my-certificate.png`" />
              <view class="text-size-xxs common-text-400 common-text">我的证书</view>
            </view>
          </view>
        </view>
      </view>
      <!-- 用户个人中心 -->
      <view class="mine-setting">
        <view class="setting-tit" v-if="moreServeShow">{{ moreServeTit[0] }}</view>
        <view class="setting-flex">
          <view class="setting-item" @tap="goTo('我的协议')">
            <view class="flex-column-center item-inner">
              <!-- <view class="iconfont .icon-protocol setting-iconfont" /> -->
              <image :src="`${baseStatic}/certificate/protocol.png`" />
              <view class="setting-text">我的协议</view>
            </view>
          </view>
          <view
            v-for="(item, index) in moreServeList"
            :key="index"
            class="setting-item"
            @tap="goTo(item.name)"
          >
            <view class="flex-column-center item-inner" v-if="item.ifshow">
              <image :src="item.icon" />
              <view class="setting-text">{{ item.alias }}</view>
            </view>
          </view>
        </view>
      </view>
      <!-- <view class="logo-box">
        <view :class="['t-icon', logoClass]" />
      </view> -->
    </view>
    <CustomTab />
  </view>
</template>

<script>
  import { addRecord, getAdvertList, getPersonalCenter } from '@/api/modules/user/index';
  import CustomTab from '../../customTab';
  import { AdertUrl, baseUrl } from '@/enums/advert';
  import { getCommodityStatus } from '@/api/modules/commodity/index';
  import { getCouponList } from '@/api/modules/coupon/index';
  import { getMaxCard } from '@/api/modules/user/member.ts';
  import baseInfo from '@/build/index';
  import { ChannelSingleLogo } from '@/enums/msgEnum';
  import { bottomNavTo } from '@/utils/common.js';
  import { baseStatic } from '@/api/config/index';
  export default {
    name: 'mine',
    components: {
      CustomTab,
    },
    data() {
      return {
        baseStatic: baseStatic,
        logoClass: '',
        memberInfo: {},
        pubCommodityList: [
          {
            imgUrl: '',
          },
        ],
        usableList: 0,
        integral: 0,
        settingList: [
          /* #ifdef MP-WEIXIN */
          // {
          //   iconfont: 'iconfont .icon-a-customerservice',
          //   name: '联系客服',
          // },
          /* #endif */
          // {
          //   iconfont: 'iconfont .icon-opinion',
          //   name: '意见反馈',
          // },
          // {
          //   iconfont: 'iconfont icon-supervise',
          //   name: '监督投诉',
          // },
          // {
          //   iconfont: 't-icon t-icon-guanyu',
          //   name: '关于我们',
          // },
        ],
        oneSettingList: [],
        myStudyList: [],
        myStudyTit: '',
        moreServeTit: '',
        moreServeList: [],
        moreServeShow: true,
        myStudyShow: true,
      };
    },

    computed: {
      projectId() {
        // this.getPersonalCenterTem(this.$store.getters.getProjectId);
        return this.$store.getters.getProjectId;
      },
      token() {
        return this.$store.getters.getToken;
      },
      nickName() {
        return this.$store.getters.getNickName;
      },
      avatar() {
        return this.$store.getters.getAvatar;
      },
      uid() {
        return this.$store.getters.getUid;
      },
      tenantId() {
        return this.$store.getters.getTenantId;
      },
      isTryOut() {
        return uni.getStorageSync('isTryOut');
      },
    },
    watch: {
      settingList: {
        handler(val) {
          this.oneSettingList = val.action.config.filter((item) => item.type === 1);
          this.myStudyList = val.action.config.filter((item) => item.type === 2);
          this.moreServeList = val.action.config.filter((item) => item.type === 3);
          this.myStudyTit = val.action.config
            .filter((item) => item.key === 'mystudy')
            .map((z) => z.alias);
          this.moreServeTit = val.action.config
            .filter((item) => item.key === 'fuwu')
            .map((z) => z.alias);

          this.moreServeShow = val.action.config
            .filter((item) => item.key === 'fuwu')
            .map((z) => z.ifshow);
          this.myStudyShow = val.action.config
            .filter((item) => item.key === 'mystudy')
            .map((z) => z.ifshow);
          // const item1 = val.filter((item) => item.type === 1);
        },
        deep: true,
      },
    },
    onLoad() {
      this.logoClass = ChannelSingleLogo[baseInfo.CHANNEL];
    },
    onShow() {
      if (this.token && !this.isTryOut) {
        // this.getIntegralNum();
        this.getCouponList();
      }
      this.getAdvertList();
      this.getPersonalCenterTem();
      if (this.token) {
        this.getMaxCardData();
      }
      uni.hideTabBar();
    },
    // 转发页面
    async onShareAppMessage() {
      return {
        path: '/pages/mine/index',
        // imageUrl: 'https://app.static.wangxiao.cn/ykmf/images/zuduishuati.png',
      };
    },
    methods: {
      async getPersonalCenterTem() {
        const res = await getPersonalCenter({ pageCode: 'profile', id: this.projectId });
        const pageJson = JSON.parse(res.body.pageJson);
        this.settingList = pageJson[1];
        console.log(this.settingList, 'setting');
        // console.log('pererererer------', res.body.pageJson);
      },
      // 跳转到我的课程
      gotoMyCourse() {
        uni.setStorageSync('current', 1);
        // uni.switchTab({
        //   url: '/pages/newCourse/index',
        // });
        bottomNavTo('/pages/newCourse/index', 1);
      },
      async getAdvertList() {
        const data = await getAdvertList({
          type: 2,
          productId: this.projectId,
          tenantId: this.tenantId,
        });
        if (data && data.length > 0) {
          this.pubCommodityList = data;
        } else {
          this.pubCommodityList = [
            {
              imgUrl: baseUrl + this.tenantId + '/8f92cb8f216d4edeade1692c611617c1.png',
            },
          ];
        }
      },
      // 登录
      goLogin() {
        let homeURL = '/home/login/login';
        /* #ifdef H5 */
        homeURL = '/home/login/passwordLogin';
        /* #endif */
        uni.navigateTo({
          url: homeURL,
        });
      },
      // 获取我的积分
      // async getIntegralNum() {
      //   if (this.token) {
      //     const res = await getIntegralNum();
      //     this.integral = res.body;
      //   }
      // },
      // 获取我的优惠券
      async getCouponList() {
        const res = await getCouponList();
        this.usableList = res.body.usableCoupons.length;
      },
      // 图片错误
      handleError() {
        this.pubCommodityList = [
          {
            imgUrl: AdertUrl.Home,
          },
        ];
      },
      // 跳转
      goTo(key) {
        switch (key) {
          case '我的课程':
            this.gotoMyCourse();
            break;
          case '我的订单':
            uni.navigateTo({
              url: '/page_commodity/order/index',
            });
            break;
          case '排行榜':
            uni.navigateTo({
              url: '/business/learnGroup/index',
            });
            break;
          case '学习记录':
            uni.navigateTo({
              url: '/business/myRecords/index',
            });
            break;
          case '兑换码':
            uni.navigateTo({
              url: '/page_material/userCenter/exchange',
            });
            break;
          case '联系客服':
            uni.navigateTo({
              url: '/page_material/customerService/index',
            });
            break;
          case '意见反馈':
            uni.navigateTo({
              url: '/page_commodity/order/index',
            });
            break;
          case '监督投诉':
            uni.navigateTo({
              url: '/page_material/complaint/index',
            });
            break;
          case '更多设置':
            uni.navigateTo({
              url: '/page_material/setUp/index',
            });
            break;
          case '我的证书':
            uni.navigateTo({
              url: '/page_commodity/certificateCommodity/pages/certificateList',
            });
            break;
          case '我的协议':
            uni.navigateTo({
              url: '/page_material/agreement/index',
            });
            break;
          // case '兑换码':
          //   uni.navigateTo({
          //     url: '/page_material/userCenter/exchange',
          //   });
          //   break;
          // case '关于我们':
          //   this.commonFun.routeTo('/page_material/userCenter/about');
          //   break;
        }
      },
      // 点击广告
      async clickAdvert(data) {
        // 记录点击广告
        if (data.id) {
          await addRecord({ advertId: data.id });
          if (data.jumpType == 2) {
            //跳转链接
            uni.setClipboardData({
              data: data.jumpPage,
              success: () => {
                uni.hideToast();
                this.$nextTick(() => {
                  uni.showToast({
                    title: '链接已复制，请在浏览器打开',
                    icon: 'none',
                  });
                });
              },
            });
          } else {
            const status = await getCommodityStatus({ id: data.jumpPage });
            //跳转商品当type:1
            if (status.body == false) {
              uni.navigateTo({
                url: `/page_commodity/commodity/pages/commodityBank?id=${data.jumpPage}`,
              });
            } else if (status.body == true) {
              uni.navigateTo({
                url: `/page_commodity/courseList/index?id=${data.jumpPage}&isOrder=true`,
              });
            }
          }
        }
      },
      //会员
      async getMaxCardData() {
        let res = await getMaxCard(this.projectId);
        this.memberInfo = res.body;
      },
    },
  };
</script>

<style lang="scss" scoped>
  .mypage-bg {
    height: 100vh;
    background: #f9f9f9 !important;
  }
  .setting-iconfont {
    font-size: 20px;
    line-height: 21px;
    // margin-right: 16rpx;
    color: #9fa1a4;
  }
  .mine-headBg {
    // background-image: url('https://app.static.wangxiao.cn/ztb/mine-bg.png');
    // background-size: 100% 100%;
    // background-repeat: no-repeat;
    width: 100%;
    padding-top: 48rpx;
    position: relative;
    background: #f9f9f9;
    .icon-settings {
      padding-left: 30rpx;
      margin-bottom: 60rpx;
    }
    .mine-headMsg {
      display: flex;
      height: 100rpx;
      justify-content: space-between;
      align-items: center;
      margin: 0 40rpx;
      position: relative;
      margin-bottom: 47rpx;
      padding-bottom: 20rpx;
      .login-box {
        margin-left: 10rpx;
      }

      .mine-Name {
        line-height: 1.5;
        image {
          width: 100rpx;
          height: 100rpx;
          border-radius: 50%;
          border: 2rpx solid #ffffff;
          margin-right: 24rpx;
        }
        .mine-namebox {
          padding-top: 17rpx;
          .purchased-vip-icon {
            min-width: 94rpx;
            width: 94rpx;
            height: 32rpx;
            border-radius: 0;
            margin-left: 16rpx;
          }
        }
        .text-user {
          color: #333333;
          font-weight: 500;
          font-family: 'PingFang SC';
          // text-align: center;
        }
        .name-width {
          width: 380rpx;
        }
      }
      .icon-more_large {
        color: #bbbbbb;
        margin-top: 20rpx;
      }
    }
  }
  .mine-card {
    display: flex;
    align-items: center;
    justify-content: center;
    .no-card {
      width: 690rpx;
      height: 80rpx;
    }
    .vip-card {
      width: 690rpx;
      height: 120rpx;
    }
  }
  .personal-box {
    position: relative;
    width: 690rpx;
    height: 200rpx;
    background: #fff;
    margin: 0 auto;
    margin-top: 30rpx;
    display: flex;
    justify-content: space-around;
    align-items: center;
    text-align: center;
    border-radius: 10rpx;
    z-index: 9;
    .personal-item {
      width: 230rpx;
      height: 200rpx;
      justify-content: center;
    }
    .common-text {
      font-size: 24rpx;
      color: #333333ff;
      font-family: 'PingFang SC';
      line-height: 34rpx;
      font-weight: 500;
    }
    image {
      width: 80rpx;
      height: 80rpx;
      margin-bottom: 16rpx;
    }
    .integral-shop {
      width: 168rpx;
      height: 48rpx;
      border-radius: 24rpx;
      background: #f5f6fa;
      image {
        width: 40rpx;
        height: 40rpx;
        margin-top: 2rpx;
        margin-right: 6rpx;
      }
    }
    .integral-item {
      margin-bottom: 16rpx;
    }
    .discount-item {
      margin-bottom: 24rpx;
    }
  }
  .vip-mt-20 {
    margin-top: -24rpx;
  }
  .mystudy-box {
    width: 690rpx;
    height: 264rpx;
    background: #fff;
    margin: 0 auto;
    // padding-left: 30rpx;
    // padding-top: 32rpx;
    margin-top: 30rpx;
    margin-bottom: 30rpx;
    border-radius: 10rpx;
    .mystudy-item {
      width: 25%;
      height: 192rpx;
      margin-top: 88rpx;
      justify-content: center;
    }
    .mystudy-tit {
      padding-left: 30rpx;
      padding-top: 32rpx;
      font-size: 28rpx;
      font-weight: 600;
      color: #333333;
      font-family: 'PingFang SC';
    }
    .mystudy-flex {
      width: 690rpx;
      height: 192rpx;
      display: flex;
      align-items: center;
      justify-content: flex-start;
      // padding-left: 11rpx;
    }
    .flex1 {
      margin-right: 86rpx;
    }
    image {
      width: 40rpx;
      height: 40rpx;
      margin-bottom: 12rpx;
    }
  }

  .mine-setting {
    width: 690rpx;
    height: 264rpx;
    background: #fff;
    border-radius: 10rpx;
    margin: 0 auto;
    .setting-tit {
      font-size: 28rpx;
      font-weight: 600;
      color: #333333;
      font-family: 'PingFang SC';
      padding-left: 30rpx;
      padding-top: 32rpx;
    }
    .setting-flex {
      display: flex;
      align-items: center;
      justify-content: flex-start;
      // padding: 0 37rpx;
      text-align: center;
    }
    .setting-item {
      width: 25%;
      height: 192rpx;
      justify-content: center;
      .item-inner {
        height: 192rpx;
        justify-content: center;
      }
      image {
        width: 20px;
        height: 20px;
      }
    }
    .flex-center-box {
      margin-bottom: 64rpx;
    }
    .settingitem {
      margin-right: 78rpx;
    }

    .setting-text {
      font-size: 24rpx !important;
      color: #555555;
      margin-top: 10rpx;
    }
    .back-box {
      display: flex;
      align-items: center;
    }
  }
  .logo-box {
    margin: 40rpx auto;
    text-align: center;
    .t-icon {
      width: 258rpx;
      height: 44rpx;
      background-repeat: no-repeat;
    }
  }
  .space-height {
    margin-top: 4rpx;
  }
  .banner-swiper {
    height: 128rpx;
    width: 702rpx;
    margin: 36rpx 24rpx 0 24rpx;
    .swiper-item {
      height: 100%;
      width: 702rpx;
      border-radius: 24rpx;
    }
  }
  .purchased-no-icon {
    width: 120rpx;
    height: 32rpx;
    margin-top: 20rpx;
  }
  .bold-text {
    font-weight: 700 !important;
  }
</style>
