import { TOKEN, VALIDTIME } from '../../common/const.js'
import { getTopicCategories } from '../../service/api/order.js'
import { isTokenFailure } from '../../util/util.js'

Page({
  data: {

  },
  onLoad: function (options) {
    // 判断token，刷新token
    isTokenFailure();
    // 发送网络请求
    this._getData();
  },
  // 网络请求
  _getData(){
    this._getTopicCategories();
  },
  // 获取订单列表
  _getTopicCategories(){
    const token = wx.getStorageSync(TOKEN);
    getTopicCategories(token).then(res => {
      console.log(res);
    }).catch(res => {
      console.log(res)
    })
  }
})