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
  formSubmit(e) {
    var that = this;
    if (!e.detail.value.name){
      wx.showToast({
        title: '请输入收款人户名',
        icon: 'none',
        duration: 2000
      })
    } else if (!e.detail.value.account){
      wx.showToast({
        title: '请输入收款人账号',
        icon: 'none',
        duration: 2000
      })
    } else if (!e.detail.value.bank){
      wx.showToast({
        title: '请输入银行名称',
        icon: 'none',
        duration: 2000
      })
    } else if (!e.detail.value.bankname) {
      wx.showToast({
        title: '请输入开户银行',
        icon: 'none',
        duration: 2000
      })
    } else if (!e.detail.value.money) {
      wx.showToast({
        title: '请输入提现金额',
        icon: 'none',
        duration: 2000
      })
    }else{
      const requestData = {
        token: that.data.token,
        name: e.detail.value.name,
        bank: e.detail.value.bank,
        account: e.detail.value.account,
        money: e.detail.value.money,
        bank_name:e.detail.value.bankname
      }
      withdrawal(requestData).then(res => {
        console.log(res);
        if (res.statusCode == 201){
          var timer = setTimeout(function () {
            wx.switchTab({
              url: '../../pages/userCenter/userCenter'
            })
            clearTimeout(timer);
          }, 1500);
          wx.showToast({
            title: '已申请，待审核',
            icon: 'success',
            duration: 2000
          })
        }else{
          wx.showToast({
            title: '提交失败，请稍后重试',
            icon: 'none',
            duration: 2000
          })
        }
      }).catch(res => {
        wx.showToast({
          title: '提交失败，请稍后重试',
          icon: 'none',
          duration: 2000
        })
      })
    }

    
  },
  getTotalMoney (){
    this.setData({
      total_money: this.data.money
    })
  },
  //下拉刷新
  onPullDownRefresh() {
    this._getUserInfo();
  }
})