var Function = require("../../../utils/function.js");
import request from '../../../utils/request.js'
Page({
  /**
   * 页面的初始数据
   */
  data: {
    list : [],
    pagesize : 10
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      id : options.id
    })
  //  this.getList();
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
        url: '/api/bkb.manager/getDoctorLeaveApply',
        data: {
          token: token,
          page : 1,
          shop_id : this.data.id,
          pagesize : this.data.pagesize
        },
        header: {
          token: token
        }
      }).then(res => {
        console.log(res, '请假审批列表')
        if (res.data.code == 200) {
          this.setData({
            list : res.data.data
          })
        } else {
          Function.layer('获取请假审批列表失败，请稍后重试！')

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
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getList();
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {
    setTimeout(()=> {
        this.setData({
            list : [],
            pagesize : 10
           })
        this.getList();
     wx.stopPullDownRefresh()
   }, 2000)
 },
 /**
  * 页面上拉触底事件的处理函数
  */
 onReachBottom() {
   wx.showLoading({
     title: '正在加载',
     mask: true
   })
  this.setData({
    pagesize : this.data.pagesize + 10
  })
   setTimeout(() => {
    this.getList();
     wx.hideLoading()
   }, 1000)
   if(this.data.list.length % 10 != 0 ){
    Function.layer('已加载全部请假审批！')
  }
 }
})