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
        return this.list().then(data => {
            console.info(data);
            return this.own('NEVER_USED');
        }).then(data => {
            console.info(data);
        });
    }

    list() {
        const url = `${this.baseUrl}/coupons/show`;
        return this.get(url);
    }


    /**
     * 查找目前已领取的优惠券
     */
    own(status) {
        const url = `${this.baseUrl}/coupons/list?status=${status}`;
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
    remove(acceptId) {
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
        coupon.usedTime = root.usedTime;
        coupon.beginTime = this._convertTimestapeToDay(coupon.beginTime);
        coupon.dueTime = this._convertTimestapeToDay(coupon.dueTime);
        this._processCouponDisplayFlag(coupon);
        return coupon;
    }


    /**
     * 处理卡券展示标签
     */
    _processCouponDisplayFlag(coupon) {
        if (coupon.status != 'NEVER_USED') {
            return;
        }
        const acceptTimeInterval = this._dayIntervalToNow(coupon.acceptTime);
        if (acceptTimeInterval <= 1) {
            coupon.isNew = true;
        }
        const dueTimeInterval = this._dayIntervalToNow(coupon.dueTime);
        if (dueTimeInterval >= -1) {
            coupon.isExpiring = true;
        }
    }

    /**
     * 计算时间间隔
     */
    _dayIntervalToNow(dateStr) {
        const MS_OF_DAY = 86400000;
        const date = Date.parse(dateStr);
        return Math.round((Date.now() - date) / MS_OF_DAY);
    }

    /**
     * 处理时间格式
     */
    _convertTimestapeToDay(timestape) {
        return timestape.substring(0, timestape.indexOf(' ')).replace(/\-/g, '.');
    }


}