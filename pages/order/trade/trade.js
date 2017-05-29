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

    //订单创建成功后直接拉起支付页面
    orderService.createOrder(trade).then(data => {
      return data.order_id;
    }).then(this.wxPay).catch(() =>{
      Tips.toast('订单创建失败');
    });
  },

    /**
   * 微信支付
   */
  wxPay: function (orderId) {
    Tips.loading('支付加载中');
    orderService.prepayOrder(orderId).then(payment => {
      Tips.loaded();
      return orderService.wxpayOrder(payment);
    }).then(res => {
      //字符成功，跳转到订单列表页面
      Tips.toast('支付成功', () => Router.orderIndexRefresh());
    }).catch(() => {
      //支付取消，跳转到订详情页面
      Tips.toast('支付已取消', ()=> Router.orderDetailRedirect(orderId));
    });
  },
});