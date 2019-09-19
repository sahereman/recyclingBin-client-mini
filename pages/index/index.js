import { TOKEN, NEARBYBIN, USERINFO, VALIDTIME } from '../../common/const.js'
import { getToken, updateToken, userInfoShow} from '../../service/api/user.js'
import {getBanners} from '../../service/api/banner.js'
import { getNearbyBin, getBinLists } from '../../service/api/recyclingBins.js'
import { examineToken, isTokenFailure } from '../../util/util.js'

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
    showModal: false, // 显示绑定手机号弹窗modal弹窗
    single: false, // false 只显示一个按钮，如果想显示两个改为true即可
    nearBybininfo:{},
    money: "0",  //累计奖励金
    orderCount: 0, //投递次数
    orderMoney: "0",  //当前奖励金
    inphone: null, // 用户输入的手机号
  },
  onLoad: function () {
    const token = wx.getStorageSync(TOKEN);
    if (isTokenFailure()) {
      // token有效
      this.data.token = token;
      this.setData({
        show: false
      })
      this._getData()
    }else {
      // token无效
      if (token && token.length != 0) {
        // 当token存在只需要进行更新
        this.setData({
          show: false
        })
        // 刷新token
        updateToken(token, this);
      }else {
        // token不存在需用户重新登录
        app.login()
        this.setData({
          show: true
        })
      }
    }
  },
  // ------------------网络请求相关方法----------
  _getData(){
    this._getBanners()
    this.getLocation()
    this._getUserInfo()
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
      // wx.setStorage(NEARBYBIN, res.data)
      wx.setStorage({
        key: NEARBYBIN,
        data: res.data
      })
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
  // 获取个人信息
  _getUserInfo() {
    const requestData = {
      token: this.data.token
    }
    userInfoShow(requestData).then(res => {
      // 将个人信息存入缓存在个人中心进行调用
      this.setData({
        money: res.data.money,
        orderCount: res.data.total_client_order_count,
        orderMoney: res.data.total_client_order_money
      })
      if(!res.data.phone) {
        this.setData({
          // showModal: true
        })
      }else {
        this.setData({
          showModal: false
        })
      }
      wx.setStorage({
        key: USERINFO,
        data: res.data
      })
    }).catch(res => {
      console.log(res)
    })
  },
  // 获取验证码
  _sendVerification(){
    const requestData = {
      token: this.data.token,
      phone: this.data.inphone
    }
    sendVerification(requestData).then(res => {
      console.log(res);
    }).catch(res => {
      console.log(res);
    })
  },
  // 绑定手机号
  _bindPhone(){
    const requestData = {
      token: this.data.token,
      phone: this.data.phone
    }
    bindPhone(requestData).then(res => {
      console.log(res);
    }).catch(res => {
      console.log(res);
    })
  }
})
