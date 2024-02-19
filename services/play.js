import {requestMusic} from "./index"


export function getSongDetail(ids) {
  return requestMusic.get({
    url:"song/detail",
    data: {
      ids
    }
  })
}

export function getLyric(id) {
    return requestMusic.get({
      url:"lyric",
      data: {
        id
      }
    })
}