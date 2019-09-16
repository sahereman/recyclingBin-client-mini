// pages/news/childCpns/w-content/w-content.js
Component({
  properties: {
    categoryLists:{
      type: Array
    }
  },
  data: {
    currentId: 0
  },
  methods: {
    onItemClick(e){
      console.log(e)
      const currentId = e.currentTarget.dataset.listid;
      this.setData({
        currentId
      })
      this.triggerEvent('listsclick', { currentId }, {})
    }
  }
})
