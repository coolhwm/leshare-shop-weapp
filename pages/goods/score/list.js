import Tips from "../../../class/utils/Tips";
import Router from "../../../class/utils/Router";
import OrderService from "../../../class/service/OrderService";

const app = getApp();
const Tab = require('../../../templates/tab/index');
const orderService = new OrderService();

Page(Object.assign({}, Tab, {
  page: {},
  data: {
    comments: [],
    init: false
  },
  onLoad: function ({goodsId}) {
    this.data.goodsId = goodsId;
    Tips.loading();
    //初始化分页参数
    this.page = orderService.commentList();
    orderService.commentCount(this.data.goodsId).then(res => {
      this.setData(
        {
          "tab": {
            "list": [
              { "id": "GOOD", "title": `满意（${res.GOOD}）` },
              { "id": "NORMAL", "title": `一般（${res.NORMAL}）` },
              { "id": "BAD", "title": `不满意（${res.BAD}）` }
            ],
            "selectedId": "GOOD",
            "scroll": false
          },
        }
      );
    }).then(() => {
      this.loadNextPage();
    });
  },

  reload: function () {
    this.page.reset();
    this.loadNextPage();
    wx.stopPullDownRefresh();
  },

  /**
   * 加载下一页
   */
  loadNextPage: function () {
    const param = {
      status: this.data.tab.selectedId,
      goods_id: this.data.goodsId
    };
    this.page.next(param).then(data => {
      this.setData({
        comments: data.list,
        init: true
      });
      Tips.loaded();
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
  /**
   * 处理点击事件
   */
  handleZanTabChange(e) {
    var componentId = e.componentId;
    var selectedId = e.selectedId;

    this.setData({
      [`${componentId}.selectedId`]: selectedId
    });
    this.reload();
  },
}));