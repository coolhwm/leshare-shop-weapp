var app = getApp();

Page({
  data:{
    shop : {},
    goods : []
  },
  onLoad:function(options){
    var shopId = app.globalData.lastShopId;
    var baseUrl = app.globalData.baseUrl;

    //请求店铺基本信息
    wx.request({
      url: `${baseUrl}/shops/${shopId}`,
      success: (res) => {
        this.setData({ shop: res.data });
      }
    });

    //请求店铺商品信息
    wx.request({
      url: `${baseUrl}/shops/${shopId}/goods`,
      success: (res) => {
        this.setData({ goods: res.data });
      }
    });
  }
})