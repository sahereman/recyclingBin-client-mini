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
    encryptedData: null,
    lat:null,
    lng:null
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
  }
})