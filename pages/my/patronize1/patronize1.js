var Function = require("../../../utils/function.js");
import request from '../../../utils/request.js'
Page({
  /**
   * 页面的初始数据
   */
  data: {
    user_id: '',
    pages: 1,
    list: ''
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      user_id: options.user_id,
      shop_id : options.shop_id
    })
    this.list();
  },
  list() {  //光顾记录
    var token = wx.getStorageSync('token') || '';
    if (token == '') {
      wx.showModal({
        title: '提示',
        content: '为了保证您的信息安全，请先授权登录！',
        success(res) {
          if (res.confirm) {
            // console.log('用户点击确定')
            wx.navigateTo({
              url: '/pages/authorization/auth/auth',
            })
          }
        }
      })
    } else {
      request({
        url: '/api/bkb.manager/getRepetitiveRate',
        data: {
          token: token,
          page: this.data.pages,
          pagesize: 10,
          user_id: Number(this.data.user_id),
          shop_id : Number(this.data.shop_id)
        },
        header: {
          token: token
        }
      }).then(res => {
        console.log(res, '光顾情况')
        if (res.data.code == 200) {
          this.setData({
            repetitive_rate: res.data.data.repetitive_rate,
            service_total: res.data.data.service_total,
            user_info: res.data.data.user_info
          })
          if (this.data.list.length == 0) {
            this.setData({
              list: res.data.data.items
            })
          } else {
            if(this.data.list.length % 10 != 0) {
              Function.layer('已加载完全部光顾记录！')
              return false;
            }
            this.setData({
              list: [...this.data.list, ...res.data.data.items]
            })
          }
        } else {
          Function.layer(res.data.msg)
        }
      })
    }
  },
  /**
  * 页面相关事件处理函数--监听用户下拉动作
  */
  onPullDownRefresh: function () {
    setTimeout(() => {
      this.setData({
        list: [],
        pages: 1
      })
      this.list();
      wx.stopPullDownRefresh()
    }, 2000)
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    wx.showLoading({
      title: '正在加载',
      mask: true
    })

    setTimeout(() => {
      this.setData({
        pages: this.data.pages + 1
      })
      this.list();
      wx.hideLoading()
    }, 1000)
  }
})