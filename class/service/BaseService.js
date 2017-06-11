import Http from '../utils/Http';
const app = getApp();
const wxApi = require('../utils/wxApi');

/**
 * 基础服务类
 */
export default class BaseService {

    constructor() {

        //路径信息
        this.baseUrl = app.globalData.baseUrl;
        this.publicUrl = app.globalData.publicUrl;
        //店铺信息
        this.shopName = app.globalData.shop.name;
        //微信支付
        this.wxpay = wxApi.wxPay;
        //全局对象
        this.app = app;

        //网络请求
        this.get = Http.get.bind(Http);
        this.post = Http.post.bind(Http);
        this.patch = Http.patch.bind(Http);
        this.delete = Http.delete.bind(Http);
        this.put = Http.put.bind(Http);
    }

}