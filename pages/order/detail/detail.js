import OrderService from "../../../class/service/OrderService";
import ExpressService from "../../../class/service/ExpressService";
import Tips from "../../../class/utils/Tips";
import Router from "../../../class/utils/Router";

const app = getApp();
const orderService = new OrderService();
const expressService = new ExpressService();

Page({
  data: {
    order: {},
    express: {},
    init: false
  },

  onLoad: function (options) {
    Tips.loading();
    const orderId = options.orderId;
    //const orderId = 1695;

    //获取订单信息
    orderService.getInfo(orderId).then(data => {
      if (data.orderExpress != null) {
        const express = expressService.createCurrentTrace(data.orderExpress);
        this.setData({ express: express });
      }

      this.setData({
        order: data,
        init: true
      });
      Tips.loaded();
    });
  },

  /**
   * 关闭订单
   */
  onOrderClose: function (event) {
    const orderId = this.data.order.orderId;
    Tips.confirm('您确认取消该订单吗？').then(() => {
      Tips.loading('订单关闭中');
      return orderService.closeOrder(orderId);
    }).then(data => {
      Tips.toast('订单关闭成功', () => Router.orderIndexRefresh());
    }).catch(e => {
      Tips.error('关闭失败请联系客服', () => this.reload());
    });
  },

  /**
  * 订单退款
  */
  onOrderRefund: function (event) {
    const order = this.data.order;
    const refund = orderService.createOrderRefund(order);
    const refundStr = JSON.stringify(refund);
    Tips.confirm('您确认要申请退款吗？').then(() => {
      return Router.refundApply(refundStr);
    });
  },

  /**
   * 确认收货
   */
  onOrderConfirm: function (event) {
    const orderId = this.data.order.orderId;
    Tips.confirm('您确认已收到货品？').then(() => {
      Tips.loading('确认收货中');
      return orderService.confirmOrder(orderId);
    }).then(data => {
      Tips.toast('确认收货成功', () => Router.orderIndexRefresh());
    });
  },

  /**
   * 微信支付
   */
  onWxPay: function (event) {
    const orderId = this.data.order.orderId;
    Tips.loading('支付加载中');
    orderService.prepayOrder(orderId).then(payment => {
      Tips.loaded();
      return orderService.wxpayOrder(payment);
    }).then(res => {
      Tips.toast('支付成功', () => Router.orderIndexRefresh());
    }).catch((error) => {
      if(error.data && error.data.code == 80100) {
        Tips.error('支付失败请联系客服');
      } else {
        Tips.toast('支付已取消');
      }
    });
  },

  /**
   * 退款详情
   */

  onRefundInfo: function (event) {
    const refund = this.data.order.curRefund;
    const refundStr = JSON.stringify(refund);
    Router.refundDetail(refundStr);
  },


  /**
   * 撤销退款
   */
  onCancelRefund: function (event) {
    const orderId = this.data.order.orderId;
    const refundUuid = this.data.order.curRefund.refundUuid;
    Tips.confirm('您确认取消退款申请吗？').then(() => {
      Tips.loading('退款取消中');
      return orderService.cancelRefund(orderId, refundUuid);
    }).then(res => {
      Tips.toast('退款取消成功', () => Router.orderDetailRedirect(orderId));
    });
  },

  /**
   * 查看物流
   */
  onOrderTrace: function (event) {
    if (!this.data.express.timestape) {
      return;
    }
    const order = this.data.order;
    const preview = expressService.createExpressOrderPreview(order);
    const previewStr = JSON.stringify(preview);
    Router.orderTrace(previewStr);

  },

  /**
   * 评论订单
   */
  onOrderComment: function (event) {
    Tips.toast("尚未实现");
  }

});