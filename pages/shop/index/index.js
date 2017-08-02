import ShopService from "../../../class/service/ShopService";
import GoodsService from "../../../class/service/GoodsService";
import CouponService from "../../../class/service/CouponService";
import AuthService from "../../../class/service/AuthService";
import CartService from "../../../class/service/CartService";
import Router from "../../../class/utils/Router";
import Tips from "../../../class/utils/Tips";
import Sku from "../../../class/entity/Sku";

const Tab = require('../../../templates/tab/index');
const notification = require("../../../class/utils/WxNotificationCenter.js");
const Quantity = require('../../../templates/quantity/index');
const app = getApp();
const cache = getApp().globalData.cart;
const shopService = new ShopService();
const goodsService = new GoodsService();
const couponService = new CouponService();
const authService = new AuthService();
const cartService = new CartService();

Page(Object.assign({}, Quantity, Tab, {
  page: {},
  retry: 0,
  data: {
    shop: {},
    goods: [],
    notices: [],
    tab: {},
    coupons: [],
    init: false,
    loading: false,
    nomore: false,
    cartGoods: {},
    cartSku: {}
  },

  /**
   * 页面初始化
   */
  onLoad: function (options) {
    Tips.loading();
    authService.checkLoginCode()
      .then(this.init, this.session)
      .then(this.login);
  },


  /**
   * 用户登录
   */
  login: function () {
    authService.checkLoginStatus()
      .then(user => console.info('用户已登录', user),
      err => authService.getWxUserInfo()
        .then(rawUser => authService.checkUserInfo(rawUser))
        .then(rawUser => authService.decodeUserInfo(rawUser))
        .then(user => authService.saveUserInfo(user)));
  },

  /**
   * 建立会话
   */
  session: function () {
    console.info('权限校验失败，与服务器建立新会话');
    if (this.retry > 5) {
      Tips.error('服务器连接失败');
      return Promise.reject('服务器连接失败');
    }
    this.retry ++;
    return authService.getWxJsCode()
      .then(jsCode => {
        return authService.getLoginCode(jsCode);
      })
      .then(auth => {
        authService.saveAuthInfo(auth);
      })
      .then(() => {
        this.onLoad();
      });
  },


  /**
   * 初始化店铺信息
   */
  init: function () {
    console.info('权限校验成功，会话正常');
    //请求店铺基本信息
    shopService.getInfo().then(data => {
      this.setData({ shop: data });
    })

    //请求公告信息
    shopService.notices().then(data => {
      this.setData({ notices: data });
    });

    //请求分类信息
    goodsService.categories().then(data => {
      this.setData({ tab: data });
      //生成分页对象
      this.page = goodsService.page(true);
      //请求加载商品
      this.loadNextPage();
    });
    
    //购物车数量初始化
    cartService.count().then(count => app.globalData.cart.num = count);

    // 请求最低价格
    shopService.limitPrice().then(data => {
      const arr = [];
      if (data.SELF != null) {
        arr.push(data.SELF);
      }
      if (data.CITY != null) {
        arr.push(data.CITY);
      }
      if (data.EXPRESS != null) {
        arr.push(data.EXPRESS);
      }
      let limitPrice = Math.min(...arr);
      if (!limitPrice || Number.isNaN(limitPrice)) {
        limitPrice = 0;
      }
      console.info(`limit price: ${limitPrice}`);
      app.globalData.shop.limitPrice = limitPrice;
    });

    shopService.visit();
  },

  /**
    * 加载下一页
    */
  loadNextPage: function () {
    const param = {
      category_id: this.data.tab.selectedId
    }
    this.page.next(param).then(data => {
      Tips.loaded();
      this.setData({
        goods: data.list,
        nomore: data.list.length == this.data.goods.length,
        loading: false,
        init: true
      });
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
    if (this.data.nomore) {
      return;
    }
    this.loadNextPage();
    this.setData({ loading: true });
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
    Tips.loading();
    this.page.reset();
    this.loadNextPage();
  },

  /**
   * 点击领取卡券
   */
  onCouponTap: function (event) {
    const couponId = event.currentTarget.dataset.couponId;
    Tips.loading();
    couponService.pick(couponId).then(data => {
      Tips.toast('领取成功！');
    });
  },

  onScroll: function (event) {
    const top = event.detail.scrollTop;
    const fixed = top > 120;
    this.setData({ fixed: fixed });
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

    this.page = goodsService.page(selectedId == -1);
    this.reload();
  },

  /**
   * 分享
   */
  onShareAppMessage: function(){
    const title = app.globalData.shop.name;
    const url = '/pages/shop/index/index';
    return Tips.share(title, url, title);
  },

   /***********************购物车及面板事件***********************/

   
  /**
   * 关闭面板
   */
  onPanelClose: function () {
    this.cartSku.display = false;
    this.setData({ cartSku: this.cartSku.export() });
  },

    /**
   * 点击加入购物车
   */
  onAddCartTap: function (event) {
    Tips.loading();
    const goodsId = event.currentTarget.dataset.goodsId;
    //获取商品信息
    goodsService.getInfo(goodsId).then(data => {
      this.cartSku = new Sku(data);
      this.cartSku.display = true;
      this.cartSku.action = "cart";
      this.setData({
        cartGoods: data,
        cartSku: this.cartSku.export(),
      });
      Tips.loaded();
    });
  },

  /**
   * 点击规格
   */
  onSkuTap: function (event) {
    const key = event.currentTarget.dataset.skuKey;
    const value = event.currentTarget.dataset.skuValue;
    //屏蔽禁止点击
    if (this.cartSku.disabledSkuValues[value]) {
      return;
    }
    const cartSku = this.cartSku;
    cartSku.select(key, value);
    this.setData({ cartSku: cartSku.export() });
  },

  /**
   * 确定加入购物车
   */
  onConfirmCartTap: function (event) {
    if (!this.isValidSku()) {
      return;
    }
    //请求服务端
    const goods = this.data.cartGoods;
    const sku = this.cartSku;
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
    }).catch(err =>console.info(err));
  },

  setCartNumFromApp: function (num) {
    if (num) {
      cache.num += num;
    }
    this.setData({ cartNum: cache.num });
  },

  /**
  * 处理数量选择器请求
  */
  handleZanQuantityChange(e) {
    this.cartSku.setNum(e.quantity);
    this.setData({ cartSku: this.cartSku.export() });
  },

  /**
   * 校验库存和SKU选择情况
   */
  isValidSku: function () {
    if (this.cartSku.exists && !this.cartSku.isReady) {
      Tips.alert('请选择商品规格');
      return false;
    }
    if (this.cartSku.stock < 1) {
      Tips.alert('该商品无货');
      return false;
    }

    return true;
  },
}));