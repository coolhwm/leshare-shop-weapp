import OrderService from "../../../class/service/OrderService";
import AddressService from "../../../class/service/AddressService";
import CouponService from "../../../class/service/CouponService";
import Tips from "../../../class/utils/Tips";
import Router from "../../../class/utils/Router";

const app = getApp();
const notification = require("../../../class/utils/WxNotificationCenter.js");
const orderService = new OrderService();
const addressService = new AddressService();
const couponService = new CouponService();

Page({
  data: {
    trade: {},
    address: {},
    message: "",
    delilveries: [],
    seletedDelilvery: null,
    coupons: [],
    selectedCoupon: null,
    init: false
  },

  onLoad: function (options) {
    Tips.loading('订单加载中');
    const trade = JSON.parse(options.trade);
    this.setData({ trade: trade });

    addressService.getDefault().then(address => {
      //处理地址
      this.setData({ address: address });
      return orderService.queryPostPrice(address, trade.orderGoodsInfos);
    }).then(data => {
      //处理运费
      if (data.dilivery) {
        const seletedDelilvery = data.delilveryList.find(item => item.default);
        const trade = this.updateTradePostFee(seletedDelilvery);
        this.setData({
          delilveries: data.delilveryList,
          seletedDelilvery: seletedDelilvery,
          trade: trade
        });
      }
      return couponService.available(trade.orderGoodsInfos);
    }).then(data => {
      //处理优惠券
      this.setData({
        init: true,
        coupons: data
      });
      Tips.loaded();
    });

    //注册事件监听器
    const that = this;
    notification.addNotification("ON_ADDRESS_CHOICE", that.updateAddress, that);
    notification.addNotification("ON_COUPON_CHOICE", that.updateCoupon, that);
  },

  onShow(options) {
  },

  /**
   * 捕捉备注文本
   */
  onMessageInput: function (event) {
    this.setData({ message: event.detail.value });
  },

  //******************* 订单操作 ******************/

  /**
   * 提交订单
   */
  onConfirmTap: function (event) {

    //准备交易对象
    const trade = this.data.trade;
    const address = this.data.address;
    trade.message = this.data.message;
    Tips.loading('订单创建中');

    //订单创建成功后直接拉起支付页面
    orderService.createOrder(trade, address, ).then(data => {
      return data.orderId;
    }).then(this.wxPay).catch(() => {
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
      Tips.toast('支付已取消', () => {
        notification.postNotificationName("ON_ORDER_UPDATE");
        Router.orderDetailRedirect(orderId);
      });
    });
  },

  //******************* 运费操作 ******************/

  /**
   * 更新订单的运费信息
   */
  updateTradePostFee: function (delilvery) {
    const trade = this.data.trade;
    trade.deliveryType = delilvery.type;

    //扣除原价格
    if (trade.postFee && trade.postFee != 0) {
      trade.finalPrice -= trade.postFee;
    }

    //增加运费
    trade.postFee = delilvery.fee;
    trade.finalPrice = (parseFloat(trade.finalPrice) + delilvery.fee).toFixed(2);

    //目前没有优惠功能
    trade.dealPrice = trade.finalPrice;
    return trade;
  },

  /**
   * 选择运费
   */

  onPostFeeTap: function () {
    const actions = this.data.delilveries.map(item => `${item.desc} ￥${item.fee}`);
    Tips.action(actions).then(res => {
      const seletedDelilvery = this.data.delilveries[res.index];
      const trade = this.updateTradePostFee(seletedDelilvery);
      this.setData({
        seletedDelilvery: seletedDelilvery,
        trade: trade
      });
    });
  },

  //******************* 优惠券操作 ******************/

  /**
   * 点击优惠券 
   */
  onCouponTap: function () {
    const coupons = this.data.coupons;
    const param = JSON.stringify(coupons);
    Router.couponsUse(param);
  },

  /**
   * 优惠券修改回调函数
   */
  updateCoupon: function (coupon) {
    console.info(coupon);
    this.setData({
      selectedCoupon: coupon
    });
  },

  //******************* 地址操作 ******************/

  /**
   * 切换地址
   */
  onAddressTap: function (event) {
    Router.addressIndex('choice');
  },

  /**
   * 地址修改回调函数
   */
  updateAddress: function (info) {
    this.setData({
      address: info
    });
  }

});