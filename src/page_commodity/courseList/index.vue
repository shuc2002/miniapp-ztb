<template>
  <view class="page-bg padding-box">
    <view v-if="list.length > 0">
      <view v-for="(item, key) in list" :key="key">
        <view class="list-box" @tap="handleOpen(item)">
          <view class="catalogue">
            <view>
              <view class="flex-item-center">
                <view>
                  <!-- 考核标签 -->
                  <img
                    src="@/static/svgs/examlogo.svg"
                    alt=""
                    class="exam_tit"
                    v-if="item.hasExam"
                  />
                  <image
                    :src="getImageSrc()"
                    class="img-style"
                    style="width: 112rpx; height: 112rpx;"
                  />
                </view>
                <!-- <view class="t-icon icon-style t-icon-Product-PutAway" /> -->
                <view class="common-text-wrap">
                  <view class="text-size-main common-black common-text-600 truncate w-text"
                    >{{ item.v }}
                  </view>
                  <view class="flex-item-center time-expired">
                    <view v-if="item.isExpired == 2" class="expired-Btn flex-center">已过期</view>
                    <view v-if="item.useTime" class="common-tip text-size-xxs common-text-400">{{
                      item.useTime
                    }}</view>
                  </view>
                </view>
              </view>
            </view>
            <view class="t-icon t-icon-chevron-right icon-height" />
          </view>
        </view>
      </view>
    </view>
    <image
      class="no-card"
      v-if="list.length === 0"
      src="@/static/img/empty/order.png"
      mode="scaleToFill"
    />
    <PopupWindow ref="detail" height="340rpx" title="温馨提示">
      <view class="text-size-main">您的课程已过期，详情请咨询客服</view>
    </PopupWindow>
    <PopupWindow ref="force" height="340rpx" title="温馨提示">
      <view class="text-size-main">请在{{ day }}天后再使用</view>
    </PopupWindow>
  </view>
</template>

<script>
  import PopupWindow from '@/components/PopupComp/PopupWindow.vue';
  import { getShopProduct } from '@/api/modules/commodity/index';
  import { getCourse } from '@/api/modules/user/index.ts';
  import { fetchCertificateLessons } from '@/api/modules/certificate/index.ts';
  import courseImage from '@/page_commodity/static/course/course.png';
  export default {
    name: 'courseList',
    components: {
      PopupWindow,
    },
    data() {
      return {
        list: [],
        day: 0,
        certificateId: '',
        courseType: '',
      };
    },
    onLoad(options) {
      if (options.isOrder == 'true') {
        this.getShopProduct(options.id);
      } else if (options.certificateId) {
        this.getCertCourse(options.certificateId);
      } else {
        this.certificateId = options.certificateId;
        this.getCourse();
      }
    },
    // onReady() {
    //   this.getCourse();
    // },
    computed: {
      projectId() {
        return this.$store.getters.getProjectId;
      },
    },
    methods: {
      // 打开过期弹窗
      handleOpen(item) {
        if (item.isExpired == 1) {
          uni.navigateTo({
            url: `/page_commodity/courseList/courseDetail?productId=${item.k}&certId=${item.certificateId}`,
          });
        } else if (item.isExpired == 2) {
          this.$refs.detail.showModal = true;
        } else if (item.isExpired == 0) {
          this.day = item.day;
          this.$refs.force.showModal = true;
        }
      },
      // 获取用户课程
      async getCourse() {
        let res = await getCourse({ id: this.projectId });
        this.list = res.body.data;
      },

      // 获取证书课程
      async getCertCourse(certificateId) {
        let res = await fetchCertificateLessons({ id: this.projectId, certificateId });
        this.list = res.body;
        this.courseType = 'certificate';
      },

      // 获取产品课程
      async getShopProduct(id) {
        console.log('testasync');
        let res = await getShopProduct({ id });
        this.list = res.body.data;
        this.courseType = 'product';
      },

      getImageSrc() {
        return this.courseType === 'certificate'
          ? courseImage
          : 'https://acc.wangxiao.cn/image/certificate.png';
      },
    },
  };
</script>

<style lang="scss">
  .list-box {
    margin: 0 32rpx 24rpx 32rpx;
    border-radius: 24rpx;
    background: #f5f6fa;
    padding: 34rpx 32rpx;
    .catalogue {
      display: flex;
      justify-content: space-between;
      align-items: center;
      .space-height {
        margin-top: 16rpx;
      }
      .icon-style {
        width: 40rpx;
        height: 40rpx;
        margin-right: 24rpx;
      }
      .w-text {
        width: 436rpx;
        margin-left: 24rpx;
      }
      .icon-height {
        width: 40rpx;
        height: 40rpx;
      }
    }
  }

  .exam_tit {
    position: absolute;
    width: 33px;
    height: 19px;
    right: 16px;
    top: 14px;
  }
  .padding-box {
    padding-top: 32rpx;
  }
  .no-card {
    width: 344rpx;
    height: 344rpx;
    position: absolute;
    top: 33%;
    left: 50%;
    transform: translate(-50%);
  }
  .expired-Btn {
    width: 76rpx;
    height: 36rpx;
    border-radius: 8rpx;
    background: #989ead;
    font-size: 20rpx;
    color: #ffffff;
    margin-right: 16rpx;
  }
  .time-expired {
    margin-top: 18rpx;
    margin-left: 24rpx;
  }
</style>
