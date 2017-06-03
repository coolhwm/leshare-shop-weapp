// pages/refund/apply/apply.js
Page({

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
  onInputChange: function(e) {
    console.info(e);
    const refund = this.data.refund;
    refund[e.currentTarget.id] = e.detail.value
    this.setData(refund);
  },
  /**
   * 修改原因
   */
  onReasonChange: function(e) {
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
  onSubmitTap: function(){

  }
})