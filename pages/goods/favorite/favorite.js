import FavoriteService from "../../../class/service/FavoriteService";

const favoriteService = new FavoriteService();
Page({
  page: {},
  data: {
    favorites: []
  },

  onLoad: function (options) {
    //初始化分页参数
    this.page = favoriteService.page();
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
      console.info('收藏信息', data);
    });
  },

  /**
  * 上划加载
  */
  onReachBottom: function (event) {
    this.loadNextPage();
  },

   /***********************操作事件***********************/
})