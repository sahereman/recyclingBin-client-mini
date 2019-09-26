import { TOKEN } from '../../common/const.js'
import { getTopicCategories } from '../../service/api/order.js'
import { updateToken } from '../../service/api/user.js'
import { isTokenFailure } from '../../util/util.js'

Page({
  data: {
    orderLists:[],
    orderListsData: [],  //临时存储数据
    currentPage: 1,  // 当前页
    totalPages: 0,  // 总页数
    isLast: false,  //是否有更多数据
    token: ''
  },
  onLoad: function (options) {
    const token = wx.getStorageSync(TOKEN);
    if (isTokenFailure()) {
      // token有效
      this.data.token = token;
      this._getData()
    } else {
      // token无效
      if (token && token.length != 0) {
        updateToken(token, this);
      } else {}
    }
  },
  onReachBottom: function () {
    if (this.data.currentPage < this.data.totalPages) {
      this._getTopicCategories()
    } else {
      this.setData({
        isLast: true
      })
    }
  },
  // 网络请求
  _getData(){
    this._getTopicCategories();
  },
  // 获取订单列表
  _getTopicCategories(){
    const requestData = {
      token: this.data.token,
      page: this.data.currentPage
    }
    getTopicCategories(requestData).then(res => {
      wx.stopPullDownRefresh();
      const list = res.data.data;
      let page_num;
      this.data.orderListsData.push(...list);
      if (res.data.meta.pagination.links.next) {
        let splitArr = res.data.meta.pagination.links.next.split("=")
        page_num = splitArr[splitArr.length - 1]
      } else {
        page_num = 1;
      }
      this.setData({
        orderLists: this.data.orderListsData,
        currentPage: page_num,
        totalPages: res.data.meta.pagination.total_pages
      })
    }).catch(res => {
      console.log(res)
      this.setData({
        orderLists: []
      })
    })
  },
  onPullDownRefresh() {//下拉刷新
    this.setData({
      orderListsData: [],
      currentPage:1
    })
    this._getTopicCategories();
  },
  binsListShow() {//查看附近回收机
    wx.navigateTo({
      url: '../binsLists/binsLists',
      events: {
        // 为指定事件添加一个监听器，获取被打开页面传送到当前页面的数据
        acceptDataFromOpenedPage: function (data) {
          console.log(data)
        },
        someEvent: function (data) {
          console.log(data)
        }
      },
      success: function (res) {
        // 通过eventChannel向被打开页面传送数据
        res.eventChannel.emit('acceptDataFromOpenerPage', { data: 'test' })
      }
    })
  }
})