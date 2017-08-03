import BaseService from "./BaseService";
import Pagination from "../entity/Page";

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
     * 购物车总数
     */
    count(){
        const url = `${this.baseUrl}/carts/count`;
        return this.get(url).then(data => data.count);
    }


    /**
     * 将商品加入购物车中
     */
    add(goodsId, num = 1, sku) {
        const url = `${this.baseUrl}/carts`;
        const param = {
            goodsId: goodsId,
            goodsSku: sku,
            goodsNum: num
        };
        return this.post(url, param);
    }

    /**
     * 删除购物车中的商品
     */
    remove(cartId) {
        const url = `${this.baseUrl}/carts/${cartId}`;
        return this.delete(url);
    }

    /**
     * 批量删除购物车商品
     */
    removeBatch(carts){
        const url = `${this.baseUrl}/carts/batch`;
        const param = carts.map(cart => {
            return {cartId: cart.cartId}
        });
        return this.delete(url, param);
    }

    /**
     * 更新购物车中的商品数量
     */
    update(cartId, num) {
        const url = `${this.baseUrl}/carts/${cartId}`;
        const param = {
            goodsNum: num
        };
        return this.put(url, param);
    }

    /**
     * 处理购物车数据
     */
    _processCartData(cart){
        cart.check = true;
        cart.goodsPrice = cart.goodsPrice.toFixed(2);
        if(cart.goodsSku){
            cart.skuText = cart.goodsSku.replace(/:/g, ',');
        }
        if(cart.goodsNum >　cart.stock){
            cart.goodsNum = cart.stock;
        }
        cart.goodsImage += '/small';
    }

}