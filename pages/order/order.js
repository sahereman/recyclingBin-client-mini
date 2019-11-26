import { TOKEN } from '../../common/const.js'
import { getTopicCategories, traditionOrder } from '../../service/api/order.js'
import { updateToken } from '../../service/api/user.js'
import { isTokenFailure, forbiddenReLaunch } from '../../util/util.js'

Page({
  data: {
    orderLists:[],
    orderListsData: [],  //临时存储数据
    currentPage: 1,  // 当前页
    totalPages: 0,  // 总页数
    isLast: false,  //是否有更多数据
    token: '',
    showOrder:true,
    traOrderList:[],
    traPage:1,
    traTotalPages: 0,  // 总页数
    traIsLast: false,  //是否有更多数据
    showBIgIMg:false,
    bigImgUrl: '',
    isLoaded:false
  },
  onShow: function (options) {
    this.setData({
      orderLists: [],
      orderListsData: [],  //临时存储数据
      currentPage: 1,  // 当前页
      totalPages: 0,  // 总页数
      isLast: false,  //是否有更多数据
      traOrderList: [],
      traPage: 1,
      traTotalPages: 0,  // 总页数
      traIsLast: false  //是否有更多数据
    })
    const token = wx.getStorageSync(TOKEN);
    if (isTokenFailure()) {
      // token有效
      this.data.token = token;
      this._getData()
    } else {
      // token无效
      if (token && token.length != 0) {
        updateToken(token, this);
      } else {
        // token不存在需用户重新登录
      }
    }
  },
  onReachBottom: function () {
    if (this.data.showOrder){
      if (this.data.currentPage <= this.data.totalPages) {
        this._getTopicCategories()
      } else {
        this.setData({
          isLast: true
        })
      }
    }else{
      if (this.data.traPage <= this.data.traTotalPages) {
        this.getTraOrder()
      } else {
        this.setData({
          traIsLast: true
        })
      }
    }
  },
  // 网络请求
  _getData(){
    this._getTopicCategories();
    this.getTraOrder()
  },
  // 获取订单列表
  _getTopicCategories(){
    const requestData = {
      token: this.data.token,
      page: this.data.currentPage
    }
    getTopicCategories(requestData).then(res => {
      if (res.statusCode == 403) {
        forbiddenReLaunch();
        return;
      }
      wx.stopPullDownRefresh();
      const list = res.data.data;
      let page_num = this.data.currentPage;
      page_num++;
      this.data.orderListsData.push(...list);
      this.setData({
        orderLists: this.data.orderListsData,
        currentPage: page_num,
        totalPages: res.data.meta.pagination.total_pages,
        isLoaded:true
      })
    }).catch(res => {
      this.setData({
        orderLists: [],
        isLoaded: true
      })
    })
  },
  onPullDownRefresh() {//下拉刷新
    this.setData({
      orderLists: [],
      orderListsData: [],  //临时存储数据
      currentPage: 1,  // 当前页
      totalPages: 0,  // 总页数
      isLast: false,  //是否有更多数据
      traOrderList: [],
      traPage: 1,
      traTotalPages: 0,  // 总页数
      traIsLast: false,  //是否有更多数据
      isLoaded: false
    })
    this._getTopicCategories();
    this.getTraOrder()
  },
  binsListShow() {//查看附近回收机
    var modelsState = 0;
    if (!this.data.showOrder){
      modelsState = 1;
    }
    wx.navigateTo({
      url: '../binsLists/binsLists?modelsState=' + modelsState,
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
  },
  changeMenu:function(){//更换menu
    var that = this;
    var showOrder = !this.data.showOrder;
    this.setData({
      showOrder: showOrder,
    })
  },
  getTraOrder:function(){//获取传统机订单
    var that = this;
    const requestData = {
      token: this.data.token,
      page: this.data.traPage
    }
    traditionOrder(requestData).then(res => {
      console.log(res.data);
      if (res.statusCode == 403) {
        forbiddenReLaunch();
        return;
      }
      wx.stopPullDownRefresh();
      const list = res.data.data;
      let page_num = this.data.traPage;
      let traOrderList = that.data.traOrderList;
      page_num++;
      traOrderList.push(...list);
      this.setData({
        traOrderList: traOrderList,
        traPage: page_num,
        traTotalPages: res.data.meta.pagination.total_pages,
        isLoaded: true
      })
    }).catch(res => {
      this.setData({
        traOrderList: [],
        isLoaded: true
      })
    })
  },
  previewImg:function(e){//预览订单图片
    var _url = e.currentTarget.dataset.url;
    this.setData({
      bigImgUrl: _url,
      showBIgIMg:true
    })
  },
  closeImg:function(){//关闭预览图片
    this.setData({
      bigImgUrl: '',
      showBIgIMg: false
    })
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    this.setData({
      isLoaded: false
    })
  },
})