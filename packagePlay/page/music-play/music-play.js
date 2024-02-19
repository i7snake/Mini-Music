// packagePlay/page/music-play/music-play.js
import usePlaySongStore, {
  audioCtx
} from "../../../store/PlaySongStore"
import {
  throttle
} from "../../../utils/throttle"

const app = getApp()
const modeNames = ["order", "repeat", "random"]
Page({
  //  "currentTime",  "currentLyricText", "currentLyricIndex", "isPlaying", ,"playModeIndex"
  data: {
    stateKeys: ["id", "currentSong", "lyricInfos", "durationTime", "currentTime", "currentLyricText", "currentLyricIndex", "isPlaying", "playModeIndex"],
    contentHeight: 0,
    pageTitleTab: ["歌曲", "歌词"],
    currentPage: 0,
    lyricScrollTop: 0,
    sliderValue: 0,
    isSliderChanging: false, //是否正在拖动,
    playModeName: "order",

    id: "",
    currentSong: {},
    lyricInfos: [], //歌词
    durationTime: 0,
    currentTime: 0,
    currentLyricText: "",
    currentLyricIndex: 0,
    isPlaying: true,

    playSongIndex: 0, //列表数据
    playSongList: [],
  },
  onLoad(options) {
    this.setData({contentHeight: app.globalData.contentHeight})
    const id = options.id
    this.setData({id})
    if (id) { //判断如果是从播放栏进来不需要用id 正常播放原来播放歌曲
      usePlaySongStore.dispatch("fetchPlayMusicSongIdAction", id)
    } // 派发事件
    usePlaySongStore.onStates(this.data.stateKeys, this.handleUsePlaySongStore) //获取仓库数据
    usePlaySongStore.onStates(["playSongList", "playSongIndex"], this.getPlaySongInfosHandler)
  },

  // ======================滑块处理=====================================
  updateProgress: throttle(function (currentTime) {
    if (this.data.isSliderChanging) return
    // 1.记录当前的时间 2.修改sliderValue
    const sliderValue = currentTime / this.data.durationTime * 100
    this.setData({
      currentTime,
      sliderValue
    })
  }, 800, {
    leading: false,
    trailing: false
  }),

  // ======================事件监听======================================
  onBack() {
    wx.navigateBack()
  },
  onPage(e) {
    const index = e.currentTarget.dataset.index
    this.setData({
      currentPage: index
    })
  },
  onCurrSwiper(e) {
    const current = e.detail.current
    this.setData({
      currentPage: current
    })
  },
  onSliderChange(e) {
    // console.log(e);
    // 1.获取点击滑块位置对应的value
    const value = e.detail.value
    // 2.计算出要播放的位置时间
    const currentTime = value / 100 * this.data.durationTime
    //3.设置最新跳转播放时间(跳转时onTimeUpdate不会调用 这套方法生效)
    audioCtx.pause() //先暂停
    audioCtx.seek(currentTime / 1000) // 再跳转
    setTimeout(() => {
      audioCtx.play()
    }, 100); // 给一个延迟，再播放
    this.setData({
      currentTime,
      sliderValue: value,
      isSliderChanging: false
    })
  },
  onSliderChanging: throttle(function (e) {
    // console.log(e);
    const value = e.detail.value
    const currentTime = value / 100 * this.data.durationTime
    this.setData({
      currentTime
    })

    // 正在滑动中
    this.data.isSliderChanging = true
  }, 100),
  onPlayOrPauseTap() {
    usePlaySongStore.dispatch("changeMusicStatusAction")
  },
  onPrev() {
    usePlaySongStore.dispatch("playNewMusicAction", false)
  },
  onNext() {
    usePlaySongStore.dispatch("playNewMusicAction")
  },
  onMode() {usePlaySongStore.dispatch("changePlayModeAction")},
  // ==================store仓库共享数据处理===============================
  handleUsePlaySongStore({
    id,
    currentSong,
    lyricInfos,
    durationTime,
    currentTime,
    currentLyricText,
    currentLyricIndex,
    isPlaying,
    playModeIndex
  }) {
    if (id !== undefined) {
      this.setData({
        id
      })
    }
    if (currentSong) {
      this.setData({
        currentSong
      })
    }
    if (lyricInfos) {
      this.setData({
        lyricInfos
      })
    }
    if (durationTime !== undefined) {
      this.setData({
        durationTime
      })
    }
    if (currentTime !== undefined) {
      this.updateProgress(currentTime)
    }
    if (currentLyricText) {
      this.setData({
        currentLyricText
      })
    }
    if (currentLyricIndex !== undefined) {
      // 修改lyricScrollTop
      this.setData({
        currentLyricIndex,
        lyricScrollTop: currentLyricIndex * 35
      })
    }
    if (isPlaying !== undefined) {
      this.setData({
        isPlaying
      })
    }
    if (playModeIndex !== undefined) {
      this.setData({
        playModeName: modeNames[playModeIndex]
      })
    }
  },
  getPlaySongInfosHandler({
    playSongList,
    playSongIndex
  }) {
    if (playSongList) {
      this.setData({
        playSongList
      })
    }
    if (playSongIndex !== undefined) {
      this.setData({
        playSongIndex
      })
    }

  },
  onUnload() {
    usePlaySongStore.offStates(this.data.stateKeys, this.handleUsePlaySongStore)
    usePlaySongStore.offStates(["playSongList", "playSongIndex"], this.getPlaySongInfosHandler)
  }
})