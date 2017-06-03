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
    createOrder(trade, address) {
        const url = `${this.baseUrl}/orders`;
        this._processOrderAddress(trade, address);
        return this.post(url, trade).then(res => {
            return res.data;
        });
    }

    /**
     * 申请退款
     */
    refundOrder(orderId, refund) {
        const url = `${this.baseUrl}/orders/${orderId}/status/refund`;
        return this.put(url, refund).then(res => {
            return res;
        });
    }

    /**
     *  取消退款
     */
    cancelRefund(orderId, refundUUID){
        const url = `${this.baseUrl}/orders/${orderId}/status/cancelRefundMoney`;
        const param = {
            refund_uuid: refundUUID
        };
        return this.put(url, param);
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


     /*********************** 生成方法 ***********************/

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
     * 根据订单构造退款对象
     */
    createOrderRefund(order) {
        return {
            order_id: order.order_id,
            uuid: order.uuid,
            type: 0,
            contact_name: order.receiveName,
            contact_phone: order.receivePhone,
            price: order.final_price
        };
    }
    

    /**
     * 根据退款时间生成退款步骤
     */

    createOrderRefundSetps(refund) {
        let steps = [];

        //提交申请
        const creareTime = refund.create_time;
        if (creareTime) {
            steps.push(this._createRefundSetp('您的取消申请已提交，请耐心等待', creareTime));
            steps.push(this._createRefundSetp('等待卖家处理中,卖家24小时未处理将自动退款', creareTime));
        }

        //卖家处理
        const sellerTime = refund.seller_dealtime;
        if (sellerTime) {
            //卖家同意
            if (refund.is_agree == 1) {
                steps.push(this._createRefundSetp('卖家已同意退款', sellerTime));
                steps.push(this._createRefundSetp('款项已原路退回中，请注意查收', sellerTime));
            }
            //卖家不同意
            else {
                steps.push(this._createRefundSetp(`卖家不同意退款，原因：${refund.disagree_cause}`, sellerTime));

            }
        }

        //处理结束
        const finishTime = refund.finish_time;
        if (finishTime) {
            //卖家同意
            if (refund.is_agree == 1) {
                steps.push(this._createRefundSetp('退款成功', finishTime));
            }
            //卖家不同意
            else {
                steps.push(this._createRefundSetp('退款关闭，请联系卖家处理', finishTime));
            }
        }

        //买家关闭
        const closeTime = refund.close_time;
        if (closeTime) {
            steps.push(this._createRefundSetp('买家取消退款，交易恢复', closeTime));
        }


        //改变最后一个状态
        const lastStep = steps[steps.length - 1];
        lastStep.done = true;
        lastStep.current = true;

        //反转
        steps = steps.reverse();
        return steps;
    }

    _createRefundSetp(text, time) {
        return {
            text: text,
            timestape: time,
            done: false,
            current: false
        };
    }



    /*********************** 数据处理方法 ***********************/

    /**
     * 处理订单地址
     */
    _processOrderAddress(order, address) {
        order.receiveName = address.name;
        order.receivePhone = address.phone;
        order.address = address.fullAddress;
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
        //处理退款信息
        this._processOrderRefund(detail);
        //处理商品信息
        this._processOrderGoods(goods);
    }

    /**
 * 处理订单的退货信息
 */
    _processOrderRefund(order) {
        const refunds = order.orderRefunds;
        if (refunds == null || refunds.length < 1) {
            //订单没有退款信息，不做处理
            return;
        }

        const refund = refunds[0];
        //曾经退款过，就一定需要展现退款记录
        order.is_action = true;
        //控制展现退款详情字段
        order.is_refund = true;
        //取出第一条退款记录
        order.cur_refund = refund;
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


