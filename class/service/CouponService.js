import BaseService from "./BaseService";
import Pagination from "../utils/Page";

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
        return new Pagination(url, null);
    }

}