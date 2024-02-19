// pages/detail-song/detail-song.js
import recommendStore from "../../store/recommendStore"
import rankingStore from "../../store/rankingStore"
import PlaySongStore from "../../store/PlaySongStore"
import {getPlaylistDetail} from "../../services/music"
Page({
  data: {
    type: "",
    key: "newRanking",
    id: "",

    detailSong: {}
  },
  onLoad(options) {
      //获取确定数据的类型
      const type = options.type
      this.setData({type})

      // 获取store的数据( rec 从推荐歌曲进来的  ran 从排行榜进来的 menu是每个歌单进来的)
      if(type === "recommend"){
        recommendStore.onState("recommendSong",this.handleDetailSongStore)
      }else if(type === "ranking") {
          const key = options.key
          this.data.key = key
          rankingStore.onState(key,this.handleDetailSongStore)
      } else if(type === "menu") {
          const id = options.id
          this.data.id = id
          this.fetchMenuSongInfo()
      }
  },
  async fetchMenuSongInfo() {
      const res = await getPlaylistDetail(this.data.id)
      // console.log(res.data.playlist);
      this.setData({detailSong: res.data.playlist})
  },
  onSongItemTap(e) {
    // console.log(e);
    const index = e.currentTarget.dataset.index
    PlaySongStore.setState("playSongList",this.data.detailSong.tracks)
    PlaySongStore.setState("playSongIndex",index)
  },
  handleDetailSongStore(value) {
      this.setData({detailSong: value})
      wx.setNavigationBarTitle({
        title: value.name
      })
  },
  onUnload() {

  },
})