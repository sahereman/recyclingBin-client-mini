import { TOKEN, USERINFO } from '../../common/const.js'
import { userInfoShow, updateToken } from '../../service/api/user.js'
import { isTokenFailure, forbiddenReLaunch } from '../../util/util.js'

Page({
  data: {
    token: "",
    money: 0,
    showTip:true//展示提现规则
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
      if (res.data.status_code == 444) {
        forbiddenReLaunch();
        return;
      }
      wx.stopPullDownRefresh();
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
  //下拉刷新
  onPullDownRefresh() {
    this._getUserInfo();
  },
  goWeChatWallet:function(){
    wx.showModal({
      title: '提示',
      content: '该功能暂未开放',
      showCancel: false,
      success(res) {
        
      }
    })
  },
  closeTip:function(){//关闭提现规则弹窗
    this.setData({
      showTip:false
    })
  }
})