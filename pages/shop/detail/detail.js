import ShopService from "../../../class/service/ShopService";
import Tips from "../../../class/utils/Tips";

const app = getApp();
const shopService = new ShopService();

Page({
  data: {
    shop: {}
  },
  onLoad: function (options) {
    //请求店铺基本信息
    shopService.getInfo().then(data => {
      this.setData({ shop: data });
    });
  },

  onPhoneCall: function (event) {
    const phone = this.data.shop.phone;
    wx.makePhoneCall({
      phoneNumber: phone
    });
  },

  onOpenLocation: function (event) {
    const longitude = 119.340685;
    const latitude = 26.105099;
    wx.openLocation({
      latitude: latitude,
      longitude: longitude,
      name: this.data.shop.name,
      address: this.data.shop.describe
    });
  }
})