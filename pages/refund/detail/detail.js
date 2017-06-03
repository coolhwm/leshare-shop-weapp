// pages/refund/detail/detail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    steps: [
      {
        done: true,
        current: true,
        text: '款项已原路退回，请注意查收',
        timestape: '2017/10/10 12:20'
      },
      {
        done: false,
        current: false,
        text: '卖家已同意退款',
        timestape: '2017/10/10 12:20'
      },
      {
        done: false,
        current: false,
        text: '等待卖家处理中,卖家24小时未处理将自动退款',
        timestape: '2017/10/10 12:20'
      },
      {
        done: false,
        current: false,
        text: '您的取消申请已提交，请耐心等待',
        timestape: '2017/10/10 12:20'
      }
    ],
    refund: {}
  },


  onLoad: function (options) {
    const refundStr = options.refund;
    const refund = JSON.parse(refundStr);
    this.setData({ refund: refund });
  }
})