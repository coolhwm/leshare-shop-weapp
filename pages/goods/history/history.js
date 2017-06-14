import LogService from "../../../class/service/LogService";
import Router from "../../../class/utils/Router";
import Tips from "../../../class/utils/Tips";
const logService = new LogService();


Page({
  page: {},
  data: {
    histories: [],
    init: false
  },

  onLoad: function (options) {
    Tips.loading();
    //初始化分页参数
    this.page = logService.page();
    this.loadNextPage();
  },

  reload: function () {
    this.page.reset();
    this.loadNextPage();
    wx.stopPullDownRefresh();
  },

  /**
   * 加载下一页
   */
  loadNextPage: function () {
    this.page.next().then(data => {
      this.setData({
        histories: data.list,
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

  /***********************操作事件***********************/

  /**
   * 点击商品
   */
  onGoodsTap: function (event) {
    const goodsId = event.currentTarget.dataset.goodsId;
    Router.goodsIndex(goodsId);
  },

  /**
  * 操作
  */
  onMoreTap: function (event) {
    const goodsId = event.currentTarget.dataset.goodsId;
    Tips.actionWithFunc(['查看商品', '删除记录'],
      () => Router.goodsIndex(goodsId),
      () => {
        Tips.loading();
        logService.remove(goodsId).then(() => this.reload())
      });
  }
});