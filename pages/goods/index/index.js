import ShopService from "../../../class/service/ShopService";
import GoodsService from "../../../class/service/GoodsService";
import OrderService from "../../../class/service/OrderService";
import CartService from "../../../class/service/CartService";
import Router from "../../../class/utils/Router";

const app = getApp();
const shopService = new ShopService();
const goodsService = new GoodsService();
const orderService = new OrderService();
const cartService = new CartService();

Page({
  data: {
    goods: {},
    shop: {},
    cartNum: 0
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

    //获取购物车商品数量
    this.setCartNumFromApp()

  },

  /**
   * 点击店铺
   */
  onShopItemTap: function (event) {
    Router.shopDetail();
  },

  /**
   * 点击加入购物车
   */
  onAddCartTap: function (event) {
    //页面渲染
    app.globalData.cartNum++;
    this.setCartNumFromApp();
    //请求服务端
    cartService.add(this.data.goods.id).then(res => {

    });
  },

  /**
   * 购买
   */
  onBuyTap: function (event) {
    const goods = this.data.goods;
    const trade = orderService.createSingleTrade(goods);
    const param = JSON.stringify(trade);
    Router.createTrade(param);
  },

  /**
   * private 设置购物车商品数量
   */
  setCartNumFromApp: function () {
    this.setData({ cartNum: app.globalData.cartNum });
  }
});