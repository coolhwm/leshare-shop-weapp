import BaseService from "./BaseService";
const app = getApp();

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

    status() {
        const url = `${this.baseUrl}/shops/status`;
        return this.get(url).then(data => {
            if (data.status == 'CLOSE') {
                data.closeTips = '店铺已休息，请稍后再来';
            } else if (data.status == 'NORMAL' && !data.status.open) {
                data.closeTips = `店铺已休息，营业时间：${data.beginTime} - ${data.endTime}`;
            }
            return data;
        });
    }

    /**
     * 店铺限价
     */
    limitPrice() {
        const url = `${this.baseUrl}/delivery/limit_price`;
        return this.get(url).then(data => {
            const arr = [];
            if (data.SELF != null) {
                arr.push(data.SELF);
            }
            if (data.CITY != null) {
                arr.push(data.CITY);
            }
            if (data.EXPRESS != null) {
                arr.push(data.EXPRESS);
            }
            let limitPrice = Math.min(...arr);
            if (!limitPrice || Number.isNaN(limitPrice)) {
                limitPrice = 0;
            }
            app.globalData.shop.limitPrice = limitPrice;
            return limitPrice;
        });
    }

    /**
     * 获取店铺公告（第一个）
     */
    notices() {
        const url = `${this.baseUrl}/notices`;
        return this.get(url, {}).then(data => {
            if (data == null || data.length < 1) {
                return [{ content: '暂无公告' }]
            } else {
                return data;
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