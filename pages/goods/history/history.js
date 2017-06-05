import LogService from "../../../class/service/LogService";
import Router from "../../../class/utils/Router";
const logService = new LogService();


Page({
  page: {},
  data: {
    histories: []
  },

  onLoad: function (options) {
    //初始化分页参数
    this.page = logService.page();
    this.loadNextPage();
  },

  reload: function () {
    this.page.reset();
    this.loadNextPage();
  },

  /**
   * 加载下一页
   */
  loadNextPage: function () {
    this.page.next().then(data => {
      this.setData({ histories: data.list });
    });
  },

  /**
  * 下拉刷新
  */
  onPullDownRefresh: function () {
    this.reload();
  },

  /**
  * 上划加载
  */
  onReachBottom: function (event) {
    this.loadNextPage();
  },

  /***********************操作事件***********************/

  /**
   * 点击商品
   */
  onGoodsTap: function(event){
      const goodsId = event.currentTarget.dataset.goodsId;
      Router.goodsIndex(goodsId);
  }
});