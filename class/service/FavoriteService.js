import BaseService from "./BaseService";
import Pagination from "../utils/Page";

/**
 * 收藏信息服务类
 */
export default class FavoriteService extends BaseService {

    constructor() {
        super();
    }

    /**
    * 返回分页对象
    */
    page() {
        const url = `${this.baseUrl}/shops/favorite_goods`;
        return new Pagination(url, null);
    }


    /**
     * 判断是否为收藏商品
     */
    is(goodsId) {
        const url = `${this.baseUrl}/favorite_goods/check`;
        const param = {goods_id : goodsId};
        return this.get(url, param);
    }

    /**
     * 增加收藏
     */
    add(goodsId) {
        const url = `${this.baseUrl}/favorite_goods`;
        const param = { goods_id: goodsId }
        return this.post(url, param).then(res => {
            console.info(res);
            return res;
        });
    }

    /**
     * 移除收藏
     */
    remove(goodsId) {
        const url = `${this.baseUrl}/favorite_goods`;
        const param = { goods_id: goodsId }
        return this.delete(url, param).then(res => {
            console.info(res);
            return res;
        });
    }
}

