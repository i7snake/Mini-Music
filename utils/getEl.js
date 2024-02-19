export function getEl(el) {
  return new Promise((resolve,reject) => {
    const query = wx.createSelectorQuery()
    query.select(el).boundingClientRect()
    query.exec(res => {
      resolve(res)
    })
  })
}