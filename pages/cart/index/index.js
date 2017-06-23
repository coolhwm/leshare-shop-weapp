import CartService from "../../../class/service/CartService";
import OrderService from "../../../class/service/OrderService";
import Router from "../../../class/utils/Router";
import Cart from "../../../class/entity/Cart";
import Tips from "../../../class/utils/Tips";
const app = getApp();
const notification = require("../../../class/utils/WxNotificationCenter.js");
const Quantity = require('../../../templates/quantity/index');
const cache = getApp().globalData.cart;
const cartService = new CartService();
const orderService = new OrderService();

Page(Object.assign({}, Quantity, {

  cart: {},
  page: {},
  data: {
    cart: {},
    init: false,
    delBtnWidth: 60
  },


  /**
   * 页面初始化
   */
  onLoad: function (options) {
    Tips.loading();
    //初始化分页参数
    this.page = cartService.page();
    //注册事件,数量改变的时候重新加载
    const that = this;
    notification.addNotification("ON_CART_UPDATE", that.reload, that);
    notification.addNotification("ON_CART_ORDER", that.removeOrderGoods, that);
    //初始化购物车对象
    this.cart = new Cart();
    //加载第一页
    this.loadNextPage();
    this.setData({ shopName: app.globalData.shop.name });
  },

  /**
   * 页面隐藏，同步数据
   */
  onHide: function () {
    cartService.count().then(count => cache.num = count);
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
    Tips.loaded();
    this.setData({
      cart: cart,
      init: true
    });
  },


  /**
 * 上划加载
 */
  onReachBottom: function (event) {
    this.loadNextPage();
  },

  /**
   * 删除订单的商品
   */
  removeOrderGoods: function (goods) {
    console.info(goods);
    this.reload();
  },

  /***********************操作***********************/

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
      Tips.alert("请选择商品");
      return;
    }
    const message = this.cart.checkGoodsStock();
    if (message) {
      Tips.alert(message);
      return;
    }
    const carts = this.cart.getCheckedCarts();
    const trade = orderService.createCartTrade(carts);
    const param = JSON.stringify(trade);
    Router.createTrade(param);
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
  },

  /***********************批量操作***********************/
  /**
   * 进入批量操作模式
   */
  onBatchTap: function () {
    this.cart.toggleBatch();
    this.render();
  },

  /**
   * 批量加入收藏
   */
  onBatchFav: function () {
    Tips.alert('尚未实现');
  },

  /**
   * 批量删除
   */
  onBatchDelete: function () {
    const carts = this.cart.getCheckedCarts();
    if (carts.length < 1) {
      Tips.alert('请选择商品');
      return;
    }

    Tips.confirm('是否确认删除所选商品').then(() => {
      return cartService.removeBatch(carts);
    }).then(() => {
      Tips.toast('删除成功');
      this.reload();
    });
  },




  /***********************滑动删除事件***********************/

  touchS: function (e) {
    if (e.touches.length == 1) {
      this.setData({
        //设置触摸起始点水平方向位置
        startX: e.touches[0].clientX
      });
    }
  },
  touchM: function (e) {
    if (e.touches.length == 1) {
      //手指移动时水平方向位置
      var moveX = e.touches[0].clientX;
      //手指起始点位置与移动期间的差值
      var disX = this.data.startX - moveX - 30;
      var delBtnWidth = this.data.delBtnWidth;
      var txtStyle = "";
      if (disX == 0 || disX < 0) {//如果移动距离小于等于0，文本层位置不变
        txtStyle = "left:0px";
      } else if (disX > 0) {//移动距离大于0，文本层left值等于手指移动距离
        txtStyle = "left:-" + disX + "px";
        if (disX >= delBtnWidth) {
          //控制手指移动距离最大值为删除按钮的宽度
          txtStyle = "left:-" + delBtnWidth + "px";
        }
      }
      //获取手指触摸的是哪一项
      var index = e.currentTarget.dataset.index;
      var cart = this.data.cart;
      var list = cart.carts;
      if (index >= 0) {
        list[index].txtStyle = txtStyle;
        //更新列表的状态
        this.setData({
          cart: cart
        });
      }
    }
  },

  touchE: function (e) {
    if (e.changedTouches.length == 1) {
      //手指移动结束后水平位置
      var endX = e.changedTouches[0].clientX;
      //触摸开始与结束，手指移动的距离
      var disX = this.data.startX - endX - 30;
      var delBtnWidth = this.data.delBtnWidth;
      //如果距离小于删除按钮的1/2，不显示删除按钮
      var txtStyle = disX > delBtnWidth / 2 ? "left:-" + delBtnWidth + "px" : "left:0px";
      //获取手指触摸的是哪一项
      var index = e.currentTarget.dataset.index;
      var cart = this.data.cart;
      var list = cart.carts;
      if (index >= 0) {
        list[index].txtStyle = txtStyle;
        //更新列表的状态
        this.setData({
          cart: cart
        });
      }
    }
  },
  //获取元素自适应后的实际宽度
  getEleWidth: function (w) {
    var real = 0;
    try {
      var res = wx.getSystemInfoSync().windowWidth;
      var scale = (750 / 2) / (w / 2);//以宽度750px设计稿做宽度的自适应
      // console.log(scale);
      real = Math.floor(res / scale);
      return real;
    } catch (e) {
      return false;
      // Do something when catch error
    }
  },
  initEleWidth: function () {
    var delBtnWidth = this.getEleWidth(this.data.delBtnWidth);
    this.setData({
      delBtnWidth: delBtnWidth
    });
  }
}));