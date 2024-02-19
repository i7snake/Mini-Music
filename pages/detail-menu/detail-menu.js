// pages/detail-menu/detail-menu.js
import {getSongMenuTag, getSongMenuList} from "../../services/music"
Page({
  data: {
    songMenus:[]
  },

  onLoad(options) {
      this.fetchAllMenuList()
  },

  async fetchAllMenuList() {
    // 获取歌单分类(tag)
    const res = await getSongMenuTag()
    const tags = res.data.tags

    // 根据tags去获取对应的歌单
    const allPromise = [] //返回Promise
    for (const key of tags) {
      // console.log(key);
      const tag = await getSongMenuList(key.name)
      allPromise.push(tag.data)
    }
    // 获取到所有的数据之后, 调用一次setData(all 当所有Promise 都兑现时‘fulfilled’ 返回兑现fulfilled)
    Promise.all(allPromise).then(res => {
      // console.log(res);
      this.setData({songMenus:res})
    })
  },

  onUnload() {

  },

})