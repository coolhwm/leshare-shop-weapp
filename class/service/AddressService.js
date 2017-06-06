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
    save(address) {
        const url = `${this.baseUrl}/addresses`;
        return this.post(url, address).then(res => {
            return res;
        });
    }

    /**
     * 更新地址对象
     */
    update(addrId, address) {
        const url = `${this.baseUrl}/addresses/${addrId}`;
        return this.put(url, address);
    }

    /**
     * 设置默认
     */
    setDefault(id) {
        const url = `${this.baseUrl}/addresses/${id}/default`;
        return this.patch(url, {});
    }

    /**
     * 获取默认
     */
    getDefault(){
        const url = `${this.baseUrl}/addresses/default`;
        return this.get(url, {}).then(res => res.data);
    }

    /**
    * 删除地址对象
    */
    remove(id) {
        const url = `${this.baseUrl}/addresses/${id}`;
        return this.delete(url, {});
    }

    /**
     * 选择微信地址
     */
    wxAddress() {
        return new Promise((resolve, reject) => {
            wx.chooseAddress({
                success: data => {
                    resolve({
                        name: data.userName,
                        phone: data.telNumber,
                        province: data.provinceName,
                        city: data.cityName,
                        country: data.countyName,
                        detail: data.detailInfo,
                        isDefault: 0
                    });
                },
                fail: reject
            });
        });
    }
}