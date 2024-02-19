import {HYEventStore} from "hy-event-store"
import {getSongMenuList} from "../services/music"

const usePlaylistStore = new HYEventStore({
  state: {
    hotMenuList: [], //热门歌单(全部)
    recommendMenuList: [] //推荐歌单(华语)
  },
  actions: {
       async fetchHotMenuAction(ctx) {
         const res = await getSongMenuList()
        //  console.log(res.data.playlists);
        ctx.hotMenuList = res.data.playlists
       },
       async fetchRecommendMenuAction(ctx) {
         const res = await getSongMenuList("华语")
        //  console.log(res.data.playlists);
        ctx.recommendMenuList = res.data.playlists
       }
  }
})

export default usePlaylistStore