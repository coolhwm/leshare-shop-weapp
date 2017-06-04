import ExpressService from "../../../class/service/ExpressService";

const expressService = new ExpressService();

Page({

  data: {
    steps: [],
    info: {},
    order: {},
  },


  onLoad: function (options) {
    console.info(options);
    //const order = JSON.parse(options.order);
    //模拟测试
    const order = {
      imageUrl: 'http://op09okwcw.bkt.clouddn.com/timg.jpg',
      goodsCount: 2,
      orderId: 1628
    };
    
    this.setData({
      order: order
    });

    expressService.queryTrace(order.orderId).then(express => {
      this.setData(express);
    });

  }
})