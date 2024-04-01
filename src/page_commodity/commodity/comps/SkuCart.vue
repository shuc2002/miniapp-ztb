<template>
  <view style="background-color:#f5f6fa ;height: 100vh;">
    <view class="list-box">
      <view v-for="(item, index) in goodsCart" :key="index">
        <view class="flex">
          <view>
            <image :src="item.thumbnail" class="img-commodity" mode="aspectFit" />
          </view>
          <view class="price-box">
            <view class="text-size-main common-text-400 thruncate-style">{{ item.name }}</view>
            <view class="flex-item">
              <view class="text-size-sn common-text-700">￥{{ item.price }}</view>
              <view class="flex-item-center">
                <view class="t-icon t-icon-minus icon-style" @tap="handleReduce(item.skuCode)" />
                <span class="flex-center">{{ item.number }}</span>
                <view class="t-icon t-icon-add icon-style" @tap="handleAdd(item.skuCode)" />
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>
    <view style="height: 180rpx"></view>
    <view class="pay-item">
      <view class="pay-price">
        <view class="total-price">
          <view class="text-size-xxs price-left">
            合计:<span class="common-price">￥</span>
            <span class="text-size-xl common-price goodsnow">{{ totalPrice }}</span>
            <view
              >已选<span class="common-price">{{ totalNum }}</span
              >件
            </view>
          </view>
        </view>
      </view>
      <view class="btn-box">
        <button class="button-buy" @tap="handlePay()">立即结算</button>
      </view>
    </view>
  </view>
</template>
<script>
  export default {
    name: 'SkuCart',
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
      },
      timeData: {
        type: Number,
        default: 0,
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
          const level = val.skuOptions.length;

          const arr = [];
          for (let i = 0; i < level; i++) {
            arr.push(i < level ? 0 : '');
            this.select.push(i < level ? 0 : '');
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
    onLoad(options) {
      //   console.log('options-----', options);
      //   this.commodityData = uni.getStorageSync('commodityData');
      //   console.log('commcodity', this.commodityData);
      this.goodsCart = JSON.parse(options.goodsCart);
      this.commodityType = options.type;
    },
    methods: {
      onClickOption(key, index) {
        // this.select[key] = index;
        this.$set(this.select, key, index);
        // let option = this.data.skuList.find((item) => item.skuCode == skuCode);
      },
      //增加商品数量
      handleAdd(skuCode) {
        let item = this.goodsCart.find((item) => item.skuCode == skuCode);
        item.number++;
      },
      //减少商品数量
      handleReduce(skuCode) {
        let item = this.goodsCart.find((item) => item.skuCode == skuCode);
        if (item.number > 1) {
          item.number--;
        }
      },
      //加入购物车
      addCart() {
        let skuCode = '';
        this.select.map((item, index) => {
          skuCode += index == 0 ? item : ':' + item;
        });
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
      handlePay() {
        // uni.navigateTo({
        //   url: `/page_commodity/order/pages/entityOrder?commodityList=${JSON.stringify(
        //     this.goodsCart
        //   )}&isCollage=true&ifActivity=true`,
        // });
        //3 实体商品
        if (this.commodityType == 3) {
          uni.navigateTo({
            url: `/page_commodity/order/pages/entityOrder?commodityList=${JSON.stringify(
              this.goodsCart
            )}&isCollage=false&ifActivity=true`,
          });
        } else if (this.commodityType == 1) {
          uni.navigateTo({
            url: `/page_commodity/order/pages/collageOrder?commodityList=${JSON.stringify(
              this.goodsCart
            )}&isCollage=false&ifActivity=true`,
          });
        }

        // uni.navigateTo({
        //   url: `/page_commodity/order/pages/collageOrder?commodityList=${JSON.stringify(
        //     this.goodsCart
        //   )}&isCollage=true&ifActivity=true`,
        // });
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
        if (this.goodsCart.length == 0) {
          return;
        }
      },
    },
  };
</script>
<style lang="scss" scoped>
  .list-box {
    margin: 20rpx 24rpx;
    border-radius: 24rpx;
    background: #fff;
    padding: 32rpx;
  }
  .img-commodity {
    width: 200rpx;
    height: 112rpx;
    margin-right: 22rpx;
    border-radius: 12rpx;
    object-fit: cover;
  }
  .price-box {
    display: flex;
    flex-wrap: wrap;
    align-content: space-between;
    padding: 12rpx 12rpx;
    .truncate-style {
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      width: 420rpx;
    }
    .money-style {
      margin-left: 12rpx;
    }
    .flex-item {
      width: 420rpx;
      span {
        width: 56rpx;
      }
    }
  }
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

  //   .price-box {
  //     display: flex;
  //     height: 108rpx;
  //     align-items: center;
  //     padding-left: 24rpx;
  //     background: linear-gradient(140.2deg, #ff4c34 0%, #ff4a4a 100%);
  //     justify-content: space-between;
  //     position: relative;
  //   }
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

  .btn-box {
    margin-right: 30rpx;
  }
  .button-buy {
    width: 296rpx;
    height: 96rpx;
    border-radius: 80rpx;
    color: #ffffff;
    background: #e51600;
    margin-left: 32rpx;
    margin-top: 16rpx;
    display: flex;
    flex-flow: column;
    align-items: center;
    justify-content: center;
    font-size: 32rpx;
    font-weight: 600;
    &:active {
      opacity: 0.8;
    }
  }
  .goodsnow {
    // margin-left: 30rpx;
    color: #e51600;
    font-weight: 500;
    font-size: 40rpx;
    margin-right: 16rpx;
  }

  .price-left {
    padding-left: 30rpx;
    padding-top: 16rpx;
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

  .list-box {
    margin: 20rpx 24rpx;
    border-radius: 24rpx;
    background: #fff;
    padding: 32rpx;
  }
  .img-commodity {
    width: 200rpx;
    height: 112rpx;
    margin-right: 22rpx;
    border-radius: 12rpx;
    object-fit: cover;
  }
  .price-box {
    display: flex;
    flex-wrap: wrap;
    align-content: space-between;
    padding: 12rpx 12rpx;
    .truncate-style {
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      width: 420rpx;
    }
    .money-style {
      margin-left: 12rpx;
    }
    .flex-item {
      width: 420rpx;
      span {
        width: 56rpx;
      }
    }
  }
  .success-pop {
    .success-img {
      width: 750rpx;
      height: 300rpx;
    }
    .success-img-close {
      position: absolute;
      top: 40rpx;
      right: 30rpx;
      width: 30rpx;
      height: 30rpx;
    }
    .success-text {
      margin-top: 30rpx;
      font-weight: 700;
      font-size: 48rpx;
      color: #2e2e2e;
      text-align: center;
      line-height: 48px;
    }
    .success-btn {
      margin-top: 78rpx;
      margin-bottom: 68rpx;
      .to-list-btn {
        width: 311rpx;
        height: 96rpx;
        background: #ffffff;
        border: 2rpx solid #e51600;
        border-radius: 72rpx;
        font-weight: 700;
        font-size: 32rpx;
        color: #e51600;
        text-align: center;
        line-height: 96rpx;
        margin-right: 33rpx;
      }
      .to-learn-btn {
        width: 311rpx;
        height: 96rpx;
        background: #e51600;
        border-radius: 72rpx;
        font-weight: 700;
        font-size: 32rpx;
        color: #ffffff;
        text-align: center;
        line-height: 96rpx;
      }
    }
  }
  .pay-box {
    height: 180rpx;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 100;
    .pay-content {
      height: 180rpx;
    }
  }
  .pay-item {
    width: 750rpx;
    height: 180rpx;
    // position: fixed;
    // bottom: 0;
    // left: 0;
    // right: 0;
    display: flex;
    justify-content: space-between;
    background-color: #fff;
    .disable-Btn {
      width: calc(100% - 96rpx);
      font-size: 32rpx;
      height: 96rpx;
      border-radius: 50rpx;
      font-weight: 700;
      color: #fff;
      margin: auto;
      background-color: #ccc;
    }
    .expired-Btn {
      width: calc(100% - 64rpx);
      font-size: 32rpx;
      height: 96rpx;
      border-radius: 80rpx;
      font-weight: 700;
      color: #fff;
      margin: auto;
      background-color: #989ead;
    }
    .live-btn {
      width: 690rpx;
      height: 100rpx;
      background: #e51600;
      border-radius: 50rpx;
      font-size: 36rpx;
      color: #ffffff;
      line-height: 100rpx;
      text-align: center;
      margin: 50rpx auto 0rpx;
    }
  }
  .total-price {
    display: flex;
    align-items: center;
    // margin-top: 20rpx;
  }
  .price-left {
    padding-left: 30rpx;
    padding-top: 16rpx;
  }
  .btn-box {
    margin-right: 30rpx;
  }
  .button-buy {
    width: 296rpx;
    height: 96rpx;
    border-radius: 80rpx;
    color: #ffffff;
    background: #e51600;
    margin-left: 32rpx;
    margin-top: 16rpx;
    display: flex;
    flex-flow: column;
    align-items: center;
    justify-content: center;
    font-size: 32rpx;
    font-weight: 600;
    &:active {
      opacity: 0.8;
    }
  }
  .goodsnow {
    // margin-left: 30rpx;
    color: #e51600;
    font-weight: 500;
    font-size: 40rpx;
    margin-right: 16rpx;
  }
  .bug-money {
    background: #ffffff;
    color: #f0522f;
    border: 2px solid #f0522f;
  }
  .bug-collage {
    margin-right: 32rpx;
  }
  .ml-price {
    margin-left: 48rpx;
  }
  .radio-flex-box {
    display: flex;
    justify-content: space-between;
    padding: 32rpx 48rpx;
    .discount-box {
      padding: 8rpx;
      border: 2rpx solid #f0522f;
      border-radius: 10rpx;
    }
    .price-display {
      margin-right: 16rpx;
    }
  }
  .border-top {
    border-top: 20rpx solid #f5f6fa;
  }
  .btn-radio {
    width: 48rpx;
    height: 48rpx;
    border: 2rpx solid #ecedf1;
    border-radius: 50%;
  }
  .icon-size {
    width: 48rpx;
    height: 48rpx;
    margin-right: 12rpx;
  }
  .text-pay {
    font-size: 28rpx;
    color: #323949;
    font-weight: 600;
  }
  .button-pay {
    width: 654rpx;
    height: 96rpx;
    border-radius: 24rpx;
    background: linear-gradient(140.2deg, #ff8058 0%, #ff6969 100%);
    color: #ffffff;
    margin-bottom: 24rpx;
    margin-top: 60rpx;
    &:active {
      opacity: 0.8;
    }
  }
  .no-collage {
    margin-left: 44rpx;
    // margin-top: 16rpx;
  }
  .no-collage-second {
    margin-right: 32rpx;
  }
  .shelf-box {
    position: fixed;
    right: 0;
  }
  .shelf-btn {
    width: 296rpx;
    height: 96rpx;
    font-size: 32rpx;
    font-weight: 600;
    color: #ffffff;
    background-color: #c9cdd4;
    border-radius: 80rpx;
    margin: 16rpx 30rpx;
    float: right;
  }

  .list-box {
    margin: 20rpx 24rpx;
    border-radius: 24rpx;
    background: #fff;
    padding: 32rpx;
  }
  .img-commodity {
    width: 200rpx;
    height: 112rpx;
    margin-right: 22rpx;
    border-radius: 12rpx;
    object-fit: cover;
  }
  .price-box {
    display: flex;
    flex-wrap: wrap;
    align-content: space-between;
    padding: 12rpx 12rpx;
    .truncate-style {
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      width: 420rpx;
    }
    .money-style {
      margin-left: 12rpx;
    }
    .flex-item {
      width: 420rpx;
      span {
        width: 56rpx;
      }
    }
  }
</style>
