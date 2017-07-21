import CouponService from "../../../class/service/CouponService";
import Tips from "../../../class/utils/Tips";

const Tab = require('../../../templates/tab/index');
const couponService = new CouponService();

Page(Object.assign({}, Tab, {
  page: {},
  data: {
    tab: {
      list: [{
        id: 'NEVER_USED',
        title: '未使用'
      }, {
        id: 'USED',
        title: '使用记录'
      }, {
        id: 'EXPIRED',
        title: '已过期'
      }],
      selectedId: 'NEVER_USED',
      scroll: false
    },
    coupons: [],
    init: false
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
    wx.stopPullDownRefresh();
  },

  /**
   * 加载下一页
   */
  loadNextPage: function () {
    Tips.loading();
    const param = {
      status: this.data.tab.selectedId
    };
    this.page.next(param).then(data => {
      this.setData({ 
        coupons: data.list,
        init: true
      });
      Tips.loaded();
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


  /**
   * 处理点击事件
   */
  handleZanTabChange(e) {
    var componentId = e.componentId;
    var selectedId = e.selectedId;

    this.setData({
      [`${componentId}.selectedId`]: selectedId
    });
    this.reload();
  },

  /**
   * 长按删除卡券
   */
  onCouponDelete: function (event) {
    const acceptId = event.currentTarget.dataset.couponId;
    Tips.confirm('是否删除该卡券？')
      .then(() => couponService.remove(acceptId))
      .then(() => Tips.toast('删除成功', () => this.reload()));
  }
}))