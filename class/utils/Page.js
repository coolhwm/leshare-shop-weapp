var wxRequest = require('./wxRequest');

export default class Pagination {

    constructor(url, processFunc) {
        //数据访问地址
        this.url = url;
        //数据集合
        this.list = [];
        //起始数据
        this.start = 0;
        //加载数据条数
        this.count = 10;
        //数据处理函数
        this.processFunc = processFunc;
        //正在加载中
        this.loading = false;
        //参数
        this.params = [];
    }

    /**
     * 加载下一页数据
     */
    next(args) {
        const param = {
            from: this.start,
            limit: this.count
        };
        //附加参数
        this.loading = true;
        Object.assign(param, args);
        return wxRequest.getRequest(this.url, param).then(res => {
            let data = res;
            //微信脱壳            
            if (res.data) {
                data = res.data;
            }
            //报文脱壳
            if (data.data) {
                data = data.data;
            }
            //处理数据
            this._processData(data);

            //设置数据
            this.list = this.list.concat(data);
            this.start += this.count;
            //加载完毕
            this.loading = false;
            //导出列表数据
            return this._export();
        });
    }


    /**
     * 恢复到第一页
     */
    reset() {
        this.start = 0;
        this.list = [];
    }

    /**
     * 处理数据（私有）
     */
    _processData(data) {
        if (this.processFunc) {
            for (let i in data) {
                const result = this.processFunc(data[i]);
                if (result) {
                    data[i] = result;
                }
            }
        }
    }

    /**
     * 导出数据（私有）
     */
    _export() {
        return {
            list: this.list,
            start: this.start,
            count: this.count
        }
    }
}