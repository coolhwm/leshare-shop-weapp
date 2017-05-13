import { Http } from "../../../class/utils/Http.js";
var app = getApp();
Page({
  data: {
    orders: [],
    start: 0,
    count: 10,
    status: 0,
    tabbar: {}
  },
  onLoad: function (options) {
    this.iniOrderTabBar();
    this.loadNextPage();
  },
  onShow: function () {
    //订单有更新的时候，要进行刷新操作
    if (app.globalData.isReloadOrderList) {
      app.globalData.isReloadOrderList = false;
      this.clearData();
      this.loadNextPage();
    }
  },

  /**
   * 点击单个订单 
   */
  onOrderTap: function (event) {
    let orderId = event.currentTarget.dataset.orderId;
    wx.navigateTo({
      url: `/pages/order/detail/detail?orderId=${orderId}`
    });
  },

  /**
   * 点击单个订单 
   */
  onReachBottom: function (event) {
    this.loadNextPage();
  },

  /**
   * 加载下一页
   */
  loadNextPage: function () {
    wx.showNavigationBarLoading();
    //请求订单信息
    let url = `${app.globalData.baseUrl}/customers/${app.globalData.userId}/shops/${app.globalData.shopId}/orders`;

    let params = {
      from: this.data.start,
      limit: this.data.count,
      status: this.data.status
    };

    Http.get(url, params, (data) => {
      for (let item of data) {
        //对数据做一些处理
        this.processOrderData(item);
      }

      //视图刷新
      var orders = this.data.orders;
      orders = orders.concat(data);
      this.setData({ orders: orders });
      //移动到下一页
      this.data.start += this.data.count;
      wx.hideNavigationBarLoading();
    });
  },

  /**
   * 处理订单数据
   */
  processOrderData: function (order) {
    let statusDict = {
      "0": "全部",
      "1": "待发货",
      "2": "待付款",
      "3": "已发货",
      "4": "退款中",
      "5": "已完成",
      "6": "已关闭"
    };

    order.status_text = statusDict[order.status];
  },


  /**
   * 清除数据
   */
  clearData: function () {
    this.setData({
      status: 0,
      start: 0,
      count: 10,
      orders: []
    });
  },

  /**
   * 初始化TAB数据
   */
  iniOrderTabBar: function () {
    let tabbar = {
      tabs: [
        { "value": "0", "name": "全部" },
        { "value": "2", "name": "待付款" },
        { "value": "1", "name": "待发货" },
        { "value": "3", "name": "待收货" },
        { "value": "5", "name": "已完成" },
      ],
      selected: this.data.status
    };

    this.setData({ tabbar: tabbar });
  },

  //点击TAB页的事件
  onOrderTabTap: function (event) {
    let status = event.currentTarget.dataset.status;
    var tabbar = this.data.tabbar;
    tabbar.selected = status;

    //更新/初始化页面数据
    this.setData({
      status: status,
      tabbar: tabbar,
      start: 0,
      count: 10,
      orders: []
    });

    //刷新页面
    this.loadNextPage();
  }
})