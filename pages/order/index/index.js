import OrderService from "../../../class/service/OrderService";
import ExpressService from "../../../class/service/ExpressService";
import Router from "../../../class/utils/Router";
import Tips from "../../../class/utils/Tips";

const notification = require("../../../class/utils/WxNotificationCenter.js");
const app = getApp();
const cache = app.globalData.order;
const orderService = new OrderService();
const expressService = new ExpressService();

Page({
  page: {},
  data: {
    orders: [],
    status: 0,
    tabbar: {}
  },

  /**
   * 页面加载
   */
  onLoad: function (options) {
    this.page = orderService.page();
    this.iniOrderTabBar()
    this.loadNextPage();

    //事件监听
    const that = this;
    notification.addNotification("ON_ORDER_UPDATE", that.reload, that);
  },

  /**
   * 页面展现
   */
  onShow: function () {
    // if (cache.reload) {
    //   this.page.reset();
    //   this.loadNextPage();
    // }
  },

  /**
   * 加载下一页
   */
  loadNextPage: function () {
    this.page.next({ status: this.data.status }).then(data => {
      this.setData({ orders: data.list }
      );
    });
  },

  /**
   * 上划加载
   */
  onReachBottom: function (event) {
    this.loadNextPage();
  },

  /**
    * 下拉刷新
    */
  onPullDownRefresh: function () {
    this.reload();
  },

  /**
   * 重新加载
   */
  reload: function () {
    this.page.reset();
    this.loadNextPage();
    wx.stopPullDownRefresh();
  },

  /**
   * 点击单个订单 
   */
  onOrderTap: function (event) {
    const orderId = event.currentTarget.dataset.orderId;
    Router.orderDetail(orderId);
  },


  //******************* TAB页 ******************/


  iniOrderTabBar: function () {
    const tabbar = {
      tabs: [
        { "value": "0", "name": "全部" },
        { "value": "1", "name": "待付款" },
        { "value": "2", "name": "待发货" },
        { "value": "3", "name": "待收货" },
        { "value": "4", "name": "待评价" },
      ],
      selected: this.data.status
    };

    this.setData({ tabbar: tabbar });
  },

  //点击TAB页的事件
  onOrderTabTap: function (event) {
    const status = event.currentTarget.dataset.status;
    const tabbar = this.data.tabbar;
    tabbar.selected = status;

    //更新/初始化页面数据
    this.setData({
      status: status,
      tabbar: tabbar,
    });

    //初始化分页数据
    this.page.reset();

    //刷新页面
    this.loadNextPage();
  },

  //******************* 订单操作 ******************/

  /**
   * 确认收货
   */
  onOrderConfirm: function (event) {
    const orderId = event.currentTarget.dataset.orderId;
    Tips.confirm('您确认已收到货品？').then(() => {
      Tips.loading('确认收货中');
      return orderService.confirmOrder(orderId);
    }).then(data => {
      Tips.toast('确认收货成功', () => this.reload());
    });
  },

  /**
   * 微信支付
   */
  onWxPay: function (event) {
    const orderId = event.currentTarget.dataset.orderId;
    Tips.loading('支付加载中');
    orderService.prepayOrder(orderId).then(payment => {
      Tips.loaded();
      return orderService.wxpayOrder(payment);
    }).then(res => {
      Tips.toast('支付成功', () => this.reload());
    }).catch(() => {
      Tips.toast('支付已取消');
    });
  },

  /**
  * 关闭订单
  */
  onOrderClose: function (event) {
    const orderId = event.currentTarget.dataset.orderId;
    Tips.confirm('您确认取消该订单吗？').then(() => {
      Tips.loading('订单关闭中');
      return orderService.closeOrder(orderId);
    }).then(data => {
      Tips.toast('订单关闭成功', () => this.reload());
    });
  },

  /**
   * 物流查询
   */
  onOrderTrace: function (event) {
    const orderId = event.currentTarget.dataset.orderId;
    const order = this.data.orders.find(order => order.order_id == orderId);
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
})