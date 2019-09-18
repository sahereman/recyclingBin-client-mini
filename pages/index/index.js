import { TOKEN, LAT, LNG, VALIDTIME } from '../../common/const.js'
import { getToken, updateToken} from '../../service/api/user.js'
import {getBanners} from '../../service/api/banner.js'
import { isTokenFailure } from '../../util/util.js'
import { getNearbyBin, getBinLists } from '../../service/api/recyclingBins.js'
import { examineToken } from '../../util/util.js'

//获取应用实例
const app = getApp()
Page({
  data: {
    banners: [],
    show: true,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    token:"",
    lat: null,
    lng: null,
    showModal: false, // 显示modal弹窗
    single: false, // false 只显示一个按钮，如果想显示两个改为true即可
    nearBybininfo:{}
  },
  onLoad: function () {
    // 判断token，刷新token
    isTokenFailure();
    const token = wx.getStorageSync(TOKEN);
    if (token && token.length != 0) {
      this.setData({ 
        show: false,
        token: token
      })
    }
  },
  onShow: function () {
    this._getData();
  },
  // ------------------网络请求相关方法----------
  _getData(){
    this._getBanners()
    this.getLocation()
  },
  // 获取token
  _getToken(requestData){
    getToken(requestData).then(res => {
      // 存储到本地缓存
      const token = res.data.token_type + " " + res.data.access_token
      const validTime = res.data.expires_in
      // token和有效期存入缓存
      wx.setStorageSync(TOKEN, token)
      examineToken(validTime)
      this.setData({ 
        show: false,
        token: token
      })
      this._getData();
    }).catch(err => {
      console.log(err)
    })
  },
  // 获取banner图数组
  _getBanners(){
    const requestData = {
      pageName: 'mini-index'
    }
    getBanners(requestData).then(res => {
      const banners = res.data.data.map(item => {
        return item.image_url
      })
      this.setData({
        banners: banners
      })
    }).catch(res =>{
      console.log(res)
    })
  },
  // 获取距离最近的回收箱
  _getNearbyBin(){
    const requestData = {
      token: this.data.token,
      lat: app.globalData.lat,
      lng: app.globalData.lng
    }
    getNearbyBin(requestData).then(res => {
      this.setData({
        nearBybininfo: res.data
      })
    }).catch(res => {
      console.log(res)
    })
  },
  // -------------------------------事件监听及操作----------
  // 获取用户信息
  getUserInfo(e){
    if(app.globalData.code){
      if (e.detail.errMsg == "getUserInfo:ok") {
        app.globalData.userInfo = e.detail.userInfo
        const requestData = {
          code: app.globalData.code,
          iv: e.detail.iv,
          encryptedData: e.detail.encryptedData
        }
        // 获取token
        this._getToken(requestData)
      }
    }else {
      // app.login()
    }
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
        app.globalData.lat = res.latitude;
        app.globalData.lng = res.longitude;
        this._getNearbyBin()
      },
      fail: res => {
        console.log(res)
      }
    })
  },
  // 点击取消按钮的回调函数
  modalCancel(e) {
    // 这里面处理点击取消按钮业务逻辑
    console.log('点击了取消')
  },
  // 点击确定按钮的回调函数
  modalConfirm(e) {
    // 这里面处理点击确定按钮业务逻辑
    console.log('点击了确定')
  }
})
