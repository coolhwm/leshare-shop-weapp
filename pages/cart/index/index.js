import CartService from "../../../class/service/CartService";
import OrderService from "../../../class/service/OrderService";
import Router from "../../../class/utils/Router";
import Cart from "../../../class/entity/Cart";
import Tips from "../../../class/utils/Tips";

const notification = require("../../../class/utils/WxNotificationCenter.js");
const Quantity = require('../../../templates/quantity/index');
const cache = getApp().globalData.cart;
const cartService = new CartService();
const orderService = new OrderService();

Page(Object.assign({}, Quantity, {

  cart: {},
  page: {},
  data: {
    cart: {}
  },


  /**
   * 页面初始化
   */
  onLoad: function (options) {
    //初始化分页参数
    this.page = cartService.page();
    //注册事件,数量改变的时候重新加载
    const that = this;
    notification.addNotification("ON_CART_UPDATE", that.reload, that);
    //初始化购物车对象
    this.cart = new Cart();
    //加载第一页
    this.loadNextPage();
  },

  /**
   * 页面隐藏，同步数据
   */
  onHide: function () {
    cache.num = this.cart.num;
  },

  reload: function () {
    this.page.reset();
    this.loadNextPage();
  },

  /**
   * 加载下一页
   */
  loadNextPage: function () {
    this.page.next().then(data => {
      //设置购物车对象参数
      cache.init = true;
      this.cart.setCarts(data.list);
      this.render();
    });
  },

  /**
   * 执行渲染购物车视图
   */
  render: function () {
    const cart = this.cart.export();
    this.setData({ cart: cart });
  },


  /**
 * 上划加载
 */
  onReachBottom: function (event) {
    this.loadNextPage();
  },

  /**
   * 点击多选事件
   */
  onCheckTap: function (e) {
    const cartId = e.currentTarget.dataset.cartId;
    this.cart.toggleCartCheck(cartId);
    this.render();
  },

  /**
   * 点击多选按钮
   */
  onCheckAllTap: function (e) {
    this.cart.toggleAllCheck();
    this.render();
  },

  /**
   * 点击项目
   */
  onCartTap: function (e) {
    const goodsId = e.currentTarget.dataset.goodsId;
    Router.goodsIndex(goodsId);
  },

  /**
   * 点击购买
   */
  onBuyTap: function (e) {
    if (this.cart.empty()) {
      Tips.toast("请选择商品");
    }
    else {
      const trade = orderService.createCartTrade(this.cart.getCheckedCarts());
      const param = JSON.stringify(trade);
      Router.createTrade(param);
    }
  },


  /**
   * 长按项目，删除商品
   */
  onCartLongTap: function (e) {
    const cartId = e.currentTarget.dataset.cartId;
    const goodsName = e.currentTarget.dataset.goodsName;
    Tips.confirm(`是否删除${goodsName}`).then(() => {
      this.cart.remveCart(cartId);
      this.render();
      return cartService.remove(cartId);
    }).then(() => {
      console.log('请求删除成功')
    });
  },

  /**
   * 处理数量选择器请求
   */
  handleZanQuantityChange(e) {
    var cartId = e.componentId;
    var num = e.quantity;

    this.cart.updateCartNum(cartId, num);
    this.render();

    //请求服务端
    cartService.update(cartId, num).then(res => {
      //修改商品数量
    });
  }
}));