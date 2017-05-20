import OrderService from "../../../class/service/OrderService";
import Router from "../../../class/utils/Router";

const app = getApp();
const orderService = new OrderService();

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
  },

  /**
   * 页面展现
   */
  onShow: function () {
    //需要判断脏数据
    //this.clearData();
    //this.loadNextPage();
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


  /**
   * 初始化TAB数据
   */
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
  }
})