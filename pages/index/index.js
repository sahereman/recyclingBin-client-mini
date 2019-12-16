import {
  TOKEN,
  NEARBYBIN,
  USERINFO,
  VALIDTIME,
  BANNER,
  ISFORBIDDEN,
  BOXNUMBER
} from '../../common/const.js'
import {
  getToken,
  updateToken,
  userInfoShow,
  bindPhone,
  sendVerification
} from '../../service/api/user.js'
import {
  getBanners
} from '../../service/api/banner.js'
import {
  getNearbyBin,
  getBinLists,
  getPhoneNumberajax
} from '../../service/api/recyclingBins.js'
import {
  examineToken,
  isTokenFailure,
  forbiddenReLaunch
} from '../../util/util.js'

//获取应用实例
const app = getApp()
Page({
  data: {
    banners: [],
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    token: "",
    lat: null,
    lng: null,
    showModal: false, // 显示绑定手机号弹窗modal弹窗
    single: false, // false 只显示一个按钮，如果想显示两个改为true即可
    nearBybininfo: {},
    money: "0.00", //累计奖励金
    orderCount: 0, //投递次数
    orderMoney: "0.00", //当前奖励金
    inphone: null, // 用户输入的手机号
    vCode: null, //验证码
    weChatShow: true,
    ajxtrue: false, //手机号码格式
    verification_key: '', //短信验证码key
    vcodeSate: false, //验证码验证
    timerNum: 10, //倒计时
    closeTimerNum: true,
    timer: null, //定时器
    loginState:0 //0为未登录   1 是登录 但没有绑定手机号   2 登录并绑定手机号
  },
  onShow: function() {
    this._getBanners() 
    const token = wx.getStorageSync(TOKEN);
    var that = this;
    if (isTokenFailure()) {
      // token有效
      that.data.token = token;
      that._getData()
    } else {
      // token无效
      if (token && token.length != 0) {
        // 当token存在只需要进行更新
        // 刷新token
        updateToken(token, that);
      } else {
        // token不存在需用户重新登录
        app.login();
        that.getLocation()
      }
    }
  },
  onLoad:function(){
    const box_no = wx.getStorageSync(BOXNUMBER);
    if (box_no) {
      wx.removeStorage({
        key: BOXNUMBER
      })
    }
  },

  // ------------------网络请求相关方法----------
  _getData() {
    this.getLocation()
    this._getUserInfo()
  },
  _getBanners() {
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
    }).catch(res => {
      console.log(res)
    })
  },
  // 获取距离最近的回收箱
  _getNearbyBin() {
    const requestData = {
      token: this.data.token,
      lat: app.globalData.lat,
      lng: app.globalData.lng
    }
    getNearbyBin(requestData).then(res => {
      console.log(res);
      if (res.statusCode == 403) {
        forbiddenReLaunch();
        return;
      }
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
  // 获取位置信息
  getLocation() {
    // 获取位置信息
    wx.getLocation({
      type: 'gcj02',
      success: res => {
        wx.stopPullDownRefresh();
        this.setData({
          lat: res.latitude,
          lng: res.longitude
        })
        app.globalData.lat = res.latitude;
        app.globalData.lng = res.longitude;
        this._getNearbyBin()
      },
      fail: res => {
        
      }
    })
  },
  // 获取个人信息
  _getUserInfo() {
    const requestData = {
      token: this.data.token
    }
    userInfoShow(requestData).then(res => {
      console.log(res.data.phone);
      if (res.statusCode == 403) {
        forbiddenReLaunch();
        return;
      }
      wx.stopPullDownRefresh();
      // 将个人信息存入缓存在个人中心进行调用
      var tempState = 0;
      if (res.data.phone){
        tempState = 2;
      }else{
        tempState = 1;
      }
      this.setData({
        money: res.data.money,
        orderCount: res.data.total_client_order_count,
        orderMoney: res.data.total_client_order_money,
        loginState: tempState
      })
      wx.setStorage({
        key: USERINFO,
        data: res.data
      })
    }).catch(res => {
      console.log(res)
    })
  },
  // 获取验证码
  _sendVerification() {
    var that = this;
    if (that.data.ajxtrue == true) {
      const requestData = {
        token: that.data.token,
        phone: that.data.inphone
      }
      that.setData({
        closeTimerNum: false
      })
      var timerNumtemp = that.data.timerNum;

      that.data.timer = setInterval(function() {
        timerNumtemp--;
        that.setData({
          timerNum: timerNumtemp
        })
        if (timerNumtemp <= 0) {
          clearInterval(that.data.timer);
          that.setData({
            closeTimerNum: true
          })
        }

      }, 1000)

      sendVerification(requestData).then(res => {
        if (res.statusCode == 403) {
          forbiddenReLaunch();
          return;
        } 
        that.setData({
          verification_key: res.data.verification_key
        })
      }).catch(res => {
        console.log(res);
      })
    } else {
      wx.showToast({
        title: '请输入手机号',
        icon: 'none',
        duration: 2000
      })
    }
  },
  // 绑定手机号
  _bindPhone() {
    var that = this;
    if (that.data.ajxtrue == true) {
      if (that.data.verification_key) {
        if (that.data.vcodeSate == false) {
          wx.showToast({
            title: '验证码不正确',
            icon: 'none',
            duration: 2000
          })
        } else {
          const requestData = {
            token: that.data.token,
            phone: that.data.inphone,
            verification_key: that.data.verification_key,
            verification_code: that.data.vCode
          }
          bindPhone(requestData).then(res => {
            if (res.statusCode == 403) {
              forbiddenReLaunch();
              return;
            } 
            if (res.statusCode == 200) {
              wx.showToast({
                title: '绑定成功',
                icon: 'success',
                duration: 2000
              })
              that.setData({
                showModal: false
              })
              that._getUserInfo();
            } else {
              wx.showToast({
                title: '绑定失败，请稍后重试',
                icon: 'none',
                duration: 2000
              })
            }
          }).catch(res => {
            console.log(res);
          })
        }
      } else {
        wx.showToast({
          title: '请先获取验证码',
          icon: 'none',
          duration: 2000
        })
      }
    } else {
      wx.showToast({
        title: '请输入正确的手机号',
        icon: 'none',
        duration: 2000
      })
    }

  },
  onPullDownRefresh() { //下拉刷新
    this.getLocation()
    this._getUserInfo()
  },
  blurPhone: function(e) { //验证手机号
    var phone = e.detail.value;
    let that = this
    if (!(/^1[34578]\d{9}$/.test(phone))) {
      this.setData({
        ajxtrue: false
      })
      if (phone.length >= 11) {
        wx.showToast({
          title: '手机号有误',
          icon: 'none',
          duration: 2000
        })
      }
    } else {
      that.setData({
        ajxtrue: true,
        inphone: phone
      })

    }
  },
  //一键获取手机号
  getPhoneNumber(e) {
    var that = this;
    const requestData = {
      token: that.data.token,
      encryptedData: e.detail.encryptedData,
      iv: e.detail.iv
    }
    getPhoneNumberajax(requestData).then(res => {
      if (res.statusCode == 403) {
        forbiddenReLaunch();
        return;
      }
      that.setData({
        inphone: res.data.phoneNumber,
        ajxtrue: true
      })
    }).catch(res => {
      console.log(res);
    })
  },
  blurCode: function(e) { //验证验证码
    var vCode = e.detail.value;
    let that = this
    that.setData({
      vcodeSate: false
    })
    if (vCode.length == 4) {
      that.setData({
        vcodeSate: true,
        vCode: vCode
      })
    }
  },
  onUnload: function() {
    clearInterval(this.data.timer);
  }
})