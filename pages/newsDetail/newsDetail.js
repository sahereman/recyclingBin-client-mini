import { getTopicDetails } from '../../service/api/news.js'
import { updateToken } from '../../service/api/user.js'
import { TOKEN } from '../../common/const.js'
import { isTokenFailure } from '../../util/util.js'

Page({
  data: {
    nodes: '',
    title:'',
    desc:'',
    view_count:0,
    token: '',
    currentId: null
  },
  onLoad: function (options) {
    this.data.currentId = options.currentId;
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
        wx.reLaunch({
          url: '../../pages/index/index'
        })
      }
    }
  },
  // 网络请求
  _getData(){
    this._getTopicDetails()
  },
  // 获取话题详情
  _getTopicDetails() {
    const requestData = {
      topic_id: this.data.currentId,
      token: this.data.token
    }
    getTopicDetails(requestData).then(res => {
      wx.setNavigationBarTitle({
        title: res.data.title
      })
      this.setData({
        nodes: res.data.content,
        title: res.data.title,
        view_count: res.data.view_count
      })
    }).catch(res => {
      console.log(res)
      this.setData({
        nodes: "数据获取出错，请退出重进"
      })
    })
  },
})