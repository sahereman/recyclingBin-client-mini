// pages/deliver/deliver.js
import { checkscanSuccess, getOrderDetail } from '../../service/api/recyclingBins.js'
import { TOKEN } from '../../common/const.js'
Page({
  data: {
    isComplete: false,
    timer:null,//定时器
    token_id:'',
    userItems:{}
  },
  onLoad: function(options) {
    var that = this;
    
    const eventChannel = this.getOpenerEventChannel()
    
    // 监听acceptDataFromOpenerPage事件，获取上一页面通过eventChannel传送到当前页面的数据
    eventChannel.on('acceptDataFromOpenerPage', function (data) {
      that.data.token_id = data.data;
      that.checkIsSuccess();
    })
  },
  onUnload:function(){
    clearInterval(this.data.timer);
  },
  //判读是否投递成功
  checkIsSuccess: function() {
    var that = this;
    that.data.timer = setInterval(function () {
      const token = wx.getStorageSync(TOKEN);
      const requestData = {
        token: token,
        token_id: that.data.token_id 
      }
      checkscanSuccess(requestData).then(res => {
        if (res.data.related_id){
          console.log("成功了");
          clearInterval(that.data.timer); 
          var orderParams = {
            token: token,
            order_id:res.data.related_id
          }
          getOrderDetail(orderParams).then(response => {
            console.log(response);
            if (response.statusCode == 200){
              
              that.setData({
                isComplete: !that.data.isComplete,
                userItems: response.data
              })
            }
            
          }).catch(error => {
            console.log(error)
          })



        }
      }).catch(res => {
        console.log(res)
      })
    }, 1000);
  }
})