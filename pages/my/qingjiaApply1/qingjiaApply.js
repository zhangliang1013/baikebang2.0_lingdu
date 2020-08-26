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
    let  one = options.stime.substring(0,4)
    let  two = options.stime.substring(4,6)
    let  three = options.stime.substring(6,8)
    let  four = options.stime.substring(8,10)
    let start_time = one + '-' + two + '-' + three + ' ' + four + '时'

    let  one1 = options.etime.substring(0,4)
    let  two2 = options.etime.substring(4,6)
    let  three3 = options.etime.substring(6,8)
    let  four4 = options.etime.substring(8,10)
    let end_time = one1 + '-' + two2 + '-' + three3 + ' ' + four4 + '时'
    this.setData({
      name : options.name,
      portrait : options.portrait,
      content : options.content,
      img : options.img.split(','),
      status : options.status,
      id : options.id,
      shop_id : options.shop_id,
      start_time : start_time,
      end_time : end_time
    })
    if(options.type == 1){
      this.setData({
        type :'事假'
      })
    }else if(options.type == 2){
      this.setData({
        type :'病假'
      })
    }else if(options.type == 3){
      this.setData({
        type :'调休'
      })
    }else if(options.type == 4){
      this.setData({
        type :'年假'
      })
    }
  },
  handleNopass(){
     this.shenpi(2);
  },
  handlePass(){
    this.shenpi(1);
  },
  // 审批  
  shenpi(index_num){
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
        url: '/api/bkb.manager/updateDoctorLeaveApply',
        data: {
          token: token,
          leave_id : this.data.id,
          status : Number(index_num) ,
          shop_id : this.data.shop_id
        },
        header: {
          token: token
        }
      }).then(res => {
        console.log(res, '请假审批')
        if (res.data.code == 200) {
              if(index_num == 1){
                wx.showToast({
                  title: '已同意！',
                  icon: 'success',
                  duration: 2000
                })
              }else{
                wx.showToast({
                  title: '已拒绝！',
                  icon: 'success',
                  duration: 2000
                })
              }

              setTimeout(() => {
                wx.navigateBack({
                  delta: 1
                })
              }, 1500)

        }else if(res.data.msg == '权限不够'){
          Function.layer('抱歉，您暂无审批权限，请联系工作人员！')

          setTimeout(() => {
            wx.navigateBack({
              delta: 2
            })
          }, 1000)
        }else {
          Function.layer('操作失败，请稍后重试！')

          setTimeout(() => {
            wx.navigateBack({
              delta: 2
            })
          }, 1000)
        }
      })
    }
  },
  preimg(e) {   //点击图片放大
    var index = parseInt(e.currentTarget.dataset.index);
    var that = this;
    wx.previewImage({
      urls: that.data.img,
      current: that.data.img[index]
    })
  }
})