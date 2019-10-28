import { getTopicDetails } from '../../service/api/news.js'
import { forbiddenReLaunch } from '../../util/util.js'
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
    this._getData();
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
      if (res.statusCode == 403) {
        forbiddenReLaunch();
        return;
      }
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