import {HYEventStore} from "hy-event-store"
import {getPlaylistDetail} from "../services/music"

const dataMap = {
  newRanking: 3779629, //新歌
  originalRanking: 2884035, //原创
  upRanking: 19723756 //飙升
}
const useRankingStore = new HYEventStore({
  state: {
    newRanking: {},
    originalRanking: {},
    upRanking: {},
  },
  actions: {
    // 请求排行榜歌单
    async fetchRankingDataAction(ctx) {
        for (const key in dataMap) {
            const id = dataMap[key]
            const res = await getPlaylistDetail(id)
            ctx[key] = res.data.playlist
        }
    },
  }
})

export default useRankingStore