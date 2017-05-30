//app.js
import { Http } from "./class/utils/Http.js";
var wxApi = require('./class/utils/wxApi')
var wxRequest = require('./class/utils/wxRequest')
App({
  onLaunch: function () {
    this.checkLogin()
      .then(this.checkSession)
      .then(this.userInit)
      .catch(() => {
        this.userLogin()
          .then(this.getSession)
          .then(this.getUserInfo)
          .then(this.checkUserInfo)
          .then(this.decodeUserInfo);
      });
  },

  /**
   * 检查和服务器的会话
   */
  checkSession: function (user) {
    const sessionId = wx.getStorageSync("session_id");
    const url = `${this.globalData.baseUrl}/auth/checkSession`;
    const param = { wxLoginCode: sessionId };
    return new Promise((resolve, reject) => {
      wxRequest.getRequest(url, param).then(res => {
        const result = res.data.data;
        if(result == 'ok'){
          resolve(user);
        }
        else{
          //清理缓存信息
          console.info('登录信息失效');
          wx.removeStorageSync('session_id');
          wx.removeStorageSync('userInfo');
          reject();
        }
      });
    });
  },

  /**
   * 检查登录状态
   */
  checkLogin: function () {
    console.info('检查用户登录情况');
    return new Promise((resolve, reject) => {
      const user = wx.getStorageSync("userInfo");
      if (user) {
        wxApi.checkSession().then(res => {
          resolve(user);
        }, reject);
      }
      else {
        reject();
      }
    });
  },

  /**
   * 初始化用户信息
   */
  userInit: function (user) {
    console.info('用户已登录成功', user)
    this.globalData.userInfo = user;
    this.globalData.userId = user.id;
  },

  /**
   * 用户登录请求
   */
  userLogin: function () {
    console.info('用户尚未登录，获取用户js_code');
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

  /**
   * 获取3rd_session
   */
  getSession: function (jsCode) {
    console.info('获取用户thirdSessionId');
    return new Promise((resolve, reject) => {
      let url = `${this.globalData.baseUrl}/auth/session`;
      let param = { code: jsCode };

      wxRequest.getRequest(url, param).then(res => {
        let thirdSessionId = res.data.data.sessionId;
        if (!thirdSessionId) {
          reject("thirdSessionId获取失败");
        }
        else {
          console.info(`thirdSessionId=${thirdSessionId}`);
          //缓存3rd_sessionId
          //wx.setStorageSync('thirdSessionId', thirdSessionId);
          resolve(thirdSessionId);
        }
      }, reject);
    });
  },

  /**
   * 获取用户信息
   */
  getUserInfo: function (thirdSessionId) {
    console.info('获取用户基本信息');
    return new Promise((resolve, reject) => {
      wxApi.wxGetUserInfo().then(res => {
        res["thirdSessionId"] = thirdSessionId;
        resolve(res);
      }, reject);
    });
  },

  /**
   *检查用户信息完整性
   */
  checkUserInfo: function (rawUser) {
    console.info('检查用户信息完整性', rawUser);
    return new Promise((resolve, reject) => {
      let url = `${this.globalData.baseUrl}/auth/checkUserInfo`;
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

  /**
   *解密并保存用户信息
   */
  decodeUserInfo: function (rawUser) {
    console.info('解密并保存用户信息');
    return new Promise((resolve, reject) => {
      const url = `${this.globalData.baseUrl}/auth/decodeUserInfo`;
      const param = {
        encryptedData: rawUser.encryptedData,
        iv: rawUser.iv,
        sessionId: rawUser.thirdSessionId
      };
      //请求服务端解密数据
      wxRequest.getRequest(url, param).then(res => {
        //解密成功，缓存数据
        const user = res.data.data.user;
        const sessionId = res.data.data.session_id;
        if (user) {
          console.info('用户解密信息:', user);
          console.info('session_id', sessionId);
          this.globalData.userInfo = user;
          this.globalData.userId = user.id;
          wx.setStorageSync("userInfo", user);
          wx.setStorageSync("session_id", sessionId);
        }
        else {
          console.error("用户信息解密失败", res);
        }
      }, reject);
    });
  },

  globalData: {
    //购物车缓存
    cart: {
      init: false,
      reload: false,
      num: 0
    },

    order: {
      reload: false
    },

    //用户缓存
    userInfo: {},
    userId: null,

    //店铺缓存
    shop: null,
    shopId: "3",
    shopName: '连江海蜇专卖',

    //API地址
    baseUrl: "http://192.168.31.124:9999/v1/customer",
    //baseUrl: "http://leshare.shop:9999/v1/customer"
  }
});