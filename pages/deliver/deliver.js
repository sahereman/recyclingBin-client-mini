// pages/deliver/deliver.js
import { checkscanSuccess, getOrderDetail } from '../../service/api/recyclingBins.js'
import { TOKEN } from '../../common/const.js'
import { isTokenFailure, forbiddenReLaunch } from '../../util/util.js'
import { updateToken } from '../../service/api/user.js'
//获取应用实例
const app = getApp()
Page({
  data: {
    isComplete: false,
    timer:null,//定时器
    token_id:'',
    userItems:{}
  },
  onLoad: function(options) {
    var that = this;
    that.data.token_id = options.id;
    that.checkIsSuccess();
    // const eventChannel = this.getOpenerEventChannel()
    
    // // 监听acceptDataFromOpenerPage事件，获取上一页面通过eventChannel传送到当前页面的数据
    // eventChannel.on('acceptDataFromOpenerPage', function (data) {
    //   that.data.token_id = data.data;
    //   that.checkIsSuccess();
    // })
  },
  onUnload:function(){
    clearInterval(this.data.timer);
  },
  //判读是否投递成功
  checkIsSuccess: function() {
    var that = this;
    that.data.timer = setInterval(function () {
      const token = wx.getStorageSync(TOKEN);
      if (isTokenFailure()) {
        // token有效
        that.data.token = token;
      } else {
        // token无效
        if (token && token.length != 0) {
          // 当token存在只需要进行更新
          // 刷新token
          updateToken(token, that);
        } else {
          // token不存在需用户重新登录
          app.login()
        }
      }
      const requestData = {
        token: token,
        token_id: that.data.token_id 
      }
      checkscanSuccess(requestData).then(res => {
        console.log(res);
        if (res.statusCode == 403) {
          forbiddenReLaunch();
          return;
        } else if (res.statusCode == 404){
          wx.reLaunch({
            url:'../../pages/index/index'
          })
        }else{
          if (res.data.related_id) {
            clearInterval(that.data.timer);
            var orderParams = {
              token: token,
              order_id: res.data.related_id
            }
            getOrderDetail(orderParams).then(response => {
              if (res.statusCode == 403) {
                forbiddenReLaunch();
                return;
              }
              if (response.statusCode == 200) {
                that.setData({
                  isComplete: !that.data.isComplete,
                  userItems: response.data
                })
              }

            }).catch(error => {
              console.log(error)
            })
          }
        }
      }).catch(res => {
        console.log(res)
      })
    }, 1000);
  },
  onPullDownRefresh() { //下拉刷新
    wx.stopPullDownRefresh();
  }
})