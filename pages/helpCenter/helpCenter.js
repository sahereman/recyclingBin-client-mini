// pages/helpCenter/helpCenter.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    questionData: [
      {
        ques: '可投放哪些物品？',
        isOpen: true,
        answer: [
          '（1）纸类：纸壳、报纸、书本杂志',
          '（2）塑料类：透明塑料瓶、透明食用油桶等瓶底标有PET标志的塑料（洗洁精、洗衣液、洗发露、孩子玩具 等有色塑料暂不回收）',
          '（3）金属类：铝制易拉罐（红牛罐、核桃露罐、奶粉罐等属于铁制品，暂不回收）'
        ]
      },
      {
        ques: '投递如何计算？',
        isOpen: false,
        answer: ['投放后系统自动计算出投放费用，开箱后回收员会再次进行确认，以回收员确认价格为准。']
      },
      {
        ques: '投递后没有收到奖励金怎么办？',
        isOpen: false,
        answer: ['可致电点点回收官方客服电话0532-87967521，客服人员会帮助您解决问题。']
      },
      {
        ques: '如何找到工蚁回收箱？',
        isOpen: false,
        answer: ['打开微信小程序首页，点击【附近回收箱】，可找到距离您最近的回收想位置，并可前往投递。']
      }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {
    wx.stopPullDownRefresh();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  openDetail: function (e) {//展开
    var index = e.currentTarget.dataset.index;
    var that = this;
    var questionData = that.data.questionData;
    questionData[index].isOpen = !questionData[index].isOpen;
    that.setData({
      questionData: questionData
    })
  }
})