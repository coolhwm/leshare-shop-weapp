import { Http } from "../../../class/utils/Http.js";
var app = getApp();

Page({
  data:{
    order : {}
  },
  onLoad:function(options){
    var orderId = options.orderId;
    var shopId = app.globalData.lastShopId;
    var userId = app.globalData.userId;
    var baseUrl = app.globalData.baseUrl;
    var baseImgUrl = app.globalData.imgUrl;

    //获取订单详情信息
    Http.get(`${baseUrl}/customers/${userId}/shops/${shopId}/orders/${orderId}`, data =>{
        this.setData({order : data});
    });
  }
});