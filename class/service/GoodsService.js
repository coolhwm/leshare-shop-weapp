import BaseService from "./BaseService";
import Pagination from "../utils/Page";

/**
 * 商品服务类
 */
export default class GoodsService extends BaseService {
    
    constructor() {
        super();
    }

    /**
     * 返回分页对象
     */
    page() {
        const url = `${this.baseUrl}/goods`;
        return new Pagination(url, this._processGoodsData);
    }

    /**
     * 查询商品详情
     */
    getInfo(goodsId){
        const url = `${this.baseUrl}/goods/${goodsId}`;
        return this.get(url, {}).then(res => {
            return res.data;
        });
    }

    /**
     * 处理商品信息
     */
    _processGoodsData(item) {
        //结构赋值
        var {name, sell_price, original_price, images} = item;

        //长名字处理
        if (name.length > 12) {
            item.name = name.substring(0, 12) + "...";
        }

        //销售价处理
        if (original_price == null || original_price == 0) {
            item.original_price = sell_price;
        }

        //图片处理
        if (images == null || images.length < 1) {
            item.imageUrl = "/images/goods/mock.png";
        }
        else if (images[0].url == null) {
            item.imageUrl = "/images/goods/mock.png";
        }
        else {
            item.imageUrl = images[0].url;
        }
    }

}