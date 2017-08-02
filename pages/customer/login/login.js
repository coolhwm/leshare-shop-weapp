import ShopService from "../../../class/service/ShopService";
import AuthService from "../../../class/service/AuthService";
import Router from "../../../class/utils/Router";
import Tips from "../../../class/utils/Tips";

const authService = new AuthService();
const shopService = new ShopService();
Page({

  data: {
    shop: {}
  },

  onLoad: function (options) {
    shopService.getInfo().then(data => {
      this.setData({ shop: data });
    });
    authService.cleanLoginInfo();
  },

  confirm: function ({detail}) {
    console.info('user login:', detail);
    const rawUser = detail;
    Tips.loading();
    authService.getWxJsCode()
      .then(jsCode => authService.getLoginCode(jsCode))
      .then(auth => authService.saveAuthInfo(auth))
      .then(() => authService.decodeUserInfo(rawUser))
      .then(user => authService.saveUserInfo(user))
      .then(() => {
        Tips.loaded();
        Tips.toast('授权成功', ()=> wx.reLaunch({url: '/pages/shop/index/index'}));
      }).catch(() => {
        Tips.loaded();
        Tips.error('授权失败');
      }).finally(() => {
        Tips.loaded();
      });
  },

  back: function (e) {
    wx.reLaunch({url: '/pages/shop/index/index'});
  }

})