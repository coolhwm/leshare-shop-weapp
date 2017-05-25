import CartService from "../../../class/service/CartService";
import OrderService from "../../../class/service/OrderService";
import Router from "../../../class/utils/Router";
import Cart from "../../../class/entity/Cart";

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
    cache.init = true;
    //初始化分页参数
    this.page = cartService.page();
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


  /**
   * 页面展现
   */
  onShow: function () {
    if (cache.init && cache.reload) {
      this.page.reset();
      this.loadNextPage();
    }
  },

  /**
   * 加载下一页
   */
  loadNextPage: function () {
    this.page.next().then(data => {
      //设置购物车对象参数
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
    const trade = orderService.createCartTrade(this.data.cart.carts);
    const param = JSON.stringify(trade);
    Router.createTrade(param);
  },


  /**
   * 长按项目
   */
  onCartLongTap: function (e) {
    const cartId = e.currentTarget.dataset.cartId;
    const goodsName =e.currentTarget.dataset.goodsName;
    wx.showModal({
      title: '删除商品',
      content: `是否删除${goodsName}`,
      showCancel: true,
      success: res => {
        if (res.confirm) {
          this.cart.remveCart(cartId);
          this.render();

          //请求服务器
          cartService.remove(cartId).then(data => {
            //TODO
          });
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
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