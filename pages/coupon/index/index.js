import CouponService from "../../../class/service/CouponService";

const Tab = require('../../../templates/tab/index');
const couponService = new CouponService();

Page(Object.assign({}, Tab, {
  page: {},
  data: {
    tab: {
      list: [{
        id: 'all',
        title: '未使用(43)'
      }, {
        id: 'topay',
        title: '使用记录(24)'
      }, {
        id: 'tosend',
        title: '已过期(27)'
      }],
      selectedId: 'all',
      scroll: false
    },
    coupons: []
  },

  onLoad: function (options) {
    this.page = couponService.page();
    this.loadNextPage();
  },

  /**
   * 重新加载
   */
  reload: function () {
    this.page.reset();
    this.loadNextPage();
  },

  /**
   * 加载下一页
   */
  loadNextPage: function () {
    this.page.next().then(data => {
      console.info(data);
      this.setData({ coupons: data.list });
    });
  },

  /**
  * 下拉刷新
  */
  onPullDownRefresh: function () {
    this.reload();
  },

  /**
  * 上划加载
  */
  onReachBottom: function (event) {
    this.loadNextPage();
  },

}))