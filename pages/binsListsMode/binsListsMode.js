import { TOKEN } from '../../common/const.js'
import { isTokenFailure } from '../../util/util.js'
import { getBinLists } from '../../service/api/recyclingBins.js'
import { updateToken } from '../../service/api/user.js'
var QQMapWX = require('../../common/qqmap-wx-jssdk.min.js')
var qqmapsdk

Page({
  data: {
    localInfo: "",
    listsArr: [],
    dataList: [],  //临时数组存放数据
    category_page: 1,
    total_pages: 0,
    lat: null,
    lng: null,
    token: "",
    bearByArr: {}
  },
  onLoad: function (options) {
    // 腾讯地图初始化
    qqmapsdk = new QQMapWX({
      key: 'OUTBZ-V6R3O-A7AW2-SLGR3-IF27F-VOFTS'
    });
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
  onShow: function () {
  },
  onReachBottom: function () {
    if (this.data.category_page <= this.data.total_pages) {
      this._getBinsLists()
    }
  },
  _getData() {
    this.getLocation()
  },
  // 获取位置信息
  getLocation() {
    // 获取位置信息
    wx.getLocation({
      type: 'gcj02',
      success: res => {
        this.setData({
          lat: res.latitude,
          lng: res.longitude
        })
        this._getBinsLists();
        this.getLocalInfo();
      },
      fail: res => {
        console.log(res)
      }
    })
  },
  // 获取回收箱列表
  _getBinsLists() {
    const requestData = {
      page: this.data.category_page,
      token: this.data.token,
      lat: this.data.lat,
      lng: this.data.lng,
      count: 10
    }
    getBinLists(requestData).then(res => {
      console.log(res);
      wx.stopPullDownRefresh();
      const list = res.data.data;
      let page_num = this.data.category_page;
      page_num++
      this.data.dataList.push(...list);
      this.setData({
        listsArr: this.data.dataList,
        category_page: page_num,
        total_pages: res.data.meta.pagination.total_pages
      })
    }).catch(res => {
      console.log(res)
      this.setData({
        listsArr: []
      })
    })
  },
  // 获取当前位置的详细描述
  getLocalInfo() {
    let that = this;
    qqmapsdk.reverseGeocoder({
      location: {
        latitude: that.data.lat,
        longitude: that.data.lng
      },
      success: function (res) {
        that.setData({
          localInfo: res.result.address
        })
      },
      fail: function (res) {
        console.log(res);
      },
      complete: function (res) {
        // console.log(res);
      }
    })
  },
  //
  gomappage: function (e) {
    console.log(e)
    const name = e.currentTarget.dataset.name;
    const address = e.currentTarget.dataset.address;
    const no = e.currentTarget.dataset.no;
    const distance = e.currentTarget.dataset.distance;
    wx.navigateTo({
      url: '../binsLists/binsLists?name=' + name + "&address=" + address + "&no=" + no + "&distance=" + distance,
    })
  },
  // -----------------事件监听及操作---------------------
  changeShowModule() {
    wx.navigateTo({
      url: '../binsLists/binsLists',
    })
  },
  //下拉刷新
  onPullDownRefresh() {
    this.setData({
      category_page: 1,
      listsArr: [],
      dataList: []
    });
    this._getBinsLists();
  }
})