// pages/index/childcon/my-reward/my-reward.js
Component({
  options: {
    styleIsolation: 'apply-shared'
  },
  properties: {
    bounty:{
      type: String,
      value: "0.00"
    },
    deliveryTimes: {
      type: Number,
      value: 0
    },
    totalBounty: {
      type: String,
      value:'0.00'
    }
  },
  data: {
    title: "我的奖励金"
  },

  /**
   * 组件的方法列表
   */
  methods: {

  }
})
