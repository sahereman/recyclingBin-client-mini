import {
  getTopicCategories,
  getTopicLists,
  getTopicDetails

} from '../../service/api/news.js'
import { updateToken } from '../../service/api/user.js'
import { TOKEN } from '../../common/const.js'
import { isTokenFailure, forbiddenReLaunch } from '../../util/util.js'
const app = getApp()
Page({
  data: {
    category_id: 0,
    category_page: 1,
    total_pages: 0,
    topic_id: 0,
    token:"",
    categories: [],
    dataList: [],
    categoryLists: [],
    currentIndex: 0,
    categoryIndex: null,
    isLast: false,
    isLoaded:false
  },
  onShow: function (options) {
    // const token = wx.getStorageSync(TOKEN);
    // if (isTokenFailure()) {
    //   // token有效
    //   this.data.token = token;
    //   this._getData()
    // } else {
    //   // token无效
    //   if (token && token.length != 0) {
    //     // 当token存在只需要进行更新
    //     // 刷新token
    //     updateToken(token, this);
    //   } else {
    //     // token不存在需用户重新登录
    //   }
    // }
  },
  onLoad:function(){
    this._getData()
  },
  onReachBottom: function () {
    // 监听用户上拉触底事件
    if (this.data.category_page <= this.data.total_pages){
      this._getTopicLists()
    }else {
      this.setData({
        isLast: true
      })
    }
  },
  _getData(){
    this.data.isLoaded = false;
    this._getTopicCategories()
  },
  // 获取话题分类
  _getTopicCategories(){
    var that = this;
    const requestData = this.data.token;
    getTopicCategories(requestData).then(res => {
      if (res.statusCode == 403) {
        forbiddenReLaunch();
        return;
      }
      wx.stopPullDownRefresh();
      if (res.data.data.length != 0){
        if (this.data.categoryIndex != null){
          const showCategory = this.data.categoryIndex;
          this.setData({
            categories: res.data.data,
            category_id: res.data.data[showCategory].id
          })
        }else {
          this.setData({
            categories: res.data.data,
            category_id: res.data.data[0].id
          })
        }
        // 默认获取第一个分类列表
        this._getTopicLists();
      }else{
        that.setData({
          isLoaded: true
        })  
      }
    }).catch(res => {
      console.log(res)
    })
  },
  // 获取话题列表
  _getTopicLists(){
    var that = this;
    let requestData = {}
    if (that.data.category_page == 1) {
      requestData = {
        category_id: that.data.category_id,
        token: that.data.token
      }
    }else {
      requestData = {
        category_id: that.data.category_id + "?page=" + that.data.category_page,
        token: that.data.token
      }
    }
    getTopicLists(requestData).then(res => {
      if (res.statusCode == 403) {
        forbiddenReLaunch();
        return;
      }
      wx.stopPullDownRefresh();
      const list = res.data.data;
      let page_num = this.data.category_page;
      page_num++;
      that.data.dataList.push(...list);
      that.setData({
        categoryLists: that.data.dataList,
        category_page: page_num,
        total_pages: res.data.meta.pagination.total_pages,
        isLoaded: true
      })
    }).catch(res => {
      console.log(res)
    })
  },
  // 事件
  // 点击获取对应分类的列表内容
  menuClick(e){
    const currentIndex = e.detail.currentIndex;
    const maitkey = this.data.categories[currentIndex].id;
    // 获取点击的menu的按钮的id，通过id获取分类下的列表
    this.setData({
      category_id: maitkey,
      dataList: [],
      category_page:1,
      categoryIndex: currentIndex
    })
    this._getTopicLists()
  },
  // 点击lists查看对应的详情
  listsClick(e){
    const currentId = e.detail.currentId;
    const dataObj = {currentId: currentId,token: this.data.token}
    // this._getTopicDetails(currentId)
    wx.navigateTo({
      url: '../newsDetail/newsDetail?currentId=' + currentId,
    })
  },
  onPullDownRefresh() {
    this.setData({
      category_id: 0,
      categories:[],
      category_page:1,
      dataList: [],
      categoryLists:[],
      isLoaded: false
    })
    this._getTopicCategories();
  }
})