const app = getApp();

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
        app.globalData.order.reload = true;
        this.orderIndex();
    }
    //订单列表
    static orderIndex() {
        const cache = app.globalData.order;
        cache.reload = true;
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
       this.redirectTo(`/pages/order/detail/detail?orderId=${orderId}`);
    }

    //购物车
    static cartIndex() {
        const cache = app.globalData.order;
        wx.switchTab({
            url: "/pages/cart/index/index"
        });
    }

    /**
     * 地址列表
     */
    static addressIndex(reload = false){
        this.goto(`/pages/address/index/index?reload=${reload}`);
    }

    /**
     * 地址详情页面
     */
    static addressEdit(address){
         this.goto(`/pages/address/edit/edit?addr=${address}`);
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
}