Page({
  /**
   * 页面的初始数据
   */
  data: {
    time : '' //入职时间
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      this.setData({
        time : options.time  
      })
  }
})