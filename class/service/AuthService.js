import Http from '../utils/Http';
const wxApi = require('../utils/wxApi');
const app = getApp();

/**
 * 权限服务类
 * 
 * 
 * 
 */
export default class AuthService {

    constructor() {
        this.publicUrl = app.globalData.publicUrl;
        this.baseUrl = this.publicUrl + '/customer';
    }


    /**
     * 获取JS_CODE
     */
    getWxJsCode() {
        return wxApi.wxLogin().then(res => {
            if (res.code == null && res.code == '') {
                return Promise.reject('用户登录js_code获取失败');
            }
            else {

                return res.code;
            }
        });
    }


    /**
     * 获取登录码
     */
    getLoginCode(jsCode) {
        const url = `${this.baseUrl}/auth/session`;
        const param = {
            code: jsCode,
            shop_code: app.globalData.shop.code
        };

        return Http.get(url, param).then(data => {
            console.info(`获取权限信息成功: login_code=${data.login_code}, third_session=${data.third_session}`);
            
            return data;
        });
    }


    /**
     * 获取用户信息
     */
    getWxUserInfo() {
        return wxApi.wxGetUserInfo();
    }


    /**
     * 检查用户信息完整性
     */
    checkUserInfo(user) {
        const url = `${this.baseUrl}/auth/check_userinfo`;
        const param = {
            rawData: rawUser.rawData,
            signature: rawUser.signature,
            thirdSession: rawUser.third_session
        };
        return Http.get(url, param);
    }


    /**
     * 检查微信登录状态
     */
    checkLoginStatus() {
        const user = wx.getStorageSync("user");
        if (user == "") {
            return Promise.reject('user不存在，尚未登录');
        }
        return wxApi.checkSession().then(res => {
            console.info('用户微信登录状态校验成功', user);
        }, err => err);
    }

    /**
     * 检查和服务器的会话
     */
    checkLoginCode() {
        const loginCode = wx.getStorageSync("login_code");
        if (loginCode == '') {
            return Promise.reject('login_code不存在');
        }

        const url = `${this.baseUrl}/auth/check_session`;
        const param = { login_code: loginCode };
        console.info('开始检查login_code', loginCode);
        return Http.get(url, param).then(code => {
            if (code === 'ok') {
                //校验成功
                console.info('用户服务端登录状态login_code校验成功');
                this.saveProperty('login_code', loginCode);
                return loginCode;
            }
            else {
                //校验失败
                this.cleanLoginInfo();
                return Promise.reject('login_code已过期');
            }
        });
    }

    /**
     * 保存loginCode
     */
    saveProperty(key, value) {
        app.globalData.auth[key] = value;
        wx.setStorageSync(key, value);
    }

    /**
     * 保存权限信息
     */
    saveAuthInfo(auth){
        this.saveProperty('third_session', auth.third_session);
        this.saveProperty('login_code', auth.login_code);
    }


    /**
     * 清理登录信息
     */
    cleanLoginInfo() {
        wx.removeStorageSync('user');
        wx.removeStorageSync('login_code');
    }


} 