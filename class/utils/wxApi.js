function wxPromisify(fn) {
  return function (obj = {}) {
    return new Promise((resolve, reject) => {
      obj.success = function (res) {
        //成功
        resolve(res)
      }
      obj.fail = function (res) {
        //失败
        reject(res)
      }
      fn(obj)
    })
  }
}
//无论promise对象最后状态如何都会执行
Promise.prototype.finally = function (callback) {
  let P = this.constructor;
  return this.then(
    value => P.resolve(callback()).then(() => value),
    reason => P.resolve(callback()).then(() => { throw reason })
  );
};
/**
 * 微信用户登录,获取code
 */
function wxLogin() {
  return wxPromisify(wx.login)();
}
/**
 * 获取微信用户信息
 * 注意:须在登录之后调用
 */
function wxGetUserInfo() {
  return wxPromisify(wx.getUserInfo)();
}
/**
 * 获取系统信息
 */
function wxGetSystemInfo() {
  return wxPromisify(wx.getSystemInfo)();
}

/**
 * 调起客户端小程序设置界面
 */
function wxOpenSetting() {
  return wxPromisify(wx.openSetting)();
}

/**
 * 检查客户端会话状态
 */
function checkSession() {
  return wxPromisify(wx.checkSession)();
}



/**
 * 检查客户端会话状态
 */
function wxPay(data) {
  return new Promise((resolve, reject) => {
    wx.requestPayment({
      timeStamp: data.timeStamp,
      nonceStr: data.nonceStr,
      package: data.package,
      signType: 'MD5',
      paySign: data.paySign,
      success: function(res){
        resolve(res);
      },
      fail: function(res) {
        reject(res);
      }
    });
  });
}



module.exports = {
  wxPromisify: wxPromisify,
  wxLogin: wxLogin,
  wxGetUserInfo: wxGetUserInfo,
  wxGetSystemInfo: wxGetSystemInfo,
  wxOpenSetting: wxOpenSetting,
  checkSession: checkSession,
  wxPay: wxPay

}