var app = getApp();
Page({
  data: {
    orders: []
  },
  onLoad: function (options) {
    var shopId = app.globalData.lastShopId;
    var userId = app.globalData.userId;
    var baseUrl = app.globalData.baseUrl;

    //请求订单信息
    wx.request({
      url: `${baseUrl}/customers/${userId}/shops/${shopId}/orders`,
      success: (res) => {
        this.setData({ orders: res.data });
      }
    });
  }
})