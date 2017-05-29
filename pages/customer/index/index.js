 import { Http } from "../../../class/utils/Http.js";
var app = getApp();

Page({
  data: {
    userInfo: {}
  },

  onLoad: function (options) {
    this.setData({ userInfo: app.globalData.userInfo });
  },
  /**
   * 选择收货地址
   */
  onAddressTap: function (event) {
    console.info(event);
    wx.chooseAddress({
      success: function (res) {
        console.info(res);
      }
    });
  }

});