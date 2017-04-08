import { Http } from "../../../class/utils/Http.js";
var app = getApp();
Page({
  data: {
    orders: [],
    start: 0,
    count: 10
  },
  onLoad: function (options) {
    this.loadNextPage();
  },

  //点击单个订单
  onOrderTap : function(event){
    var orderId = event.currentTarget.dataset.orderId;
    wx.navigateTo({
      url : `/pages/order/detail/detail?orderId=${orderId}`
    });
  },

  //下拉刷新
  onReachBottom: function (event) {
    this.loadNextPage();
  },

  //加载下一页
  loadNextPage: function () {
    wx.showNavigationBarLoading();
    //请求订单信息
    let url = `${app.globalData.baseUrl}/customers/${app.globalData.userId}/shops/${app.globalData.lastShopId}/orders?from=${this.data.start}&limit=${this.data.count}&by=order_id&sort=asc`;
    Http.get(url, (data) => {
      //特殊处理
      if(data.length > 10){
        data = data.slice(1, 10)
      }
      
      for (let item of data) {
        //对数据做一些处理
        this.processOrderData(item);
      }

      //视图刷新
      var orders = this.data.orders;
      orders = orders.concat(data);
      this.setData({ orders: orders });
      //移动到下一页
      this.data.start += this.data.count;
      wx.hideNavigationBarLoading();
    });
  },
  
  //处理订单数据
  processOrderData : function(order){
    for(let goods of order.orderGoodsInfos){
      goods.image_url = app.globalData.imgUrl + goods.image_url;
    }
  }
})