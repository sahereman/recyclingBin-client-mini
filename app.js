import { isTokenFailure } from '/util/util.js'
import { TOKEN, LISTBINTAP } from '/common/const.js'

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
    const token = wx.getStorageSync(TOKEN);
    if (!token && token.length == 0) {
      // 登陆
      this.login();
    }
    // else {
    //   isTokenFailure();
    // }
  },
  // 登录
  login(){
    wx.login({
      success: loginRes => {
        this.globalData.code = loginRes.code
      }
    })
  },
  onHide: function () {
    const listbintap = wx.getStorageSync(LISTBINTAP);
    if (listbintap) {
      wx.removeStorage({
        key: LISTBINTAP
      })
    }
  }
})