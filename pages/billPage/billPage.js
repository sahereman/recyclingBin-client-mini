import { TOKEN, USERINFO } from '../../common/const.js'
import { isTokenFailure, forbiddenReLaunch } from '../../util/util.js'
import { getBillList, updateToken } from '../../service/api/user.js'

var animation;

const date = new Date()
const years = []
const months = []
const days = []

for (let i = 1990; i <= date.getFullYear(); i++) {
  years.push(i)
}

for (let i = 1; i <= 12; i++) {
  months.push(i)
}
Page({
  data: {
    money: "0",  //累计奖励金
    orderCount: 0, //参与投递次数
    orderMoney: '0', //当前奖励金
    billArr: [],   // 账单列表组
    billArrData: [],  //临时存储数据
    currentPage: 1,  // 当前页
    totalPages: 0,  // 总页数
    isLast: false,  //是否有更多数据
    token:'',
    hideModal: true, //模态框的状态  true-隐藏  false-显示
    animationData: {},//
    currentIndex:0,
    ordertype: 'all',//账单类型
    ordertypeName:'全部奖励金类型',
    years: years,
    year: date.getFullYear(),
    months: months,
    month: date.getMonth() + 1 > 9 ? date.getMonth() + 1 :'0'+ (date.getMonth() + 1),
    value: [9999, date.getMonth()],
    checktype:1,
    searchDate:'',
    ordertimeName:'全部月份',
    isLoaded:false
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
          orderCount: userInfo.total_client_order_count,
          orderMoney: userInfo.total_client_order_money,
        })
      } 
      this._getData()
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
  onReachBottom: function () {
    if (this.data.currentPage <= this.data.totalPages) {
      console.log(this.data.currentPage);
      console.log(this.data.totalPages);
      this._getBillList()
    }else {
      this.setData({
        isLast: true
      })
    }
  },
  // ----------------------------数据请求------------------
  _getData(){
    this._getBillList()
  },
  // 获取账单列表
  _getBillList(){
    const requestData = {
      token: this.data.token,
      page: this.data.currentPage,
      type: this.data.ordertype,
      date: this.data.searchDate
    }
    getBillList(requestData).then(res => {
      if (res.statusCode == 403) {
        forbiddenReLaunch();
        return;
      }
      wx.stopPullDownRefresh();
      const list = res.data.data;
      let page_num = this.data.currentPage;
      page_num++
      this.data.billArrData.push(...list);
      this.setData({
        billArr: this.data.billArrData,
        currentPage: page_num,
        totalPages: res.data.meta.pagination.total_pages,
        isLoaded:true
      })
    }).catch(res => {
      this.setData({
        listsArr: [],
        isLoaded: true
      })
    })
  },
  // 显示遮罩层
  showModal: function (e) {
    var that = this;
    that.setData({
      hideModal: false,
      checktype: e.currentTarget.dataset.checktype
    })
    var animation = wx.createAnimation({
      duration:500,//动画的持续时间 默认400ms   数值越大，动画越慢   数值越小，动画越快
      timingFunction: 'ease',//动画的效果 默认值是linear
    })
    this.animation = animation
    that.fadeIn();//调用显示动画
  },

  // 隐藏遮罩层
  hideModal: function () {
    var that = this;
    var animation = wx.createAnimation({
      duration: 500,//动画的持续时间 默认400ms   数值越大，动画越慢   数值越小，动画越快
      timingFunction: 'linear',//动画的效果 默认值是linear
    })
    this.animation = animation
    that.fadeDown();//调用隐藏动画  
    that.setData({
      hideModal: true
    }) 
  },
  //动画集
  fadeIn: function () {
    this.animation.translateY(0).step()
    this.setData({
      animationData: this.animation.export()//动画实例的export方法导出动画数据传递给组件的animation属性
    })
  },
  fadeDown: function () {
    this.animation.translateY(300).step()
    this.setData({
      animationData: this.animation.export(),
    })
  },
  choiceTYpe:function(e){//选择类型
    var that = this;
    var index = e.currentTarget.dataset.index;
    var ordertype = e.currentTarget.dataset.ordertype;
    var ordertypeName = e.currentTarget.dataset.name;
    that.setData({
      currentIndex: index,
      currentPage:1,
      billArr: [],   // 账单列表组
      billArrData: [],  //临时存储数据
      totalPages: 0,  // 总页数
      isLast: false,  //是否有更多数据
      ordertype: ordertype,
      ordertypeName: ordertypeName,
      month: that.data.month
    })
    this._getBillList();
    this.hideModal();
    console.log(that.data.value);
  },
  bindChange: function (e) {//选取月份
    const val = e.detail.value
    this.setData({
      year: this.data.years[val[0]],
      month: this.data.months[val[1]] > 9 ? this.data.months[val[1]] : '0' + this.data.months[val[1]]
    })
  },
  sureSearch:function(){//根据月份查找
    var that = this;
    that.setData({
      searchDate: that.data.year + '-' + that.data.month,
      currentPage: 1,
      billArr: [],   // 账单列表组
      billArrData: [],  //临时存储数据
      totalPages: 0,  // 总页数
      isLast: false,  //是否有更多数据
      ordertimeName: that.data.year + '-' + that.data.month
    })
    this._getBillList();
    this.hideModal();
  },
  //下拉刷新
  onPullDownRefresh() {
    this.setData({
      searchDate:'',
      currentPage: 1,
      billArr: [],   // 账单列表组
      billArrData: [],  //临时存储数据
      totalPages: 0,  // 总页数
      isLast: false,  //是否有更多数据
      ordertimeName:'全部月份',
      currentIndex: 0,
      ordertype: 'all',
      ordertypeName: '全部奖励金类型',
      isLoaded: false
    })
    this._getBillList();
  }
})