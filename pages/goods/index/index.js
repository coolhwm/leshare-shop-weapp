import { Http } from "../../../class/utils/Http.js";
var app = getApp();

Page({
  data: {
    goods: {},
    shop: {}
  },
  onLoad: function (options) {
    let shopId = app.globalData.shopId;
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
  },

  /**
   * 点击店铺
   */
  onShopItemTap: function (event) {
    let shopId = event.currentTarget.dataset.shopId;
    wx.navigateTo({
      url: `/pages/shop/detail/detail?shopId=${shopId}`
    });
  },

  /**
   * 购买
   */
  onBuyTap: function(event) {
    let goods = this.data.goods;
    //构造交易对象
    var trade = {
      status_text: "待确认",
      deal_price: goods.original_price,
      final_price: goods.sell_price,
      address_id: "1",
      payment_type: "0",
      message: "",
      orderGoodsInfos: [
        {
          goods_id: goods.id,
          goods_name: goods.name,
          image_url: goods.images[0].url,
          goods_price: goods.sell_price,
          count: "1"
        }
      ],
      shop_name: this.data.shop.name
    };
    let param = JSON.stringify(trade);
    wx.navigateTo({
      url : `/pages/order/trade/trade?trade=${param}`
    });
  }
});