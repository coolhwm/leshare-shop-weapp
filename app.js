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
    this.userLogin()
      .then(this.getSession)
      .then(this.getUserInfo)
      .then(this.checkUserInfo)
      .then(this.decodeUserInfo);
  },


  userLogin: function () {
    return new Promise((resolve, reject) => {
      wxApi.wxLogin().then(res => {
        if (!res.code) {
          reject("用户登录js_code获取失败");
        }
        else {
          console.info(`js_code=${res.code}`);
          resolve(res.code);
        }
      }, reject);
    });
  },

  getSession: function (jsCode) {
    return new Promise((resolve, reject) => {
      let url = `${this.globalData.baseUrl}/customers/session`;
      let param = { code: jsCode };

      wxRequest.getRequest(url, param).then(res => {
        let thirdSessionId = res.data.data.sessionId;
        if (!thirdSessionId) {
          reject("thirdSessionId获取失败");
        }
        else {
          console.info(`3rd_sessionId=${thirdSessionId}`);
          //缓存3rd_sessionId
          wx.setStorageSync('thirdSessionId', thirdSessionId);
          resolve(thirdSessionId);
        }
      }, reject);
    });
  },

  getUserInfo: function (thirdSessionId) {
    return new Promise((resolve, reject) => {
      wxApi.wxGetUserInfo().then(res => {
        res["thirdSessionId"] = thirdSessionId;
        resolve(res);
      }, reject);
    });
  },

  checkUserInfo: function (rawUser) {
    return new Promise((resolve, reject) => {
      let url = `${this.globalData.baseUrl}/customers/checkUserInfo`;
      let param = {
        rawData: rawUser.rawData,
        signature: rawUser.signature,
        sessionId: rawUser.thirdSessionId
      };
      wxRequest.getRequest(url, param).then(res => {
        if (!res.data.data.checkPass) {
          reject("数据完整性验证失败");
        }
        else {
          resolve(rawUser);
        }
      }, reject);

    });
  },

  decodeUserInfo: function (rawUser) {
    return new Promise((resolve, reject) => {
      let url = `${this.globalData.baseUrl}/customers/decodeUserInfo`;
      let param = {
        encryptedData: rawUser.encryptedData,
        iv: rawUser.iv,
        sessionId: rawUser.thirdSessionId
      };
      //请求服务端解密数据
      wxRequest.getRequest(url, param).then(res => {
        //解密成功，缓存数据
        var user = res.data.data;
        console.info(user);
        this.globalData.userInfo = user;
        wx.setStorageSync("userInfo", user);
        //临时user_id
        this.globalData.userId = user.id;
      }, reject);
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