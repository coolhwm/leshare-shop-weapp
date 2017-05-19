import ShopService from "../../../class/service/ShopService";
import GoodsService from "../../../class/service/GoodsService";
import Router from "../../../class/utils/Router";

const app = getApp();
const shopService = new ShopService();
const goodsService = new GoodsService();

Page({
  page: {},
  data: {
    shop: {},
    goods: [],
    notice: []
  },

  /**
   * 页面初始化
   */
  onLoad: function (options) {
    //请求店铺基本信息
    shopService.getInfo().then(data => {
      this.setData({ shop: data });
    })

    //请求公告信息
    shopService.getFirstNotice().then(data => {
      this.setData({ notice: data });
    });

    //生成分页对象
    this.page = goodsService.page();
    //请求加载商品
    this.loadNextPage();
  },

  /**
    * 加载下一页
    */
  loadNextPage: function () {
    this.page.next().then(data => {
      this.setData({ goods: data.list }
      );
    });
  },

  /**
   * 点击商品
   */
  onGoodsItemTap: function (event) {
    const goodsId = event.currentTarget.dataset.goodsId;
    Router.goodsIndex(goodsId);
  },

  /**
   * 点击店铺
   */
  onShopItemTap: function (event) {
    Router.shopDetail();
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