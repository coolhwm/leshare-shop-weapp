import BaseService from "./BaseService";
import Pagination from "../entity/Page";

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
        return new Pagination(url, this._processGoodsData.bind(this));
    }


    /**
     * 查询商品目录
     */
    categories(pid = 0) {
        const url = `${this.baseUrl}/goods/inner_category`;
        return this.get(url).then(data => this._createGoodsCategories(data));
    }

    /**
     * 查询商品详情
     */
    getInfo(goodsId) {
        const url = `${this.baseUrl}/goods/${goodsId}`;
        return this.get(url, {}).then(data => this._processGoodsDetail(data));
    }

    /*********************** 数据处理方法 ***********************/

    _createGoodsCategories(data) {
        const list = [];
        list.push({
            id: '0',
            title: '全部'
        });

        list.push(...data.map(item => {
            return {
                id: item.id,
                title: item.name
            }
        }));

        const tab = {
            list: list,
            selectedId: '0',
            scroll: false
        }

        return tab;
    }

    /**
     * 处理商品详情
     */
    _processGoodsDetail(detail) {
        //解析预览图
        this._processGoodsPreview(detail);

        //解析SKU规格
        this._processSkuLable(detail);

        //处理价格范围区间
        this._processGoodsPriceRange(detail);

        //处理价格标签
        this._processGoodsPriceLabel(detail);

        //处理运费
        this._processGoodsPostFeeText(detail);
        return detail;
    }

    /**
     * 处理运费信息
     */
    _processGoodsPostFeeText(detail){
        const fee = detail.postFee;
        let feeText = '';
        if(!fee || fee == 0){
            feeText = '配送：免运费';
        }
        else{
            feeText = `同城配送：￥${fee} (支持自提)`;
        }
        detail.feeText = feeText;
    }

    /**
     * 处理价格商品区间
     */
    _processGoodsPriceRange(detail) {
        if (!detail.goodsSkuInfo || !detail.goodsSkuInfo.goodsSkuDetails) {
            return;
        }
        const skuDetails = detail.goodsSkuInfo.goodsSkuDetails;
        let maxPrice = 0;
        let minPrice = 0;

        for (let i in skuDetails) {
            const detail = skuDetails[i].goodsSkuDetailBase;
            maxPrice = Math.max(detail.price, maxPrice);
            minPrice = Math.min(detail.price, maxPrice);
        }
        detail.maxPrice = maxPrice;
        detail.minPrice = minPrice;
    }

    /**
     * 处理价格展现标签 / 需要先调用区间处理
     */
    _processGoodsPriceLabel(detail) {
        let priceLable = detail.sell_price;

        if (detail.maxPrice && detail.minPrice) {
            priceLable = `${detail.minPrice} ~ ${detail.maxPrice}`;
        }

        detail.priceLable = priceLable;
    }


    /**
     * 处理SKU标签
     */
    _processSkuLable(detail) {
        const skuInfo = detail.goodsSkuInfo;
        if (!skuInfo) {
            return;
        }

        const skuLabels = [];
        for (let i = 1; i <= 3; i++) {
            const skuKey = skuInfo[`prop${i}`];
            const skuValueStr = skuInfo[`value${i}`];
            if (skuKey && skuValueStr) {
                const skuValues = skuValueStr.split(',');
                const sku = {
                    key: skuKey,
                    value: skuValues
                };
                skuLabels.push(sku);
            }
            else {
                break;
            }
        }
        detail.labels = skuLabels;
    }

    /**
     * 处理商品信息
     */
    _processGoodsData(item) {
        //结构赋值
        var {name, sellPrice, originalPrice} = item;

        //长名字处理
        if (name.length > 12) {
            item.name = name.substring(0, 12) + "...";
        }

        //销售价处理
        if (originalPrice == null || originalPrice == 0) {
            item.originalPrice = sellPrice;
        }

        //处理图片
        this._processGoodsPreview(item);
    }

    /**
     * 处理预览图
     */
    _processGoodsPreview(item) {
        const images = item.images;
        //图片处理
        if (images == null || images.length < 1) {
            item.imageUrl = "/images/goods/broken.png";
        }
        else if (images[0].url == null) {
            item.imageUrl = "/images/goods/broken.png";
        }
        else {
            item.imageUrl = images[0].url;
        }
    }

}