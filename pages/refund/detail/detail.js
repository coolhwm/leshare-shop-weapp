import OrderService from "../../../class/service/OrderService";
import Tips from "../../../class/utils/Tips";
import Router from "../../../class/utils/Router";

const orderService = new OrderService();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    steps: [],
    refund: {}
  },

  onLoad: function (options) {
    const refundStr = options.refund;
    const refund = JSON.parse(refundStr);
    const steps = orderService.createOrderRefundSetps(refund);

    this.setData({
      refund: refund,
      steps: steps
    });
  }

})