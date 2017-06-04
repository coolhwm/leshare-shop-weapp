import BaseService from "./BaseService";
/**
 * 快递信息服务类
 */
export default class ExpressService extends BaseService {

    constructor() {
        super();
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
        return this.get(url, param).then(res => res.data);

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
        const steps = data.expressBases.map(this._processTraceStep);

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
            text: item.status,
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
            expTextName: data.express_type,
            mailNo: data.express_no,
            status: data.status,
            tel: data.tel_phone,
        }
    }
}