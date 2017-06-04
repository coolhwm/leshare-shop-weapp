import ShopService from "../../../class/service/ShopService";
import GoodsService from "../../../class/service/GoodsService";
import OrderService from "../../../class/service/OrderService";
import FavoriteService from "../../../class/service/FavoriteService";
import CartService from "../../../class/service/CartService";
import Router from "../../../class/utils/Router";
import Tips from "../../../class/utils/Tips";
import Sku from "../../../class/entity/Sku";

const notification = require("../../../class/utils/WxNotificationCenter.js");
const Quantity = require('../../../templates/quantity/index');
const app = getApp();
const cache = getApp().globalData.cart;
const shopService = new ShopService();
const goodsService = new GoodsService();
const orderService = new OrderService();
const cartService = new CartService();
const favoriteService = new FavoriteService();

Page(Object.assign({}, Quantity, {
  sku: {},
  data: {
    goods: {},
    shop: {},
    sku: {},
    cartNum: 0,
  },
  onLoad: function (options) {
    //const goodsId = options.goodsId;
    const goodsId = 2;
    //请求店铺基本信息
    shopService.getInfo().then(data => {
      this.setData({ shop: data });
    })

    //获取商品信息
    goodsService.getInfo(goodsId).then(data => {
      this.sku = new Sku(data);
      this.setData({
        goods: data,
        sku: this.sku.export()
      });
    });

    //获取购物车商品数量
    this.setCartNumFromApp();

  },

  /**
   * 点击店铺
   */
  onShopItemTap: function (event) {
    Router.shopDetail();
  },

  /***********************购买栏事件***********************/

  /**
   * 点击加入购物车
   */
  onAddCartTap: function (event) {
    this.sku.display = true;
    this.sku.action = "cart";
    this.setData({ sku: this.sku.export() });


  },

  /**
   * 跳转到购物车
   */
  onToCartTap: function (event) {
    Router.cartIndex();
  },

  /**
   * 购买
   */
  onBuyTap: function (event) {
    this.sku.display = true;
    this.sku.action = "buy";
    this.setData({ sku: this.sku.export() });
  },

  /**
   * private 设置购物车商品数量
   */
  setCartNumFromApp: function (num) {
    if (num) {
      cache.num += num;
    }
    this.setData({ cartNum: cache.num });
  },

  /***********************购买面板事件***********************/

  /**
   * 关闭面板
   */
  onPanelClose: function () {
    this.sku.display = false;
    this.setData({ sku: this.sku.export() });
  },

  /**
   * 点击规格
   */
  onSkuTap: function (event) {
    const key = event.currentTarget.dataset.skuKey;
    const value = event.currentTarget.dataset.skuValue;

    this.sku.select(key, value);
    this.setData({ sku: this.sku.export() });
  },

  /**
   * 确定购买
   */
  onConfirmBuyTap: function (event) {
    const goods = this.data.goods;
    const num = this.sku.num;
    const sku = this.sku.skuText;
    const trade = orderService.createSingleTrade(goods, num, sku);
    const param = JSON.stringify(trade);
    Router.createTrade(param);
  },

  /**
   * 确定加入购物车
   */
  onConfirmCartTap: function (event) {
    this.setCartNumFromApp(this.sku.num);
    //请求服务端
    cartService.add(this.data.goods.id, this.sku.num, this.sku.skuText).then(res => {
      Tips.toast('加入购物成功');
      this.sku.num = 1;
      notification.postNotificationName("ON_CART_UPDATE");
      this.onPanelClose();
    });
  },

  /**
   * 点击收藏
   */
  onLikeTap: function(event){
    //favoriteService.add(this.data.goods.id);
    favoriteService.remove(this.data.goods.id);
  },

  /**
  * 处理数量选择器请求
  */
  handleZanQuantityChange(e) {
    this.sku.setNum(e.quantity);
    this.setData({ sku: this.sku.export() });
  }
}));