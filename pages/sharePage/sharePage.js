import { TOKEN, USERINFO } from '../../common/const.js'
import { userInfoShow, updateToken } from '../../service/api/user.js'
import { isTokenFailure } from '../../util/util.js'

Page({
  data: {
    canvasHidden: true,
    token: "",
    avatar_url: "../../assets/images/user/default_user.png",
    userName: "工蚁森林",
    money: '0'
  },
  onLoad: function (options) {
    const token = wx.getStorageSync(TOKEN);
    const userInfo = wx.getStorageSync(USERINFO);
    if (isTokenFailure()) {
      this.data.token = token;
      if (userInfo && userInfo.length != 0) {
        this.setData({
          avatar_url: userInfo.avatar_url,
          userName: userInfo.name,
          money: userInfo.money,
        })
      } else {
        this._getData()
      }
    } else {
      if (token && token.length != 0) {
        updateToken(token, this);
      } else {

      }
    }
  },
  onShareAppMessage: function (options) {
    return {
      title: '分享测试',
      path: '/pages/index/index',
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
        avatar_url: res.data.avatar_url,
        userName: res.data.name,
        money: res.data.money,
      })
      wx.setStorage({
        key: USERINFO,
        data: res.data
      })
    }).catch(res => {
      console.log(res)
    })
  }
})