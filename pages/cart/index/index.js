import CartService from "../../../class/service/CartService";
import OrderService from "../../../class/service/OrderService";
import Router from "../../../class/utils/Router";
import Cart from "../../../class/entity/Cart";

var Quantity = require('../../../templates/quantity/index');
const cartService = new CartService();
const orderService = new OrderService();

Page(Object.assign({}, Quantity, {

  /**
   * 页面的初始数据
   */
  page: {},
  data: {
    isLoaded: false,
    carts: [],
    price: 0,
    num: 0,
    all: false,
    cart: {}
  },


  /**
   * 页面初始化
   */
  onLoad: function (options) {
    //初始化分页参数
    this.page = cartService.page();
    //初始化购物车对象
    this.data.cart = new Cart();
    //加载第一页
    this.loadNextPage(this);
  },

  /**
   * 加载下一页
   */
  loadNextPage: function () {
    this.page.next().then(data => {
      //设置购物车对象参数
      this.data.cart.setCarts(data.list);
      this.setData({ carts: data.list });
      this.setCheckedTotalNumAndPrice();
    });
  },


  /**
   * 设置价格和数量
   */
  setCheckedTotalNumAndPrice: function () {
    const carts = this.data.carts;
    let all = true;
    let price = 0;
    let num = 0;
    for (let i in carts) {
      const cart = carts[i];
      if (!cart.check) {
        all = false;
        continue;
      }
      num += cart.goods_num;
      price += cart.goods_price * cart.goods_num;
    }
    price = price.toFixed(2);
    this.setData({ num: num, price: price, all: all });
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
  // onPullDownRefresh: function () {
  //   this.page.reset();
  //   this.loadNextPage();
  //   wx.stopPullDownRefresh();
  // },

  /**
   * 点击多选事件
   */
  onCheckTap: function (e) {
    const cartId = e.currentTarget.dataset.cartId;
    //点击切换多选按钮
    this.data.cart.toggleCartCheck(cartId);
    //--
    const carts = this.data.carts;
    const cart = this.findCartItemById(cartId).cart;
    cart.check = !cart.check;
    //刷新视图
    this.setData({ carts: carts });
    this.setCheckedTotalNumAndPrice();
  },

  /**
   * 点击多选按钮
   */
  onCheckAllTap: function (e) {
    //--
    const check = !this.data.all;
    const carts = this.data.carts;
    for (let i in carts) {
      const cart = carts[i];
      cart.check = check;
    }
    this.setData({ carts: carts, all: check });
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
    const trade = orderService.createCartTrade(this.data.carts);
    const param = JSON.stringify(trade);
    Router.createTrade(param);
  },


  /**
   * 长按项目
   */
  onCartLongTap: function (e) {
    const cartId = e.currentTarget.dataset.cartId;
    wx.showModal({
      title: '删除商品',
      content: '是否删除该商品',
      showCancel: true,
      success: res => {
        if (res.confirm) {
          //UI渲染
          const carts = this.data.carts;
          for (let i in carts) {
            const cart = carts[i];
            if (cart.cart_id == cartId) {
              carts.splice(i, 1);
            }
          }

          this.setData({ carts: carts, isLoaded: true });
          this.setCheckedTotalNumAndPrice();
          //请求服务器
          cartService.remove(cartId).then(data => {

          });
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },

  /**
   * 查找购物车项目
   */
  findCartItemById: function (cartId) {
    const carts = this.data.carts;
    for (let i in carts) {
      const cart = carts[i];
      if (cart.cart_id == cartId) {
        return { index: i, cart: cart };
      }
    }
  },

  /**
   * 处理数量选择器请求
   */
  handleZanQuantityChange(e) {
    var cart_id = e.componentId;
    var num = e.quantity;
    const carts = this.data.carts;

    //页面渲染
    carts.forEach(cart => {
      if (cart.cart_id == cart_id) {
        cart.goods_num = num;
        this.setData({ carts: carts });
      }
    });
    this.setCheckedTotalNumAndPrice();

    //请求服务端
    cartService.update(cart_id, num).then(res => {
      //修改商品数量
    });
  }
}));