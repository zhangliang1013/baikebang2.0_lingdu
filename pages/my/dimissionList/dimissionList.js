var Function = require("../../../utils/function.js");
import request from '../../../utils/request.js'
Page({
  /**
   * 页面的初始数据
   */
  data: {

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      id : options.id
    })
    this.getList();
  },
  getList(){
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
        url: '/api/bkb.manager/getDoctorDimissionApply',
        data: {
          token: token,
          shop_id : this.data.id,
          page : 1
        },
        header: {
          token: token
        }
      }).then(res => {
        console.log(res, '离职管理')
        if (res.data.code == 200) {
          this.setData({
             list : res.data.data
          })
        } else {
          Function.layer('获取离职申请列表失败，请稍后重试！')
          setTimeout(() => {
            wx.navigateBack({
              delta: 1
            })
          }, 1000)
        }
      })
    }
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    setTimeout(()=> {
        this.setData({
            list : []
           })       
        this.getList();
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
    //  this.getlist();
     wx.hideLoading()
   }, 1000)
 }
})