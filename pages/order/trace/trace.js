import ExpressService from "../../../class/service/ExpressService";

const expressService = new ExpressService();

Page({

  data: {
    steps: [],
    info: {},
    order: {},
  },


  onLoad: function (options) {
    const order = option.order;
    this.setData({
      order: order
    });

    expressService.queryTrace(order.id).then(express => {
      this.setData(express);
    });

  }
})