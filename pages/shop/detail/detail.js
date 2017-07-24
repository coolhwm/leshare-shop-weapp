import ShopService from "../../../class/service/ShopService";
import Tips from "../../../class/utils/Tips";
import Router from "../../../class/utils/Router";

const app = getApp();
const shopService = new ShopService();

Page({
  data: {
    shop: {}
  },
  onLoad: function (options) {
    //请求店铺基本信息
    shopService.getInfo().then(data => {
      if (data.longitude && data.latitude) {
        data.map = true;
      }
      this.setData({ shop: data });
    });
  },

  onPhoneCall: function (event) {
    const phone = this.data.shop.phone;
    wx.makePhoneCall({
      phoneNumber: phone
    });
  },

  /**
   * 查看图片
   */
  preview: function(event) {
    const urls = this.data.shop.images.map(item => item.url);
    wx.previewImage({
      urls: urls
    });
  },

  /**
   * 打开地图
   */
  onOpenLocation: function (event) {
    const longitude = this.data.shop.longitude;
    const latitude = this.data.shop.latitude;
    wx.openLocation({
      latitude: Number(latitude),
      longitude: Number(longitude),
      name: this.data.shop.name,
      address: this.data.shop.describe,
      fail: (e) => {
        Tips.alert('定位失败');
      }
    });
  }
})