// components/song-item-v1/song-item-v1.js
Component({
  properties: {
    itemData: {
      type: Object,
      value: {}
    }
  },

  methods: {
    onSongItem() {
      const id = this.properties.itemData.id
          wx.navigateTo({
            url: `/packagePlay/page/music-play/music-play?id=${id}`,
          })
      }
  }
})