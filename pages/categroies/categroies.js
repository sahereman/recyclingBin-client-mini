Page({
  data: {
    cateItems: [
      {
        cate_id: 1,
        cate_name: "纺织物",
        ishaveChild: true,
        children:
          [
            {
              child_id: 1,
              name: '抱枕/靠垫',
              image: "../../assets/images/categroies/categroy_img_1.png"
            },
            {
              child_id: 2,
              name: '抱枕/靠垫',
              image: "../../assets/images/categroies/categroy_img_1.png"
            },
            {
              child_id: 3,
              name: '抱枕/靠垫',
              image: "../../assets/images/categroies/categroy_img_1.png"
            },
            {
              child_id: 4,
              name: '抱枕/靠垫',
              image: "../../assets/images/categroies/categroy_img_1.png"
            }
          ]
      },
      {
        cate_id: 2,
        cate_name: "可回收物",
        ishaveChild: true,
        children:
          [
            {
              child_id: 1,
              name: '抱枕/靠垫',
              image: "../../assets/images/categroies/categroy_img_1.png"
            },
            {
              child_id: 2,
              name: '抱枕/靠垫',
              image: "../../assets/images/categroies/categroy_img_1.png"
            },
            {
              child_id: 3,
              name: '抱枕/靠垫',
              image: "../../assets/images/categroies/categroy_img_1.png"
            },
            {
              child_id: 4,
              name: '抱枕/靠垫',
              image: "../../assets/images/categroies/categroy_img_1.png"
            },
            {
              child_id: 5,
              name: '抱枕/靠垫',
              image: "../../assets/images/categroies/categroy_img_1.png"
            },
            {
              child_id: 6,
              name: '抱枕/靠垫',
              image: "../../assets/images/categroies/categroy_img_1.png"
            },
            {
              child_id: 7,
              name: '抱枕/靠垫',
              image: "../../assets/images/categroies/categroy_img_1.png"
            },
            {
              child_id: 8,
              name: '抱枕/靠垫',
              image: "../../assets/images/categroies/categroy_img_1.png"
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