// pages/my/inform/inform.js
var Function = require("../../../utils/function.js");
import request from '../../../utils/request.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [] ,//列表
    pages : 1
  },

  onLoad: function (options) {
   this.list();
  },
 list(){  //通知列表
  var  token = wx.getStorageSync('token')  || '';
  if(token == ''){
    wx.showModal({
      title: '提示',
      content: '为了保证您的信息安全，请先授权登录！',
      success (res) {
        if (res.confirm) {
          // console.log('用户点击确定')
          wx.navigateTo({
            url: '/pages/authorization/auth/auth',
          })
        } 
      }
    })
  }else{
     request({
       url : '/api/bkb/my/getNotificationList',
       data: {
         token : token,
         page : this.data.pages
       },
       header : {
         token : token
       }
     }).then(res =>{
       console.log(res,'通知列表')
       if(res.data.code == 200){
          this.setData({
            list : res.data.data
          })
       }else{
         Function.layer('获取通知公告失败，请稍后重试！')
       }
     })
  }
 },
  onPullDownRefresh: function () {
 
    setTimeout(()=> {
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
        pages: this.data.pages++
      })
      this.list();
      wx.hideLoading()
    }, 1000)
  }
})