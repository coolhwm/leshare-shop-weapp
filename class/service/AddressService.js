import BaseService from "./BaseService";
import Pagination from "../utils/Page";

/**
 * 购物车服务类
 */
export default class AddressService extends BaseService {
    constructor() {
        super();
    }

    /**
     * 返回分页对象
     */
    page() {
        const url = `${this.baseUrl}/addresses`;
        return new Pagination(url);
    }

    /**
     * 新增地址
     */
    save(address){
        const url = `${this.baseUrl}/addresses`;
        return this.post(url, address).then(res => {
            return res;
        });
    }

    /**
     * 更新地址对象
     */
    update(){

    }
}