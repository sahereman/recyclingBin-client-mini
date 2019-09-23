import {
  getTopicCategories,
  getTopicLists,
  getTopicDetails

} from '../../service/api/news.js'
import { updateToken } from '../../service/api/user.js'
import { TOKEN } from '../../common/const.js'
import { isTokenFailure } from '../../util/util.js'

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
    currentIndex: 0
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
        // 当token存在只需要进行更新
        // 刷新token
        updateToken(token, this);
      } else {

      }
    }
  },
  onReachBottom: function () {
    // 监听用户上拉触底事件
    if (this.data.category_page < this.data.total_pages){
      this._getTopicLists()
    }
  },
  _getData(){
    this._getTopicCategories(this.data.token)
  },
  // 获取话题分类
  _getTopicCategories(requestData){
    getTopicCategories(requestData).then(res => {
      this.setData({
        categories: res.data.data,
        category_id: res.data.data[0].id
      })
      // 默认获取第一个分类列表
      this._getTopicLists();
    }).catch(res => {
      console.log(res)
    })
  },
  // 获取话题列表
  _getTopicLists(){
    let requestData = {}
    if (this.data.category_page == 1) {
      requestData = {
        category_id: this.data.category_id,
        token: this.data.token
      }
    }else {
      requestData = {
        category_id: this.data.category_id +"?page="+ this.data.category_page,
        token: this.data.token
      }
    }
    getTopicLists(requestData).then(res => {
      const list = res.data.data;
      let page_num;
      this.data.dataList.push(...list);
      if (res.data.meta.pagination.links.next){
        page_num = res.data.meta.pagination.links.next.split("=")[1]
      }else {
        page_num = 1;
      }
      this.setData({
        categoryLists: this.data.dataList,
        category_page: page_num,
        total_pages: res.data.meta.pagination.total_pages
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
      dataList: []
    })
    this._getTopicLists()
  },
  // 点击lists查看对应的详情
  listsClick(e){
    const currentId = e.detail.currentId;
    const dataObj = {currentId: currentId,token: this.data.token}
    // this._getTopicDetails(currentId)
    wx.navigateTo({
      url: '../newsDetail/newsDetail',
      success: function (res) {
        // 通过eventChannel向被打开页面传送数据
        res.eventChannel.emit('acceptDataFromOpenerPage', { data: dataObj})
      }
    })
  }
})