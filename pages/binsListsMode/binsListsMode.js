import { TOKEN } from '../../common/const.js'
import { isTokenFailure } from '../../util/util.js'
import { getBinLists } from '../../service/api/recyclingBins.js'
import { updateToken } from '../../service/api/user.js'
// var QQMapWX = require('../../common/qqmap-wx-jssdk.min.js')
// var qqmapsdk

Page({
  data: {
    localInfo: "敦化路街道328号诺德广场B座",
    listsArr: [],
    dataList: [],  //临时数组存放数据
    category_page: 1,
    total_pages: 0,
    lat: null,
    lng: null,
    token: ""
  },
  onLoad: function () {
    // 腾讯地图初始化
    // qqmapsdk = new QQMapWX({
    //   key: 'OUTBZ-V6R3O-A7AW2-SLGR3-IF27F-VOFTS'
    // });
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
    if (this.data.category_page < this.data.total_pages) {
      this._getBinsLists()
    }
  },
  _getData(){
    this.getLocation()
  },
  // 获取位置信息
  getLocation() {
    // 获取位置信息
    wx.getLocation({
      type: 'gcj02',
      success: res => {
        console.log(res)
        this.setData({
          lat: res.latitude,
          lng: res.longitude
        })
        this._getBinsLists();
      },
      fail: res => {
        console.log(res)
      }
    })
  },
  // 获取回收箱列表
  _getBinsLists() {
    console.log(this.data);
    const requestData = {
      page: this.data.category_page,
      token: this.data.token,
      lat: this.data.lat,
      lng: this.data.lng
    }
    getBinLists(requestData).then(res => {
      console.log(res);
      const list = res.data.data;
      let page_num;
      this.data.dataList.push(...list);
      if (res.data.meta.pagination.links.next) {
        let splitArr = res.data.meta.pagination.links.next.split("=")
        page_num = splitArr[splitArr.length-1]
      } else {
        page_num = 1;
      }
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
  getLocalInfo(e){
    var _this = this;
    qqmapsdk.reverseGeocoder({
      //位置坐标，默认获取当前位置，非必须参数
      /**
       * 
       //Object格式
        location: {
          latitude: 39.984060,
          longitude: 116.307520
        },
      */
      /**
       *
       //String格式
        location: '39.984060,116.307520',
      */
      location: '', //获取表单传入的位置坐标,不填默认当前位置,示例为string格式
      //get_poi: 1, //是否返回周边POI列表：1.返回；0不返回(默认),非必须参数
      success: function (res) {//成功后的回调
        console.log(res);
        var res = res.result;
        var mks = [];
        /**
         *  当get_poi为1时，检索当前位置或者location周边poi数据并在地图显示，可根据需求是否使用
         *
            for (var i = 0; i < result.pois.length; i++) {
            mks.push({ // 获取返回结果，放到mks数组中
                title: result.pois[i].title,
                id: result.pois[i].id,
                latitude: result.pois[i].location.lat,
                longitude: result.pois[i].location.lng,
                iconPath: './resources/placeholder.png', //图标路径
                width: 20,
                height: 20
            })
            }
        *
        **/
        //当get_poi为0时或者为不填默认值时，检索目标位置，按需使用
        mks.push({ // 获取返回结果，放到mks数组中
          title: res.address,
          id: 0,
          latitude: res.location.lat,
          longitude: res.location.lng,
          iconPath: './resources/placeholder.png',//图标路径
          width: 20,
          height: 20,
          callout: { //在markers上展示地址名称，根据需求是否需要
            content: res.address,
            color: '#000',
            display: 'ALWAYS'
          }
        });
        _this.setData({ //设置markers属性和地图位置poi，将结果在地图展示
          markers: mks,
          poi: {
            latitude: res.location.lat,
            longitude: res.location.lng
          }
        });
      },
      fail: function (error) {
        console.error(error);
      },
      complete: function (res) {
        console.log(res);
      }
    })
  },
  //
  gomappage:function(e){
    console.log("111111111111");
    console.log(e);
    var temp = {
      lat: e.currentTarget.dataset.lat,
      lng: e.currentTarget.dataset.lng,
    }
    wx.navigateTo({
      url: '../binsLists/binsLists',
      success: function (res) {
        // 通过eventChannel向被打开页面传送数据
        res.eventChannel.emit('acceptDataFromOpenerPage', { data:temp })
      }
    })
  },
  // -----------------事件监听及操作---------------------
  changeShowModule() {
    const dataObj = { lat: this.data.lat, lng: this.data.lng }
    wx.navigateTo({
      url: '../binsLists/binsLists',
      success: function (res) {
        res.eventChannel.emit('acceptDataFromOpenerPage', { data: dataObj })
      }
    })
  }
})