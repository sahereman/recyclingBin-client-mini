Component({
  options: {
    styleIsolation: 'apply-shared'
  },
  properties: {
    nearByArr:{
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
    binTime: "周一至周日 08:30-21:00",  //回收箱工作时间
    fabricImages: [
      { child_id: 1, child_name: "衣、帽", image_url: "../../../../assets/images/map/clothing_icon.png" },
      { child_id: 2, child_name: "鞋、包", image_url: "../../../../assets/images/map/Shoebag_icon.png" },
      { child_id: 3, child_name: "毛绒玩具", image_url: "../../../../assets/images/map/plushboy_icon.png" }
    ],
    paperImages: [
      { child_id: 1, child_name: "纸类", image_url: "../../../../assets/images/map/paperclass_icon.png" },
      { child_id: 2, child_name: "塑料", image_url: "../../../../assets/images/map/plastic_icon.png" },
      { child_id: 3, child_name: "金属", image_url: "../../../../assets/images/map/metal_icon.png" }
    ],
    markers: [{
      iconPath: "../../../../assets/images/map/location_icon.png",
      id: 0,
      latitude: 23.099994,
      longitude: 113.324520,
      width: 50,
      height: 50
    }]

  },
  methods: {
    openMapChoose(){
      wx.openLocation({
        latitude: this.properties.latitude,
        longitude: this.properties.longitude,
        scale: 18,
        address: this.properties.nearByArr.address
      })
    }
  }
})
