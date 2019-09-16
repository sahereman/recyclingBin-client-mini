import { TOKEN, VALIDTIME } from '../../common/const.js'
import { isTokenFailure } from '../../util/util.js'
import { getNearbyBin, getBinLists } from '../../service/api/recyclingBins.js'

Page({
  data: {
    ismap: true,
    token: "",
    lat: null,
    lng: null,
    binsLists: []
  },
  onLoad: function (options) {
    // 判断token，刷新token
    isTokenFailure();
    const token = wx.getStorageSync(TOKEN);
    if (token && token.length != 0) {
      this.setData({
        token: token
      })
    }
    this._getData();
  },
  // ------------------网络请求-------------------
  _getData() {
    // 获取位置授权及信息
    this.getLocation()
  },
  // 获取位置信息
  getLocation() {
    // 获取位置信息
    wx.getLocation({
      type: 'wgs84',
      success: res => {
        console.log(res)
        this.setData({
          lat: res.latitude,
          lng: res.longitude
        })
        wx.getSetting({
          success: settingRes => {
            if (settingRes.authSetting['scope.userInfo']) {
              this._getBinsLists()
            }
          }
        })
      },
      fail: res => {
        console.log(res)
      }
    })
  },
  // 获取回收箱列表
  _getBinsLists() {
    const requestData = {
      token: this.data.token,
      lat: this.data.lat,
      lng: this.data.lng
    }
    getBinLists(requestData).then(res => {
      console.log(res)
      this.setData({
        binsLists: res.data.data
      })
    }).catch(res => {
      console.log(res)
    })
  },
  // -----------------操作方法---------------------
})