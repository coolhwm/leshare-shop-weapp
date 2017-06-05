import BaseService from "./BaseService";
import Pagination from "../utils/Page";

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