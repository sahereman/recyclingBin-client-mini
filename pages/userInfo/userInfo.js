import { TOKEN, USERINFO } from '../../common/const.js'
import { userInfoShow, updateToken } from '../../service/api/user.js'
import { sub, isTokenFailure } from '../../util/util.js'

Page({
  data: {
    token: "",
    avatar_url: "../../assets/images/user/default_user.png",
    userName: "工蚁森林",
    phone: '',
    real_authenticated_at: null,   //是否已经实名认证
    real_name: '',   // 真实姓名
    infoRefresh: false  // 判断接口是否进行刷新（主要用于从实名认证界面返回）
  },

  onLoad: function (options) {
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
            phone: sub(userInfo.phone, 3, 4),
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
      this.setData({
        avatar_url: res.data.avatar_url,
        userName: res.data.name,
        money: res.data.money,
        phone: sub(res.data.phone, 3, 4),
        real_authenticated_at: userInfo.real_authenticated_at,
        real_name: userInfo.real_name
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
      wx.navigateTo({
        url: '../identification/identification',
      })
    }
  }
})