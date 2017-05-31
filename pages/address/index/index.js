import AddressService from "../../../class/service/AddressService";

const addressService = new AddressService();

Page({
  page: {},
  data: {
    addresses: []
  },

  onLoad: function (options) {
    this.page = addressService.page();
    this.loadNextPage();
  },

  onShow: function (options) {
    if(options && options.reload){
      this.onPullDownRefresh();
    }
  },

  /**
  * 加载下一页
  */
  loadNextPage: function () {
    this.page.next().then(data => {
      this.setData({ addresses: data.list });
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

});