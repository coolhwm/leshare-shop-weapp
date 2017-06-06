import OrderService from "../../../class/service/OrderService";
import Router from "../../../class/utils/Router";
import Tips from "../../../class/utils/Tips";

const orderService = new OrderService();
const TopTips = require('../../../templates/toptips/index');

Page(Object.assign({}, TopTips, {

  data: {
    refund: {},
    reason: ['重复下单/误下单', '操作有误', '其他渠道价格更低', '不想买了', '其他原因']
  },

  onLoad: function (options) {
    const refund = JSON.parse(options.refund);
    this.setData({ refund: refund });
  },


  /**
   * 修改输入框
   */
  onInputChange: function (e) {
    console.info(e);
    const refund = this.data.refund;
    refund[e.currentTarget.id] = e.detail.value
    this.setData(refund);
  },
  /**
   * 修改原因
   */
  onReasonChange: function (e) {
    console.info(e);
    const refund = this.data.refund;
    const reasonIndex = e.detail.value;
    refund['cause'] = this.data.reason[reasonIndex];
    this.setData({
      refund: refund,
      reasonIndex: reasonIndex
    });
  },

  /**
   * 提交申请
   */
  onSubmitTap: function (event) {
    //校验
    let errorMsg = '';
    if (this.isEmpty(this.data.refund.cause)) {
      errorMsg = '请填写退款原因';
    }
    else if (this.isEmpty(this.data.refund.contactName)) {
      errorMsg = '请填联系人';
    }
    else if (this.isEmpty(this.data.refund.contactPhone)) {
      errorMsg = '请填联系方式';
    }
    if(!this.isEmpty(errorMsg)){
      this.showZanTopTips(errorMsg);
      return;
    }

    //发起退款
    const refund = this.data.refund;
    const orderId = refund.orderId;
    Tips.confirm('您确认要申请退款吗？').then(() => {
      Tips.loading('退款申请中');
      return orderService.refundOrder(orderId, refund);
    }).then(data => {
      Tips.toast('退款申请成功', () => Router.orderIndexRefresh());
    });
  },

  /**
   * 工具方法，校验
   */
  isEmpty: function (str) {
    return str == null || str == '';
  }
}))