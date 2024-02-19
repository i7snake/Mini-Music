// pages/main-music/main-music.js
import {
  getBanner
} from "../../services/music"
import {
  getEl
} from "../../utils/getEl"
import {
  throttle
} from "../../utils/throttle"

// 仓库共享数据
import useRecommendStore from "../../store/recommendStore"
import usePlaylistStore from "../../store/PlaylistStore"
import useRankingStore from "../../store/rankingStore"
import usePlaySongStore from "../../store/PlaySongStore"

const getElThrottle = throttle(getEl, 1000)
Page({
  data: {
    banner: [],
    swiperH: 150,
    recommendSong: [],

    // 歌单数据
    hotMenuList: [], //热门歌单(全部)
    recommendMenuList: [], //推荐歌单(华语)

    // 排行榜数据
    isRanking: false,
    rankingSongmenu: {},

    // 播放栏
    currentSong:{},
    isPlaying:false
  },

  onLoad() {
    this.fetchBanner()
    useRecommendStore.dispatch("fetchRecommendSongAction") //派发(发起actions)
    useRecommendStore.onState("recommendSong", this.handleRecommendStore) //获取数据  
    usePlaylistStore.dispatch("fetchHotMenuAction")
    usePlaylistStore.dispatch("fetchRecommendMenuAction")
    usePlaylistStore.onStates(["hotMenuList", "recommendMenuList"], this.handlePlaylistStore)
    useRankingStore.dispatch("fetchRankingDataAction")
    useRankingStore.onStates(["newRanking", "originalRanking", "upRanking"], this.handleRankingStore)
    usePlaySongStore.onStates(["currentSong","isPlaying"],this.handlePlayInfos)

  },

  // 轮播图数据
  async fetchBanner() {
    const res = await getBanner()
    // console.log(res);
    this.setData({
      banner: res.data.banners
    })
  },
  onSearch() {
    wx.navigateTo({
      url: '/pages/detail-search/detail-search',
    })
  },
  // 获取Image组件的高度
  onImageLoad() {
    getElThrottle(".banner-image").then((res) => {
      // console.log(res);
      this.setData({
        swiperH: res[0].height
      })
    })
  },
  onRecommendMoreClick() {
    wx.navigateTo({
      url: "/pages/detail-song/detail-song?type=recommend",
    })
  },
  onSongItmeTap(e) {
    const index = e.currentTarget.dataset.index
    usePlaySongStore.setState("playSongList", this.data.recommendSong)
    usePlaySongStore.setState("playSongIndex",index)
  },
  onPlayStatus() {
    usePlaySongStore.dispatch("changeMusicStatusAction")
  },
  onPlaySong() {
    wx.navigateTo({
      url: '/packagePlay/page/music-play/music-play',
    })
  },

  // 回调函数封装，拿到仓库数据值
  handleRecommendStore(value) {
    if (!value.tracks) return
    // console.log(value);
    this.setData({
      recommendSong: value.tracks.slice(0, 6)
    })
  },
  handlePlaylistStore({
    hotMenuList,
    recommendMenuList
  }) {
    if (hotMenuList) {
      this.setData({
        hotMenuList: hotMenuList,
      })
    }
    if (recommendMenuList) {
      this.setData({
        recommendMenuList: recommendMenuList
      })
    }
  },
  handleRankingStore(value) {
    for (const key in value) {
        if(!value[key].name) return
        this.setData({
            rankingSongmenu: {...this.data.rankingSongmenu, ...value},
            isRanking: true
        })
    }
  },
  handlePlayInfos({currentSong,isPlaying}) {
    if (currentSong) {
      this.setData({currentSong})
    }
    if (isPlaying !== undefined) {
      this.setData({isPlaying})
    }
  },


  // 页面卸载时 取消对仓库的监听
  onUnload() {
    useRecommendStore.offState("recommendSong", this.handleRecommendStore)
    usePlaylistStore.offStates(["hotMenuList", "recommendMenuList"], this.handlePlaylistStore)
    useRankingStore.offStates(["newRanking", "originalRanking", "upRanking"], this.handleRankingStore)
    usePlaySongStore.offStates(["currentSong","isPlaying"],this.handlePlayInfos)

  }
})