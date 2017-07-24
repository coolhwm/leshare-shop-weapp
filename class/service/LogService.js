import BaseService from "./BaseService";
import Pagination from "../entity/Page";

/**
 * 日志服务
 */
export default class LogService extends BaseService {
    constructor() {
        super()
    }

    /**
    * 返回分页对象
    */
    page() {
        const url = `${this.baseUrl}/visit_goods_log`;
        return new Pagination(url, this._processFavGoods.bind(this));
    }

    /**
     * 移除访问记录
     */
    remove(goodsId) {
        const url = `${this.baseUrl}/visit_goods_log?goodsId=${goodsId}`;
        return this.delete(url);
    }

    /**
    * 数据处理
    */
    _processFavGoods(data) {
        return {
            goodsId: data.goodsId,
            goodsName: data.goods.name,
            goodsPrice: data.goods.sellPrice.toFixed(2),
            imageUrl: this._processGoodsPreview(data.goods.images)
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
            return images[0].url + '/small';
        }
    }
}
