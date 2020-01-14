import { LISTBINTAP } from '../../common/const.js'
import { forbiddenReLaunch } from '../../util/util.js'
import { getNearbyBin, getTraNearbyBin } from '../../service/api/recyclingBins.js'
//获取应用实例
const app = getApp()
Page({
  data: {
    ismap: true,
    lat: null,
    lng: null,
    bearByArr: {},
    fromListMode: false,
    getOptions: {},
    isSystemLocal: true,
    modelsState:0//机型（传统机/智能机）
  },
  onShow: function (options) {
    this._getData();
  },
  onLoad: function (options) {
    var that = this;
    if (options.modelsState){
      that.setData({
        modelsState: options.modelsState
      })
    }
  },
  // ------------------网络请求-------------------
  _getData() {
    // 获取位置授权及信息
    this.getLatLng()
  },
  // 获取经纬度信息
  getLatLng(){
    var that = this;
    wx.getLocation({
      type: 'gcj02',
      success: res => {
        console.log(res.latitude);
        that.setData({
          lat: res.latitude,
          lng: res.longitude
        })
        const listbintap = wx.getStorageSync(LISTBINTAP);
        if (listbintap) {
          that.setData({
            bearByArr: listbintap,
          })
        } else {
          if (that.data.modelsState == 0){
            that._getNearbyBin();
          }else{
            that.getTradionalData()
          }
        }
      },
      fail: res => {
        if (res.errMsg === "getLocation: fail: system permission denied"){
          // 手机系统未授权微信获取位置信息
          this.setData({
            isSystemLocal: false
          })
        }
      }
    })
  },
  // 获取位置信息
  getLocation() {
    const that = this;
    wx.getSetting({
      success(res) {
        // 判断用户是否授权获取地理位置
        if (res.authSetting['scope.userLocation'] === true){
          // 获取位置信息
          that.getLatLng();
        }else {
          // 如果用户没有授权则引导用户前往设置页面开启
          wx.authorize({
            scope: 'scope.userLocation',
            success() {
              that.getLatLng();
            },
            fail() {
              wx.openSetting({
                success(res) {
                  // res.authSetting = {
                  //   "scope.userInfo": true,
                  //   "scope.userLocation": true
                  // }
                }
              })
            }
          })
        }
      }
    })
  },
  // // 获取距离最近的回收箱
  _getNearbyBin() {
    const requestData = {
      lat: this.data.lat,
      lng: this.data.lng
    }
    getNearbyBin(requestData).then(res => {
      if (res.statusCode == 403) {
        forbiddenReLaunch();
        return;
      }
      this.setData({
        bearByArr: res.data
      })
    }).catch(res => {
      console.log(res)
    })
  },
  // -----------------事件监听及操作---------------------
  changeShowModule(){
    var bearByArr = this.data.bearByArr;
    wx.redirectTo({
      url: '../binsListsMode/binsListsMode?modelsState=' + this.data.modelsState,
    })

  },
  onPullDownRefresh() { //下拉刷新
    wx.stopPullDownRefresh();
  },
  onUnload: function(){
    // 当页面卸载的时候清除缓存
    const listbintap = wx.getStorageSync(LISTBINTAP);
    if (listbintap) {
      wx.removeStorage({
        key: LISTBINTAP
      })
    }
  },
  getModelsState:function(e){
    var that = this;
    var _state = e.currentTarget.dataset.state;
    this.setData({
      modelsState: _state
    })
    if (_state == 1){
      that.getTradionalData()
    }else{
      that._getNearbyBin()
    }
  },
  getTradionalData:function(){
    const requestData = {
      lat: this.data.lat,
      lng: this.data.lng
    }
    getTraNearbyBin(requestData).then(res => {
      console.log(res);
      if (res.statusCode == 403) {
        forbiddenReLaunch();
        return;
      }
      this.setData({
        bearByArr: res.data
      })
    }).catch(res => {
      console.log(res)
    })
  }
})