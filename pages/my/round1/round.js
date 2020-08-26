// pages/my/round/round.js
var Function = require("../../../utils/function.js");
import request from '../../../utils/request.js'
Page({
  /**
   * 页面的初始数据
   */
  data: {
    pagesize : 10
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      shop_id : options.id
    })
  this.getList();
  },
  getList(){
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
        url: '/api/bkb.manager/getRepetitiveRateList',
        data: {
          token: token,
          shop_id : this.data.shop_id,
          pagesize : this.data.pagesize
        },
        header: {
          token: token
        }
      }).then(res => {
        console.log(res, '回头')
        if (res.data.code == 200) {
          this.setData({
            repetitive_rate : res.data.data.repetitive_rate,
            list : res.data.data.repetitive_rate_list
          })
        } else {
          Function.layer('获取店铺回头率失败，请稍后重试！')

          setTimeout(() => {
            wx.navigateBack({
              delta: 1
            })
          }, 1000)
        }
      })
    }
  },
  onPullDownRefresh() {
    setTimeout(()=> {
        let that = this
        that.setData({
          list: [],
          pagesize : 10
        })
        that.getList();
      wx.stopPullDownRefresh()
    }, 2000)
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {
    wx.showLoading({
      title: '正在加载',
      mask: true
    })
    this.setData({
      pagesize : this.data.pagesize + 10
    })
    setTimeout(() => {
       this.getList();
      wx.hideLoading()

      // if(this.data.list.length % 10 != 0 ){
      //   Function.layer('已加载全部回头率数据！')
      // }
    }, 1000)
  }
})