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
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})