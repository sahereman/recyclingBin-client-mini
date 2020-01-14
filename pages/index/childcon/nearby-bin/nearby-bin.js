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
    content_btn: "正常投递",
    buttonClicked:true
  },
  methods: {
    binsListShow() {
      var that = this;
      if (that.data.buttonClicked){//防止重复点击
        that.setData({
          buttonClicked:false
        })
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
              })
            }
          }
        })
      }
      var timer = setTimeout(function(){
        that.setData({
          buttonClicked: true
        })
        clearTimeout(timer);
      },3000)
    }
  }
})