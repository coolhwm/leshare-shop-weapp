import { Http } from "../../../class/utils/Http.js";
import ShopService from "../../../class/service/ShopService";

const app = getApp();
const shopService = new ShopService();

Page({
  data: {
    shop: {}
  },
  onLoad: function (options) {
    //请求店铺基本信息
    shopService.getInfo().then(data => {
      this.setData({ shop: data });
    });
  },
  
  onMoreTap: function (event) {

  }
})