import { getToken } from '../../service/api/user.js'
import { TOKEN } from '../../common/const.js'
import { forbiddenReLaunch, examineToken } from '../../util/util.js'
//获取应用实例
const app = getApp()
Page({
  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    codename:'',
    num:''
  },
  onLoad: function (options) {
    var that = this;
    if (options.codename){
      that.setData({
        codename: options.codename,
        num: options.num
      })
    }
  },
  // 网络请求
  _getData(){
    
  },
  // 获取用户信息
  getUserInfo(e) {
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
    } else {
      // app.login()
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
      }
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
      if (that.data.codename){
        wx.reLaunch({
          url: '../../pages/loadPage/loadPage?codename=' + that.data.codename + '&num=' + that.data.num
        })
      }else{
        wx.reLaunch({
          url: '../../pages/index/index'
        })
      }
      
    }).catch(err => {
      console.log(err)
    })
  },
})