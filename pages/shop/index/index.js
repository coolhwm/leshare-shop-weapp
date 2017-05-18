import { Http } from "../../../class/utils/Http.js";
import ShopService from "../../../class/service/ShopService";
import GoodsService from "../../../class/service/GoodsService"; 
import Pagination from "../../../class/utils/Page"; 

const app = getApp();
const shopService = new ShopService();

Page({
  data: {
    shop: {},
    goods: [],
    notice: [],
    start: 0,
    count: 10
  },
  onLoad: function (options) {
    //请求店铺基本信息
    shopService.getInfo().then(data => {
      this.setData({ shop: data });
    })

    //请求公告信息
    shopService.getNotice().then(data => {
      this.setData({ notice: data[0] });
    });

    //请求加载商品
    this.loadNextPage();
  },

  /**
  * 下拉刷新
  */
  onPullDownRefresh: function () {
    this.clearData();
    this.loadNextPage();
    wx.stopPullDownRefresh();
  },

  /**
   * 清除数据
   */
  clearData: function () {
    this.setData({
      start: 0,
      count: 10,
      goods: []
    });
  },


  

  /**
   * 点击商品
   */
  onGoodsItemTap: function (event) {
    const goodsId = event.currentTarget.dataset.goodsId;
    wx.navigateTo({
      url: "/pages/goods/index/index?goodsId=" + goodsId
    });
  },

  /**
   * 点击店铺
   */
  onShopItemTap: function (event) {
    const shopId = event.currentTarget.dataset.shopId;
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
    let url = `${app.globalData.baseUrl}/shops/${app.globalData.shopId}/goods`
    const page = new Pagination(url, this.processGoodsData);
    page.next().then(data =>{
      console.info('分页信息查询结果', data);
      this.setData(
        {
          goods: data.list,
          start: data.start,
          countL: data.count
        }
      );
    });


    // wx.showNavigationBarLoading();
    // //请求店铺商品信息
    // let url = `${app.globalData.baseUrl}/shops/${app.globalData.shopId}/goods`;
    // let param = {
    //   from: this.data.start,
    //   limit: this.data.count
    // };
    // console.info("开始请求--->");
    // console.info(url);
    // console.info(param);
    // Http.get(url, param, (data) => {
    //   console.info("请求成功--->");
    //   console.info(data);
    //   for (let i in data) {
    //     var item = data[i];
    //     //对数据做一些处理
    //     this.processGoodsData(item);
    //   }
    //   //视图刷新
    //   var goods = this.data.goods;
    //   goods = goods.concat(data);
    //   this.setData({ goods: goods });
    //   //移动到下一页
    //   this.data.start += this.data.count;
    //   wx.hideNavigationBarLoading();
    // });
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