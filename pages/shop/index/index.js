import { Http } from "../../../class/utils/Http.js";
import ShopService from "../../../class/service/ShopService";
import GoodsService from "../../../class/service/GoodsService"; 

const app = getApp();
const shopService = new ShopService();
const goodsService = new GoodsService();

Page({
  page : {},
  data: {
    shop: {},
    goods: [],
    notice: []
  },
  
  onLoad: function (options) {
    //请求店铺基本信息
    shopService.getInfo().then(data => {
      this.setData({ shop: data });
    })

    //请求公告信息
    shopService.getNotice().then(data => {
      this.setData({ notice: data[0] });
    });

    //生成分页对象
    this.page = goodsService.page();
    //请求加载商品
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
   * 点击商品
   */
  onGoodsItemTap: function (event) {
    const goodsId = event.currentTarget.dataset.goodsId;
    wx.navigateTo({
      url: "/pages/goods/index/index?goodsId=" + goodsId
    });
  },

  /**
   * 点击店铺
   */
  onShopItemTap: function (event) {
    const shopId = event.currentTarget.dataset.shopId;
    wx.navigateTo({
      url: `/pages/shop/detail/detail?shopId=${shopId}`
    });
  },

  /**
   * 下拉刷新
   */
  onReachBottom: function (event) {
    this.loadNextPage();
  },

  /**
   * 加载下一页
   */
  loadNextPage: function () {
    this.page.next().then(data => {
      console.info('分页信息查询结果', data);
      this.setData({goods: data.list}
      );
    });
  },
});