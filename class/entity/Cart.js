
/**
 * 购物车视图类
 */
export default class Cart {

    constructor(context) {
        this.context = context;
        this.carts = [];
        this.price = 0;
        this.num = 0;
        this.all = false;
        this.reload = false;
    }

    /**
     * 设置数据
     */
    setCarts(carts) {
        this.carts = carts;
        this._setTotalNumAndPrice();
    }
    /**
     * 获取总价
     */
    getTotalPrice() {

    }

    /**
     * 获取总数
     */
    getTotoalNum() {

    }

    /**
     * 获取已选择商品
     */
    getCheckedCart() {

    }

    /**
     * 切换一个商品的选择
     */
    toggleCartCheck(cartId) {
        //遍历查询
        for (let i in this.carts) {
            const cart = this.carts[i];
            if (cart.cart_id == cartId) {
                cart.check = !cart.check;
            }
        }
        this._setTotalNumAndPrice();
    }

    /**
     * 切换全部商品的选择
     */
    toggleAllCheck() {

    }

    /**
     * 移除一个购物车项目
     */
    remveCart() {

    }

    /**
    * 设置价格和数量
    */
    _setTotalNumAndPrice() {
        let all = true;
        let price = 0;
        let num = 0;
        for (let i in this.carts) {
            const cart = this.carts[i];
            if (!cart.check) {
                all = false;
                continue;
            }
            num += cart.goods_num;
            price += cart.goods_price * cart.goods_num;
        }
        price = price.toFixed(2);

        this.all = all;
        this.num = num;
        this.price = price;
    }

}