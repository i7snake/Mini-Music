// pages/detail-video/detail-video.js
import {
  getMVUrl,
  getMvDetail,
  getRelatedAllvideo
} from "../../services/video"
Page({
  data: {
    id: 0,
    mvUrl: {},
    mvDetail: {},
    MvAllVideo: {},
    desc: []
  },
  onLoad(options) {
    // console.log(options);
    this.setData({
      id: options.id
    })

    this.fetchMvUrl()
    this.fetchMVDetail()
    //  this.fetchMvAllVideo()
  },
  async fetchMvUrl() {
    const res = await getMVUrl(this.data.id)
    this.setData({
      mvUrl: res.data.data.url
    })
  },
  async fetchMVDetail() {
    const res = await getMvDetail(this.data.id)
    this.setData({
      mvDetail: res.data.data
    })
  },
  // 无数据
  async fetchMvAllVideo() {
    const res = await getRelatedAllvideo(this.data.id)
    console.log(res);
  },
})