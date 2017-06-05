import BaseService from "./BaseService";
import Pagination from "../utils/Page";

/**
 * 日志服务
 */
export default class LogService extends BaseService {
    constructor(){
        super()
    }

     /**
     * 返回分页对象
     */
    page() {
        const url = `${this.baseUrl}/visit_goods_log`;
        return new Pagination(url, null);
    }
}