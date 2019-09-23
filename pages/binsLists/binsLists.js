import { TOKEN, VALIDTIME } from '../../common/const.js'
import { isTokenFailure } from '../../util/util.js'
import { getNearbyBin, getBinLists } from '../../service/api/recyclingBins.js'

Page({
  data: {
    ismap: true,
    token: "",
    lat: null,
    lng: null,
    bearByArr: {}
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
  },
  onShow: function () {
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
        this.setData({
          lat: res.latitude,
          lng: res.longitude
        })
        this._getNearbyBin();
      },
      fail: res => {
        console.log(res)
      }
    })
  },
  // // 获取距离最近的回收箱
  _getNearbyBin() {
    const requestData = {
      token: this.data.token,
      lat: this.data.lat,
      lng: this.data.lng
    }
    getNearbyBin(requestData).then(res => {
      console.log(res)
      this.setData({
        bearByArr: res.data
      })
    }).catch(res => {
      console.log(res)
    })
  },
  // -----------------事件监听及操作---------------------
  changeShowModule(){
    wx.navigateTo({
      url: '../binsListsMode/binsListsMode',
    })
  }
})