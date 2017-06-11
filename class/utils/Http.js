import Tips from '../utils/Tips';

const app = getApp();

// HTTP工具类
export default class Http {

    constructor() {
    }


    static request(method, url, data) {
        return new Promise((resolve, reject) => {
            const header = this.createAuthHeader();
            wx.request({
                url: url,
                method: method,
                header: header,
                data: data,
                success: (res) => {
                    //微信状态校验
                    const wxCode = res.statusCode;
                    if (wxCode != 200) {
                        console.error('服务端请求错误', res);
                        this.handleHttpException(res);
                        reject(res);
                    }
                    else {
                        //服务端状态校验
                        const wxData = res.data;
                        const code = wxData.code;
                        if (code != 0) {
                            console.error('服务端业务错误', res);
                            reject(res);
                        }
                        else {
                            //服务端的内部数据
                            const serverData = wxData.data;
                            resolve(serverData);
                        }
                    }
                },
                fail: (res) => {
                    console.error('网络请求发起失败');
                    reject(res);
                }
            });
        });
    }

    /**
     * 错误处理器
     */
    static handleHttpException(res) {
        const status = res.statusCode;
        switch (status) {
            case 403:
                this.handleHttp403Exception(res);
                break;
            case 500:
                this.handleHttp500Exception(res);
                break;
            default:
                console.info('其他错误', res);

        }
    }

    /**
     * 403无权限错误
     */
    static handleHttp403Exception(res) {
        //需要区分两403之间的区别
        console.error(`403-权限错误：${res.data.message}`);
    }

    /**
     * 500内部错误
     */
    static handleHttp500Exception(res) {
        console.error(`500-服务器内部错误：${res.data.message}`);
    }

    /**
     * 构造权限头部
     */
    static createAuthHeader() {
        const loginCode =  app.globalData.auth.login_code;
        var header = {};
        if (loginCode) {
            header["login_code"] = loginCode;
        }
        return header;
    }

    static get(url, data) {
        return this.request("GET", url, data);
    }

    static put(url, data) {
        return this.request("PUT", url, data);
    }

    static post(url, data) {
        return this.request("POST", url, data);
    }

    static patch(url, data) {
        return this.request("PATCH", url, data);
    }

    static delete(url, data) {
        return this.request("DELETE", url, data);
    }

}