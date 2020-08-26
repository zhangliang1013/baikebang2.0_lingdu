// pages/my/dimissionApply/dimissionApply.js
var Function = require("../../../utils/function.js");
import request from '../../../utils/request.js'
Page({
  /**
   * 页面的初始数据
   */
  data: {
    neirong: ''
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options, '离职详情')
    this.setData({
      id: options.id,
      shop_id: options.shop_id,
      connect: options.connect,
      content: options.content,
      check_status: options.check_status,
      entry_time: Number(options.stime),
      le_time : Number(options.etime)
    })
    // let one = options.etime.substring(0, 4)
    // let two = options.etime.substring(4,6)
    // let three = options.etime.substring(6, 8)
    // let le_time = one + '-' + two + '-' + three
    // this.setData({
    //   le_time: le_time
    // })
  },
  handleBtn() { //提交交接
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
      if (this.data.neirong == '') {
        Function.layer('请填写交接内容！')
        return false;
      }
      request({
        url: '/api/bkb.manager/checkDoctorDimission',
        data: {
          token: token,
          dimission_id: this.data.id,
          shop_id: this.data.shop_id,
          connect: this.data.neirong
        },
        header: {
          token: token
        }
      }).then(res => {
        console.log(res, '离职交接')
        if (res.data.code == 200) {
          wx.showToast({
            title: '已交接成功！',
            icon: 'success',
            duration: 2000
          })
          setTimeout(() => {
            wx.navigateBack({
              delta: 2
            })
          }, 1500)
        } else {
          Function.layer('离职交接失败，请稍后重试！')
          setTimeout(() => {
            wx.navigateBack({
              delta: 2
            })
          }, 1000)
        }
      })
    }
  },
  handleInput(e) {
    this.setData({
      neirong: e.detail.value
    })
  }
})