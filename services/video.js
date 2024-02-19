import {requestMusic} from "./index"

// 请求视频页
export function getTopMv(offset = 0,limit = 10) {
  return requestMusic.get({
      url: "top/mv",
      data: {
        limit,
        offset
      } 
  })
}

//mv地址
export function getMVUrl(id) {
  return requestMusic.get({
    url: `mv/url`,
    data: {
      id
    }
  })
}

//获取 mv 数据
export function getMvDetail(mvid) {
    return requestMusic.get({
      url: "mv/detail",
      data: {
        mvid
      }
    })
}

// 获取相关视频
export function getRelatedAllvideo(id) {
  return requestMusic.get({
    url: "related/allvideo",
    data: {
      id
    }
  })
}