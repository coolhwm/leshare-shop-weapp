
const TopTips = require('../../../templates/toptips/index');

Page(Object.assign({}, TopTips, {

  data: {
    refund: {},
    reason: ['重复下单/误下单', '操作有误', '其他渠道价格更低', '不想买了', '其他原因']
  },

  onLoad: function (options) {
    //const refund = JSON.parse(options.refund);

    const refund = {
      "order_id": 1627,
      "uuid": "201706022300306813752899MOVZW",
      "type": 1,
      "contact_name": "张三",
      "contact_phone": "18888888888",
      "price": 0.11
    };

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
    let errorMsg = '';
    if (this.isEmpty(this.data.refund.cause)) {
      errorMsg = '请填写退款原因';
    }
    else if (this.isEmpty(this.data.refund.contact_name)) {
      errorMsg = '请填联系人';
    }
    else if (this.isEmpty(this.data.refund.contact_phone)) {
      errorMsg = '请填联系方式';
    }
    if(!this.isEmpty(errorMsg)){
      this.showZanTopTips(errorMsg);
      return;
    }
    
    console.info(event);
  },

  /**
   * 工具方法，校验
   */
  isEmpty: function (str) {
    return str == null || str == '';
  }
}))