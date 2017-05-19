import OrderService from "../../../class/service/OrderService";
import Tips from "../../../class/utils/Tips";
import Router from "../../../class/utils/Router";
const app = getApp();
const orderService = new OrderService();

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
    const trade = this.data.trade;
    trade.message = this.data.message;

    Tips.loading('订单创建中');
    orderService.createOrder(trade).then(data => {
      Tips.toast("订单创建成功", () => {
        Router.orderIndex();
      });
    });
  }
});