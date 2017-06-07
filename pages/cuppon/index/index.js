const Tab = require('../../../templates/tab/index');

Page(Object.assign({}, Tab, {

  data: {
     tab: {
      list: [{
        id: 'all',
        title: '未使用(43)'
      }, {
        id: 'topay',
        title: '使用记录(24)'
      }, {
        id: 'tosend',
        title: '已过期(27)'
      }],
      selectedId: 'all',
      scroll: false
    },
  },

  onLoad: function (options) {
  
  }
}))