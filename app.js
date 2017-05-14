//app.js
import { Http } from "./class/utils/Http.js";
var wxApi = require('./class/utils/wxApi')
var wxRequest = require('./class/utils/wxRequest')
App({
  onLaunch: function () {
    this.checkLogin();
  },
  //检查登录状态
  checkLogin: function () {
    let thirdSessionId = wx.getStorageSync("thirdSessionId");
    let user = wx.getStorageSync("userInfo");
    if (thirdSessionId && user) {
      wxApi.checkSession().then(res => {
        this.globalData.userInfo = user;
        this.globalData.userId = user.id;
        return false;
      }).catch(res => {
        this.login();
      });
    }
    else {
      this.login();
    }
  },

  //用户登录
  login: function () {
    var thirdSessionId;
    var userInfo;
    wxApi.wxLogin().then(res => {
      if (!res.code) {
        console.error("用户登录js_code获取失败");
        console.info(res);
      }
      console.info(`js_code=${res.code}`);

      //请求服务端使用JS_CODE换取3rd_sessionId
      return wxRequest.getRequest(`${this.globalData.baseUrl}/customers/session`, { code: res.code });
    }).then(res => {
      thirdSessionId = res.data.data.sessionId;
      if (!thirdSessionId) {
        console.error("thirdSessionId获取失败");
        console.info(res);
      }
      console.info(`3rd_sessionId=${thirdSessionId}`);
      //缓存3rd_sessionId
      wx.setStorageSync('thirdSessionId', thirdSessionId);
      //获取用户信息
      return wxApi.wxGetUserInfo();
    }).then(res => {
      console.info(res);
      userInfo = res;
      let param = {
        rawData: res.rawData,
        signature: res.signature,
        sessionId: thirdSessionId
      };
      //检验用户信息完整性
      return wxRequest.getRequest(`${this.globalData.baseUrl}/customers/checkUserInfo`, param);
    }).then(res => {
      if (!res.data.data.checkPass) {
        console.error("数据完整性验证失败");
        console.info(res);
      }
      let param = {
        encryptedData: userInfo.encryptedData,
        iv: userInfo.iv,
        sessionId: thirdSessionId
      };
      //请求服务端解密数据
      return wxRequest.getRequest(`${this.globalData.baseUrl}/customers/decodeUserInfo`, param);
    }).then(res => {
      //解密成功，缓存数据
      var user = res.data.data;
      console.info(user);

      this.globalData.userInfo = user;
      wx.setStorageSync("userInfo", user);

      //临时user_id
      this.globalData.userId = user.id;
    }).catch(err => {
      console.error('登录错误', err);
    }).finally(res => {
      console.log('finally~')
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