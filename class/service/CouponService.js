import BaseService from "./BaseService";
import Pagination from "../entity/Page";

/**
 * 卡券服务类
 */
export default class CouponService extends BaseService {

    constructor() {
        super();
    }


    /**
     * 返回分页对象
     */
    page() {
        const url = `${this.baseUrl}/coupons`;
        return new Pagination(url, this._processCouponItem.bind(this));
    }


    /**
     * 卡券货架
     */
    shelf() {
        const url = `${this.baseUrl}/coupons/show`;
        return this.get(url);
    }

    /**
     * 领取卡券
     */
    pick(couponId) {
        const url = `${this.baseUrl}/coupons/${couponId}/get`;
        return this.get(url);
    }

    /**
     * 删除卡券
     */
    remove(acceptId){
        const url = `${this.baseUrl}/counpons/${acceptId}`;
        return this.delete(url);
    }

    /**
     * 获取可用的卡券信息
     */
    available(goodsList) {
        const url = `${this.baseUrl}/coupons/order_available`;
        const param = { orderGoodsInfos: goodsList };
        return this.post(url, param).then(data => {
            return data.map(coupon => this._processCouponItem(coupon));
        });
    }


    /**
     * 处理卡券数据
     */
    _processCouponItem(data) {
        const root = data;
        const coupon = data.coupon;

        coupon.status = root.status;
        coupon.id = root.id;
        coupon.couponId = root.couponId;
        coupon.usedTime = coupon.usedTime;
        coupon.acceptTime = root.acceptTime;
        coupon.beginTime = this._convertTimestapeToDay(coupon.beginTime);
        coupon.dueTime = this._convertTimestapeToDay(coupon.dueTime);
        return coupon;
    }

    /**
     * 处理时间格式
     */
    _convertTimestapeToDay(timestape) {
        return timestape.substring(0, timestape.indexOf(' ')).replace(/\-/g, '.');
    }


}