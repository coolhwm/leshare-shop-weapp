
/**
 * 购物车视图类
 */
export default class Cart {

    constructor() {
        this.carts = [];
        this.price = 0;
        this.num = 0;
        this.all = false;
        this.reload = false;
        this.batch = false;
    }

    /**
     * 导出数据
     */
    export() {
        return {
            carts: this.carts,
            price: this.price,
            num: this.num,
            all: this.all,
            reload: this.reload,
            batch: this.batch
        };
    }

    /**
     * 是否为空
     */
    empty() {
        return this.num == 0;
    }

    /**
     * 设置数据
     */
    setCarts(carts) {
        this.carts = carts;
        if(this.batch){
            this.unselectAll();
        }
        if(this.empty()){
            this.batch = false;
        }
        this._setTotalNumAndPrice();
    }


    /**
     * 根据商品信息查找
     */
    find(goodsId, sku){
        return this.carts.find(item => item.goodsId == goodsId && item.goodsSku == sku);
    }

    /**
     * 获取已选择商品
     */
    getCheckedCarts() {
        return this.carts.filter(cart => cart.check);
    }

    /**
     * 切换一个商品的选择
     */
    toggleCartCheck(cartId) {
        this.carts.forEach(cart => {
            if (cart.cartId == cartId) {
                cart.check = !cart.check;
            }
        });
        this._setTotalNumAndPrice();
    }

    /**
     * 切换批量操作
     */
    toggleBatch() {
        this.batch = !this.batch;
        if (this.batch) {
            this.unselectAll();
        }
        else {
            this.selectAll();
        }
    }

    /**
     * 检查库存
     */
    checkGoodsStock() {
        const goods = this.carts.find(item => item.goodsNum > item.stock || item.stock == 0);
        if (goods == null) {
            return;
        }
        else if (goods.stock == 0) {
            return `${goods.goodsName} 无货`;
        }
        else {
            return `${goods.goodsName} 库存不足`;
        }
    }

    /**
     * 切换全部商品的选择
     */
    toggleAllCheck() {
        this.all = !this.all;
        this.updateAllSeleteStatus(this.all);
    }


    /**
     * 选择全部
     */
    selectAll() {
        this.all = true;
        this.updateAllSeleteStatus(this.all);
    }

    /**
     * 取消选择全部
     */
    unselectAll() {
        this.all = false;
        this.updateAllSeleteStatus(this.all);
    }


    /**
     * 更新全部选择状态
     */
    updateAllSeleteStatus(check) {
        this.carts.forEach(cart => {
            cart.check = check;
        });
        this._setTotalNumAndPrice();
    }

    /**
     * 更新商品数量
     */
    updateCartNum(cartId, num) {
        this.carts.forEach(cart => {
            if (cart.cartId == cartId) {
                cart.goodsNum = num;
            }
        });
        this._setTotalNumAndPrice();
    }

    /**
     * 移除一个购物车项目
     */
    remveCart(cartId) {
        for (let i in this.carts) {
            const cart = this.carts[i];
            if (cart.cartId == cartId) {
                this.carts.splice(i, 1);
            }
        }
        this._setTotalNumAndPrice();
    }

    /**
    * 设置价格和数量
    */
    _setTotalNumAndPrice() {
        let all = this.carts.length > 0 ? true : false;
        let price = 0;
        let num = 0;
        for (let i in this.carts) {
            const cart = this.carts[i];
            if (!cart.check) {
                all = false;
                continue;
            }
            num += cart.goodsNum;
            price += cart.goodsPrice * cart.goodsNum;
        }
        price = price.toFixed(2);

        this.all = all;
        this.num = num;
        this.price = price;
    }

}