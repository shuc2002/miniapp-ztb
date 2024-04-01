<template>
  <view class="flex-col page">
    <view class="flex-col flex-auto group_3 space-y-354">
      <view class="flex-col group_4">
        <view class="flex-col section">
          <view class="flex-col items-start group_5 space-y-14">
            <text class="font_3 text_3">购买服务</text>
            <text class="font_2">{{ info.name }}</text>
          </view>
          <view class="flex-col group_6 space-y-14">
            <text class="self-start font_3 text_4">使用期限</text>
            <view class="flex-row space-x-8">
              <view
                v-for="item in info.skuList"
                :key="item.skuId"
                @click="onChange(item)"
                class="sku-item"
              >
                <view
                  v-if="item.skuId === currentSkuId"
                  class="flex-col items-center relative equal-division-item_2"
                >
                  <text class="font_4 text_5">{{ item.timeLimit }}个月</text>
                  <text class="font_5 text_6">{{ item.discount }}折</text>
                  <image
                    class="image_5 pos_2"
                    src="https://codesign-v2-1258344706.cos.ap-guangzhou.myqcloud.com/codefun//07b1ea43a8e017e6adef9ee6895e313a.png"
                  />
                </view>
                <view v-else class="flex-col items-center equal-division-item_3 space-y-6">
                  <text class="font_4">{{ item.timeLimit }}个月</text>
                  <text class="font_5">{{ item.discount }}折</text>
                </view>
              </view>
            </view>
          </view>
        </view>
        <view class="flex-row items-center group_7 space-x-6">
          <image
            class="image_6"
            src="https://codesign-v2-1258344706.cos.ap-guangzhou.myqcloud.com/codefun//7c4c73ae5cce7871bd16b740c191e30a.png"
          />
          <text class="font_6 text_7">我已阅读并同意</text>
          <text class="font_6 text_8" @click="viewProtocol">《学员服务条款》</text>
        </view>
      </view>
      <view class="flex-col section_2">
        <view class="flex-row justify-between items-center group_8">
          <view class="flex-row items-baseline space-x-4">
            <view class="group_9">
              <text class="text_11">¥</text>
              <text class="text_9">{{ info.price }}</text>
            </view>
            <text class="font_4 text_12">¥{{ info.linePrice }}</text>
          </view>
          <view class="flex-col justify-start items-center text-wrapper">
            <text class="font_2 text_10">立即抢购</text>
          </view>
        </view>
        <view class="section_3"></view>
      </view>
    </view>
  </view>
</template>

<script>
  import { getCommodityDetail } from '@/api/modules/commodity/index';

  export default {
    components: {},
    data() {
      return {
        info: {},
        currentSkuId: null,
      };
    },
    onLoad({ id = 0 }) {
      this.getCommodityDetail({ id });
    },
    computed: {
      channelId() {
        return this.$store.getters.getChannelId;
      },
    },
    methods: {
      async getCommodityDetail(data) {
        const result = await getCommodityDetail(data);
        console.log('result--', result);
        this.info = result.body || {};
      },
      viewProtocol() {
        uni.navigateTo({
          url: `/page_commodity/order/pages/userProtocol?channelId=${this.channelId}`,
        });
      },
      onChange(val) {
        this.currentSkuId = val.skuId;
      },
    },
  };
</script>

<style scoped lang="scss">
  .flex-row {
    display: flex;
    flex-direction: row;
  }

  .flex-col {
    display: flex;
    flex-direction: column;
  }

  .justify-start {
    justify-content: flex-start;
  }

  .justify-end {
    justify-content: flex-end;
  }

  .justify-center {
    justify-content: center;
  }

  .justify-between {
    justify-content: space-between;
  }

  .justify-around {
    justify-content: space-around;
  }

  .justify-evenly {
    justify-content: space-evenly;
  }

  .items-start {
    align-items: flex-start;
  }

  .items-end {
    align-items: flex-end;
  }

  .items-center {
    align-items: center;
  }

  .items-baseline {
    align-items: baseline;
  }

  .items-stretch {
    align-items: stretch;
  }

  .self-start {
    align-self: flex-start;
  }

  .self-end {
    align-self: flex-end;
  }

  .self-center {
    align-self: center;
  }

  .self-baseline {
    align-self: baseline;
  }

  .self-stretch {
    align-self: stretch;
  }

  .flex-1 {
    flex: 1 1 0%;
  }

  .flex-auto {
    flex: 1 1 auto;
  }

  .grow {
    flex-grow: 1;
  }

  .grow-0 {
    flex-grow: 0;
  }

  .shrink {
    flex-shrink: 1;
  }

  .shrink-0 {
    flex-shrink: 0;
  }

  .relative {
    position: relative;
  }
  .page {
    background-color: #f6f6f6;
    width: 100%;
    overflow-y: auto;
    overflow-x: hidden;
    height: 100%;
    .group_3 {
      overflow-y: auto;
      .group_4 {
        padding: 0 30rpx;
        .section {
          padding: 0 20rpx 80rpx;
          background-color: #ffffff;
          border-radius: 16rpx;
          .group_5 {
            padding: 40rpx 0 48rpx;
            border-bottom: solid 2rpx #f6f6f6;
            .text_3 {
              line-height: 22rpx;
            }
          }
          .space-y-14 {
            & > view:not(:first-child),
            & > text:not(:first-child),
            & > image:not(:first-child) {
              margin-top: 28rpx;
            }
          }
          .group_6 {
            padding-top: 40rpx;
            .text_4 {
              line-height: 22rpx;
            }
            .space-x-8 {
              & > view:not(:first-child),
              & > text:not(:first-child),
              & > image:not(:first-child) {
                margin-left: 16rpx;
              }
              .sku-item {
                width: 150rpx;
                height: 150rpx;
              }
              .equal-division-item {
                padding: 60rpx 0;
                flex: 1 1 150rpx;
                border-radius: 8rpx;
                height: 150rpx;
                border: solid 2rpx #f2f3f5;
              }
              .equal-division-item_2 {
                padding: 44rpx 0;
                flex: 1 1 150rpx;
                background-color: #fef3f2;
                border-radius: 8rpx;
                height: 150rpx;
                border: dotted 2rpx #e51600;
                .text_5 {
                  color: #e51600;
                }
                .text_6 {
                  margin-top: 12rpx;
                  color: #e51600;
                }
                .image_5 {
                  width: 40rpx;
                  height: 40rpx;
                }
                .pos_2 {
                  position: absolute;
                  right: 0;
                  bottom: 0;
                }
              }
              .equal-division-item_3 {
                flex: 1 1 150rpx;
                padding: 44rpx 0;
                border-radius: 8rpx;
                height: 150rpx;
                border: solid 2rpx #f2f3f5;
              }
              .space-y-6 {
                & > view:not(:first-child),
                & > text:not(:first-child),
                & > image:not(:first-child) {
                  margin-top: 12rpx;
                }
              }
              .font_5 {
                font-size: 20rpx;
                font-family: PingFang SC;
                line-height: 18rpx;
                color: #ff7d00;
              }
            }
          }
          .font_3 {
            font-size: 24rpx;
            font-family: PingFang SC;
            line-height: 21rpx;
            color: #4e5969;
          }
        }
        .group_7 {
          padding: 32rpx 36rpx 0;
          .image_6 {
            border-radius: 4rpx;
            width: 40rpx;
            height: 40rpx;
          }
          .font_6 {
            font-size: 20rpx;
            font-family: PingFang SC;
            line-height: 21rpx;
          }
          .text_7 {
            color: #9ea1a3;
            font-size: 22rpx;
          }
          .text_8 {
            color: #4b538a;
            font-size: 22rpx;
          }
        }
        .space-x-6 {
          & > view:not(:first-child),
          & > text:not(:first-child),
          & > image:not(:first-child) {
            margin-left: 12rpx;
          }
        }
      }
      .section_2 {
        background-color: #ffffff;
        box-shadow: 0px -6rpx 8rpx #e8e8e840;
        .group_8 {
          padding: 16rpx 32rpx 0;
          .space-x-4 {
            & > view:not(:first-child),
            & > text:not(:first-child),
            & > image:not(:first-child) {
              margin-left: 8rpx;
            }
            .group_9 {
              line-height: 36rpx;
              height: 36rpx;
              .text_11 {
                color: #e51600;
                font-size: 30rpx;
                font-family: PingFang SC;
                font-weight: 600;
                line-height: 21rpx;
              }
              .text_9 {
                color: #e51600;
                font-size: 48rpx;
                font-family: PingFang SC;
                font-weight: 600;
                line-height: 36rpx;
              }
            }
            .text_12 {
              color: #b9bacb;
              line-height: 21rpx;
              text-decoration: line-through;
            }
          }
          .text-wrapper {
            padding: 32rpx 0;
            background-color: #e51600;
            border-radius: 80rpx;
            width: 296rpx;
            height: 96rpx;
            .text_10 {
              color: #ffffff;
              font-weight: 600;
            }
          }
        }
        .section_3 {
          background-color: #ffffff;
          border-radius: 4rpx;
          height: 19rpx;
        }
      }
      .font_4 {
        font-size: 28rpx;
        font-family: PingFang SC;
        line-height: 26rpx;
        color: #9ea1a3;
      }
      .font_2 {
        font-size: 32rpx;
        font-family: PingFang SC;
        line-height: 30rpx;
        color: #333333;
      }
    }
    .space-y-354 {
      & > view:not(:first-child),
      & > text:not(:first-child),
      & > image:not(:first-child) {
        margin-top: 708rpx;
      }
    }
  }
</style>
