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

    //请求公告信息
    Http.get(`${baseUrl}/shops/${shopId}/notices/shows`, (data) =>{
      this.setData({ notice: data[0] });
    });

    
    //请求店铺商品信息
    Http.get(`${baseUrl}/shops/${shopId}/goods`, (data) =>{
      this.setData({ goods: data });
    });
    
  }, 
  onGoodsItemTap : function(e){
    wx.navigateTo({
      url : "/pages/goods/index/index"
    });
  }
})