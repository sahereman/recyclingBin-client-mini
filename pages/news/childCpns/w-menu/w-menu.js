// pages/news/childCpns/w-menu/w-menu.js
Component({
  properties: {
    categories: {
      type: Array
    },
    categoryIndex: null
  },
  data: {
    currentIndex: 0
  },
  ready: function () { 
    this.getData();
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
        // 2.将最新的currentIndex传递到上层
        that.triggerEvent('menuclick', { currentIndex }, {})
      }
      
    },
    getData(){
      if (this.properties.categoryIndex != null) {
        this.setData({
          currentIndex: this.properties.categoryIndex
        })
      }
    }
  }
})
