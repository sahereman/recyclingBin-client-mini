import {
  getBinLists, getNearbyBin
} from '../../../../service/api/recyclingBins.js'
import { TOKEN, LISTBINTAP } from '../../../../common/const.js'

Component({
  options: {
    styleIsolation: 'apply-shared'
  },
  properties: {
    nearByArr: {
      type: Object,
      value: {}
    },
    latitude: {
      type: Number,
      value: 0
    },
    longitude: {
      type: Number,
      value: 0
    }
  },
  data: {
    binTime: "周一至周日 08:30-21:00", //回收箱工作时间
    fabricImages: [{
        child_id: 1,
        child_name: "衣、帽",
        image_url: "../../../../assets/images/map/clothing_icon.png"
      },
      {
        child_id: 2,
        child_name: "鞋、包",
        image_url: "../../../../assets/images/map/Shoebag_icon.png"
      },
      {
        child_id: 3,
        child_name: "毛绒玩具",
        image_url: "../../../../assets/images/map/plushboy_icon.png"
      }
    ],
    paperImages: [{
        child_id: 1,
        child_name: "纸类",
        image_url: "../../../../assets/images/map/paperclass_icon.png"
      },
      {
        child_id: 2,
        child_name: "塑料",
        image_url: "../../../../assets/images/map/plastic_icon.png"
      },
      {
        child_id: 3,
        child_name: "金属",
        image_url: "../../../../assets/images/map/metal_icon.png"
      }
    ],
    markers: []
  },
  created(){
    //this.mapCtx = wx.createMapContext("map");
  },
  ready() {
    this._getBinsLists();
  },
  methods: {
    openMapChoose() {
      wx.openLocation({
        latitude: this.properties.latitude,
        longitude: this.properties.longitude,
        scale: 18,
        address: this.properties.nearByArr.address
      })
    },
    // 获取回收箱列表
    _getBinsLists() {
      const token = wx.getStorageSync(TOKEN);
      const that = this;
      const requestData = {
        page: 1,
        token: token,
        lat: this.properties.latitude,
        lng: this.properties.longitude,
        count:20
      }
      var arealist = [];
      getBinLists(requestData).then(res => {
        for (var i = 0; i < res.data.data.length; i++) {
          var temp = {
            iconPath: "../../../../assets/images/map/bars_icon.png",
            id: res.data.data[i].id,
            latitude: res.data.data[i].lat,
            longitude: res.data.data[i].lng,
            width: 34,
            height: 41
          }
          arealist.push(temp);
        }
        that.setData({
          markers: arealist
        })
      }).catch(res => {

      })
    },
    mapViewchange(e) {
      var that = this;
      // 地图发生变化的时候，获取中间点，也就是用户选择的位置toFixed
      if (e.type == 'end' && (e.causedBy == 'drag' || e.causedBy == 'scale')) {
        var mapCtx = wx.createMapContext("map",that);
        mapCtx.getCenterLocation({
          type:'gcj02',
          success: function(res) {
            that.setData({
              latitude:res.latitude,
              longitude: res.longitude
            })
            that._getBinsLists();
            that._getNearbyBin();
          }
        })
      }
    },
    gotohere: function (res) {
      let lat = ''; // 获取点击的markers经纬度
      let lon = ''; // 获取点击的markers经纬度
      let name = ''; // 获取点击的markers名称
      let markerId = res.markerId;// 获取点击的markers  id
      let markers = res.currentTarget.dataset.markers;// 获取markers列表

      for (let item of markers) {
        if (item.id === markerId) {
          lat = Number(item.latitude);
          lon = Number(item.longitude);
          wx.openLocation({ // 打开微信内置地图，实现导航功能（在内置地图里面打开地图软件）
            latitude: lat,
            longitude: lon,
            name: name,
            success: function (res) {
              console.log(res);
            },
            fail: function (res) {
              console.log(res);
            }
          })
          break;
        }
      }
    },
    _getNearbyBin() {
      const token = wx.getStorageSync(TOKEN);
      const requestData = {
        token: token,
        lat: this.properties.latitude,
        lng: this.properties.longitude
      }
      getNearbyBin(requestData).then(res => {
        this.setData({
          nearByArr: res.data
        })
      }).catch(res => {
        console.log(res)
      })
    }
  }
})