import { Http } from "../../../class/utils/Http.js";
var app = getApp();
Page({
  data: {
    orders: []
  },
  onLoad: function (options) {
    var shopId = app.globalData.lastShopId;
    var userId = app.globalData.userId;
    var baseUrl = app.globalData.baseUrl;
    var baseImgUrl = app.globalData.imgUrl;

    //请求订单信息
    Http.get(`${baseUrl}/customers/${userId}/shops/${shopId}/orders?from=0&limit=10&by=id&sort=desc`, data => {
      for (let order of data) {
        for(let goods of order.orderGoodsInfos){
          goods.image_url = baseImgUrl + goods.image_url;
        }
      }
      this.setData({ orders: data });
    });
  },
  onOrderTap : function(event){
    var orderId = event.currentTarget.dataset.orderId;
    wx.navigateTo({
      url : `/pages/order/detail/detail?orderId=${orderId}`
    });
  }
})