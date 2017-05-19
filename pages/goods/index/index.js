import ShopService from "../../../class/service/ShopService";
import GoodsService from "../../../class/service/GoodsService";
import OrderService from "../../../class/service/OrderService";
import Router from "../../../class/utils/Router";

const app = getApp();
const shopService = new ShopService();
const goodsService = new GoodsService();
const orderService = new OrderService();

Page({
  data: {
    goods: {},
    shop: {}
  },
  onLoad: function (options) {
    const goodsId = options.goodsId;

    //请求店铺基本信息
    shopService.getInfo().then(data => {
      this.setData({ shop: data });
    })

    //获取商品信息
    goodsService.getInfo(goodsId).then(data => {
      this.setData({ goods: data });
    });
  },

  /**
   * 点击店铺
   */
  onShopItemTap: function (event) {
    Router.shopDetail();
  },

  /**
   * 购买
   */
  onBuyTap: function (event) {
    const goods = this.data.goods;
    const trade = orderService.createSingleTrade(goods);
    const param = JSON.stringify(trade);
    Router.createTrade(param);
  }
});