//app.js
App({
  onLaunch: function () {

    //用户登录
    wx.login({
      success: (res) => {
        if (res.code) {
          console.log('获取用户登录态成功！' + res.code);

          wx.getUserInfo({
            success: (res) => {
              console.info(res);
              var userInfo = res.userInfo;
              this.globalData.userInfo = userInfo;
            }
          });

        } else {
          console.log('获取用户登录态失败！' + res.errMsg);
        }
      }
    });
  },
  globalData: {
    isReloadOrderList: false,
    userInfo : {},
    userId: 1,
    lastShopId: "",
    baseUrl: "http://leshare.shop:9999/v1/customer",
    imgUrl: "http://115.28.93.210"
  }
});