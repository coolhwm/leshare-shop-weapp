
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
        //初始化
        this.init();
    }


    init() {
        this.labels = this.goods.labels;
        //没有规格的情况
        if(!this.labels){
            this.exists = false;
            this.stock = this.goods.stock;
        }
        //初始化已被选择的对象 / 占位符
        for (let i in this.labels) {
            const label = this.labels[i].key;
            this.selected[label] = null;
            this.skuKeys += `${label} `;
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
            action: this.action,
            skuKeys: this.skuKeys,
            skuText: this.skuText,
            skuValues: this.skuValues
        };
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
                this.stock = 0;
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
     * 取出当前SKU组合信息
     */
    fetchSelectedSkuDetail() {
        //检索当前SKU的信息
        const details = this.goods.goodsSkuInfo.goodsSkuDetails;
        for (let i in details) {
            const detail = details[i];
            if (detail.sku == this.skuText) {
                this.detail = detail.goodsSkuDetailBase;
                this.stock = this.detail.stock;
                break;
            }
        }
    }


}