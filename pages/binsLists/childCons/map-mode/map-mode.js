import {
  getBinLists
} from '../../../../service/api/recyclingBins.js'
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
      const that = this;
      const requestData = {
        page: 1,
        token: this.data.token,
        lat: this.data.latitude,
        lng: this.data.longitude
      }
      var arealist = that.data.markers;
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
        console.log(arealist);
        that.setData({
          markers: arealist
        })
      }).catch(res => {

      })
    },
    regionchange(e) {
      console.log("11111111111111");
      console.log(e.type)
    },
    markertap(e) {
      console.log("2222222222");
      console.log(e.markerId)
    },
    controltap(e) {
      console.log("33333333333");
      console.log(e.controlId)
    },
    mapViewchange(e) {
      console.log(e)
      // 地图发生变化的时候，获取中间点，也就是用户选择的位置toFixed
      if (e.type == 'end' && (e.causedBy == 'scale' || e.causedBy == 'drag')) {
        console.log(e)
        var that = this;
        var mapCtx = wx.createMapContext("map");
        mapCtx.getCenterLocation({
          type: 'gcj02',
          success: function(res) {
            console.log(res)
            that.setData({
              latitude: res.latitude,
              longitude: res.longitude,
              circles: [{
                latitude: res.latitude,
                longitude: res.longitude,
                color: '#FF0000DD',
                fillColor: '#d1edff88',
                radius: 3000, //定位点半径
                strokeWidth: 1
              }]
            })
          }
        })
      }
    },
  }
})