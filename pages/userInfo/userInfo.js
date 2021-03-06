import { TOKEN, USERINFO } from '../../common/const.js'
import { userInfoShow, updateToken, bindPhone, sendVerification, getToken } from '../../service/api/user.js'
import { sub, isTokenFailure, forbiddenReLaunch, examineToken } from '../../util/util.js'
import {getPhoneNumberajax} from '../../service/api/recyclingBins.js'
const app = getApp()
Page({
  data: {
    token: "",
    avatar_url: "../../assets/images/user/default_user.png",
    userName: "小黑点",
    phone: '',
    real_authenticated_at: null,   //是否已经实名认证
    real_name: '',   // 真实姓名
    infoRefresh: false,  // 判断接口是否进行刷新（主要用于从实名认证界面返回）
    showModal: false, // 显示绑定手机号弹窗modal弹窗
    inphone: null, // 用户输入的手机号
    vCode: null, //验证码
    weChatShow: true,
    ajxtrue: false, //手机号码格式
    verification_key: '', //短信验证码key
    vcodeSate: false, //验证码验证
    timerNum:60, //倒计时
    closeTimerNum: true,
    timer: null, //定时器
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    showLoginState:false
  },
  onLoad: function (options) {
    var that = this;
    const token = wx.getStorageSync(TOKEN);
    const userInfo = wx.getStorageSync(USERINFO);
    if (isTokenFailure()) {
      // token有效
      this.data.token = token;
      if (this.data.infoRefresh){
        // 从实名认证界面返回，个人信息发生了改变需要重新获取
        this._getData()
      }else {
        if (userInfo && userInfo.length != 0) {
          this.setData({
            avatar_url: userInfo.avatar_url,
            userName: userInfo.name,
            phone: userInfo.phone ? sub(userInfo.phone, 3, 4) :"",
            real_authenticated_at: userInfo.real_authenticated_at,
            real_name: userInfo.real_name
          })
        } else {
          this._getData()
        }
      }
    } else {
      // token无效
      if (token && token.length != 0) {
        // 当token存在只需要进行更新
        // 刷新token
        updateToken(token, this);
      } else {

      }
    }
    const eventChannel = this.getOpenerEventChannel()
    eventChannel.on('acceptDataFromOpenerPage', function (data) {
      console.log(data)
    })
  },
  onShow:function(){
    
  },
  // --------------------------------网络请求---------
  _getData(){
    this._getUserInfo()
  },
  // 获取个人信息
  _getUserInfo() {
    const requestData = {
      token: this.data.token
    }
    userInfoShow(requestData).then(res => {
      if (res.statusCode == 403) {
        forbiddenReLaunch();
        return;
      }
      this.setData({
        avatar_url: res.data.avatar_url,
        userName: res.data.name,
        money: res.data.money,
        phone: sub(res.data.phone, 3, 4),
        real_authenticated_at: res.data.real_authenticated_at,
        real_name: res.data.real_name
      })
      wx.setStorage({
        key: USERINFO,
        data: res.data
      })
    }).catch(res => {
      console.log(res)
    })
  },
  // -----------事件监听及操作----------
  // 跳转到实名认证页
  realAuthentication() {
    if (!this.data.real_authenticated_at){
      wx.redirectTo({
        url: '../identification/identification',
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
          ajxtrue: true
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
  onUnload: function () {
    clearInterval(this.data.timer);
  },
  openPhonemodal:function(){//打开绑定手机弹窗
    wx.navigateTo({
      url: '../bindPhone/bindPhone',
    })
  }
})