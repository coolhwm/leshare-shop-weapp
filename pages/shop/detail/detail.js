import {Http} from "../../../class/utils/Http.js";
var app = getApp();

Page({
  data:{
    shop : {}
  },
  onLoad:function(options){
    let shopId = options.shopId;
    let baseUrl = app.globalData.baseUrl;
    
    //加载店铺详情信息
    Http.get(`${baseUrl}/shops/${shopId}`, data => {
      this.setData({shop : data});
    });
  }
})