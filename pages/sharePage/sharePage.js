import { TOKEN, USERINFO } from '../../common/const.js'
import { userInfoShow, updateToken } from '../../service/api/user.js'
import { isTokenFailure, forbiddenReLaunch } from '../../util/util.js'

Page({
  data: {
    canvasHidden: true,
    token: "",
    avatar_url: "../../assets/images/user/default_user.png",
    userName: "工蚁森林",
    money: '0',
    amount:'32.00'
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
      imageUrl:'../../assets/images/user/_ad.jpg'
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
      if (res.statusCode == 403) {
        forbiddenReLaunch();
        return;
      }
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
  },
  onPullDownRefresh() {
    wx.stopPullDownRefresh();
  }
})