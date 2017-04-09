import { Http } from "../../../class/utils/Http.js";
var app = getApp();

Page({
  data: {
    goods: {},
    shop: {},
    details: []
  },
  onLoad: function (options) {
    let shopId = app.globalData.lastShopId;
    let userId = app.globalData.userId;
    let baseUrl = app.globalData.baseUrl;
    let baseImgUrl = app.globalData.imgUrl;
    let goodsId = options.goodsId;

    //请求店铺基本信息
    Http.get(`${baseUrl}/shops/${shopId}`, (data) => {
      this.setData({ shop: data });
    });


    //获取商品信息
    Http.get(`${baseUrl}/shops/${shopId}/goods/${goodsId}`, data => {
      this.setData({ goods: data });
    });

    //获取商品详情
    Http.get(`${baseUrl}/shops/${shopId}/goods/${goodsId}/details`, data => {
      this.setData({ details: data });
    });
  },

  /* 点击店铺 */
  onShopItemTap: function (event) {
    let shopId = event.currentTarget.dataset.shopId;
    wx.navigateTo({
      url: `/pages/shop/detail/detail?shopId=${shopId}`
    });
  }
})