import {
  getTraBinLists, getTraNearbyBin
} from '../../../../service/api/recyclingBins.js'
import { TOKEN, LISTBINTAP } from '../../../../common/const.js'
import { forbiddenReLaunch } from '../../../../util/util.js'

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
    },
    isSystemLocal: {
      type: Boolean,
      value: true
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
      },
      {
        child_id: 4,
        child_name: "裤子",
        image_url: "../../../../assets/images/map/pants_icon.png"
      },
      {
        child_id:5,
        child_name: "家纺",
        image_url: "../../../../assets/images/map/textile_icon.png"
      },
      {
        child_id: 6,
        child_name: "棉絮",
        image_url: "../../../../assets/images/map/cotton_icon.png"
      }
    ],
    markers: [],
    mapChange: false,
    changeHeight:false
  },
  created(){
    //this.mapCtx = wx.createMapContext("map");
  },
  ready() {
    this._getBinsLists();
  },
  methods: {
    openMapChoose() {
      if (!this.data.mapChange){
        const listbintap = wx.getStorageSync(LISTBINTAP);
        if (listbintap) {
          this.properties.latitude = listbintap.lat;
          this.properties.longitude = listbintap.lng;
        }
      }
      wx.openLocation({
        latitude: Number(this.properties.latitude),
        longitude: Number(this.properties.longitude),
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
      getTraBinLists(requestData).then(res => {
        console.log(res);
        if (res.statusCode == 403) {
          forbiddenReLaunch(true);
          return;
        }
        for (var i = 0; i < res.data.data.length; i++) {
          var temp = {
            iconPath: "../../../../assets/images/map/tra_box.png",
            id: res.data.data[i].id,
            latitude: res.data.data[i].lat,
            longitude: res.data.data[i].lng,
            width: 34,
            height:38
          }
          arealist.push(temp);
        }
        that.setData({
          markers: arealist,
          changeHeight:true
        })
      }).catch(res => {

      })
    },
    mapViewchange(e) {
      var that = this;
      // 地图发生变化的时候，获取中间点，也就是用户选择的位置toFixed
      if (e.type == 'end' && (e.causedBy == 'drag' || e.causedBy == 'scale')) {
        var mapCtx = wx.createMapContext("map2",that);
        mapCtx.getCenterLocation({
          type:'gcj02',
          success: function(res) {
            console.log(res);
            that.data.mapChange = true;
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
      console.log("11111111");
      const token = wx.getStorageSync(TOKEN);
      const requestData = {
        token: token,
        lat: this.properties.latitude,
        lng: this.properties.longitude
      }
      getTraNearbyBin(requestData).then(res => {
        if (res.statusCode == 403) {
          forbiddenReLaunch(true);
          return;
        }
        this.setData({
          nearByArr: res.data
        })
        this.properties.latitude = res.data.lat
        this.properties.longitude = res.data.lng
      }).catch(res => {
        console.log(res)
      })
    }
  }
})