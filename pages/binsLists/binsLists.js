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
    bearByArr: {}
  },
  onLoad: function (options) {
    const token = wx.getStorageSync(TOKEN);
    if (isTokenFailure()) {
      // token有效
      this.data.token = token;
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
  onShow: function () {
    var that = this;
    const eventChannel = this.getOpenerEventChannel()
    // 监听acceptDataFromOpenerPage事件，获取上一页面通过eventChannel传送到当前页面的数据
    eventChannel.on('acceptDataFromOpenerPage', function (data) {
      console.log(data);
      if (data.data.lat && data.data.lng){
        that.setData({
          lat: data.data.lat,
          lng: data.data.lng
        })
        that._getNearbyBin();
      }else{
        that._getData();
      }
    })
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
    wx.redirectTo({
      url: '../binsListsMode/binsListsMode',
    })
  }
})