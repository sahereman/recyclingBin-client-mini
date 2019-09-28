import { TOKEN, USERINFO } from '../../common/const.js'
import { userInfoShow, updateToken } from '../../service/api/user.js'
import { sub, isTokenFailure } from '../../util/util.js'

Page({
  data: {
    token: "",
    avatar_url: "../../assets/images/user/default_user.png",
    userName: "工蚁回收",
    money: "0.00",  //累计奖励金
    orderCount: 0, //参与投递次数
    orderMoney: '0.00', //当前奖励金
    phone: '',
  },
  onShow: function (options) {
    const token = wx.getStorageSync(TOKEN);
    const userInfo = wx.getStorageSync(USERINFO);
    if (isTokenFailure()) {
      // token有效
      this.data.token = token;
      if (userInfo && userInfo.length != 0) {
        // this.setData({
        //   avatar_url: userInfo.avatar_url,
        //   userName: userInfo.name,
        //   money: userInfo.money,
        //   orderCount: userInfo.total_client_order_count,
        //   orderMoney: userInfo.total_client_order_money,
        //   phone: sub(userInfo.phone, 3, 4),
        // })
        this._getData()
      } 
    } else {
      // token无效
      if (token && token.length != 0) {
        // 当token存在只需要进行更新
        // 刷新token
        updateToken(token, this);
      } else {
        // token不存在需用户重新登录
        wx.reLaunch({
          url: '../../pages/index/index'
        })
      }
    }
  },
  // ----------------网络请求------------
  _getData(){
    this._getUserInfo()
  },
  // 获取个人信息
  _getUserInfo(){
    const requestData = {
      token: this.data.token
    }
    userInfoShow(requestData).then(res => {
      wx.stopPullDownRefresh();
      this.setData({
        avatar_url: res.data.avatar_url,
        userName:  res.data.name,
        money:  res.data.money,
        orderCount:  res.data.total_client_order_count,
        orderMoney:  res.data.total_client_order_money,
        phone: sub(res.data.phone,3,4),
        realAuthenticated: res.data.real_authenticated_at
      })
      wx.setStorage({
        key: USERINFO,
        data: res.data
      })
    }).catch(res => {
      console.log(res)
    })
  },
  // ---------------事件监听及操作----------------
  // 跳转到订单列表页
  showOrderList(){
    wx.navigateTo({
      url: '../order/order',
    })
  },
  //下拉刷新
  onPullDownRefresh() {
    this._getUserInfo();
  } 
})