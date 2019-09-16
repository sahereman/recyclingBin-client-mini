import { TOKEN, VALIDTIME } from '../../common/const.js'
import {getToken,updateToken} from '../../service/api/user.js'
import {getBanners} from '../../service/api/banner.js'
import { isTokenFailure } from '../../util/util.js'
import { getNearbyBin, getBinLists } from '../../service/api/recyclingBins.js'

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
    showModal: true, // 显示modal弹窗
    single: false // false 只显示一个按钮，如果想显示两个改为true即可
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
    // 发送网络请求
    this._getData();
  },
  // ------------------网络请求相关方法----------
  _getData(){
    this._getBanners()
    // 获取位置授权及信息
    this.getLocation()
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
      lat: this.data.lat,
      lng: this.data.lng
    }
    // console.log(requestData)
    getNearbyBin(requestData).then(res => {
      console.log(res)
    }).catch(res => {
      console.log(res)
    })
  },
  // -------------------------------事件操作----------
  // 获取用户信息
  getUserInfo(e){
    // 点击授权登陆后获取token并存住
    if(app.globalData.code){
      if (e.detail.errMsg == "getUserInfo:ok") {
        this.setData({ show: false })
        app.globalData.userInfo = e.detail.userInfo
        const requestData = {
          code: app.globalData.code,
          iv: e.detail.iv,
          encryptedData: e.detail.encryptedData
        }
        // 获取token
        getToken(requestData);
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
        console.log(res)
        this.setData({
          lat: res.latitude,
          lng: res.longitude
        })
        wx.getSetting({
          success: settingRes => {
            if (settingRes.authSetting['scope.userInfo']) {
              this._getNearbyBin()
              // this._getBinsLists()
            }
          }
        })
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
  },
  confirm(){
    console.log("点击了自定义组件的确定按钮")
  }
})
