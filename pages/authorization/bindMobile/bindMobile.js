import request from '../../../utils/request.js'
var Function = require("../../../utils/function.js");



Page({
  data: {
    phone:'', //手机号
    cose:'',  //验证码
    time:60, //倒计时
    ishi:true//是否可以点击
    
  },
  onLoad: function(options) {

  },

  getphone(e){  //手机号
    this.setData({
      phone:e.detail.value
    })
  },
  getmima(e){   //验证码
    this.setData({
      cose: e.detail.value
    })
  },

  _common(){  //发送验证码
    let that = this;
    let data ={
      mobile : that.data.phone,
      event  : 'bindingmobile'
    }
// 发送验证码
request({
  url : '/api/sms/send',
  data : data 
}).then(res =>{
  if(res.code == 200){
    wx.showToast({
      title:res.msg,
      duration:1000,
      icon:'none'   
    })
  } else {
    Function.layer(res.data.msg)
  }
})
  },

  bindphobe(){  //点击获取验证码
    var that =this;
    if (!(/^1(3|4|5|6|7|8|9)\d{9}$/.test(that.data.phone))) {
      wx.showToast({
        title: '请正确填写手机号',
        duration: 1000,
        icon: "none"
      })
      return;
    } 
    that.setData({ ishi: false });//不可以点击获取验证码
    that._common(); //获取验证码函数
    var time_ed = setInterval(()=>{ //验证码倒计时处理
      var time = that.data.time;
        if(time == 0){
          clearInterval(time_ed)
          that.setData({time:60,ishi:true})
        }else{
          time--;
          that.setData({time})
        }
    },1000)
  },

  bindOfcose(){ //确定绑定
    if (this.data.phone == "") {
      wx.showToast({
        title: '请正确填写手机号',
        duration: 1000,
        icon: "none"
      })
      return;
    }
    this._perfect()
  } ,

  _perfect(){  //绑定手机
    let that = this;
    let data = {
      mobile: that.data.phone,
      captcha:that.data.cose,
      event : 'bindingmobile'
    }
    let token = wx.getStorageSync('members').token || '';
    if(token!=''){
      request({
        url: '/api/user/mobilelogin',
        data : data
      }).then(res =>{
        if(res.code == 200){
          wx.setStorageSync('phoneNumber', that.data.phone); //绑定手机号存在本地
           wx.showToast({
             title: res.msg,
             duration:1000,
             icon: 'none'
           })
  
           setTimeout(()=>{
             wx.navigateBack()
           },1000)
         }else{
           wx.showToast({
             title: res.msg,
             duration: 1000,
             icon:'none'
           })
         }
      })
    }else{
      wx.navigateTo({
        url: '/pages/auth/auth'
      })
    }
  } 
})

