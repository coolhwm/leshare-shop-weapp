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
            "1": "等待买家付款",
            "2": "等待卖家发货",
            "3": "卖家已发货",
            "4": "等待买家评价",
            "5": "申请退款中",
            "6": "交易成功",
            "7": "交易关闭",
            "8": "卖家已退款"
        };
        //字符字典
        this.paymentDict = {
            "0": "线下支付",
            "1": "在线支付"
        };
    }


    /**
    * 返回分页对象
    */
    page() {
        const url = `${this.baseUrl}/orders`;
        return new Pagination(url, this._processOrderListItem.bind(this));
    }

    /**
     * 获取订单详情
     */
    getInfo(orderId) {
        const url = `${this.baseUrl}/orders/${orderId}`;
        return this.get(url, {}).then(res => {
            const detail = res.data;
            this._processOrderDetail(detail);
            return detail;
        });
    }

    /**
     * 生成预支付订单
     */
    prepayOrder(orderId) {
        const url = `${this.baseUrl}/orders/${orderId}/wxpay`;
        return this.get(url, {}).then(res => {
            //TODO 可能失败
            return res.data.data;
        });
    }

    /**
     * 拉起微信支付
     */
    wxpayOrder(payment) {
        return this.wxpay({
            'timeStamp': payment.timeStamp,
            'nonceStr': payment.nonceStr,
            'package': payment.package,
            'signType': 'MD5',
            'paySign': payment.paySign,
        });
    }

    /**
     * 创建订单
     */
    createOrder(trade) {
        const url = `${this.baseUrl}/orders`;
        return this.post(url, trade).then(res => {
            return res.data;
        });
    }

    /**
     * 申请退款
     */
    refundOrder(orderId) {
        const url = `${this.baseUrl}/orders/${orderId}/status/refund`;
        return this.patch(url, {}).then(res => {
            //TODO 可能失败
            return res.data;
        });
    }

    /**
     * 关闭订单
     */
    closeOrder(orderId) {
        const url = `${this.baseUrl}/orders/${orderId}/status/close`;
        return this.patch(url, {}).then(res => {
            //TODO 可能失败
            return res.data;
        });
    }

    /**
     * 确认收货
     */
    confirmOrder(orderId) {
        const url = `${this.baseUrl}/orders/${orderId}/status/comments`;
        return this.patch(url, {}).then(res => {
            //TODO 可能失败
            return res.data;
        });
    }


    /**
     * 购物车下单
     */
    createCartTrade(goodsList) {
        const orderGoodsInfos = [];
        let price = 0;
        //根据购物车信息，构造订单的商品列表
        for (let i in goodsList) {
            const goods = goodsList[i];
            const info = {
                goods_id: goods.goods_id,
                goods_name: goods.goods_name,
                image_url: goods.goods_image,
                goods_price: goods.goods_price,
                count: goods.goods_num,
                sku_text: goods.sku_text,
                goods_sku: goods.goods_sku
            };
            orderGoodsInfos.push(info);
            price += goods.goods_price * goods.goods_num;
        }
        //构造交易对象
        const trade = {
            status_text: "待确认",
            deal_price: price.toFixed(2),
            final_price: price.toFixed(2),
            address_id: "1",
            payment_type: "1",
            message: "",
            orderGoodsInfos: orderGoodsInfos,
            shop_name: this.shopName
        };
        return trade;
    }


    /**
     * 构建一个交易对象（单个物品），商品页面直接下单
     */
    createSingleTrade(goods, num = 1, sku = "") {
        const hasImage = goods.images && goods.images.length > 0;
        const imageUrl = hasImage ? goods.images[0].url : null;
        const skuText = this._processOrderSku(sku);

        //构造交易对象
        const trade = {
            status_text: "待确认",
            deal_price: goods.original_price,
            final_price: (goods.sell_price * num).toFixed(2),
            address_id: "1",
            payment_type: "1",
            message: "",
            orderGoodsInfos: [
                {
                    goods_id: goods.id,
                    goods_name: goods.name,
                    goods_sku: sku,
                    sku_text: skuText,
                    image_url: imageUrl,
                    goods_price: goods.sell_price,
                    count: num
                }
            ],
            shop_name: this.shopName
        };
        return trade;
    }


    /**
     * 处理订单列表数据
     */
    _processOrderListItem(order) {
        const status = order.status;
        order.status_text = this.statusDict[status];
        //动作控制 待付款/待评论/待收货
        order.is_action = status == 1 || status == 3 || status == 4;
        //处理商品信息
        const goods = order.orderGoodsInfos;
        this._processOrderGoods(goods);
    }

    /**
     * 处理订单详情
     */
    _processOrderDetail(detail) {
        //状态字典
        const status = detail.status;
        detail.status_text = this.statusDict[status];
        detail.is_action = status == 1 || status == 2 || status == 3 || status == 4;

        //支付方式
        detail.payment_text = this.paymentDict[detail.payment_type];

        //处理商品信息
        const goods = detail.orderGoodsInfos;
        this._processOrderGoods(goods);
    }


    /**
     * 处理订单商品信息
     */
    _processOrderGoods(goods) {
        goods.forEach(item => {
            //处理SKU描述
            const sku = item.goods_sku;
            const skuText = this._processOrderSku(sku);
            item.sku_text = skuText;
        });
    }

    /**
     * 处理SKU的默认值
     */

    _processOrderSku(goods_sku) {
        let skuText = "";
        if (goods_sku && goods_sku != '') {
            skuText = goods_sku.replace(/:/g, ',');
        }
        return skuText;
    }
}


