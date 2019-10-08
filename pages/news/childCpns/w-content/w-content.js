Component({
  options: {
    styleIsolation: 'apply-shared'
  },
  properties: {
    categoryLists:{
      type: Array
    },
    isLast: {
      type: Boolean,
      value: false
    }
  },
  data: {
    currentId: 0
  },
  methods: {
    onItemClick(e){
      const currentId = e.currentTarget.dataset.listid;
      this.setData({
        currentId
      })
      this.triggerEvent('listsclick', { currentId }, {})
    }
  }
})
