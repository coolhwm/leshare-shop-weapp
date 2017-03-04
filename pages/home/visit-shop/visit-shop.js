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
    //利用全局变量暂存
    app.globalData.lastShopId = shopId;
    wx.switchTab({
      url: `/pages/shop/index/index`,
      success : (res) => {
          //写入访问记录
          wx.request({
            url: `${app.globalData.baseUrl}/customers/${app.globalData.userId}/visit_shops?shop_id=${shopId}`,
            method : "POST",
            success: (res) => {
              console.info(`[shop] visit shop ${shopId} success!`);
            }
          });

      }
    });
  }

});