import ShopService from "../../../class/service/ShopService";
import GoodsService from "../../../class/service/GoodsService";
import OrderService from "../../../class/service/OrderService";
import FavoriteService from "../../../class/service/FavoriteService";
import CouponService from "../../../class/service/CouponService";
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
const couponService = new CouponService();

Page(Object.assign({}, Quantity, {
  sku: {},
  data: {
    goods: {},
    shop: {},
    sku: {},
    isFav: false,
    cartNum: 0,
    shelf: {},
    init: false,
    commentNum: 0,
  },
  onLoad: function (options) {
    Tips.loading();
    const goodsId = options.goodsId;
    //const goodsId = 2;
    //请求店铺基本信息
    shopService.getInfo().then(data => {
      this.setData({ shop: data });
    })

    //获取商品信息
    goodsService.getInfo(goodsId).then(data => {
      this.sku = new Sku(data);
      this.setData({
        goods: data,
        sku: this.sku.export(),
        init: true
      });
      Tips.loaded();
    });

    //收藏状态
    favoriteService.is(goodsId).then(data => this.setData({ isFav: data.isFavorite }));

    //卡券
    couponService.shelf().then(data => this.setData({ shelf: data }));

    // 评论数量
    orderService.commentCount(goodsId).then(data => this.setData({commentNum: data.ALL}));

    //获取购物车商品数量
    this.setCartNumFromApp();

  },

  /**
   * 点击店铺
   */
  onShopItemTap: function (event) {
    Router.shopDetail();
  },

  /**
   * 查看图片
   */
  preview: function(event) {
    const urls = this.data.goods.images.map(item => item.url);
    wx.previewImage({
      urls: urls
    });
  },

  /**
   * 查看详情的所有图片
   */
  previewDetails: function(event) {
    const current  = event.currentTarget.dataset.url;
    const urls = this.data.goods.goodsDetails.filter(item => item.type == 2).map(item => item.content);
    wx.previewImage({
      current: current,
      urls: urls
    });
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
    //屏蔽禁止点击
    if (this.sku.disabledSkuValues[value]) {
      return;
    }
    const sku = this.sku;
    sku.select(key, value);
    this.setData({ sku: sku.export() });
  },


  /**
   * 确定购买
   */
  onConfirmBuyTap: function (event) {
    if (!this.isValidSku()) {
      return;
    }
    const goods = this.data.goods;
    const num = this.sku.num;
    Tips.loading();
    goodsService.stock(goods.id, this.sku.skuText).then(stock => {
      return stock < num ? Promise.reject('商品库存不足') : stock;
    }).then(() => {
      const sku = {
        skuText: this.sku.skuText,
        price: this.sku.detail.price,
        imageUrl: this.sku.detail.imageUrl,
      };
      const trade = orderService.createSingleTrade(goods, num, sku);
      const param = JSON.stringify(trade);
      this.onPanelClose();
      Router.createTrade(param);
    }).catch(err => Tips.error(err, () => Router.goodsIndexRedirect(goods.id)));



  },

  /**
   * 确定加入购物车
   */
  onConfirmCartTap: function (event) {
    if (!this.isValidSku()) {
      return;
    }
    //请求服务端
    const goods = this.data.goods;
    const sku = this.sku;
    Tips.loading('数据加载中');
    goodsService.stock(goods.id, sku.skuText).then(stock => {
      return stock < sku.num ? Promise.reject('商品库存不足') : stock;
    }).then(() => {
      return cartService.add(goods.id, sku.num, sku.skuText);
    }).then(() => {
      Tips.toast('加入购物成功');
      sku.num = 1;
      this.setCartNumFromApp(sku.num);
      notification.postNotificationName("ON_CART_UPDATE");
      this.onPanelClose();
    }).catch(err => Tips.error(err, () => Router.goodsIndexRedirect(goods.id)));
  },

  /**
   * 校验库存和SKU选择情况
   */
  isValidSku: function () {
    if (this.sku.exists && !this.sku.isReady) {
      Tips.alert('请选择商品规格');
      return false;
    }
    if (this.sku.stock < 1) {
      Tips.alert('该商品无货');
      return false;
    }

    return true;
  },

  /**
   * 点击收藏
   */
  onLikeTap: function (event) {
    const isFav = event.currentTarget.dataset.fav;
    if (isFav) {
      favoriteService.remove(this.data.goods.id);
    }
    else {
      favoriteService.add(this.data.goods.id);
    }
    this.setData({ isFav: !isFav });
  },

  /**
  * 处理数量选择器请求
  */
  handleZanQuantityChange(e) {
    this.sku.setNum(e.quantity);
    this.setData({ sku: this.sku.export() });
  },
  /**********************卡券面板事件***********************/
  onCouponPanelShow: function () {
    const shelf = this.data.shelf;
    shelf.display = true;
    this.setData({ shelf: shelf });
  },

  onCouponPanelClose: function () {
    const shelf = this.data.shelf;
    shelf.display = false;
    this.setData({ shelf: shelf });
  },

  /**
   * 领取卡券
   */
  onCouponPick: function (event) {
    const couponId = event.currentTarget.dataset.couponId;
    Tips.loading();
    couponService.pick(couponId).then(data => {
      const shelf = this.data.shelf;
      const currentCoupon = shelf.pickList.find(item => item.id == couponId);
      currentCoupon.own = true;
      this.setData({ shelf: shelf });
      Tips.toast('领取成功！');
    });
  },

  /**********************分享事件***********************/

  /**
   * 分享
   */
  onShareAppMessage: function () {
    const title = app.globalData.shop.name;
    const desc = this.data.goods.name;
    const url = `/pages/goods/index/index?goodsId=${this.data.goods.id}`;
    return Tips.share(title, url, desc);
  },
  onScoreTap: function() {
    const goodsId = this.data.goods.id;
    Router.goto(`/pages/goods/score/list?goodsId=${goodsId}`);
  }
}));