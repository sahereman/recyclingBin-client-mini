// pages/news/news.js
import {
  getTopicCategories,
  getTopicLists,
  getTopicDetails

} from '../../service/api/news.js'
import { TOKEN } from '../../common/const.js'
import { isTokenFailure } from '../../util/util.js'

Page({
  data: {
    category_id: 0,
    topic_id: 0,
    token:"",
    categories: [],
    categoryLists: [],
    currentIndex: 0
  },
  onLoad: function (options) {
    // 每次页面加载时验证token是否过期
    // 判断token，刷新token
    isTokenFailure();
    this.data.token = wx.getStorageSync(TOKEN);
    this._getData();
  },
  _getData(){
    this._getTopicCategories(this.data.token)
  },
  // 获取话题分类
  _getTopicCategories(requestData){
    getTopicCategories(requestData).then(res => {
      this.setData({
        categories: res.data.data
      })
      // 默认获取第一个分类列表
      this._getTopicLists(res.data.data[0].id);
    }).catch(res => {
      console.log(res)
    })
  },
  // 获取话题列表
  _getTopicLists(category_id){
    const requestData = {
      category_id: category_id,
      token: this.data.token
    }
    getTopicLists(requestData).then(res => {
      console.log(res)
      this.setData({
        categoryLists: res.data.data
      })
    }).catch(res => {
      console.log(res)
    })
  },
  // 获取话题详情
  _getTopicDetails(topic_id){
    const requestData = {
      topic_id: topic_id,
      token: this.data.token
    }
    getTopicDetails(requestData).then(res => {
      console.log(res)
    }).catch(res =>{
      console.log(res)
    })
  },
  // 事件
  // 点击获取对应分类的列表内容
  menuClick(e){
    const currentIndex = e.detail.currentIndex;
    const maitkey = this.data.categories[currentIndex].id;
    // 获取点击的menu的按钮的id，通过id获取分类下的列表
    this._getTopicLists(maitkey)
  },
  // 点击lists查看对应的详情
  listsClick(e){
    const currentId = e.detail.currentId;
    this._getTopicDetails(currentId)
  }
})