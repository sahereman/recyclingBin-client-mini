import { updateToken, getMessageData } from '../../service/api/user.js'
import { TOKEN } from '../../common/const.js'
import { isTokenFailure } from '../../util/util.js'
const app = getApp()
Page({
  data: {
    token: "",
    msgList:[],
    category_page:1,
    total_pages: 0,
  },
  onShow: function (options) {
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
        // token不存在需用户重新登录
        
      }
    }
  },
  onReachBottom: function () {
    // 监听用户上拉触底事件
    if (this.data.category_page < this.data.total_pages) {
      this._getTopicLists()
    }
  },
  _getData() {
    this.getMsgList()
  },
  getMsgList:function(){
    var that = this;
    let requestData = {}
    requestData = {
      page: that.data.category_page,
      token: that.data.token
    }
    getMessageData(requestData).then(res => {
      console.log(res);
      wx.stopPullDownRefresh();
      const list = res.data.data;
      const msgList = that.data.msgList;
      let page_num;
      msgList.push(...list);
      if (res.data.meta.pagination.links.next) {
        page_num = res.data.meta.pagination.links.next.split("=")[1]
      }
      console.log(page_num);
      that.setData({
        msgList: msgList,
        category_page: page_num,
        total_pages: res.data.meta.pagination.total_pages
      })
    }).catch(res => {
      console.log(res)
    })
  },
  onReachBottom: function () {
    // 监听用户上拉触底事件
    if (this.data.category_page < this.data.total_pages) {
      this.getMsgList()
    }
  },
  onPullDownRefresh() {
    this.setData({
      msgList: [],
      category_page: 1,
      total_pages: 0,
    })
    this.getMsgList()
  }
})