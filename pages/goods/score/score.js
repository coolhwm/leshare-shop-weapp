import Tips from "../../../class/utils/Tips";
import GoodsService from "../../../class/service/GoodsService";

const notification = require("../../../class/utils/WxNotificationCenter.js");
const app = getApp();
const goodsService = new GoodsService();
Page({
  data: {
    orderId: '',
    scores: []
  },
  onLoad: function ({orderId, data}) {
    const scores = JSON.parse(data);
    this.setData({
      orderId: orderId,
      scores: scores
    });
  },
  onStarTap({currentTarget}) {
    const {goodsId, goodsSku, index} = currentTarget.dataset;
    const scores = this.data.scores;
    const score = scores.find(item => item.goodsId == goodsId && item.sku == goodsSku);
    for (let i = 0; i < 5; i++) {
      score.star[i] = i <= index ? 1 : 0;
    }
    score.score = index + 1;
    this.setData({ scores: scores });
  },
  input(event) {
    const index = event.currentTarget.dataset.index;
    const value = event.detail.value;
    const scores = this.data.scores;
    scores[index].note = value;
    this.setData({ scores: scores });
  },
  onSubmitTap(event) {
    console.info('submit')
  }
})