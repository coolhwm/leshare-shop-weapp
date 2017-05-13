//app.js
import { Http } from "./class/utils/Http.js";
App({
  onLaunch: function () {
    //尚未登录则启动登录程序
    this.checkLogin();

  },
  checkLogin: function () {
    let thirdSessionId = wx.getStorageSync("thirdSessionId");
    if (thirdSessionId && this.globalData.userId) {
      wx.checkSession({
        success: function () {
          return false;
        },
        fail: function () {
          this.login();
        }
      })
    }
    else {
      this.login();
    }
  },
  login: function () {
    let url_3rdSession = `http://192.168.31.124:9999/api/v1/wx/getSession`;
    let url_checkUserInfo = "http://192.168.31.124:9999/api/v1/wx/checkUserInfo";
    let url_decodeData = "http://192.168.31.124:9999/api/v1/wx/decodeUserInfo";


    //用户登录，获取JS_CODE
    wx.login({
      success: (res) => {
        if (!res.code) {
          console.error("用户登录js_code获取失败");
          console.info(res);
        }
        console.info(`js_code=${res.code}`);

        //请求服务端使用JS_CODE换取3rd_sessionId
        Http.get(url_3rdSession, { code: res.code }, data => {
          var thirdSessionId = data.data.sessionId;
          if (!thirdSessionId) {
            console.error("thirdSessionId获取失败");
            console.info(data);
          }
          console.info(`3rd_sessionId=${thirdSessionId}`);
          //缓存3rd_sessionId
          wx.setStorageSync('thirdSessionId', thirdSessionId);

          //获取用户信息
          wx.getUserInfo({
            success: user => {
              console.info(user);

              //检查数据完整性
              let param = {
                rawData: user.rawData,
                signature: user.signature,
                sessionId: thirdSessionId
              };

              Http.get(url_checkUserInfo, param, data => {
                if (!data.data.checkPass) {
                  console.error("数据完整性验证失败");
                  console.info(data);
                }

                //请求服务端解密数据
                let param = {
                  encryptedData: user.encryptedData,
                  iv: user.iv,
                  sessionId: thirdSessionId
                };

                Http.get(url_decodeData, param, data => {
                  console.info(data);
                  //解密成功，缓存数据
                  this.globalData.userInfo = JSON.parse(data.data);

                  //临时user_id
                  this.globalData.userId = 1;
                });
              });
            }
          });
        });
      }
    });
  },
  globalData: {
    isReloadOrderList: false,
    userInfo: {},
    userId: null,
    shopId: "3",
    baseUrl: "http://leshare.shop:9999/v1/customer",
    imgUrl: "http://115.28.93.210"
  }
});