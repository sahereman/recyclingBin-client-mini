// pages/index/childcon/nearby-bin/nearby-bin.js
Component({
  options: {
    styleIsolation: 'apply-shared'
  },
  properties: {

  },
  data: {
    title: "距离最近的回收箱",
    content_title: "诺德广场B座",
    content_info: "敦化路328号诺德广场敦化路328号诺德广场敦化路328号诺德广场敦化路328号诺德广场",
    content_btn: "正常投递"
  },
  methods: {
    binsListShow(){
      wx.navigateTo({
        url: '../binsLists/binsLists',
        events: {
          // 为指定事件添加一个监听器，获取被打开页面传送到当前页面的数据
          acceptDataFromOpenedPage: function (data) {
            console.log(data)
          },
          someEvent: function (data) {
            console.log(data)
          }
        },
        success: function (res) {
          // 通过eventChannel向被打开页面传送数据
          res.eventChannel.emit('acceptDataFromOpenerPage', { data: 'test' })
        }
      })
    }
  }
})
