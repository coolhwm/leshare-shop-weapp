import AddressService from "../../../class/service/AddressService";

const addressService = new AddressService();

Page({
  page: {},
  data: {
    addresses: []
  },

  onLoad: function (options) {
    this.page = addressService.page();
    this.loadNextPage();
  },

  /**
  * 加载下一页
  */
  loadNextPage: function () {
    this.page.next().then(data => {
      this.setData({ addresses: data.list });
    });
  },


});