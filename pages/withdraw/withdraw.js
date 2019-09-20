import { TOKEN, USERINFO } from '../../common/const.js'
import { userInfoShow, updateToken, withdrawal } from '../../service/api/user.js'
import { isTokenFailure } from '../../util/util.js'

Page({
  data: {
    token: "",
    money: '0',
    total_money: ''
  },

  onLoad: function (options) {
    const token = wx.getStorageSync(TOKEN);
    const userInfo = wx.getStorageSync(USERINFO);
    if (isTokenFailure()) {
      // token有效
      this.data.token = token;
      if (userInfo && userInfo.length != 0) {
        this.setData({
          money: userInfo.money,
        })
      } else {
        this._getData()
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
  },
  // ----------------网络请求------------
  _getData() {
    this._getUserInfo()
  },
  // 获取个人信息
  _getUserInfo() {
    const requestData = {
      token: this.data.token
    }
    userInfoShow(requestData).then(res => {
      this.setData({
        money: res.data.money,
      })
      wx.setStorage({
        key: USERINFO,
        data: res.data
      })
    }).catch(res => {
      console.log(res)
    })
  },
  formSubmit(e) {
    console.log(e.detail.value)
    const requestData = {
      token: this.data.token,
      name: e.detail.value.name,
      bank: e.detail.value.bank,
      account: e.detail.value.account,
      money: e.detail.value.money
    }
    withdrawal().then(res => {
      console.log(res)
    }).catch(res => {
      console.log(res)
    })
  },
  getTotalMoney (){
    this.setData({
      total_money: this.data.money
    })
  }
})