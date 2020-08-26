// pages/rate/index/index.js
var Function = require("../../../utils/function.js");
import request from '../../../utils/request.js'
Page({
  /**
   * 页面的初始数据
   */
  data: {
    detail : ''
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },
  getDetail(){  //获取收益详情
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
         url : '/api/bkb.my/getPerformance',
         data: {
           token : token
         },
         header : {
           token : token
         }
       }).then(res =>{
         console.log(res,'收益信息')
        if(res.data.code == 200){
      this.setData({
        detail : res.data.data
      })
        }else if(res.data.code == 401){
          Function.layer(res.data.msg);
          setTimeout(() => {
            wx.navigateTo({
              url: '/pages/authorization/auth/auth',
            })
          }, 1000)
        }else{
          Function.layer('获取收益详情失败,请稍后重试！')
        }
       })
    }
  },
  onShow(){
      this.getDetail(); //调用详情
  }
})