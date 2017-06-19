
/**
 * SKU视图类
 */
export default class Sku {

    constructor(goods) {
        //商品是否存在SKU
        this.exists = true;
        //商品信息
        this.goods = goods;
        //SKU标签
        this.labels = {}
        //是否展现面板
        this.display = false;
        //已经选择的SKU信息
        this.selected = {};
        //SKU组合的详细信息
        this.detail = {};
        //是否已经将所有的SKU都选择了
        this.isReady = false;
        //购买数量
        this.num = 1;
        //当前的库存
        this.stock = 0;
        //SKU 的拼装文本
        this.skuText = ""
        //占位符
        this.skuKeys = ""
        //处理后的已选择SKU值
        this.skuValues = ""
        //SKU 面板的动作
        this.action = "";
        //库存
        this.skuStocks = goods.goodsStocks;
        //是否可以点击下一步
        this.next = false;
        //初始化
        this.init();
    }


    /**
     * 初始化对象
     */
    init() {
        this.labels = this.goods.labels;
        //没有规格的情况
        if (!this.labels) {
            this.exists = false;
            //this.stock = this.goods.stock;
        }
        //初始化已被选择的对象 / 占位符
        for (let i in this.labels) {
            const label = this.labels[i].key;
            this.selected[label] = null;
            this.skuKeys += `${label} `;
        }
        //初始化无规格商品的库存
        if(!this.exists){
            this.stock = this.skuStocks[0].stock;
        }

    }

    /**
     * 选择某个SKU参数
     */
    select(key, value) {
        const srcValue = this.selected[key];
        this.selected[key] = srcValue == value ? null : value;

        this.isReady = this.joinSkuText();
        if (this.isReady) {
            this.fetchSelectedSkuDetail();
            this.setSkuStock(this.skuText);
            this.num = 1;
        }
        else {
            this.detail = {};
        }
    }

    /**
     *设置数量
     */
    setNum(num) {
        this.num = num;
    }

    /**
    * 导出数据
    */
    export() {
        return {
            num: this.num,
            isReady: this.isReady,
            detail: this.detail,
            selected: this.selected,
            labels: this.labels,
            display: this.display,
            exists: this.exists,
            stock: this.stock,
            stockText: this.buildStockText(),
            action: this.action,
            skuKeys: this.skuKeys,
            skuText: this.skuText,
            skuValues: this.skuValues,
            next: this.buildNextFlag()
        };
    }


    /**
     * 构造是否可以进入下一步的标识符
     */
    buildNextFlag(){
        if (this.exists && this.isReady && this.stock > 0) {
            return true;
        }
        else if(!this.exists && this.stock > 0){
            return true;
        }
        else{
            return false;
        }
    }


    /**
     * 剩余库存文本
     */
    buildStockText() {
        if (this.exists) {
            if (this.isReady) {
                return `剩余${this.stock}件`;
            }
            else {
                return '(请选择规格)';
            }
        }
        else {
            return `剩余${this.stock}件`;
        }
    }

    /**
     * 拼装SKU字符串
     */
    joinSkuText() {
        let ready = true;
        let skuText = ""
        for (let key in this.selected) {
            const skuValue = this.selected[key];
            if (skuValue != null) {
                skuText += skuValue + ':';
            }
            else {
                ready = false;
                break;
            }
        }
        //全部都选择的话
        if (ready) {
            skuText = skuText.substring(0, skuText.length - 1);
            this.skuText = skuText;
            this.skuValues = skuText.replace(/:/g, ' ');
        }
        return ready;
    }

    /**
     * 获取SKU库存信息
     */
    setSkuStock(skuText) {
        const stocks = this.skuStocks;
        for (let i in stocks) {
            const stockInfo = stocks[i];
            if (stockInfo.sku == skuText) {
                this.stock = stockInfo.stock;
            }
        }
    }

    /**
     * 取出当前SKU组合信息
     */
    fetchSelectedSkuDetail() {
        //检索当前SKU的信息
        const details = this.goods.goodsSkuInfo.goodsSkuDetails;
        for (let i in details) {
            const detail = details[i];
            if (detail.sku == this.skuText) {
                this.detail = detail.goodsSkuDetailBase;
                break;
            }
        }
    }


}