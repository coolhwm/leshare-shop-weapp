import Tips from "../../../class/utils/Tips";
const app = getApp();

Page({
  data: {
    userInfo: {}
  },

  onLoad: function (options) {
    this.setData({ userInfo: app.globalData.user });
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
  },

  tips: function(event){
    Tips.alert('尚未开放');
  }

});