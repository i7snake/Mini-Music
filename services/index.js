class Request {
  constructor(baseURL) {
    this.baseURL = baseURL
  }
  
  request(config) {
      const {url} = config
      return new Promise((resolve,reject) => {
        wx.request({
          ... config,
          url: this.baseURL + url,
          success: res => {
            resolve(res)
          },
          fail: err => {
             reject("err:", err)
          }
        })
      })
  }

  get(config) {
      return this.request({...config,	method:"GET"})
  }
  post(config) {
    return this.request({...config,	method:"POST"})
}
}

export const requestMusic = new Request("http://codercba.com:9002/")

// https://coderwhy-music.vercel.app/ http://codercba.com:9002/