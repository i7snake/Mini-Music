import {
  HYEventStore
} from "hy-event-store"
import {
  getSongDetail,
  getLyric
} from "../services/play"
import {
  parseLyric
} from "../utils/parseLyric"

export const audioCtx = wx.createInnerAudioContext()
const usePlaySongStore = new HYEventStore({
  state: {
    // 拿到歌曲列表
    playSongList: [],
    playSongIndex: 0,

    id: 0,
    currentSong: {},
    durationTime: 0,
    lyricInfos: [],
    currentTime: 0,
    currentLyricText: "",
    currentLyricIndex: -1,

    isFirstPlay: true, //只用添加一次监听播放的进度
    isPlaying: false, // 暂停/播放判断

    playModeIndex: 0, // 0:顺序播放 1:单曲循环 2:随机播放
  },
  actions: {
    fetchPlayMusicSongIdAction(ctx, id) {
      // 清空上一首歌曲信息
      ctx.currentSong = {}
      ctx.durationTime = 0
      ctx.currentTime = 0
      ctx.lyricInfos = 0
      ctx.currentLyricText = ''
      ctx.currentLyricIndex = 0

      ctx.id = id
      ctx.isPlaying = true

      // 请求歌曲相关的数据(根据id)
      getSongDetail(id).then(res => {
        ctx.currentSong = res.data.songs[0]
        ctx.durationTime = res.data.songs[0].dt
      })

      // 请求歌词
      getLyric(id).then(res => {
        // console.log(res.data.lrc.lyric);
        const lyric = res.data.lrc.lyric
        const lyricString = parseLyric(lyric)
        ctx.lyricInfos = lyricString
      })

      //播放歌曲
      audioCtx.stop()
      audioCtx.src = `https://music.163.com/song/media/outer/url?id=${id}.mp3`
      audioCtx.autoplay = true

      // 播放监听的进度
      if (ctx.isFirstPlay) {
        ctx.isFirstPlay = false

        audioCtx.onTimeUpdate(() => {
          // console.log("------------------------");
          //拿到当前播放时间
          // console.log( audioCtx.currentTime * 100);
          ctx.currentTime = audioCtx.currentTime * 1000

          // 匹配正确歌词
          if (!ctx.lyricInfos.length) return
          let index = ctx.lyricInfos.length - 1
          for (let i = 0; i < ctx.lyricInfos.length; i++) {
            const infos = ctx.lyricInfos[i];
            if (infos.time > audioCtx.currentTime * 1000) {
              index = i - 1
              break
            }
          }
          if (index === ctx.currentLyricIndex) return

          // 获取歌词的索引index和文本text 改变歌词滚动页面的位置
          const text = ctx.lyricInfos[index].text
          ctx.currentLyricText = text
          ctx.currentLyricIndex = index
        })
        // 跳转时onTimeUpdate不会调用  这套方法不生效
        // audioCtx.onWaiting(() => {
        //   audioCtx.pause()
        // })
        // audioCtx.onPlay(() => {
        //     audioCtx.play()
        // })
        audioCtx.onEnded(() => {
          // 是否是单曲循环
          if (audioCtx.loop) return
          // 切换下一首个
          this.dispatch("playNewMusicAction")
        })
      }
    },
    changeMusicStatusAction(ctx) {
      if (!audioCtx.paused) {
        audioCtx.pause()
        ctx.isPlaying = false
      } else {
        audioCtx.play()
        ctx.isPlaying = true
      }
    },
    changePlayModeAction(ctx) {
      // 判断新的模式
      let modeIndex = ctx.playModeIndex
      modeIndex = modeIndex + 1
      if (modeIndex === 3) modeIndex = 0
      if (modeIndex === 1) {
        audioCtx.loop = true
      } else {
        audioCtx.loop = false
      }
      //保存最新模式
      ctx.playModeIndex = modeIndex
    },
    playNewMusicAction(ctx, isNext = true) {
      // 获取之前的列表数据
      const length = ctx.playSongList.length
      let index = ctx.playSongIndex

      //根据之前的数据计算最新的索引
      switch (ctx.playModeIndex) {
        case 1:
        case 0: // 顺序
          index = isNext ? index + 1 : index - 1
          if (index === length) index = 0
          if (index === -1) index = length - 1
          break;
        case 2: // 随机
          index = Math.floor(Math.random() * length)
          break;
      }
      //根据索引获取新的歌曲 重新播放
      const newSong = ctx.playSongList[index]
      if (newSong !== undefined) {
        this.dispatch("fetchPlayMusicSongIdAction", newSong.id)
      }
      // 保存最新的index
      ctx.playSongIndex = index
    }
  }
})
export default usePlaySongStore