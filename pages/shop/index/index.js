import {Http} from "../../../class/utils/Http.js";
var app = getApp();

Page({
  data: {
    shop: {},
    goods: [],
    notice: []
  },
  onLoad: function (options) {
    let shopId = app.globalData.lastShopId;
    let baseUrl = app.globalData.baseUrl;
    let baseImgUrl = app.globalData.imgUrl;

    //请求店铺基本信息
    Http.get(`${baseUrl}/shops/${shopId}`, (data) =>{
      this.setData({ shop: data });
    });

    //请求公告信息
    Http.get(`${baseUrl}/shops/${shopId}/notices/shows`, (data) =>{
      this.setData({ notice: data[0] });
    });

    
    //请求店铺商品信息
    Http.get(`${baseUrl}/shops/${shopId}/goods?from=0&limit=10&by=id&sort=asc`, (data) =>{
      for(let item of data){
        //结构赋值
        var {name, sell_price, original_price, images} = item;

        //长名字处理
        if(name.length > 12){
          item.name = name.substring(0,12) + "...";
        }

        //销售价处理
        if(original_price == null || original_price == 0){
          item.original_price = sell_price;
        }
        
        //图片处理
        if(images == null || images.length < 1){
          item.imageUrl = "/images/goods/mock.png";
        }
        else if(images[0].url == null){
          item.imageUrl = "/images/goods/mock.png";
        }
        else{
          item.imageUrl = baseImgUrl + images[0].url;
        }
      }

      this.setData({ goods: data });
    });
    
  }, 
  onGoodsItemTap : function(event){
    let goodsId = event.currentTarget.dataset.goodsId;
    wx.navigateTo({
      url : "/pages/goods/index/index?goodsId=" + goodsId
    });
  }
})