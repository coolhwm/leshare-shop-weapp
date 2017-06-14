import FavoriteService from "../../../class/service/FavoriteService";
import Router from "../../../class/utils/Router";
import Tips from "../../../class/utils/Tips";

const favoriteService = new FavoriteService();
Page({
  page: {},
  data: {
    favorites: [],
    init: false
  },

  onLoad: function (options) {
    Tips.loading();
    //初始化分页参数
    this.page = favoriteService.page();
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
        favorites: data.list,
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
    Tips.actionWithFunc(['查看商品', '取消收藏'],
      () => Router.goodsIndex(goodsId), 
      () => {
        Tips.loading();
        favoriteService.remove(goodsId).then(() => this.reload())
    });
  }
});