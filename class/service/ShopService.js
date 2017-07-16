import BaseService from "./BaseService";


/**
 * 店铺服务类
 */
export default class ShopService extends BaseService {

    constructor() {
        super();
    }

    /**
     * 访问店铺
     */
    visit() {
        const url = `${this.baseUrl}/visit_shops`;
        wx.getSystemInfo({
            success: (res) => {
                this.post(url, res).then(_ => { });
            }
        });
    }

    /**
     * 获取店铺详情
     */
    getInfo() {
        const cacheShop = this.app.globalData.shop.info;
        if (cacheShop) {
            return new Promise(resolve => resolve(cacheShop));
        }
        else {
            const url = `${this.baseUrl}/shops`;
            return this.get(url, {}).then(shop => {
                shop = this._processShopInfo(shop);
                this.app.globalData.shop.info = shop;
                return shop;
            });
        }

    }

    /**
     * 获取店铺公告（第一个）
     */
    getFirstNotice() {
        const url = `${this.baseUrl}/notices/shows`;
        return this.get(url, {}).then(data => {
            if (data && data.length > 0) {
                return data[0];
            }
            else {
                return {content: '暂无公告'};
            }

        });
    }

    /**
     * 处理商店信息
     */
    _processShopInfo(shop) {
        if (shop.avatar == null) {
            shop.avatar = '/images/shop/shop-logo.png';
        }
        return shop;
    }

}