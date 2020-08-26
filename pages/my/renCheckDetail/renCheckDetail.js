var Function = require("../../../utils/function.js");
import request from '../../../utils/request.js'
var util = require("../../../utils/util.js");
Page({
  /**
   * 页面的初始数据
   */
  data: {
    color: [{
      month: 'current',
      day: "01",
      color: 'white',
      background: "#156DF2",
    }],
    date: 20200601
  },
  dayClick(e) { //点击当天
    var time5 = e.detail.year + '/' + e.detail.month + '/' + e.detail.day;
    var time6 = time5.split('/');
    if (Number(time6[1]) <= 9) {
      time6[1] = '0' + time6[1]
    }
    if (Number(time6[2]) <= 9) {
      time6[2] = '0' + time6[2]
    }
    var time8 = time6[0] + time6[1] + time6[2]
    // console.log(time8)
    this.setData({
      date : Number(time8) ,
      color: [{
        month: 'current',
        day: e.detail.day,
        color: 'white',
        background: "#156DF2",
      }]
    })
    this.getDetail();
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var TIME = util.formatTime(new Date());
    var time = TIME.split('/')[2];
    var time3 = TIME.split('/');
    if (Number(time3[1]) <= 9) {
      time3[1] = '0' + time3[1]
    }
    if (Number(time3[2]) <= 9) {
      time3[2] = '0' + time3[2]
    }
    var time4 = time3[0] + time3[1] + time3[2]

    this.setData({
      shop_id: options.id,
      doctor_id: options.doctor_id,
      status: options.status,
      portrait: options.portrait,
      name: options.name,
      date: Number(time4),
      color: [{
        month: 'current',
        day: time,
        color: 'white',
        background: "#156DF2",
      }]
    })
    this.getDetail();
  },
getDetail(){
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
      url: '/api/bkb.manager/getClockIn',
      data: {
        token: token,
        date : this.data.date,
        doctor_id : this.data.doctor_id,
        shop_id : this.data.shop_id
      },
      header: {
        token: token
      }
    }).then(res => {
      console.log(res, '考勤')
      if (res.data.code == 200) {
        this.setData({
          kaoQin : res.data.data
        })
      } else {
        Function.layer('操作失败，请稍后重试！')

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