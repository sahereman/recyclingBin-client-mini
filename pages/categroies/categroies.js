Page({
  data: {
    cateItems: [
      {
        cate_id: 1,
        cate_name: "纺织物",
        ishaveChild: true,
        listdata:[
          {
            children:[
              {
                child_id: 1,
                name: '抱枕/靠垫',
                image: "../../assets/images/categroies/textile1.png"
              },
              {
                child_id: 2,
                name: '床上用品',
                image: "../../assets/images/categroies/textile2.png"
              },
              {
                child_id: 3,
                name: '公仔',
                image: "../../assets/images/categroies/textile3.png"
              },
              {
                child_id: 4,
                name: '裤子',
                image: "../../assets/images/categroies/textile4.png"
              },
              {
                child_id: 5,
                name: '毛巾',
                image: "../../assets/images/categroies/textile5.png"
              },
              {
                child_id: 6,
                name: '书包',
                image: "../../assets/images/categroies/textile6.png"
              },
              {
                child_id: 7,
                name: '围巾',
                image: "../../assets/images/categroies/textile7.png"
              },
              {
                child_id: 8,
                name: '鞋子',
                image: "../../assets/images/categroies/textile8.png"
              },
              {
                child_id: 9,
                name: '衣服',
                image: "../../assets/images/categroies/textile9.png"
              }
            ]
          }
        ]
      },
      {
        cate_id: 2,
        cate_name: "可回收物",
        ishaveChild: true,
        listdata: [
          {
            name: '纸类',
            children: [
              {
                child_id: 1,
                name: '办公废纸',
                image: "../../assets/images/categroies/paper1.png"
              },
              {
                child_id: 2,
                name: '包装废纸',
                image: "../../assets/images/categroies/paper2.png"
              },
              {
                child_id: 3,
                name: '废报纸',
                image: "../../assets/images/categroies/paper3.png"
              },
              {
                child_id: 4,
                name: '画报/画册',
                image: "../../assets/images/categroies/paper4.png"
              },
              {
                child_id:5,
                name: '明信片',
                image: "../../assets/images/categroies/paper5.png"
              },
              {
                child_id: 6,
                name: '杂志书刊',
                image: "../../assets/images/categroies/paper6.png"
              },
              {
                child_id: 7,
                name: '纸盒',
                image: "../../assets/images/categroies/paper7.png"
              },
              {
                child_id: 8,
                name: '纸质画册',
                image: "../../assets/images/categroies/paper8.png"
              },
              {
                child_id: 9,
                image: "../../assets/images/categroies/empty.png"
              }
            ]
          },
          {
            name: '塑料',
            children: [
              {
                child_id: 1,
                name: '果汁茶饮杯',
                image: "../../assets/images/categroies/plastic1.png"
              },
              {
                child_id: 2,
                name: '键盘',
                image: "../../assets/images/categroies/plastic2.png"
              },
              {
                child_id: 3,
                name: '食用油壶',
                image: "../../assets/images/categroies/plastic3.png"
              },
              {
                child_id: 4,
                name: '收纳盒',
                image: "../../assets/images/categroies/plastic4.png"
              },
              {
                child_id: 5,
                name: '水管',
                image: "../../assets/images/categroies/plastic5.png"
              },
              {
                child_id: 6,
                name: '塑料包装品',
                image: "../../assets/images/categroies/plastic6.png"
              },
              {
                child_id: 7,
                name: '塑料袋',
                image: "../../assets/images/categroies/plastic7.png"
              },
              {
                child_id: 8,
                name: '塑料水杯',
                image: "../../assets/images/categroies/plastic8.png"
              },
              {
                child_id: 9,
                name: '塑料桶',
                image: "../../assets/images/categroies/plastic9.png"
              },
              {
                child_id: 10,
                name: '塑料拖鞋',
                image: "../../assets/images/categroies/plastic10.png"
              },
              {
                child_id: 11,
                name: '塑料外壳',
                image: "../../assets/images/categroies/plastic11.png"
              },
              {
                child_id:12,
                name: '塑料玩具',
                image: "../../assets/images/categroies/plastic12.png"
              },
              {
                child_id:13,
                name: '塑料文具',
                image: "../../assets/images/categroies/plastic13.png"
              },
              {
                child_id: 14,
                image: "../../assets/images/categroies/empty.png"
              },
              {
                child_id:15,
                image: "../../assets/images/categroies/empty.png"
              }
            ]
          },
          {
            name: '金属',
            children: [
              {
                child_id: 1,
                name: '保温杯瓶',
                image: "../../assets/images/categroies/metal1.png"
              },
              {
                child_id: 2,
                name: '电线',
                image: "../../assets/images/categroies/metal2.png"
              },
              {
                child_id: 3,
                name: '罐头盖',
                image: "../../assets/images/categroies/metal3.png"
              },
              {
                child_id: 4,
                name: '金属餐具',
                image: "../../assets/images/categroies/metal4.png"
              },
              {
                child_id: 5,
                name: '门窗架',
                image: "../../assets/images/categroies/metal5.png"
              },
              {
                child_id: 6,
                name: '奶粉罐',
                image: "../../assets/images/categroies/metal6.png"
              },
              {
                child_id: 7,
                name: '平底锅',
                image: "../../assets/images/categroies/metal7.png"
              },
              {
                child_id: 8,
                name: '水龙头',
                image: "../../assets/images/categroies/metal8.png"
              },
              {
                child_id: 9,
                name: '铁纸质物架',
                image: "../../assets/images/categroies/metal9.png"
              },
              {
                child_id: 10,
                name: '易拉罐',
                image: "../../assets/images/categroies/metal10.png"
              }
            ]
          }
        ]
      }
    ],
    curNav: 1,
    curIndex: 0,
  },
  onLoad: function (options) {
    // console.log(options)
  },
  //事件处理函数
  switchRightTab: function (e) {
    // 获取item项的id，和数组的下标值
    let id = e.target.dataset.id,
      index = parseInt(e.target.dataset.index);
    // 把点击到的某一项，设为当前index
    this.setData({
      curNav: id,
      curIndex: index
    })
  }
})