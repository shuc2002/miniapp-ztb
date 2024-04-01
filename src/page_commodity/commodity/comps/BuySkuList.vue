<!--
* @desc 价格栏组件
* @author 江玉龙
* @date 2022年04月20日
-->
<template>
  <view>
    <view class="goodstit">{{ commodityData.name }}</view>
    <view class="goodsprice flex"
      ><view class="goodsnow"><span>￥</span>{{ commodityData.price }}起</view>
      <view class="lineprice">{{ commodityData.linePrice }}</view>
    </view>
    <view class="sku-box" v-for="(data, key) in commodityData.skuOptions" :key="key">
      <p>{{ data.name }}</p>
      <view class="skuitem-box">
        <view
          v-for="(item, index) in data.values"
          :key="index"
          class="skuitem"
          :class="[select[key] === index ? 'select' : 'unselect']"
          @click="onClickOption(key, index)"
        >
          {{ item }}
          <view v-if="data.activityType == 3 && activity.amount" class="miaosha-tit">秒杀</view>
          <view v-if="data.activityType == 2" class="pintuan-tit">拼团</view>
        </view>
      </view>
    </view>
    <view class="countdown-box" v-if="commodityData.activityType == 3 && activity.amount">
      <view>
        <view>限时秒杀</view>
        <view class="flex-countdown"
          >剩<NewCountdown
            backgroundColor="#fff"
            textColor="#FF7200"
            fgColor="#FF7200"
            :remain="timeData"
            :showBox="true"
            :showMs="true"
          />后活动截止</view
        >
      </view>
    </view>
    <view class="skubutton">
      <view v-if="commodityData.activityType != 2 && commodityData.status == 0" class="btn-comm">
        <view>
          <view class="sku-left" v-if="goodsCart.length == 0">
            <view class="goodsnow"><span>￥</span>{{ commodityData.price }}起</view>
            <view class="lineprice"><span>￥</span>{{ commodityData.linePrice }}起</view>
          </view>
          <view class="pay-price" v-else>
            <view class="total-price">
              <view class="text-size-xxs">
                合计:<span class="common-price">￥</span>
                <span class="text-size-xl common-price">{{ totalPrice }}</span>
                <view
                  >已选<span class="common-price">{{ totalNum }}</span
                  >件 <span class="cartdetail" @click="goShopDetail">查看明细 ></span>
                </view>
              </view>
            </view>
          </view>
        </view>

        <view class="sku-right" v-if="commodityData.activityType != 2 && commodityData.status == 0">
          <button class="button-right" @click="pay">立即结算</button>
          <button class="button-left" @click="addCart">加入清单</button>
        </view>
      </view>
      <view class="miaosha-btn" v-else>
        <view>
          <view class="button-buy bug-money" @tap="handleOriginal()">
            <p class="text-size-xl common-text-700">￥{{ commodityData.price }}</p>
            <p class="text-size-xxs common-text-700">单独购买</p>
          </view>
        </view>
        <view>
          <view class="button-buy bug-collage" @tap="handleCollage()">
            <p class="text-size-xl common-text-700">￥{{ activity.amount }}</p>
            <p class="text-size-xxs common-text-700">发起拼单</p>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>
<script>
  import NewCountdown from '@/components/Countdown/NewCountdown.vue';
  export default {
    name: 'Price',
    components: {
      NewCountdown,
    },
    data() {
      return {
        commodityData: {},
        goodsdata: {},
        select: [],
        level: 0,
        goodsCart: [
          // {
          //   id: '',
          //   skuCode: '',
          //   number: 0,
          //   name: '',
          //   price: '',
          //   linePrice: '',
          //   url: '',
          // },
        ],
      };
    },
    props: {
      data: {
        type: Object,
      },
      activity: {
        type: Object,
        default: () => {},
      },
      timeData: {
        type: Number,
        default: 0,
      },
      orderContractId: {
        type: String,
        default: '',
      },
    },
    computed: {
      system() {
        return this.$store.getters.getSystem;
      },
      totalNum() {
        let num = 0;
        this.goodsCart.map((item) => {
          num += item.number;
        });
        return num;
      },
      totalPrice() {
        let price = 0;
        this.goodsCart.map((item) => {
          price += item.number * item.price;
        });
        return price;
      },
    },
    watch: {
      commodityData: {
        deep: true,
        handler(val) {
          this.level = val.skuOptions.length;
          const arr = [];
          for (let i = 0; i < this.level; i++) {
            arr.push(i < this.level ? 0 : '');
            this.select.push(i < this.level ? 0 : '');
          }
          // if (this.level) {

          // }
        },
      },
      // single:{
      //   handler(val){
      //     return
      //   }
      // }
    },
    onLoad() {
      this.commodityData = uni.getStorageSync('commodityData');
    },
    methods: {
      onClickOption(key, index) {
        // this.select[key] = index;
        this.$set(this.select, key, index);
        // let option = this.data.skuList.find((item) => item.skuCode == skuCode);
      },
      //加入购物车
      addCart() {
        let skuCode = '';

        this.select.map((item, index) => {
          skuCode += index == 0 ? item : ':' + item;
        });
        // for (let i = 0; i < this.select.length; i++) {
        //   if (i == 0) {
        //     skuCode += this.select[i];
        //   } else {
        //     skuCode += ':' + this.selecaddCartt[i];
        //   }
        // }

        // let skuCode = `${this.select[0]}:${this.select[1]}`;
        if (this.goodsCart.find((item) => item.skuCode == skuCode)) {
          let item = this.goodsCart.find((item) => item.skuCode == skuCode);
          item.number++;
          return;
        }
        let option = this.commodityData.skuList.find((item) => item.skuCode == skuCode);
        let cartItem = {
          id: this.commodityData.id,
          skuCode: skuCode,
          subName: this.skuCodeToName(skuCode),
          number: 1,
          name: this.commodityData.name,
          price: option.price,
          linePrice: option.linePrice,
          thumbnail: this.commodityData.thumbnail,
        };
        this.goodsCart.push(cartItem);
      },
      goShopDetail() {
        uni.navigateTo({
          url: `/page_commodity/commodity/comps/SkuCart?goodsCart=${JSON.stringify(
            this.goodsCart
          )}&isCollage=true&ifActivity=true&type=${this.commodityData.type}`,
        });
      },
      skuCodeToName(skuCode) {
        let skuName = '';
        let arr = skuCode.split(':');
        console.log(arr, 999);
        this.commodityData.skuOptions.forEach((item, index) => {
          const levelIndex = arr[index];
          skuName = index == 0 ? item.values[levelIndex] : `${skuName},${item.values[levelIndex]}`;
        });
        console.log(skuName, 999);
        return skuName;
      },
      pay() {
        if (this.goodsCart.length != 0) {
          this.handlePay(true);
        } else {
          if (this.level == this.select.length) {
            this.goPayRightNow();
          } else {
            if (this.goodsCart.length == 0) {
              this.goodsCart = [];
              if (this.level != this.select.length) {
                uni.showToast({ icon: 'none', title: '请选择规格' });
                return false;
              }
              let skuCode = '';
              this.select.map((item, index) => {
                skuCode += index == 0 ? item : ':' + item;
              });
              let option = this.data.skuList.find((item) => item.skuCode == skuCode);
              console.log(JSON.stringify(this.activity), 'acyivity');
              if (JSON.stringify(this.activity) != '{}') {
                option = this.activity.skuData.find((item) => item.skuCode == skuCode);
                if (option.overplus <= 0) {
                  uni.showToast({ icon: 'none', title: '库存不足' });
                  return false;
                }
              }
              let cartItem = {
                id: this.data.id,
                skuCode: skuCode,
                number: 1,
                subName: this.skuCodeToName(skuCode),
                name: this.data.name,
                price: option.price,
                amount: option.amount ? option.amount : option.price,
                linePrice: option.linePrice,
                thumbnail: this.data.thumbnail,
                stock: option.stock,
                commodityType: this.data.type,
                certificateId:
                  this.data.certificateId && this.data.type === 1 ? this.data.certificateId : null,
              };
              this.goodsCart.push(cartItem);
              if (this.commodityData.skuList.length == 1) {
                this.handlePay();
              }
            }
          }
        }

        // this.goodsCart = [];
        // if (this.level != this.select.length) {
        //   uni.showToast({ icon: 'none', title: '请选择规格' });
        //   return false;
        // }
        // let skuCode = '';
        // this.select.map((item, index) => {
        //   skuCode += index == 0 ? item : ':' + item;
        // });
        // let option = this.data.skuList.find((item) => item.skuCode == skuCode);
        // let cartItem = {
        //   id: this.data.id,
        //   skuCode: skuCode,
        //   number: 1,
        //   name: this.data.name,
        //   price: option.price,
        //   linePrice: option.linePrice,
        //   thumbnail: this.data.thumbnail,
        //   stock: option.stock,
        //   commodityType: this.data.type,
        // };
        // this.goodsCart.push(cartItem);
        // this.handlePay();
      },
      goPayRightNow() {
        let skuCode = '';
        this.select.map((item, index) => {
          skuCode += index == 0 ? item : ':' + item;
        });
        let option = this.commodityData.skuList.find((item) => item.skuCode == skuCode);
        console.log(this.activity, 'activity11--');
        if (this.activity && this.activity.skuData) {
          console.log(222);
          option = this.activity?.skuData.find((item) => item.skuCode == skuCode);
          if (option && option.overplus <= 0) {
            uni.showToast({ icon: 'none', title: '库存不足' });
            return false;
          }
        }
        let cartItem = {
          id: this.commodityData.id,
          skuCode: skuCode,
          number: 1,
          subName: this.skuCodeToName(skuCode),
          name: this.commodityData.name,
          price: option.price,
          amount: option.amount ? option.amount : option.price,
          linePrice: option.linePrice,
          thumbnail: this.commodityData.thumbnail,
          stock: option.stock,
          commodityType: this.commodityData.type,
          certificateId:
            this.commodityData.certificateId && this.commodityData.type === 1
              ? this.commodityData.certificateId
              : null,
        };
        this.handlePay(true, cartItem);
      },
      //支付
      handlePay(Original, goodsnow) {
        let ifActivity = false;
        let ifShowArgee = this.commodityData.contract ? true : false;
        if (JSON.stringify(this.activity) != '{}') {
          ifActivity = true;
        }
        if (Original) {
          ifActivity = false;
        }
        let goodsData = [];
        if (goodsnow == undefined) {
          goodsData = this.goodsCart;
        } else {
          goodsData.push(goodsnow);
        }

        //3 实体商品
        if (this.commodityData.type == 3) {
          uni.navigateTo({
            url: `/page_commodity/order/pages/entityOrder?commodityList=${JSON.stringify(
              goodsData
            )}&isCollage=${this.isCollage}&ifActivity=${ifActivity}&first=true`,
          });
        } else if (this.commodityData.type == 1) {
          uni.navigateTo({
            url: `/page_commodity/order/pages/collageOrder?commodityList=${JSON.stringify(
              goodsData
            )}&isCollage=${this.isCollage}&ifActivity=${ifActivity}&contract=${JSON.stringify(
              this.commodityData.contract
            )}&orderContractId=${this.orderContractId}&first=true&ifShowArgee=${ifShowArgee}`,
          });
        }

        // uni.navigateTo({
        //   url: `/page_commodity/order/pages/collageOrder?commodityList=${JSON.stringify(
        //     this.goodsCart
        //   )}&isCollage=true&ifActivity=true`,
        // });
      },
    },
  };
</script>
<style lang="scss" scoped>
  .pay-item {
    width: 750rpx;
    height: 180rpx;
    background-color: white;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    display: flex;
    justify-content: space-between;
  }
  .goodstit {
    margin-left: 30rpx;
    font-size: 40rpx;
    font-weight: 500;
    margin-bottom: 40rpx;
    margin-top: 16rpx;
  }
  .goodsprice {
    height: 56rpx;
    line-height: 56rpx;
    margin-bottom: 50rpx;
    padding-left: 30rpx;

    span {
      font-size: 28rpx;
    }
    .goodsnow {
      // margin-left: 30rpx;
      color: #e51600;
      font-weight: 500;
      font-size: 40rpx;
      margin-right: 16rpx;
    }
    .lineprice {
      color: #9fa1a4;
      font-size: 28rpx;
      font-weight: 400;
      text-decoration: line-through;
    }
  }
  .sku-box {
    margin-left: 30rpx;
    font-size: 28rpx;
    p {
      margin-bottom: 24rpx;
    }
    .skuitem-box {
      display: flex;
      justify-content: flex-start;
      margin-bottom: 48rpx;

      .unselect {
        padding: 0 24rpx;
        height: 72rpx;
        line-height: 72rpx;
        background: #f7f8fa;
        margin-right: 20rpx;
        font-weight: 500;
      }
      .select {
        padding: 0 24rpx;
        height: 72rpx;
        line-height: 72rpx;
        background: #fff1ea;
        color: #ff6d24;
        font-weight: 500;
        margin-right: 20rpx;
      }
      .skuitem {
        position: relative;
      }
      .miaosha-tit {
        position: absolute;
        width: 1.3rem;
        height: 0.6rem;
        background: linear-gradient(90deg, #ff5e53ff 0%, #fa4c3eff 100%) !important;
        color: #fff;
        right: 0;
        top: 0;
        font-size: 0.4rem;
        display: flex;
        align-items: center;
        justify-content: center;
        border-bottom-left-radius: 0.6rem;
      }
      .pintuan-tit {
        position: absolute;
        width: 1.3rem;
        height: 0.6rem;
        background: linear-gradient(90deg, #ffc553ff 0%, #ff782dff 100%) !important;
        color: #fff;
        right: 0;
        top: 0;
        font-size: 0.4rem;
        display: flex;
        align-items: center;
        justify-content: center;
        border-bottom-left-radius: 0.6rem;
      }
    }
  }
  .price-box {
    display: flex;
    height: 108rpx;
    align-items: center;
    padding-left: 24rpx;
    background: linear-gradient(140.2deg, #ff4c34 0%, #ff4a4a 100%);
    justify-content: space-between;
    position: relative;
  }
  .price-item {
    display: flex;
    height: 108rpx;
    align-items: center;
  }
  .unclocked-box {
    padding: 5rpx 10rpx;
    text-align: center;
    border-radius: 56rpx;
    background: #ffee83;
    color: #8c513e;
    font-size: 20rpx;
    margin-left: 20rpx;
  }

  .text-opacity {
    opacity: 0.7;
  }

  .countdown {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    width: 256rpx;
    height: 108rpx;
    border-top-left-radius: 38px;
    float: right;
    background: linear-gradient(270deg, #ffe3db 0%, #fff0eb 100%);
    position: absolute;
    right: 0;
    z-index: 100;
  }

  .exist-img {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    float: right;
    width: 166rpx;
    height: 108rpx;
    margin-right: 20rpx;
    opacity: 0.1;
  }
  .opacity-text {
    position: absolute;
    right: 47rpx;
    color: #ffffff;
    font-size: 28rpx;
  }
  .icon-item {
    margin-right: 6rpx;
    margin-top: 4rpx;
  }
  .skubutton {
    // height: 180rpx;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 0;
    // margin-right: 30rpx;
    display: flex;
    justify-content: space-evenly;
    padding-top: 16rpx;
    padding: 16rpx 30rpx 0;
    .btn-comm {
      width: 100%;
      height: 180rpx;

      display: flex;
      justify-content: space-between;
    }
    // position: fixed;
    // bottom: 0;

    .sku-left {
      flex: 1;
      // padding-left: 30rpx;
      span {
        font-size: 28rpx;
      }
      .goodsnow {
        // margin-left: 30rpx;
        color: #e51600;
        font-weight: 500;
        font-size: 40rpx;
        margin-right: 16rpx;
      }
      .lineprice {
        color: #9fa1a4;
        font-size: 28rpx;
        font-weight: 400;
        text-decoration: line-through;
      }
    }
    .cartdetail {
      color: #e51600;
      padding-left: 6rpx;
    }
    .sku-right {
      // display: flex;
      // justify-content: flex-end;
      // flex: 1;
      float: right;
      .button-left {
        width: 200rpx;
        height: 96rpx;
        line-height: 96rpx;
        border-radius: 80rpx 0 0 80rpx;
        color: #e51600;
        border: 2rpx solid #e51600;
        float: right;
      }
      .button-right {
        width: 200rpx;
        height: 96rpx;
        line-height: 96rpx;
        border-radius: 0 80rpx 80rpx 0;
        background: #e51600;
        color: #fff;
        float: right;
      }
    }
  }
  .miaosha-btn {
    display: flex;
    width: 100%;
    height: 4.5rem;
    font-size: 0.6rem;
    padding: 0.4rem 3.2rem;
    justify-content: space-around;
    .routinebuy {
      width: 7.775rem;
      height: 2.75rem;
      border-radius: 1.8rem;
      border: 2px solid #e51600;
      background: #fff;
      color: #e51600;
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }
    .collage {
      width: 7.775rem;
      height: 2.75rem;
      border-radius: 1.8rem;
      border: 2px solid #e51600;
      background: #e51600;
      color: #fff;
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }
  }
</style>
