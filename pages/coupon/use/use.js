import Router from "../../../class/utils/Router";
const notification = require("../../../class/utils/WxNotificationCenter.js");

Page({
  data: {
    coupons: []
  },

  onLoad: function (options) {
    const param = options.coupons;
    const coupons = JSON.parse(param);
    this.setData({ coupons: coupons });
  },

  /**
   * 点击选择
   */
  onCouponTap: function(event){
    const couponId = event.currentTarget.dataset.couponId;
    const selectedCoupon =  this.data.coupons.find(item => item.id == couponId);
    notification.postNotificationName("ON_COUPON_CHOICE",selectedCoupon);
    Router.back();
  }
})