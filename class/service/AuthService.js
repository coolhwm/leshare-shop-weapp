import Http from '../utils/Http';
const wxApi = require('../utils/wxApi');
const app = getApp();

/**
 * 权限服务类
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
        console.info('获取用户信息');
        return wxApi.wxGetUserInfo();
    }


    /**
     * 检查用户信息
     */
    checkUserInfo(rawUser) {
        console.info('校验用户信息完整性');
        const url = `${this.baseUrl}/auth/check_userinfo`;
        const third_session = app.globalData.auth.third_session;
        const param = {
            rawData: rawUser.rawData,
            signature: rawUser.signature,
            thirdSession: third_session
        };
        return Http.get(url, param).then(data => {
            return data.checkPass ? rawUser : Promise.reject('用户信息完整性校验失败');
        });
    }

    /**
     * 解密用户数据
     */
    decodeUserInfo(rawUser) {
        const url = `${this.baseUrl}/auth/decode_userinfo`;
        const third_session = app.globalData.auth.third_session;
        const param = {
            encryptedData: rawUser.encryptedData,
            iv: rawUser.iv,
            thirdSession: third_session
        };
        return Http.get(url, param).then(data => data.user);
    }



    /**
     * 检查微信登录状态
     */
    checkLoginStatus() {
        const user = wx.getStorageSync("user");
        if (user == "") {
            return Promise.reject('user不存在，尚未登录');
        }
        return wxApi.checkSession().then(res => user, err => err);
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
        return Http.get(url, param).then(data => {
            if (data.result === 'SUCCESS') {
                //校验成功
                console.info('用户服务端登录状态login_code校验成功');
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
    saveAuthProperty(key, value) {
        app.globalData.auth[key] = value;
        wx.setStorageSync(key, value);
    }

    

    /**
     * 保存权限信息
     */
    saveAuthInfo(auth) {
        console.info('权限信息：', auth);
        this.saveAuthProperty('third_session', auth.third_session);
        this.saveAuthProperty('login_code', auth.login_code);
    }

    /**
     * 保存用户信息
     */
    saveUserInfo(user){
        console.info('用户信息', user);
        wx.setStorageSync('user', user);
        app.globalData.user = user;
    }


    /**
     * 清理登录信息
     */
    cleanLoginInfo() {
        wx.removeStorageSync('user');
        wx.removeStorageSync('login_code');
        wx.removeStorageSync('third_session');
    }


} 