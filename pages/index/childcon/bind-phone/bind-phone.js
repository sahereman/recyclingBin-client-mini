// pages/index/childcon/my-reward/my-reward.js
Component({
  properties: {
    loginState: {
      type: Number,
      value: 0
    }
  },
  data: {
    
  },

  /**
   * 组件的方法列表
   */
  methods: {
    leavepage:function(){
      var that = this;
      if (that.data.loginState == 0){
        wx.navigateTo({
          url: '../../pages/login/login'
        })
      }else{
        wx.navigateTo({
          url: '../../pages/bindPhone/bindPhone'
        })
      }
    }
  }
})
