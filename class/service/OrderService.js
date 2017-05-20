import BaseService from "./BaseService";
import Pagination from "../utils/Page";

/**
 * 订单服务类
 */
export default class OrderService extends BaseService {
    constructor() {
        super();
        //交易状态字典
        this.statusDict = {
            "0": "全部",
            "1": "待付款",
            "2": "待发货",
            "3": "已发货",
            "4": "待评论",
            "5": "退款中",
            "6": "已完成",
            "7": "已关闭",
            "8": "已退款"
        };
    }


    /**
    * 返回分页对象
    */
    page() {
        const url = `${this.baseUrl}/orders`;
        return new Pagination(url, this._processOrderData.bind(this));
    }

    /**
     * 创建订单
     */
    createOrder(trade) {
        const url = `${this.baseUrl}/shops/${this.shopId}/orders`;
        return this.post(url, trade).then(res => {
            return res.data;
        });
    }


    /**
     * 构建一个交易对象（单个物品）
     */
    createSingleTrade(goods) {
        const hasImage = goods.images && goods.images.length > 0;
        const imageUrl = hasImage ? goods.images[0].url : null;
        //构造交易对象
        const trade = {
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


    /**
     * 处理订单数据
     */
    _processOrderData(order) {
        order.status_text = this.statusDict[order.status];
    }
}


