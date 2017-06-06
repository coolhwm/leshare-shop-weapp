const wxApi = require('./class/utils/wxApi');
const wxRequest = require('./class/utils/wxRequest');

App({
  onLaunch: function () {
    //URL初始化
    this.globalData.baseUrl = this.globalData.publicUrl + '/customer';

    //登录初始化
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
   * 检查登录状态
   */
  checkLogin: function () {
    console.info('检查用户登录情况');
    return new Promise((resolve, reject) => {
      const user = wx.getStorageSync("user");
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
   * 检查和服务器的会话
   */
  checkSession: function (user) {
    const loginCode = wx.getStorageSync("login_code");
    const url = `${this.globalData.baseUrl}/auth/check_session`;
    const param = { login_code: loginCode };
    console.info('开始检查服务端会话', param);
    return new Promise((resolve, reject) => {
      wxRequest.getRequest(url, param).then(res => {
        console.info('服务端返回：', res);
        const result = res.data.data;
        if (result == 'ok') {
          resolve(user);
        }
        else {
          //清理缓存信息
          console.info('登录信息失效');
          wx.removeStorageSync('login_code');
          wx.removeStorageSync('user');
          reject();
        }
      }, res => {
        console.error(res);
      });
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
    console.info('获取用户认证信息：thirdSessionId/loginCode');
    return new Promise((resolve, reject) => {
      const url = `${this.globalData.baseUrl}/auth/session`;
      const param = {
        code: jsCode,
        shop_code: this.globalData.shop.code
      };
      wxRequest.getRequest(url, param).then(res => {
        if (res.data.errorCode == 1 && res.data.data) {
          reject("认证信息获取失败");
        }
        else {
          const auth = res.data.data;
          this.saveAuthInfo(auth);
          resolve(auth);
        }
      }, reject);
    });
  },

  /**
   * 获取用户信息
   */
  getUserInfo: function (auth) {
    console.info('获取用户基本信息');
    return new Promise((resolve, reject) => {
      wxApi.wxGetUserInfo().then(res => {
        res["third_session"] = auth.third_session;
        res["login_code"] = auth.login_code;
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
      const url = `${this.globalData.baseUrl}/auth/check_userinfo`;
      const param = {
        rawData: rawUser.rawData,
        signature: rawUser.signature,
        thirdSession: rawUser.third_session
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
      const url = `${this.globalData.baseUrl}/auth/decode_userinfo`;
      const param = {
        encryptedData: rawUser.encryptedData,
        iv: rawUser.iv,
        thirdSession: rawUser.third_session
      };
      //请求服务端解密数据
      wxRequest.getRequest(url, param).then(res => {
        //解密成功，缓存数据
        const user = res.data.data.user;
        if (user) {
          this.saveUserInfo(user);
        }
        else {
          console.error("用户信息解密失败", res);
        }
      }, reject);
    });
  },

  /**
   * 保存认证信息
   */
  saveAuthInfo: function (auth) {
    console.info('认证信息：', auth);
    this.globalData.auth = auth;
    wx.setStorageSync('login_code', auth.login_code);
  },

  /**
   * 保存用户信息
   */
  saveUserInfo: function (user) {
    console.info('用户解密信息:', user);
    this.globalData.user = user;
    wx.setStorageSync("user", user);
  },

  globalData: {
    //购物车缓存
    cart: { num: 0 },
    order: { reload: false },
    //用户缓存
    user: {},
    //权限缓存
    auth: {},
    //店铺缓存
    shop: {
      code: 'iGsAJQYzB00GX832ZnaZwxjdRz7YEQXa',
      name: '连江海蜇专卖',
    },
    //API地址
    publicUrl: "http://192.168.31.124:9999/v1",
    //publicUrl: "http://leshare.shop:9999/v1",
  }
});