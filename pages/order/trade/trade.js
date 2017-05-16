import { Http } from "../../../class/utils/Http.js";
var app = getApp();

Page({
  data: {
    trade: {},
    message: ""
  },

  onLoad: function (options) {
    var trade = JSON.parse(options.trade);
    this.setData({ trade: trade });
  },

  /**
   * 捕捉备注文本
   */
  onMessageInput: function (event) {
    this.setData({ message: event.detail.value });
  },

  /**
   * 提交订单
   */
  onConfirmTap: function (event) {

    //准备交易对象
    var trade = this.data.trade;
    trade.message = this.data.message;

    let url = `${app.globalData.baseUrl}/customers/${app.globalData.userId}/shops/${app.globalData.shopId}/orders`;
    wx.showLoading({
      title: '订单创建中',
      mask: true
    })
    Http.post(url, trade, data => {
      //展示提示窗口
      wx.hideLoading();
      wx.showToast({
        title: "订单创建成功",
        icon: "success",
        mask: true,
        duration: 500
      });

      //跳转到订单列列表
      setTimeout(() => {
        wx.switchTab({
          url: "/pages/order/index/index"
        });
      }, 500);
    });
  }
});