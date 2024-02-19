// components/video-list/video-list.js
Component({
  properties: {
    itemData: {
      type: Object,
      value: {}
    }
  },
  methods: {
    onElItem() {
      const id = this.properties.itemData.id
      wx.navigateTo({
        url: `/pages/detail-video/detail-video?id=${id}`,
      })
    }
  }
})