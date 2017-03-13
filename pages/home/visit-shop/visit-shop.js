import {Http} from "../../../class/utils/Http.js";
var app = getApp();

Page({
  data: {
    shops: []
  },

  onLoad: function (options) {
    
    var userId = app.globalData.userId;
    var baseUrl = app.globalData.baseUrl;

    //请求历史店铺
    wx.request({
      url: `${baseUrl}/customers/${userId}/visit_shops`,
      success: (res) => {
        this.setData({ shops: res.data });
      }
    });
  },
  // 点击项目
  onShopItemTap: function (event) {
    var shopId = event.currentTarget.dataset.shopId;
    wx.switchTab({
      url: `/pages/shop/index/index`,
      //写入访问
      success : (res) => {
          var visitUrl = `${app.globalData.baseUrl}/customers/${app.globalData.userId}/visit_shops`;
          Http.post(visitUrl, {shop_id : shopId}, (data)=>{
            console.info(`[shop] visit shop ${shopId} success!`);
          });
          //利用全局变量暂存
          app.globalData.lastShopId = shopId;
      }
    });
  }

});