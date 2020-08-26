var Function = require("../../../utils/function.js");
import request from '../../../utils/request.js'
Page({
  /**
   * 页面的初始数据
   */
  data: {
    id: '',
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      id: options.id
    })
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
        url: '/api/bkb/my/getNotification',
        data: {
          token: token,
          notification_id : Number(options.id)
        },
        header: {
          token: token
        }
      }).then(res => {
        console.log(res, '个人信息')
        if(res.data.code == 200){
          this.setData({
            detail : res.data.data
          })
        }else{
          Function.layer('加载通知或公告详情失败！')
        }
      })
    }
  }
})