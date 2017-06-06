import BaseService from "./BaseService";


/**
 * 店铺服务类
 */
export default class ShopService extends BaseService {

    constructor() {
        super();
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
            return this.get(url, {}).then(res => {
                const shop = res.data;
                this.app.globalData.shop.info = shop;
                return res.data;
            });
        }

    } 

    /**
     * 获取店铺公告（第一个）
     */
    getFirstNotice() {
        const url = `${this.baseUrl}/notices/shows`;
        return this.get(url, {}).then(res => {
            const data = res.data;
            if (data && data.length > 0) {
                return data[0];
            }
            else {
                return '暂无公告';
            }

        });
    }

}