import request from '../../../utils/request.js'
var Function = require("../../../utils/function.js");
Page({
  data: {
     token : ''
  },
  onLoad: function (options) {
  },
  onShow: function(){
  
  },
  bindPhone: function (e) { //点击绑定手机号
    wx.login({
      success: res => {
        if (res.code) {
          request({
            url: '/api/bkb/login/weChatRegister',
            method: 'post',
            data: {
              code: res.code
            }
          }).then(res => {
            if(res.data.code == 412){  //需要验证手机号码
              wx.showModal({
                title: '提示',
                content: '请验证手机号码!',
                success :ren=> {
                  if (ren.confirm) {
                      request({
                        url: '/api/bkb/login/decryptData',
                        method : 'post',
                        data : {
                          openid : res.data.data.openid,
                          session_key: res.data.data.session_key,
                           iv : e.detail.iv,
                          encryptedData :  e.detail.encryptedData
                        }
                      }).then(data=>{
                        if(data.data.code == 200){
                          Function.layer('绑定成功!')
                          wx.setStorageSync('token', data.data.data.token)  //保存token
                          wx.setStorageSync('user', data.data.data)  //保存信息
                  
                          setTimeout(() => {
                            wx.navigateBack({
                              delta: 1
                            })
                          }, 1000)
                        }else{
                          Function.layer('登录失败,请重新登录！')
                        }
                      })
                  } 
                }
              })
            }else if(res.data.code == 200){
              Function.layer('绑定成功!')
              wx.setStorageSync('token', res.data.data.token)  //保存token
              wx.setStorageSync('user', res.data.data)  //保存信息
              setTimeout(() => {
                wx.navigateBack({
                  delta: 1
                })
              }, 1000)
            }
          })
        } else {
          Function.layer(res.errMsg)
        }
      }
    })  
  }
})
