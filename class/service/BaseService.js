const app = getApp();
const wxRequest = require('../utils/wxRequest');


/**
 * 基础服务类
 */
export default class BaseService{

    constructor(){
        this.baseUrl = app.globalData.baseUrl;
        this.shopId = app.globalData.shopId;
        this.shopName = app.globalData.shopName;
        this.get = wxRequest.getRequest;
        this.post = wxRequest.postRequest;
    }

}