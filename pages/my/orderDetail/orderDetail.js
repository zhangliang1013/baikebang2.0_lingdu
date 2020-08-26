Page({
  /**
   * 页面的初始数据
   */
  data: {

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.setData({
      info: options.info,
      info1: options.info1,
      info2: options.info2,
      info3: options.info3,
      info4: options.info4,
      info5: options.info5,
      info6: Number(options.info6),
      info7: options.info7,
      info9: options.info9,
    })
    if (options.info8 == "null") {
      this.setData({
        info8 : ''
      })
    } else {
      this.setData({
        info8: Number(options.info8)
      })
    }
    if (options.info10 == "null") {
      this.setData({
        info10: ''
      })
    } else {
      this.setData({
        info10: options.info10
      })
    }
  }
})