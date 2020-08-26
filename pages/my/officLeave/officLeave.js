var Function = require("../../../utils/function.js");
import request from '../../../utils/request.js'
Page({
  /**
   * 页面的初始数据
   */
  data: {
    start_time: '请选择时间',
    content: '',
    time : '' //入职时间
  },

  bindDateChange(e) { //开始时间
    this.setData({
      start_time: e.detail.value,
      content: ''
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      time : Number(options.time)
    })
  },
  handleBtn() {  //提交离职申请
    if (this.data.start_time == '请选择时间') {
      Function.layer('请填写申请离职时间');
      return false;
    }
    if (this.data.content == '') {
      Function.layer('请填写离职理由');
      return false;
    }
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
      var time = this.data.start_time.split('-');
      var time1 = time[0] + time[1] + time[2];
      request({
        url: '/api/bkb/my/createDimission',
        method: 'post',
        data: {
          token: token,
          resignation_time: Number(time1),
          content: this.data.content
        },
        header: {
          token: token
        }
      }).then(res => {
        console.log(res, '离职提交')
        if (res.data.code == 200) {
          Function.layer('离职申请提交成功!')

          setTimeout(() => {
            wx.navigateBack({
              delta: 2
            })
          }, 1500)
        } else if (res.data.msg == '已经提交过啦') {
          Function.layer('您的离职申请已经提交,请勿重复提交!')
          setTimeout(() => {
            wx.navigateBack({
              delta: 2
            })
          }, 1500)
        }
        else {
          Function.layer('提交离职申请失败,请稍后重试！')
          this.setData({
            start_time: '请选择时间',
            content: ''
          })
        }
      })
    }
  },
  handleInput(e) {
    this.setData({
      content: e.detail.value
    })
  }
})