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
        const url = `${this.baseUrl}/shops/${this.shopId}`;
        return this.get(url, {}).then(res => {
            return res.data;
        });
    }

    /**
     * 获取店铺公告
     */
    getNotice(){
        const url = `${this.baseUrl}/shops/${this.shopId}/notices/shows`;
        return this.get(url, {}).then(res => {
            return res.data;
        });
    }

}