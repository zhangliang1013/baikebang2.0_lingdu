var Function = require("../../../utils/function.js");
var util = require("../../../utils/util.js");
import request from '../../../utils/request.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    color:[
      {
        month:'current',
        day:"01",             
        color:'white',        
        background:"#156DF2",    
      }
    ]
  },

  dayClick(e){  //点击当天
    this.setData({
      date: e.detail.year + '/' + e.detail.month + '/' + e.detail.day,
      color: [
        {
          month: 'current',
          day: e.detail.day,
          color: 'white',
          background: "#156DF2",
        }
      ]
    })
    this.detail();
   },
   detail() {  //排班查询
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
      var time1 = this.data.date.split('/');
      if (time1[1] <= 9) {
        time1[1] = '0' + time1[1]
      }
      if (time1[2] <= 9) {
        time1[2] = '0' + time1[2]
      }
      var time2 = time1[0] + time1[1] + time1[2]

      
      request({
        url: '/api/bkb/my/getPlacement',
        data: {
          token: token,
          date: time2
        },
        header: {
          token: token
        }
      }).then(res => {
        console.log(res, '排班记录')
        if (res.data.code == 200) {
          this.setData({
            list: res.data.data,
            name : wx.getStorageSync('user').name  || ''
          })

        } else {
          Function.layer('获取排班记录失败,请稍后重试!')
        }
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var TIME = util.formatTime(new Date());
    var time = TIME.split('/')[2];
    this.setData({
      date: TIME,
      color: [
        {
          month: 'current',
          day: time,
          color: 'white',
          background: "#156DF2",
        }
      ]
    });

    this.detail();
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    setTimeout(function () {
      wx.stopPullDownRefresh()
    }, 1500)
  }
})