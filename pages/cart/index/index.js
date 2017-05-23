import CartService from "../../../class/service/CartService";
var Quantity = require('../../../templates/quantity/index');
const cartService = new CartService();
Page(Object.assign({}, Quantity, {

  /**
   * 页面的初始数据
   */
  data: {
    carts: []
  },
  onLoad: function (options) {
    cartService.page().then(res => {
      this.setData({ carts: res });
    });
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

          this.setData({ carts: carts });

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

    //请求服务端
    cartService.update(cart_id, num).then(res => {
      //修改商品数量
    });
  }
}));