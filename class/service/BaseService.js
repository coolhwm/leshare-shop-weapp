const app = getApp();
const wxRequest = require('../utils/wxRequest');
const wxApi = require('../utils/wxApi');

/**
 * 基础服务类
 */
export default class BaseService {

    constructor() {
        this.baseUrl = app.globalData.baseUrl;
        this.publicUrl = app.globalData.publicUrl;
        this.shopName = app.globalData.shop.name;
        this.get = wxRequest.getRequest;
        this.post = wxRequest.postRequest;
        this.patch = wxRequest.patchRequest;
        this.delete = wxRequest.deleteRequest;
        this.put = wxRequest.putRequest;
        this.wxpay = wxApi.wxPay;
        this.app = app;
    }

}