import {Http} from "../../../class/utils/Http.js";
var app = getApp();

Page({
  data:{
    order : {}
  },
  onLoad:function(options){
    var orderId = options.orderId;

    //获取订单详情信息
    let url = `${app.globalData.baseUrl}/customers/${app.globalData.userId}/shops/${app.globalData.shopId}/orders/${orderId}`;
    Http.get(url, data =>{
        this.processOrderDetail(data);
        this.setData({order : data});
    });
  },

  processOrderDetail : function(detail){
    let paymentDict = {
      "0":"现金支付",
      "1":"微信支付",
      "2":"支付宝支付",
      "3":"银联支付"
    };

     let statusDict = {
      "0":"全部",
      "1":"待发货",
      "2":"待付款",
      "3":"已发货",
      "4":"退款中",
      "5":"已完成",
      "6":"已关闭"
    };
    
    //处理字典数据
    detail.payment_text = paymentDict[detail.payment_type];
    detail.status_text = statusDict[detail.status];

    //时间默认值
    detail.payment_time = !detail.payment_time ? '-' : detail.payment_time;
    detail.send_time = !detail.send_time ? '-' : detail.send_time;
    detail.update_time = !detail.update_time ? '-' : detail.update_time;
    detail.close_time = !detail.close_time ? '-' : detail.close_time;

  }
});