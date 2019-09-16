//app.js
// 封装的数据请求方法
import request from '/service/network.js'
import { isTokenFailure } from '/util/util.js'
import { getToken } from '/service/api/user.js'
import { TOKEN, VALIDTIME} from '/common/const.js'

App({
  globalData: {
    code: null,
    userInfo: null,
    iv: null,
    encryptedData: null
  },
  // 小程序初始化时执行
  onLaunch: function () {
    // 登陆
    this.login();
  },
  // 登录
  login(){
    wx.login({
      success: loginRes => {
        this.globalData.code = loginRes.code
      }
    })
  },
  // 获取用户信息
  getUserInfo(code){
    console.log("获取用户信息")
    wx.getSetting({
      success: settingRes => {
        if (settingRes.authSetting['scope.userInfo']) {
          // 已经授权，直接调用getUserInfo获取用户信息
          wx.getUserInfo({
            success: successInfo => {
              this.globalData.iv = successInfo.iv
              this.globalData.encryptedData = successInfo.encryptedData
              const requestData = {
                code:code,
                iv: this.globalData.iv,
                encryptedData: this.globalData.encryptedData
              }
              // 获取token
              // getToken(requestData);
            },
            fail: failInfo => {
              // 用户信息获取失败（可以跳转到登陆页）
              console.log(failInfo)
            }
          })
        }else {
          // 如果用户未授权
        }
      }
    })
  }
})