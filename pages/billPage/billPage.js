import { TOKEN, USERINFO } from '../../common/const.js'
import { isTokenFailure } from '../../util/util.js'
import { getBillList, updateToken } from '../../service/api/user.js'

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
    token:''
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
    if (this.data.currentPage < this.data.totalPages) {
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
      page: this.data.currentPage
    }
    getBillList(requestData).then(res => {
      const list = res.data.data;
      let page_num;
      this.data.billArrData.push(...list);
      if (res.data.meta.pagination.links.next) {
        let splitArr = res.data.meta.pagination.links.next.split("=")
        page_num = splitArr[splitArr.length - 1]
      } else {
        page_num = 1;
      }
      this.setData({
        billArr: this.data.billArrData,
        currentPage: page_num,
        totalPages: res.data.meta.pagination.total_pages
      })
    }).catch(res => {
      console.log(res)
      this.setData({
        listsArr: []
      })
    })
  }
})