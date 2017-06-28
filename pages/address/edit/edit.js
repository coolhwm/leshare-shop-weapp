import AddressService from "../../../class/service/AddressService";
import Router from "../../../class/utils/Router";
import Tips from "../../../class/utils/Tips";

const notification = require("../../../class/utils/WxNotificationCenter.js");
const addressService = new AddressService();
var area = require('../../../data/area')
var p = 0, c = 0, d = 0
Page({
  data: {
    provinceName: [],
    provinceCode: [],
    provinceSelIndex: '',
    cityName: [],
    cityCode: [],
    citySelIndex: '',
    districtName: [],
    districtCode: [],
    districtSelIndex: '',
    showMessage: false,
    messageContent: '',
    showDistpicker: false,
    init: false
  },
  onLoad: function (options) {
    // 载入时要显示再隐藏一下才能显示数据，如果有解决方法可以在issue提一下，不胜感激:-)
    // 初始化数据
    this.setAreaData();

    //编辑模式
    const param = options.addr;
    if (param) {
      const addr = JSON.parse(param);
      this.setFormData(addr);
    }
    this.setData({init: true});
  },
  setAreaData: function (p, c, d) {
    var p = p || 0 // provinceSelIndex
    var c = c || 0 // citySelIndex
    var d = d || 0 // districtSelIndex
    // 设置省的数据
    var province = area['100000']
    var provinceName = [];
    var provinceCode = [];
    for (var item in province) {
      provinceName.push(province[item])
      provinceCode.push(item)
    }
    this.setData({
      provinceName: provinceName,
      provinceCode: provinceCode
    })
    // 设置市的数据
    var city = area[provinceCode[p]]
    var cityName = [];
    var cityCode = [];
    for (var item in city) {
      cityName.push(city[item])
      cityCode.push(item)
    }
    this.setData({
      cityName: cityName,
      cityCode: cityCode
    })
    // 设置区的数据
    var district = area[cityCode[c]]
    var districtName = [];
    var districtCode = [];
    for (var item in district) {
      districtName.push(district[item])
      districtCode.push(item)
    }
    this.setData({
      districtName: districtName,
      districtCode: districtCode
    })
  },
  changeArea: function (e) {
    p = e.detail.value[0]
    c = e.detail.value[1]
    d = e.detail.value[2]
    this.setAreaData(p, c, d)
  },
  showDistpicker: function () {
    this.setData({
      showDistpicker: true
    })
  },
  distpickerCancel: function () {
    this.setData({
      showDistpicker: false
    })
  },
  distpickerSure: function () {
    this.setData({
      provinceSelIndex: p,
      citySelIndex: c,
      districtSelIndex: d
    })
    this.distpickerCancel()
  },
  savePersonInfo: function (e) {
    var data = e.detail.value
    var telRule = /^1[3|4|5|7|8]\d{9}$/, nameRule = /^[\u2E80-\u9FFF]+$/
    if (data.name == '') {
      this.showMessage('请输入姓名')
    } else if (!nameRule.test(data.name)) {
      this.showMessage('请输入中文名')
    } else if (data.tel == '') {
      this.showMessage('请输入手机号码')
    } else if (!telRule.test(data.tel)) {
      this.showMessage('手机号码格式不正确')
    } else if (data.province == '') {
      this.showMessage('请选择所在地区')
    } else if (data.city == '') {
      this.showMessage('请选择所在地区')
    } else if (data.district == '') {
      this.showMessage('请选择所在地区')
    } else if (data.address == '') {
      this.showMessage('请输入详细地址')
    } else {
      //this.showMessage(' 保存成功')
      this.saveOrUpdate(data);
    }
  },
  showMessage: function (text) {
    var that = this
    that.setData({
      showMessage: true,
      messageContent: text
    })
    setTimeout(function () {
      that.setData({
        showMessage: false,
        messageContent: ''
      })
    }, 3000)
  },


  //******************* 业务代码 ******************/

  /**
   * 保存/更新
   */
  saveOrUpdate: function (data) {
    console.info(data);
    //构造参数
    const address = {
      name: data.name,
      phone: data.tel,
      province: data.province,
      city: data.city,
      country: data.district,
      detail: data.address,
      isDefault: data.default ? 1 : 0
    }
    //保存地址
    const addrId = this.data.addrId;
    if (addrId) {
      addressService.update(addrId, address).then(this.onSaveOrUpdateSuccess);
    }
    else {
      addressService.save(address).then(this.onSaveOrUpdateSuccess);
    }
  },


  onSaveOrUpdateSuccess: function(){
    //通知列表发生变化
    notification.postNotificationName("ON_ADDRESS_UPDATE");
    Tips.toast('保存成功', () => Router.back());
  },

  /**
   * 初始化数据
   */
  setFormData: function (data) {
    //选择省的数据 provinceSelIndex
    const p = this.data.provinceName.indexOf(data.province);

    // 设置市的数据
    var city = area[this.data.provinceCode[p]]
    var cityName = [];
    var cityCode = [];
    for (var item in city) {
      cityName.push(city[item])
      cityCode.push(item)
    }
    this.setData({
      cityName: cityName,
      cityCode: cityCode
    });

    //选择市的数据
    const c = cityName.indexOf(data.city);

    // 设置区的数据
    var district = area[cityCode[c]]
    var districtName = [];
    var districtCode = [];
    for (var item in district) {
      districtName.push(district[item])
      districtCode.push(item)
    }
    this.setData({
      districtName: districtName,
      districtCode: districtCode
    });

    //选择区的数据
    const d = districtName.indexOf(data.country);

    //数据渲染
    this.setData({
      value: [p, c, d],
      provinceSelIndex: p,
      citySelIndex: c,
      districtSelIndex: d,
      name: data.name,
      tel: data.phone,
      address: data.detail,
      default: data.isDefault == 1,
      addrId: data.id
    });
  }
})