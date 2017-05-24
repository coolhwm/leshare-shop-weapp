import BaseService from "./BaseService";
import Pagination from "../utils/Page";

/**
 * 购物车服务类
 */
export default class CartService extends BaseService {

    constructor() {
        super();
    }

    /**
     * 返回分页对象
     */
    page() {
        const url = `${this.baseUrl}/carts`;
        return new Pagination(url, this._processCartData);
    }


    /**
     * 将商品加入购物车中
     */
    add(goodsId, num = 1, sku) {
        const url = `${this.baseUrl}/carts`;
        const param = {
            goods_id: goodsId,
            goods_sku: sku,
            goods_num: num
        };
        return this.post(url, param).then(res => {
            return res;
        });
    }

    /**
     * 删除购物车中的商品
     */
    remove(cartId) {
        const url = `${this.baseUrl}/carts/${cartId}`;
        return this.delete(url, {}).then(res => {
            //TODO
        });
    }

    /**
     * 更新购物车中的商品数量
     */
    update(cartId, num) {
        const url = `${this.baseUrl}/carts/${cartId}`;
        const param = {
            goods_num: num
        };
        return this.put(url, param).then(res => {
            //TODO
        });
    }

    /**
     * 处理购物车数据
     */
    _processCartData(cart){
        cart.check = true;
        cart.goods_price = cart.goods_price.toFixed(2);
    }

}