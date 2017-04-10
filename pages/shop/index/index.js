import { Http } from "../../../class/utils/Http.js";
var app = getApp();

Page({
  data: {
    shop: {},
    goods: [],
    notice: [],
    start: 0,
    count: 10
  },
  onLoad: function (options) {
    let shopId = app.globalData.lastShopId;
    let baseUrl = app.globalData.baseUrl;

    //请求店铺基本信息
    Http.get(`${baseUrl}/shops/${shopId}`, (data) => {
      this.setData({ shop: data });
    });

    //请求公告信息
    Http.get(`${baseUrl}/shops/${shopId}/notices/shows`, (data) => {
      this.setData({ notice: data[0] });
    });

    //请求加载商品
    this.loadNextPage();
  },
  
  /**
   * 点击商品
   */
  onGoodsItemTap: function (event) {
    let goodsId = event.currentTarget.dataset.goodsId;
    wx.navigateTo({
      url: "/pages/goods/index/index?goodsId=" + goodsId
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
   * 下拉刷新
   */
  onReachBottom: function (event) {
    this.loadNextPage();
  },

  /**
   * 加载下一页
   */
  loadNextPage: function () {
    wx.showNavigationBarLoading();
    //请求店铺商品信息
    let url = `${app.globalData.baseUrl}/shops/${app.globalData.lastShopId}/goods`;
    let param = {
      from: this.data.start,
      limit: this.data.count
    };
    console.info("开始请求--->");
    console.info(url);
    console.info(param);
    Http.get(url, param, (data) => {
      console.info("请求成功--->");
      console.info(data);
      for (let i in data) {
        var item = data[i];
        //对数据做一些处理
        this.processGoodsData(item);
      }
      //视图刷新
      var goods = this.data.goods;
      goods = goods.concat(data);
      this.setData({ goods: goods });
      //移动到下一页
      this.data.start += this.data.count;
      wx.hideNavigationBarLoading();
    });
  },

  /* 处理商品信息 */
  processGoodsData: function (item) {
    console.info("处理商品信息--->");
    console.info(item);
    //结构赋值
    var {name, sell_price, original_price, images} = item;

    //长名字处理
    if (name.length > 12) {
      item.name = name.substring(0, 12) + "...";
    }

    //销售价处理
    if (original_price == null || original_price == 0) {
      item.original_price = sell_price;
    }

    //图片处理
    if (images == null || images.length < 1) {
      item.imageUrl = "/images/goods/mock.png";
    }
    else if (images[0].url == null) {
      item.imageUrl = "/images/goods/mock.png";
    }
    else {
      item.imageUrl = images[0].url;
    }
  }
});