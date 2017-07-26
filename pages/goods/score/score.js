import Tips from "../../../class/utils/Tips";
import Router from "../../../class/utils/Router";
import OrderService from "../../../class/service/OrderService";

const notification = require("../../../class/utils/WxNotificationCenter.js");
const app = getApp();
const orderService = new OrderService();
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
      score.starArr[i] = i <= index ? 1 : 0;
    }
    score.star = index + 1;
    this.setData({ scores: scores });
  },
  input(event) {
    const index = event.currentTarget.dataset.index;
    const value = event.detail.value;
    const scores = this.data.scores;
    scores[index].comment = value;
    this.setData({ scores: scores });
  },
  onSubmitTap(event) {
    const {orderId, scores} = this.data;
    const data = scores.map(item => {
      return {
        comment: item.comment,
        sku: item.sku,
        star: item.star,
        goodsId: item.goodsId,
        orderId: orderId
      }
    });
    
    Tips.confirm('确认评价？').then(() => {
      Tips.loading();
      return orderService.comment(orderId, data);
    }).then(res => {
      Tips.toast('评价成功', () => Router.orderIndexRefresh());
    });
  }
})