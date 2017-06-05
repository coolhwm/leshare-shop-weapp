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
        return new Pagination(url, this._processFavGoods.bind(this));
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

    /**
    * 数据处理
    */
    _processFavGoods(data) {
        return {
            goods_id: data.goods_id,
            goods_name: data.goods.name,
            goods_price: data.goods.sell_price,
            image_url: this._processGoodsPreview(data.goods.images)
        };
    }

     /**
     * 处理预览图
     */
    _processGoodsPreview(images) {
        //图片处理
        if (images == null || images.length < 1) {
            return "/images/goods/broken.png";
        }
        else if (images[0].url == null) {
            return "/images/goods/broken.png";
        }
        else {
            return images[0].url;
        }
    }
}

