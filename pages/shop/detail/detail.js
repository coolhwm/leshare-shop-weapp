import { Http } from "../../../class/utils/Http.js";
var app = getApp();

Page({
  data: {
    shop: {}
  },
  onLoad: function (options) {
    let shopId = options.shopId;
    let baseUrl = app.globalData.baseUrl;

    //加载店铺详情信息
    Http.get(`${baseUrl}/shops/${shopId}`, data => {
      this.setData({ shop: data });
    });
  },
  onMoreTap: function (event) {
    wx.openCard({
      cardList: [
        {
          "card_id": "pbKBy1YikpXBRSDxCkRW7cNLuA8A",
          "code": "550511081223"
        }
      ],
      success: (res) => {
        console.info("success open",res);
      },
      fail:  (res) => {
        console.info("fail open",res);
      }
    });
  }
})