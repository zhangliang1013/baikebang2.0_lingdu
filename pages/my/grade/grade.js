var Function = require("../../../utils/function.js");
import request from '../../../utils/request.js'
Page({
  /**
   * 页面的初始数据
   */
  data: {
    is_sure: true
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getMyGrade();
  },
  getMyGrade() {
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
        url: '/api/bkb.my/getGrade',
        data: {
          token: token
        },
        header: {
          token: token
        }
      }).then(res => {
        console.log(res, '我的等级')
        if (res.data.code == 200) {
          this.setData({
            detail: res.data.data
          })
        } else {
          Function.layer('我的等级获取失败，请稍后重试');
          setTimeout(() => {
            wx.navigateBack({
              delta: 1
            })
          }, 1000)
        }
      })
    }
  },
  handleBtn() {  //提交升级
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
        url: '/api/bkb.my/gradeApply',
        data: {
          token: token
        },
        header: {
          token: token
        }
      }).then(res => {
        console.log(res, '升级')
        if (res.data.code == 200) {
          this.setData({
            is_sure: false
          })
          wx.showToast({
            title: '申请提交成功！',
            icon: 'success',
            duration: 2000
          })

        } else {
          Function.layer('提交升级申请失败,请稍后重试！')
        }
      })
    }
  },
  handle() {
    Function.layer('您已提交升级申请,请勿重复操作!')
  }
})