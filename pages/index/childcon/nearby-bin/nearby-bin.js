// pages/index/childcon/nearby-bin/nearby-bin.js
Component({
  options: {
    styleIsolation: 'apply-shared'
  },
  properties: {
    nearByInfo: {
      type: Object,
      value: {}
    }
  },
  data: {
    title: "距离最近的回收箱",
    content_btn: "正常投递"
  },
  methods: {
    binsListShow() {
      wx.getSetting({
        success(res) {
          if (res.authSetting['scope.userLocation'] == false) {
            wx.openSetting({
              success(res) {
                console.log(res.authSetting)
              }
            })
          } else {
            wx.navigateTo({
              url: '../binsLists/binsLists',
              events: {
                // 为指定事件添加一个监听器，获取被打开页面传送到当前页面的数据
                acceptDataFromOpenedPage: function(data) {
                  console.log(data)
                },
                someEvent: function(data) {
                  console.log(data)
                }
              },
              success: function(res) {
                // 通过eventChannel向被打开页面传送数据
                res.eventChannel.emit('acceptDataFromOpenerPage', {
                  data: 'test'
                })
              }
            })
          }
        }
      })

    }
  }
})