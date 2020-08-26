// pages/my/rulesList/rulesList.js
var Function = require("../../../utils/function.js");
import request from '../../../utils/request.js'
Page({
  /**
   * 页面的初始数据
   */
  data: {
    pages : 1,
    list : ''
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.list();
  },
  list(){  //扣分记录
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
         url : '/api/bkb/my/getEtiquetteList',
         data: {
           token : token,
           page : this.data.pages 
         },
         header : {
           token : token 
         }
       }).then(res =>{
        //  console.log(res,'个人信息')
        if(res.data.code == 200){
          this.setData({
            list : res.data.data  //离职记录
          })
        }else{
          Function.layer('获取扣分记录失败,请稍后重试！')
          wx.navigateBack({
            delta: 1
          })
        }
       })
    }
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    setTimeout( ()=> {
        this.setData({
            list: [],
            pages: 1
          })
        this.list();
      wx.stopPullDownRefresh()
    }, 1500)
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