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
        const url = `${this.baseUrl}/shops/${this.shopId}/orders/${orderId}/wxpay`;
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
        const url = `${this.baseUrl}/shops/${this.shopId}/orders`;
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
     * 处理订单列表数据
     */
    _processOrderListItem(order) {
        order.status_text = this.statusDict[order.status];
    }

    /**
     * 处理订单详情
     */
    _processOrderDetail(detail) {
        //处理字典数据
        detail.status_text = this.statusDict[detail.status];
        detail.payment_text = this.paymentDict[detail.payment_type];
        //时间默认值
        detail.payment_time = !detail.payment_time ? '-' : detail.payment_time;
        detail.sended_time = !detail.sended_time ? '-' : detail.sended_time;
        detail.update_time = !detail.update_time ? '-' : detail.update_time;
        detail.close_time = !detail.close_time ? '-' : detail.close_time;
    }

}


