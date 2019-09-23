import { getTopicDetails } from '../../service/api/news.js'

Page({
  data: {
    nodes: ''
  },
  onLoad: function (options) {
    const eventChannel = this.getOpenerEventChannel()
    const that = this;
    // 监听acceptDataFromOpenerPage事件，获取上一页面通过eventChannel传送到当前页面的数据
    eventChannel.on('acceptDataFromOpenerPage', function (data) {
      const currentId = data.data.currentId;
      const token = data.data.token;
      that._getTopicDetails(currentId, token)
    })
  },
  // 获取话题详情
  _getTopicDetails(topic_id,token) {
    const requestData = {
      topic_id: topic_id,
      token: token
    }
    getTopicDetails(requestData).then(res => {
      let data = `<div><h3>javascript - <em>js同步编程</em>与异步编程的区别,异步有哪些优点,为什么...</h3><div><span>2016年5月20日 - </span>从编程方式来讲当然是<em>同步编程</em>的方式更为简单,但是同步有其局限性一是假如是单线程那么一旦遇到阻塞调用,会造成整个线程阻塞,导致cpu无法得到有效利用...</div><div><div></div><span ><span ></span></span> - 百度快照</div><div ><span>为您推荐：</span>js同步和异步ajax异步和同步的区别</div></div>`;
      wx.setNavigationBarTitle({
        title: res.data.title
      })
      this.setData({
        nodes: data 
      })
    }).catch(res => {
      console.log(res)
      this.setData({
        nodes: "数据获取出错，请推出重进"
      })
    })
  },
})