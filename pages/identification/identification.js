import { realAuthentication, updateToken } from '../../service/api/user.js'
import { TOKEN, USERINFO } from '../../common/const.js'
import { sub, isTokenFailure, forbiddenReLaunch } from '../../util/util.js'

Page({
  data: {
    token: '',
    phone: '',
    image_show: false
  },
  onLoad: function (options) {
    const token = wx.getStorageSync(TOKEN);
    const userInfo = wx.getStorageSync(USERINFO);
    if (userInfo && userInfo.length != 0) {
      this.setData({
        phone: userInfo.phone
      })
    }
    if (isTokenFailure()) {
      // token有效
      this.data.token = token;
    } else {
      // token无效
      if (token && token.length != 0) {
        updateToken(token);
      } else {}
    }
  },
  bindKeyInput: function (e) {
    if (e.detail.value.length == 18){
      this.setData({
        real_id: e.detail.value,
        image_show: true
      })
    }
  },
  formSubmit(e) {
    const idCard = e.detail.value.idCard;
    const realName = e.detail.value.realName;
    let pages = getCurrentPages(); //获取当前页面js里面的pages里的所有信息。
    let prevPage = pages[pages.length - 2];  
    if (idCard.length == 18 && realName != ""){
      const requestData = {
        token: this.data.token,
        real_name: realName,
        real_id: idCard
      }
      realAuthentication(requestData).then(res => {
        if (res.statusCode == 403) {
          forbiddenReLaunch();
          return;
        }
        prevPage.setData({  // 将想要传递的参数在这里直接setData。上个页面就会执行这里的操作。
          real_name: realName,
          real_authenticated_at: true,
          
        })
        wx.navigateBack({
          delta: 1,
        })
      }).catch(res => {
        console.log(res)
        prevPage.setData({
          real_name: '',
          real_authenticated_at: false,
        })
        wx.navigateBack({
          delta: 1,
        })
      })
    }else {
      if (realName == ""){
        wx.showToast({
          title: '请输入姓名',
          icon: 'none',
          duration: 2000
        })

      }else {
        wx.showToast({
          title: '身份证号码无效',
          icon: 'none',
          duration: 2000
        })
      }
    }
  },
  onPullDownRefresh() { //下拉刷新
    wx.stopPullDownRefresh();
  }
})