import BaseService from "./BaseService";

/**
 * 订单服务类
 */
export default class OrderService extends BaseService {
    constructor() {
        super();
    }


    /**
     * 创建订单
     */
    createOrder(trade){
        const url = `${this.baseUrl}/shops/${this.shopId}/orders`;
        return this.post(url, trade).then(res =>{
            return res.data;
        });
    }


    /**
     * 构建一个交易对象（单个物品）
     */
    createSingleTrade(goods) {
        const imageUrl = goods.images && goods.images.length > 0 ? goods.images[0].url : null;
        //构造交易对象
        var trade = {
            status_text: "待确认",
            deal_price: goods.original_price,
            final_price: goods.sell_price,
            address_id: "1",
            payment_type: "1",
            message: "",
            orderGoodsInfos: [
                {
                    goods_id: goods.id,
                    goods_name: goods.name,
                    image_url: imageUrl,
                    goods_price: goods.sell_price,
                    count: "1"
                }
            ],
            shop_name: this.shopName
        };
        return trade;
    }
}