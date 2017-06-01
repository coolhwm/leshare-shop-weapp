import OrderService from "../../../class/service/OrderService";
import AddressService from "../../../class/service/AddressService";
import Tips from "../../../class/utils/Tips";
import Router from "../../../class/utils/Router";

const app = getApp();
const notification = require("../../../class/utils/WxNotificationCenter.js");
const orderService = new OrderService();
const addressService = new AddressService();

Page({
  data: {
    trade: {},
    address: {},
    message: ""
  },

  onLoad: function (options) {
    //const trade = JSON.parse(options.trade);
    console.info('laod', options);
    const trade = {
      "status_text": "待确认",
      "deal_price": 0.01,
      "final_price": "0.01",
      "address_id": "1",
      "payment_type": "1",
      "message": "",
      "orderGoodsInfos": [
        {
          "goods_id": 2,
          "goods_name": "纳克萨玛斯BB烤鸭",
          "goods_sku": "五香:臻品:大红盒",
          "sku_text": "五香,臻品,大红盒",
          "image_url": "http://op09okwcw.bkt.clouddn.com/timg.jpg",
          "goods_price": 0.01,
          "count": 1
        }
      ],
      "shop_name": "连江海蜇专卖"
    };
    this.setData({ trade: trade });

    //默认地址
    addressService.getDefault().then(address => {
      this.setData({ address: address });
    });

    //注册事件监听器
    const that = this;
    notification.addNotification("ON_ADDRESS_CHOICE", that.updateAddress, that);
  },

  onShow(options) {
    console.info('show', options);
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
    trade.message = this.data.message;
    Tips.loading('订单创建中');

    //订单创建成功后直接拉起支付页面
    orderService.createOrder(trade).then(data => {
      return data.order_id;
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
      Tips.toast('支付已取消', () => Router.orderDetailRedirect(orderId));
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
  updateAddress: function(info){
    this.setData({
      address: info
    });
  }
});