// pages/my/qingjiaList/qingjiaList.js
var Function = require("../../../utils/function.js");
import request from '../../../utils/request.js'
Page({
  /**
   * 页面的初始数据
   */
  data: {
     list : '2'
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
     
  },
  getList(){
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
         url : '/api/bkb.my/getDoctorLeaveList',
         data: {
           token : token
         },
         header : {
           token : token
         }
       }).then(res =>{
         console.log(res,'请假记录')
        if(res.data.code == 200){
          this.setData({
            list : res.data.data
          })
        }else{
          Function.layer('获取请假记录失败,请稍后重试!')
          wx.navigateBack({
            delta: 1
          })
        }
       })
    }
  },
  onShow(){
    this.getList();
  }
})