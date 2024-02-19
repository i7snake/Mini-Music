import {requestMusic} from "./index"

// 轮播图数据
export function getBanner(type = 0) {
  return requestMusic.get({
    url: "banner",
    data:{
      type
    }
  })
}

// 推荐歌曲(新歌、原创、飙升、热歌)
export function getPlaylistDetail(id) {
  return requestMusic.get({
    url:"playlist/detail",
    data: {
      id
    }
  })
}

// 歌单数据 - 热门/推荐歌单(全部歌单，可选参数 华语/流行...)
export function getSongMenuList(cat = "全部",limit = 6,offset = 0) {
  return requestMusic.get({
   url: "top/playlist",
   data: {
     cat,
     limit,
     offset
   }
  })
}

//歌单分类 
export function getSongMenuTag() {
  return requestMusic.get({
    url: "playlist/hot"
  })
}

