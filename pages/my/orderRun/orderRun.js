// pages/my/orderRun/orderRun.js
var Function = require("../../../utils/function.js");
import request from '../../../utils/request.js'
Page({
  /**
   * 页面的初始数据
   */
  data: {
    orderCode: ['全部','待治疗','治疗中','已完成','已评价','已关闭'], //订单状态
    orderName : '全部',
    manList : ['全部'],
    manList_id :[''],
    doctor_id : '',
    order_status : '',
    list : [],
    man : '全部',
    pagesize : 10
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log(options)
     this.setData({
       id : Number(options.id )
     })
     this.getMan() //获取店铺理疗师
     this.getList();
  },
  getMan(){    //获取理疗师
    var token = wx.getStorageSync('token') || '';
    request({
      url: '/api/bkb.manager/getShopDoctor',
      data: {
        token: token,
        shop_id : Number(this.data.id),
      },
      header: {
        token: token
      }
    }).then(res => {
      console.log(res, '门店理疗师')
      if (res.data.code == 200) {

      for(var i = 0 ;i< res.data.data.items.length ; i++  ){
         this.data.manList.push(res.data.data.items[i].name)
      }  
        this.setData({
              manList : this.data.manList , //理疗师名称
              manList_id : ['',...res.data.data.doctor_ids],
              // list: res.data.data.items
        })
      } else {
        Function.layer('获取店铺理疗师失败，请稍后重试或咨询工作人员！')
      }
    })
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
        url: '/api/bkb.manager/getShopOrderList',
        data: {
          token: token,
          doctor_id : this.data.doctor_id,
          order_status : this.data.order_status,
          page : 1,
          pagesize : this.data.pagesize,
          shop_id : this.data.id
        },
        header: {
          token: token
        }
      }).then(res => {
        console.log(res, '订单信息')
        if (res.data.code == 200) {
          this.setData({
        list : res.data.data
          })
        } else {
          Function.layer('获取订单列表失败，请稍后重试！')
          setTimeout(() => {
            wx.navigateBack({
              delta: 1
            })
          }, 1000)
        }
      })
    }
  },
  bindPickerOrder(e){
       if(e.detail.value == 1){
           this.setData({
             orderName : '待治疗',
             order_status : 1
           })
       }else if(e.detail.value == 2){
        this.setData({
          orderName : '治疗中',
          order_status : 2
        })
       }else if(e.detail.value == 3){
        this.setData({
          orderName : '已完成',
          order_status : 4
        })
       }else if(e.detail.value == 5){
        this.setData({
          orderName : '已关闭',
          order_status : 0
        })
       }else if(e.detail.value == 4){
        this.setData({
          orderName : '已评价',
          order_status : 5
        })
       }else if(e.detail.value == 0){
        this.setData({
          orderName : '全部',
          order_status : ''
        })
       }

       this.getList() //获取订单列表
  },
  bindPickerMan(e) { //选择理疗师
    var index = Number(e.detail.value)
    this.setData({
      man : this.data.manList[index],
      doctor_id : this.data.manList_id[index]
    })
    
    this.getList();
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
   this.setData({
     pagesize : 10
   })
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
 
     setTimeout(()=> {
        this.setData({
            doctor_id : '',
            order_status : '',
            list : [],
            orderName : '全部',
            man : '全部',
            pagesize : 10
           })
        this.getList();
      wx.stopPullDownRefresh()
    }, 1500)
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
      Function.layer('已加载全部订单！')
    }
  }
})