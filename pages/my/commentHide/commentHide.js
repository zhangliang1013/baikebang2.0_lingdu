// pages/my/commentHide/commentHide.js

var Function = require("../../../utils/function.js");
import request from '../../../utils/request.js'
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
  //  console.log(options.imgs)
   this.setData({
    shop_id : options.id,
    discuss_id : options.discuss_id,
    time : Number(options.time),
    imgs : options.imgs.split(','),
    name : options.name,
    services_name : options.services_name,
    avatar : options.avatar,
    content: options.content,
    reason : ''
   })
  },
  bindReason(e){
   this.setData({
    reason : e.detail.value
   })
  },
  handleBtn(){  //提交隐藏申请
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
      if(this.data.reason == ''){
        Function.layer('请填写申请隐藏原因！')
        return false;
      }
      request({
        url: '/api/bkb.manager/hideDiscuss',
        data: {
          token: token,
          shop_id : this.data.shop_id,
          discuss_id : this.data.discuss_id,
          reason : this.data.reason
        },
        header: {
          token: token
        }
      }).then(res => {
        // console.log(res, '申请影藏')
        if (res.data.code == 200) {
          wx.showToast({
            title: '提交申请成功！',
            icon: 'success',
            duration: 2000
          })
          setTimeout(() => {
            wx.navigateBack({
              delta: 1
            })
          }, 1500)
        } else {
          Function.layer('申请隐藏失败，请稍后重试！')

          setTimeout(() => {
            wx.navigateBack({
              delta: 1
            })
          }, 1000)
        }
      })
    }
  }
})