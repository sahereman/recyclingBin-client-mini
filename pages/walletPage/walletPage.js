import { TOKEN, USERINFO } from '../../common/const.js'
import { userInfoShow, updateToken } from '../../service/api/user.js'
import { isTokenFailure } from '../../util/util.js'

Page({
  data: {
    token: "",
    money: 0
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
})