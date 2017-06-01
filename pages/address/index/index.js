import AddressService from "../../../class/service/AddressService";
import Router from "../../../class/utils/Router";
import Tips from "../../../class/utils/Tips";

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

  onShow: function (options) {
    if (options && options.reload) {
      this.onPullDownRefresh();
    }
  },

  /**
  * 加载下一页
  */
  loadNextPage: function () {
    this.page.next().then(data => {
      this.setData({ addresses: data.list });
    });
  },

  /**
   * 上划加载
   */
  onReachBottom: function (event) {
    this.loadNextPage();
  },


  /**
   * 下拉刷新
   */
  onPullDownRefresh: function () {
    this.page.reset();
    this.loadNextPage();
    wx.stopPullDownRefresh();
  },

  //******************* 页面操作 ******************/

  /**
   * 从微信新增
   */
  onWxAddressTap: function () {
    addressService.wxAddress()
      .then(res => {
        const message = `确定增加：${res.name},${res.phone},${res.province}${res.city}${res.country},${res.detail}作为收货地址?`;
        return Tips.confirm(message, res);
      })
      .then(addressService.save.bind(addressService))
      .then(res => {
        Tips.toast('地址新增成功', () => this.onPullDownRefresh());
      });
  },

  /**
   * 点击默认
   */
  onDefaultTap: function (event) {
    const addrId = event.currentTarget.dataset.id;
    Tips.loading();
    addressService.default(addrId).then(res => {
      Tips.toast('设置成功', () => this.onPullDownRefresh());
    });
  },

  /**
   * 删除地址
   */
  onDeleteTap: function (event) {
    const addrId = event.currentTarget.dataset.id;
    Tips.confirm('是否确认删除该地址', addrId)
      .then(res =>{
        Tips.loading();
        return addressService.remove(addrId);
      })
      .then(res => {
        Tips.toast('删除成功', () => this.onPullDownRefresh());
      });
  },

  /**
   * 编辑地址
   */
  onEditTap: function (event) {
    const addrId = event.currentTarget.dataset.id;
    const result = this.data.addresses.filter(addr => addr.id == addrId);
    if(result.length > 0){
      const addr = JSON.stringify(result[0]);
      Router.addressEdit(addr);
    }
  }
});