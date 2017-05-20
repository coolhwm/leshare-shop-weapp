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

function createAuthHeader() {
  //需要进行缓存
  let sessionId = wx.getStorageSync("thirdSessionId");
  let user = wx.getStorageSync("userInfo");
  var header = {};
  header["3rdSession"] = sessionId;
  header["customer_id"] = user.id;
  return header;
}


/**
 * 微信请求get方法
 * url
 * data 以对象的格式传入
 */
function getRequest(url, data) {
  var getRequest = wxPromisify(wx.request)
  return getRequest({
    url: url,
    method: 'GET',
    data: data,
    header: createAuthHeader()
  })
}

/**
 * 微信请求post方法封装
 * url
 * data 以对象的格式传入
 */
function postRequest(url, data) {
  var postRequest = wxPromisify(wx.request)
  return postRequest({
    url: url,
    method: 'POST',
    data: data,
    header: createAuthHeader()
  })
}

/**
 * 微信请求post方法封装
 * url
 * data 以对象的格式传入
 */
function patchRequest(url, data) {
  var patchRequest = wxPromisify(wx.request)
  return patchRequest({
    url: url,
    method: 'PATCH',
    data: data,
    header: createAuthHeader()
  })
}

module.exports = {
  postRequest: postRequest,
  getRequest: getRequest,
  patchRequest: patchRequest
}