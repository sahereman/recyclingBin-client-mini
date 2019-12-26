import { TOKEN, USERINFO } from '../../common/const.js'
import { userInfoShow, updateToken, bindPhone, sendVerification, getToken } from '../../service/api/user.js'
import { sub, isTokenFailure, forbiddenReLaunch, examineToken } from '../../util/util.js'
import {getPhoneNumberajax} from '../../service/api/recyclingBins.js'
const app = getApp()
Page({
  data: {
    inphone: null, // 用户输入的手机号
    vCode: null, //验证码
    ajxtrue: false, //手机号码格式
    verification_key: '', //短信验证码key
    vcodeSate: false, //验证码验证
    timerNum:60, //倒计时
    closeTimerNum: true,
    timer: null, //定时器
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    showLoginState:false,
    timer2:null
  },
  onLoad: function (options) {
    var that = this;
    const token = wx.getStorageSync(TOKEN);
    const userInfo = wx.getStorageSync(USERINFO);
    if (isTokenFailure()) {
      // token有效
      that.setData({
        token: token,
        inphone: userInfo.phone ? userInfo.phone:'',
        ajxtrue: userInfo.phone ?true:false
      })
    } else {
      // token无效
      if (token && token.length != 0) {
        // 当token存在只需要进行更新
        // 刷新token
        updateToken(token, this);
      }
    }
  },
  onShow:function(){
    app.login();
  },
  // --------------------------------网络请求---------
  _getData(){
    
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

      that.data.timer = setInterval(function () {
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
        console.log(res)
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
        title: '请输入正确的手机号',
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
              that.data.timer2 = setTimeout(function(){
                var pages = getCurrentPages();//页面指针数组
                var prepage = pages[pages.length - 2];
                prepage.setData({
                  phone: that.data.inphone ? sub(that.data.inphone, 3, 4) : ""
                })
                wx.navigateBack({
                  delta: prepage
                });
                clearTimeout(that.data.timer2);
              },1000)
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
    wx.stopPullDownRefresh();
  },
  blurPhone: function (e) { //验证手机号
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
  _getPhoneNumber(e) {
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
      if (res.data.phoneNumber){
        that.setData({
          inphone: res.data.phoneNumber,
          ajxtrue: true,
          showLoginState:false
        })
      }else{
        wx.showToast({
          title: '获取手机号失败，请稍后重试',
          icon: 'none',
          duration: 2000
        })
      }
    }).catch(res => {
      console.log(res);
    })
  },
  blurCode: function (e) { //验证验证码
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
  onUnload: function () {
    clearInterval(this.data.timer);
    clearTimeout(this.data.timer2);
  },
  openPhonemodal:function(){//打开绑定手机弹窗
    app.login();
    this.setData({
      showModal:true
    })
  },
  getUserInfo(e) {
    var that = this;
    if (app.globalData.code) {
      if (e.detail.errMsg == "getUserInfo:ok") {
        app.globalData.userInfo = e.detail.userInfo
        const requestData = {
          code: app.globalData.code,
          iv: e.detail.iv,
          encryptedData: e.detail.encryptedData
        }
        // 获取token
        this._getToken(requestData);
      }
    }
  },
  // 获取token
  _getToken(requestData) {
    var that = this;
    getToken(requestData).then(res => {
      if (res.statusCode == 403) {
        // 跳转到首页的封装方法，默认页面不传参，如果在组件中调用传参为true例如：forbiddenReLaunch(true)即可
        forbiddenReLaunch();
        return;
      } else if (res.statusCode == 201){
        // 存储到本地缓存
        const token = res.data.token_type + " " + res.data.access_token
        const validTime = res.data.expires_in
        // token和有效期存入缓存
        wx.setStorageSync(TOKEN, token)
        examineToken(validTime);
        wx.showToast({
          title: '授权成功',
          icon: 'success',
          duration: 2000
        })
        that.setData({
          showLoginState:true,
          token: token
        })
        app.login();
      }else{
        wx.showToast({
          title: '授权失败，请稍后再试',
          icon: 'none',
          duration: 2000
        })
      }
      
    }).catch(err => {
      console.log(err)
    })
  },
  noLogin:function(){
    this.setData({
      showLoginState:false
    })
  }
})