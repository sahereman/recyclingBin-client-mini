import { TOKEN, USERINFO } from '../../common/const.js'
import { userInfoShow, updateToken } from '../../service/api/user.js'
import { sub, isTokenFailure, forbiddenReLaunch, isGoLoginPage } from '../../util/util.js'

Page({
  data: {
    token: "",
    avatar_url: "../../assets/images/user/default_user.png",
    userName: "小黑点回收",
    money: "0.00",  //累计奖励金
    orderCount: 0, //参与投递次数
    orderMoney: '0.00', //当前奖励金
    phone: '',
    notification_count: 0, //未读消息的数量
    isLogin:false
  },
  onShow: function (options) {
    const token = wx.getStorageSync(TOKEN);
    const userInfo = wx.getStorageSync(USERINFO);
    var isLogin = false;
    if (isTokenFailure()) {
      // token有效
      this.data.token = token;
      isLogin = true;
      if (userInfo && userInfo.length != 0) {
        this._getData()
      } 
    } else {
      // token无效
      if (token && token.length != 0) {
        // 当token存在只需要进行更新
        // 刷新token
        updateToken(token, this);
        isLogin = true;
      } else {
        // token不存在需用户重新登录
      }
    }
    this.setData({
      isLogin: isLogin
    })
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
      if (res.statusCode == 403) {
        forbiddenReLaunch();
        return;
      }
      wx.stopPullDownRefresh();
      this.setData({
        avatar_url: res.data.avatar_url,
        userName:  res.data.name,
        money:  res.data.money,
        orderCount:  res.data.total_client_order_count,
        orderMoney:  res.data.total_client_order_money,
        phone: sub(res.data.phone,3,4),
        realAuthenticated: res.data.real_authenticated_at,
        notification_count: res.data.notification_count
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
    var that = this;
    if (this.data.isLogin){
      that._getUserInfo();
    }else{
      wx.stopPullDownRefresh();
    }
    
  },
  goOtherPage:function(e){
    var that = this;
    var next_url = e.currentTarget.dataset.url;
    isGoLoginPage(that.data.isLogin, next_url);
  }
})