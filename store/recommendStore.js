import {
  HYEventStore
} from "hy-event-store"
import {
  getPlaylistDetail
} from "../services/music"

const useRecommendStore = new HYEventStore({
  state: {
    recommendSong: {}
  },
  actions: {
    // ctx => state对象 可以直接(ctx.name = “新名字”) 来进行修改数据，在这里的this是当前new出来的实例对象
    async fetchRecommendSongAction(ctx)  {
      //(推荐歌曲) 热歌 id = 3778678
      const res = await getPlaylistDetail(3778678)
      // console.log(res.data.playlist);
      ctx.recommendSong = res.data.playlist
    }
  }
})
export default useRecommendStore