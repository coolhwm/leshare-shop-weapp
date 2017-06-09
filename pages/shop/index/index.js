import ShopService from "../../../class/service/ShopService";
import GoodsService from "../../../class/service/GoodsService";
import Router from "../../../class/utils/Router";
const Tab = require('../../../templates/tab/index');
const app = getApp();
const shopService = new ShopService();
const goodsService = new GoodsService();

Page(Object.assign({}, Tab, {
  page: {},
  data: {
    shop: {},
    goods: [],
    notice: [],
    tab: {},
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

    //请求分类信息
    goodsService.categories().then(data => {
      this.setData({ tab: data });
      //生成分页对象
      this.page = goodsService.page();
      //请求加载商品
      this.loadNextPage();
    });
  },

  /**
    * 加载下一页
    */
  loadNextPage: function () {
    const param = {
      category_id: this.data.tab.selectedId
    }
    this.page.next(param).then(data => {
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
    this.reload();
    wx.stopPullDownRefresh();
  },


  /**
   * 重新加载
   */
  reload: function () {
    this.page.reset();
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
  }


}));