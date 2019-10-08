import { TOKEN, VALIDTIME } from '../../common/const.js'
import { isTokenFailure } from '../../util/util.js'
import { getNearbyBin, getBinLists } from '../../service/api/recyclingBins.js'
import { updateToken } from '../../service/api/user.js'
//获取应用实例
const app = getApp()
Page({
  data: {
    ismap: true,
    token: "",
    lat: null,
    lng: null,
    bearByArr: {},
    fromListMode: false,
    getOptions: {}
  },
  onLoad: function (options) {
    const token = wx.getStorageSync(TOKEN);
    if (isTokenFailure()) {
      // token有效
      this.data.token = token;
      if (options.name) {
        this.data.getOptions = options;
        this.data.fromListMode = true;
      }else {
        this.data.fromListMode = false;
      }
      this._getData();
    } else {
      // token无效
      if (token && token.length != 0) {
        // 刷新token
        updateToken(token, this);
      } else {
        // token不存在需用户重新登录
        app.login()
      }
    }
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
      type: 'gcj02',
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
      this.setData({
        bearByArr: res.data
      })
      if (this.data.fromListMode){
        this.setData({
          'bearByArr.name': this.data.getOptions.name,
          'bearByArr.address': this.data.getOptions.address,
          'bearByArr.no': this.data.getOptions.no,
          'bearByArr.distance': this.data.getOptions.distance,
        })
      }
    }).catch(res => {
      console.log(res)
    })
  },
  // -----------------事件监听及操作---------------------
  changeShowModule(){
    var bearByArr = this.data.bearByArr;
    wx.navigateTo({
      url: '../binsListsMode/binsListsMode',
    })
  },
  onPullDownRefresh() { //下拉刷新
    wx.stopPullDownRefresh();
  }
})