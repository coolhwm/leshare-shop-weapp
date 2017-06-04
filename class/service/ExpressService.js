import BaseService from "./BaseService";
/**
 * 快递信息服务类
 */
export default class ExpressService extends BaseService {

    constructor() {
        super();
        this.statusDict = {
            "-1": "待查询",
            "0": "查询异常",
            "1": "暂无记录",
            "2": "在途中",
            "3": "派送中",
            "4": "已签收",
            "5": "用户拒签",
            "6": "疑难件",
            "7": "无效单",
            "8": "超时单",
            "9": "签收失败",
            "10": "退回"
        };

        
        // 模拟数据
        this.mock = {
            "showapi_res_code": 0,
            "showapi_res_error": "",
            "showapi_res_body": {
                "mailNo": "968018776110",
                "update": 1466926312666,
                "updateStr": "2016-06-26 15:31:52",
                "ret_code": 0,
                "flag": true,
                "status": 4,
                "tel": "400-889-5543",
                "expSpellName": "shentong",
                "data": [
                    {
                        "time": "2016-06-26 12:26",
                        "context": "已签收,签收人是:【本人】"
                    },
                    {
                        "time": "2016-06-25 15:31",
                        "context": "【陕西陇县公司】的派件员【西城业务员】正在派件"
                    },
                    {
                        "time": "2016-06-25 14:11",
                        "context": "快件已到达【陕西陇县公司】"
                    },
                    {
                        "time": "2016-06-25 09:08",
                        "context": "由【陕西宝鸡公司】发往【陕西陇县公司】"
                    },
                    {
                        "time": "2016-06-24 14:08",
                        "context": "由【陕西西安中转部】发往【陕西宝鸡公司】"
                    },
                    {
                        "time": "2016-06-22 13:23",
                        "context": "由【山东临沂公司】发往【陕西西安中转部】"
                    },
                    {
                        "time": "2016-06-21 23:02",
                        "context": "【江苏常熟公司】正在进行【装袋】扫描"
                    },
                    {
                        "time": "2016-06-21 23:02",
                        "context": "由【江苏常熟公司】发往【江苏江阴航空部】"
                    },
                    {
                        "time": "2016-06-21 18:30",
                        "context": "【江苏常熟公司】的收件员【严继东】已收件"
                    },
                    {
                        "time": "2016-06-21 16:41",
                        "context": "【江苏常熟公司】的收件员【凌明】已收件"
                    }
                ],
                "expTextName": "申通快递"//快递公司名
            }
        };

    }
    /*********************** 对外方法 ***********************/

    /**
     * 查询订单当前的物流状态
     */
    queryCurrentTrace(orderId) {
        const express = this.queryTrace(orderId);
        //没有物流信息
        if(express.steps == null && express.steps.length < 1){
            return {
                text: '尚未查询到物流信息'
            }
        }
        else{
            return express.steps[0];
        }
    }


    /**
     * 查询物理信息列表
     */
    queryTrace(orderId) {
        return this._queryExpressInfo(orderId).then(data => {
            const info = this._createExpressInfo(data);
            const steps = this._createTraceSteps(data);

            return {
                steps: steps,
                info: info
            };
        });
    }

    /*********************** 对象构造方法 ***********************/

    /**
     * 创建物流页面展现的基本信息
     */
    createExpressOrderPreview(order){
        const imageUrl = order.orderGoodsInfos[0].image_url;
        const goodsCount = order.orderGoodsInfos.length;
        return {
            imageUrl: imageUrl,
            goodsCount: goodsCount,
            orderId: order.order_id
        }
    }

    /*********************** 数据处理方法 ***********************/

    /**
     * 查询物流信息
     */

    _queryExpressInfo(orderId) {
        const url = `${this.publicUrl}/express`;
        const param = { order_id: orderId };
        return this.get(url, param).then(res => res.showapi_res_body);

        //模拟测试
        // return new Promise((resolve, reject) => {
        //     resolve(this.mock.showapi_res_body);
        // });
    }


    /**
     * 提取步骤信息
     */
    _createTraceSteps(data) {
        //映射每个步骤
        const steps = data.data.map(this._processTraceStep);

        //改变最后一个状态
        const lastStep = steps[0];
        lastStep.done = true;
        lastStep.current = true;

        return steps;
    }

    /**
     *  处理每个步骤
     */
    _processTraceStep(item) {
        return {
            text: item.context,
            timestape: item.time,
            done: false,
            current: false
        };
    }

    /**
     * 提取物流基本信息
     */
    _createExpressInfo(data) {
        return {
            expTextName: data.expTextName,
            mailNo: data.mailNo,
            status: data.status,
            statusText: this.statusDict[data.status],
            tel: data.tel,
        }
    }
}