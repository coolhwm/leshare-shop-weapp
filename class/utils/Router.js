const app = getApp();

/**
 * 路由导航
 */
export default class Router {
    constructor() {
        this.shopId = app.globalData.shopId;
    }

    static goodsIndex(goodsId) {
        this.goto(`/pages/goods/index/index?goodsId=${goodsId}`);
    }

    static shopDetail() {
        this.goto(`/pages/shop/detail/detail?shopId=${this.shopId}`);
    }

    static createTrade(trade) {
        this.goto(`/pages/order/trade/trade?trade=${trade}`);
    }

    static orderIndex() {
        wx.switchTab({
            url: "/pages/order/index/index"
        });
    }

    static goto(url) {
        wx.navigateTo({
            url: url
        });
    }

}