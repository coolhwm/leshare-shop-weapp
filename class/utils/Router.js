const app = getApp();
const notification = require("./WxNotificationCenter.js");
/**
 * 路由导航
 */
export default class Router {
    constructor() {
        this.shopId = app.globalData.shopId;
    }

    //商品详情
    static goodsIndex(goodsId) {
        this.goto(`/pages/goods/index/index?goodsId=${goodsId}`);
    }

    static goodsIndexRedirect(goodsId) {
        this.redirectTo(`/pages/goods/index/index?goodsId=${goodsId}`);
    }

    //店铺详情
    static shopDetail() {
        this.goto(`/pages/shop/detail/detail?shopId=${this.shopId}`);
    }
    //创建订单
    static createTrade(trade) {
        this.goto(`/pages/order/trade/trade?trade=${trade}`);
    }


    //订单列表（刷新）
    static orderIndexRefresh() {
        notification.postNotificationName("ON_ORDER_UPDATE");
        this.orderIndex();
    }

    //订单列表
    static orderIndex() {
        wx.switchTab({
            url: "/pages/order/index/index"
        });
    }
    //订单详情
    static orderDetail(orderId) {
        this.goto(`/pages/order/detail/detail?orderId=${orderId}`);
    }
    //订单详情（跳转）
    static orderDetailRedirect(orderId) {
        notification.postNotificationName("ON_ORDER_UPDATE");
        this.redirectTo(`/pages/order/detail/detail?orderId=${orderId}`);
    }
    //订单物流信息
    static orderTrace(order) {
        this.goto(`/pages/order/trace/trace?order=${order}`);
    }

    /**
     * 退款页面
     */
    static refundApply(refund){
        this.goto(`/pages/refund/apply/apply?refund=${refund}`);
    }

    /**
     * 退款详情页面
     */
    static refundDetail(refund){
         this.goto(`/pages/refund/detail/detail?refund=${refund}`);
    }

    //购物车
    static cartIndex() {
        const cache = app.globalData.order;
        wx.switchTab({
            url: "/pages/cart/index/index"
        });
    }

    /**
     * 地址列表(跳转)
     */
    static addressIndexRedirect(reload = false) {
        this.redirectTo(`/pages/address/index/index?reload=${reload}`);
    }

    /**
    * 地址列表
    */
    static addressIndex(mode = 'none') {
        this.goto(`/pages/address/index/index?mode=${mode}`);
    }

    /**
     * 地址详情页面
     */
    static addressEdit(address) {
        this.goto(`/pages/address/edit/edit?addr=${address}`);
    }

    /**
     * 选择优惠券
     */
    static couponsUse(coupons){
        this.goto(`/pages/coupon/use/use?coupons=${coupons}`);
    }


   

    static goto(url) {
        wx.navigateTo({
            url: url
        });
    }

    static redirectTo(url) {
        wx.redirectTo({
            url: url
        });
    }

    //返回一次
    static back() {
        wx.navigateBack({
            delta: 1,
        });
    }
}