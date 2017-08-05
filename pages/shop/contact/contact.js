// pages/shop/contact/contact.js
Page({

  data: {
  
  },

  onLoad: function (options) {
  
  },
  call: function () {
    wx.makePhoneCall({
        phoneNumber: '059187519835'
    });
  },
})