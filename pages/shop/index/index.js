import {Http} from "../../../class/utils/Http.js";
var app = getApp();

Page({
  data: {
    shop: {},
    goods: [],
    notice: []
  },
  onLoad: function (options) {
    var shopId = app.globalData.lastShopId;
    var baseUrl = app.globalData.baseUrl;
    //请求店铺基本信息

    Http.get(`${baseUrl}/shops/${shopId}`, (data) =>{
      this.setData({ shop: data });
    });

    // wx.request({
    //   url: `${baseUrl}/shops/${shopId}`,
    //   success: (res) => {
    //     this.setData({ shop: res.data });
    //   }
    // });

    //请求公告信息
    wx.request({
      url: `${baseUrl}/shops/${shopId}/notices/shows`,
      success: (res) => {
        this.setData({ notice: res.data[0] });
      }
    });
    
    //请求店铺商品信息
    wx.request({
      url: `${baseUrl}/shops/${shopId}/goods`,
      success: (res) => {
        this.setData({ goods: res.data });
      }
    });
  }, 
  onGoodsItemTap : function(e){
    wx.navigateTo({
      url : "/pages/goods/index/index"
    });
  }
})