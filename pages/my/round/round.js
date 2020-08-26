var Function = require("../../../utils/function.js");
import request from '../../../utils/request.js'
Page({
  /**
   * 页面的初始数据
   */
  data: {
    pagesize: 10,
     roundList : '',//客户列表
     repetitive_rate : ''
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.roundList()
  },
   roundList(){
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
         url : '/api/bkb/my/getRepetitiveRateList',
         data: {
           token : token,
           pagesize : this.data.pagesize
         },
         header : {
           token : token
         }
       }).then(res =>{
         console.log(res,'回头率')
         if(res.data.code == 200){
        this.setData({
          repetitive_rate : res.data.data.repetitive_rate,
            roundList : res.data.data.repetitive_rate_list
        })
         }else{
           Function.layer('获取回头率失败,请返回重试!')
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
    setTimeout(() =>{
        this.setData({
            roundList: [],
            pagesize: 10
          })
        this.roundList();
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
        pagesize: this.data.pagesize + 10
      })
      this.roundList();
      wx.hideLoading()
           if(this.data.roundList.length % 10 != 0 ){
        Function.layer('已加载全部回头率数据！')
      }
    }, 1000)
  }
})