Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {

  },
  methods: {
    // 调用相机扫描二维码
    getScanCode(e) {
      wx.scanCode({
        onlyFromCamera: true,
        success(res) {
          console.log(res)
        }
      })
    },
    // 跳转到分类页面
    categroiesShow(e){
      console.log("进入分类页面")
      wx.navigateTo({
        url: '../categroies/categroies',
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
    },
    // 跳转到投递指南页面
    deliveryGuideShow(){
      console.log("进入投递指南页面")
      wx.navigateTo({
        url: '../deliveryGuide/deliveryGuide',
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