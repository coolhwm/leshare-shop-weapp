import { Http } from "../../../class/utils/Http.js";
var app = getApp();

Page({
  data: {
    order: {}
  },
  onLoad: function (options) {
    var orderId = options.orderId;

    //获取订单详情信息
    let url = `${app.globalData.baseUrl}/customers/${app.globalData.userId}/shops/${app.globalData.shopId}/orders/${orderId}`;
    Http.get(url, data => {
      this.processOrderDetail(data);
      this.setData({ order: data });
    });
  },

  /**
   * 关闭订单
   */
  onOrderClose: function (event) {
    const orderId = this.data.order.order_id;
    const url = `${app.globalData.baseUrl}/orders/${orderId}/status/close`;
    //遮罩层
    wx.showLoading({
      title: '订单关闭中',
      mask: true
    });
    Http.patch(url, {}, res => {
      wx.showToast({
        title: '订单关闭成功',
        icon: 'success',
        duration: 500
      });
      //跳转到订单列列表
      setTimeout(() => {
        wx.switchTab({
          url: "/pages/order/index/index"
        });
      }, 500);
    });
  },

   /**
   * 订单退款
   */
  onOrderRefund: function (event) {
    const orderId = this.data.order.order_id;
    const url = `${app.globalData.baseUrl}/orders/${orderId}/status/refund`;
    //遮罩层
    wx.showLoading({
      title: '退款申请中',
      mask: true
    });
    Http.patch(url, {}, res => {
      wx.showToast({
        title: '退款申请成功',
        icon: 'success',
        duration: 500
      });
      //跳转到订单列列表
      setTimeout(() => {
        wx.switchTab({
          url: "/pages/order/index/index"
        });
      }, 500);
    });
  },

  /**
   * 确认收货
   */
  onOrderConfirm: function (event) {
    const orderId = this.data.order.order_id;
    const url = `${app.globalData.baseUrl}/orders/${orderId}/status/comments`;

    //遮罩层
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    let tipsTitle = "操作成功";
    Http.patch(url, {}, (res) => {
      wx.hideLoading();
      if (res.state != 1) {
        tipsTitle = "操作失败";
      }
      wx.showToast({
        title: tipsTitle,
        duration: 500
      });
      //跳转到订单列列表
      setTimeout(() => {
        wx.switchTab({
          url: "/pages/order/index/index"
        });
      }, 500);
    });

  },

  /**
   * 微信支付
   */
  onWxPay: function (event) {
    const orderId = this.data.order.order_id;
    const url = `${app.globalData.baseUrl}/shops/${app.globalData.shopId}/orders/${orderId}/wxpay`;
    //遮罩层
    wx.showLoading({
      title: '支付加载中',
      mask: true
    })

    //预支付接口
    Http.get(url, (res) => {
      console.info('开始支付', res);
      const data = res.data;
      //调用微信支付
      wx.requestPayment({
        'timeStamp': data.timeStamp,
        'nonceStr': data.nonceStr,
        'package': data.package,
        'signType': 'MD5',
        'paySign': data.paySign,
        'success': function (res) {
          //提示框
          wx.hideLoading();
          wx.showToast({
            title: '支付成功',
            icon: 'success',
            duration: 500
          });
          //跳转到订单列列表
          setTimeout(() => {
            wx.switchTab({
              url: "/pages/order/index/index"
            });
          }, 500);

        },
        'fail': function (res) {
          //提示框
          wx.hideLoading();
          wx.showToast({
            title: '支付已取消',
          });
        }
      })
    });
  },

  /**
   * 处理订单字典数据
   */
  processOrderDetail: function (detail) {
    const paymentDict = {
      "0": "线下支付",
      "1": "在线支付"
    };

    const statusDict = {
      "0": "全部",
      "1": "待付款",
      "2": "待发货",
      "3": "已发货",
      "4": "待评论",
      "5": "退款中",
      "6": "已完成",
      "7": "已关闭",
      "8": "已退款"
    };

    //处理字典数据
    detail.payment_text = paymentDict[detail.payment_type];
    detail.status_text = statusDict[detail.status];

    //时间默认值
    detail.payment_time = !detail.payment_time ? '-' : detail.payment_time;
    detail.sended_time = !detail.sended_time ? '-' : detail.sended_time;
    detail.update_time = !detail.update_time ? '-' : detail.update_time;
    detail.close_time = !detail.close_time ? '-' : detail.close_time;

  }
});