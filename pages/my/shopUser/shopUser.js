var Function = require("../../../utils/function.js");
import request from '../../../utils/request.js'
Page({
  /**
   * 页面的初始数据
   */
  data: {
     detail : '' ,
     id :  ''  //门店id
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      id: options.id
    })
    this.getDetail();
  },
  getDetail() {
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
        url: '/api/bkb.manager/getPanel',
        data: {
          token: token,
          shop_id : this.data.id
        },
        header: {
          token: token
        }
      }).then(res => {
        console.log(res, '个人信息')
        if (res.data.code == 200) {
          this.setData({
           detail: res.data.data
          })
        } else {
          Function.layer('获取店铺信息失败，请稍后重试！')
          setTimeout(() => {
            wx.navigateBack({
              delta: 1
            })
          }, 1000)
        }
      })
    }
  },
  forMoreInfoTap: function () { //回退一页
    wx.navigateBack({
      delta: 1
    })
  }
})