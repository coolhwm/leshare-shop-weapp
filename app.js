//app.js
import { Http } from "./class/utils/Http.js";
App({
  onLaunch: function () {

    //用户登录
    wx.login({
      success: (res) => {
        if (res.code) {
          var getSessionUrl = `http://192.168.31.124:9999/api/v1/wx/getSession?code=${res.code}`;
          console.log(`请求获取session，url:${getSessionUrl}`);


          //请求服务端获取
          Http.get(getSessionUrl, data => {
            var thirdSessionId = data.data.sessionId;
            console.info(`3rd_sessionId=${thirdSessionId}`);


            //获取用户信息
            wx.getUserInfo({
              success: function (user) {
                var checkUserInfoUrl = "http://192.168.31.124:9999/api/v1/wx/checkUserInfo";
                //检查数据完整性
                Http.get(checkUserInfoUrl, {
                  rawData: user.rawData,
                  signature: user.signature,
                  sessionId: thirdSessionId
                }, function (data) {
                  console.log(data);
                });
              }
            });
          });



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
    userInfo: {},
    userId: 1,
    lastShopId: "",
    baseUrl: "http://leshare.shop:9999/v1/customer",
    imgUrl: "http://115.28.93.210"
  }
});