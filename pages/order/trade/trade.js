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
    address: null,
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
      return address;
    }).then(data => this.initPostType(data)).finally(() => {
      this.setData({ init: true, });
      Tips.loaded();
    });

    //优惠券
    couponService.available(trade.orderGoodsInfos).then(data => {
      //处理优惠券
      this.setData({
        coupons: data
      });
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
    if (!this.data.address) {
      Tips.alert('请选择收货地址');
      return;
    }

    //准备交易对象
    const trade = this.data.trade;
    const address = this.data.address;
    trade.message = this.data.message;
    Tips.loading('订单创建中');

    //订单创建成功后直接拉起支付页面
    orderService.createOrder(trade, address).then(data => {
      //清理购物车
      notification.postNotificationName("ON_CART_ORDER", trade.orderGoodsInfos);
      return data.orderId;
    }).then(orderId => {
      if (trade.paymentType == 1 && trade.finalPrice > 0) {
        //在线支付
        return this.wxPay(orderId);
      }
      else {
        //线下支付 & 金额不足0元
        Tips.toast('订单创建成功', () => Router.orderIndexRefresh());
      }
    }).catch(() => {
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
        Router.orderDetailRedirect(orderId);
      });
    });
  },

  onPayTypeTap: function (event) {
    const trade = this.data.trade;
    Tips.actionWithFunc(['在线支付', '线下支付'],
      () => {
        trade.paymentText = '在线支付';
        trade.paymentType = 1;
        this.setData({ trade: trade });
      },
      () => {
        trade.paymentText = '线下支付';
        trade.paymentType = 0;
        this.setData({ trade: trade });
      });
  },

  //******************* 运费操作 ******************/


  initPostType: function (address) {
    return orderService.queryPostPrice(address, this.data.trade.orderGoodsInfos).then(data => {
      if (data.dilivery) {
        const seletedDelilvery = data.delilveryList.find(item => item.default);
        const trade = this.updateTradePostFee(seletedDelilvery);
        this.setData({
          delilveries: data.delilveryList,
          seletedDelilvery: seletedDelilvery,
          trade: trade
        });
      }
    });
  },

  /**
   * 更新订单的运费信息
   */
  updateTradePostFee: function (delilvery) {
    const trade = this.data.trade;

    //运费属性
    trade.deliveryType = delilvery.type;
    trade.postFee = delilvery.fee.toFixed(2);

    return this.refreshTradePrice(trade);
  },


  /**
   * 选择运费
   */
  onPostFeeTap: function () {
    if (!this.data.address) {
      //尚未选择地址
      return;
    }
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

  //******************* 价格计算 ******************/
  refreshTradePrice: function (trade) {
    trade.finalPrice = 0;
    trade.finalPrice += trade.dealPrice ? parseFloat(trade.dealPrice) : 0;
    trade.finalPrice += trade.postFee ? parseFloat(trade.postFee) : 0;
    trade.finalPrice -= trade.couponPrice ? parseFloat(trade.couponPrice) : 0;
    trade.finalPrice = trade.finalPrice.toFixed(2);
    return trade;
  },

  //******************* 优惠券操作 ******************/

  /**
   * 点击优惠券 
   */
  onCouponTap: function () {
    if (this.data.coupons.length < 1) {
      return;
    }
    const coupons = this.data.coupons;
    const param = JSON.stringify(coupons);
    Router.couponsUse(param);
  },

  /**
   * 优惠券修改回调函数
   */
  updateCoupon: function (coupon) {
    const trade = this.data.trade;
    trade.couponUsedId = coupon.id;
    trade.couponPrice = coupon.price.toFixed(2);

    this.setData({
      trade: this.refreshTradePrice(trade),
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
  updateAddress: function (address) {
    // if (this.data.address != null) {
    //   const oldAddressId = this.data.address.id;
    //   if (address.id == oldAddressId) {
    //     return;
    //   }
    // }

    Tips.loading('加载中');
    this.initPostType(address).then(() => {
      Tips.loaded();
      this.setData({
        address: address
      });
    });
  }
});