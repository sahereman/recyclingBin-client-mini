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
    this.getLocation();
  },
  // 登录
  login(){
    wx.login({
      success: loginRes => {
        this.globalData.code = loginRes.code
      }
    })
  },
  // 获取位置信息
  getLocation() {
    // 获取位置信息
    wx.getLocation({
      type: 'wgs84',
      success: res => {
        console.log(res)
          this.globalData.lat = res.latitude;
          this.globalData.lng = res.longitude
        // wx.setStorageSync(LAT, res.latitude)
        // wx.setStorageSync(LNG, res.longitude)
        // this._getNearbyBin()
        // wx.getSetting({
        //   success: settingRes => {
        //     if (settingRes.authSetting['scope.userInfo']) {
        //       this._getNearbyBin()
        //     }
        //   }
        // })
      },
      fail: res => {
        console.log(res)
      }
    })
  },
})