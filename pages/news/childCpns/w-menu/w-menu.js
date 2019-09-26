// pages/news/childCpns/w-menu/w-menu.js
Component({
  properties: {
    categories: {
      type: Array
    }
  },
  data: {
    currentIndex: 0
  },
  methods: {
    onItemClick(e) {
      var that = this;
      // 1.改变当前的currentIndex
      const currentIndex = e.currentTarget.dataset.index;
      if (currentIndex != that.data.currentIndex){
        that.setData({
          currentIndex
        })
        // 2.将最新的currentIndex传递到分类页面
        that.triggerEvent('menuclick', { currentIndex }, {})
      }
      
    }
  }
})
