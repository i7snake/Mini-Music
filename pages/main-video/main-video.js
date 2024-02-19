// pages/main-video/main-video.js
import {
  getTopMv
} from "../../services/video"

Page({

  /**
   * 页面的初始数据
   */
  data: {
    VideoList: [],
    offset: 0,
    hasMore: true
  },
  onLoad(options) {
    this.fetchTopMv()
  },
  async fetchTopMv() {
    const res = await getTopMv(this.data.offset)
    const newResData = [...this.data.VideoList, ...res.data.data]
    this.setData({
      VideoList: newResData
    })
    this.data.offset = this.data.VideoList.length
    this.data.hasMore = res.data.hasMore
  },
  async onPullDownRefresh() {
    console.log("用户下拉");
    this.data.VideoList = []
    this.data.offset = 0
    this.data.hasMore = true
    await this.fetchTopMv()

    wx.stopPullDownRefresh()
  },
  onReachBottom() {
    console.log("上拉触底");
    if (!this.data.hasMore) return
    this.fetchTopMv()
  },
  onItem(e) {
    // console.log(e);
    // const id = e.currentTarget.dataset.item.id
    // wx.navigateTo({
    //   url: `/pages/detail-video/detail-video?id=${id}`,
    // })
  }
})