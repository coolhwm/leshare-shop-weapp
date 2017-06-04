import ExpressService from "../../../class/service/ExpressService";

const expressService = new ExpressService();

Page({

  data: {
    steps: [],
    info: {},
    order: {},
  },


  onLoad: function (options) {
    const order = JSON.parse(options.order);

    this.setData({
      order: order
    });

    expressService.queryTrace(order.orderId).then(express => {
      this.setData(express);
    });

  }
})