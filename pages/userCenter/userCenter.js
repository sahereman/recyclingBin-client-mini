import { TOKEN, VALIDTIME } from '../../common/const.js'
import { sendVerification, bindPhone } from '../../service/api/user.js'

Page({
  data: {
    userPhone: "",
    verification_code: "",
    verification_key: "",
    token: ""
  },
  onLoad: function (options) {
    const token = wx.getStorageSync(TOKEN);
    this.data.token = token;
    if (token && token.length != 0) {
      // 验证token是否过期
      const validTime = wx.getStorageSync(VALIDTIME)
      let timestamp = Date.parse(new Date()) / 1000;
      // timestamp = timestamp / 1000;
      if (timestamp >= validTime) {
        // 如果超时则获取新的token
        // updateToken(token)
      }
      // 判断时间戳
    } else {
      // app.login()
    }
  },
  // ===================网络请求
  // 发送验证码
  sendVerification(){
    console.log(this.data.userPhone)
    const requestData = {
      token: this.data.token,
      phone: this.data.userPhone
    }
    sendVerification(requestData).then(res => {
      console.log(res)
      this.setData({
        verification_key: res.data.verification_key
      })
    }).catch(res => {
      console.log(res)
    })
  },
  // 绑定手机号
  bindUserPhone(){
    const requestData = {
      token: this.data.token,
      phone: this.data.userPhone,
      verification_key: this.data.verification_key,
      verification_code: this.data.verification_code
    }
    bindPhone(requestData).then(res => {
      console.log(res)
    }).catch(res => {
      console.log(res)
    })
  },
  // =====================事件操作
  // 获取手机号
  getPhoneNum (e){
    this.setData({
      userPhone: e.detail.value
    })
  },
  // 获取短信验证码
  getPhoneCode(e){
    this.setData({
      verification_code: e.detail.value
    })
  },
  // 跳转到订单列表页
  showOrderList(){
    wx.navigateTo({
      url: '../order/order',
    })
  }
})