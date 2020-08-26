var Function = require("../../../utils/function.js");
import request from '../../../utils/request.js'
Page({
  /**
   * 页面的初始数据
   */
  data: {
   list: [] , //店铺列表
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  this.getList();
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
         url : '/api/bkb.manager/getManageShopList',
         data: {
           token : token
         },
         header : {
           token : token
         }
       }).then(res =>{
         console.log(res,'选择店铺')
         if(res.data.msg == '权限不够'){
             Function.layer('抱歉，您没有店长端访问权限！');
             setTimeout(()=>{
              wx.navigateBack({
                delta: 1
              })
             },1000)
           
         }else if(res.data.code == 200){
          this.setData({
            list : res.data.data
          })
         }else{
          Function.layer('获取店铺信息失败，请稍后重试！')
         }
       })
    }
    
  },
  penmap(e) {  //调用地图
    var longitude = e.currentTarget.dataset.longitude
    var latitude = e.currentTarget.dataset.latitude
    var  name = e.currentTarget.dataset.name
   setTimeout(()=>{
    wx.openLocation({
      latitude: Number(latitude),
      longitude: Number(longitude),
      scale: 15,
      name: name,
    })
   },500)
  },
  onPullDownRefresh: function () {
    setTimeout(()=> {
        this.setData({
            list: []
          })
        this.getlist();
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
      this.getlist();
      wx.hideLoading()
    }, 1000)
  }
})