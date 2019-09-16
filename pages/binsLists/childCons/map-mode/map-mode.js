// pages/binsLists/childCons/map-mode/map-mode.js
Component({
  options: {
    styleIsolation: 'apply-shared'
  },
  properties: {

  },

  data: {
    localInfoName: "敦化路街道328号诺德广场B座",
    binDistance: "1676.50km", //垃圾箱距离
    binTime: "周一至周日 08:30-21:00",  //回收箱工作时间
    binencoding: "GongYi0005",  //回收箱编码
    classifyArry:[      // 导航下半部分内容
      {
        id:1,
        name: "纺织物",
        price: "0.10元/公斤",
        image: "../../../../assets/images/map/full_icon.png",
        child_arr:[
          { child_id: 1, child_name: "衣、帽", image_url: "../../../../assets/images/map/clothing_icon.png" },
          { child_id: 2, child_name: "鞋、包", image_url: "../../../../assets/images/map/Shoebag_icon.png" },
          { child_id: 3, child_name: "毛绒玩具", image_url: "../../../../assets/images/map/plushboy_icon.png" }
        ]
      },
      {
        id: 2,
        name: "可回收物",
        price: "0.30元/公斤",
        image: "../../../../assets/images/map/capacity_icon.png",
        child_arr: [
          { child_id: 1, child_name: "纸类", image_url: "../../../../assets/images/map/paperclass_icon.png" },
          { child_id: 2, child_name: "塑料", image_url: "../../../../assets/images/map/plastic_icon.png" },
          { child_id: 3, child_name: "金属", image_url: "../../../../assets/images/map/metal_icon.png" }
        ]
      },
    ],
    markers: [{
      iconPath: "../../assets/images/map/location_icon.png",
      id: 0,
      latitude: 23.099994,
      longitude: 113.324520,
      width: 50,
      height: 50
    }]

  },

  methods: {
    openMapChoose(){
      console.log("点击打开地图选择");
    }
  }
})
