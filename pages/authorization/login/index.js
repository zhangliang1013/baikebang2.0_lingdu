var Function = require("../../../utils/function.js");
import request from '../../../utils/request.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    phone: '',
    password: '',
    is_wx: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  closeLogin() { //关闭微信登录
    this.setData({
      is_wx: false
    })
  },
  openLogin() {
    this.setData({
      is_wx: true
    })
  },
  handlePhone(e) {
    this.setData({
      phone: e.detail.value
    })
  },
  handleMima(e) {
    // console.log(e)
    this.setData({
      password: e.detail.value
    })
  },
  handle_login() { //点击登录
    if (this.data.phone == '') {
      Function.layer('请输入账号！')
      return false;
    }
    if (this.data.password == '') {
      Function.layer('密码不能为空！')
      return false;
    }
    if (!(/^1[3456789]\d{9}$/.test(this.data.phone))) {
      Function.layer('请输入正确手机号！')
      return false;
    }

    request({
      url: '/api/bkb/login/login',
      method: 'post',
      data: {
        account: this.data.phone,
        password: this.data.password
      }
    }).then(res => {
      console.log(res)
      if (res.data.code == 400) {
        wx.showModal({
          title: '提示',
          content: '该账号不存在,请重新输入！',
          success: res => {
            if (res.confirm) {
              this.setData({
                password: '',
                phone: ''
              })
            }
          }
        })
      } else if (res.data.code == 200) {  //登录成功
        Function.layer('登录成功!')
        wx.setStorageSync('token', res.data.data.token)  //保存token
        wx.setStorageSync('user', res.data.data)  //保存信息

        setTimeout(() => {
          wx.switchTab({
            url: '/pages/bill/index/index'
          })
        }, 1000)

      } else {
        Function.layer('登录失败,请重新登录!')
        this.setData({
          password: '',
          phone: ''
        })
      }
    })
  },

  autoWeiXin(e) {  //点击一键授权登录
    wx.login({
      success: res => {
        console.log(res)
        if (res.code) {
          request({
            url: '/api/bkb/login/weChatRegister',
            method: 'post',
            data: {
              code: res.code
            }
          }).then(res => {
            console.log(res, 'open')
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
                        console.log(data,'解密')
                        if(data.data.code == 200){
                          Function.layer('登录成功!')
                          wx.setStorageSync('token', data.data.data.token)  //保存token
                          wx.setStorageSync('user', data.data.data)  //保存信息
                  
                          setTimeout(() => {
                            wx.switchTab({
                              url: '/pages/bill/index/index'
                            })
                          }, 1000)
                        }else{
                          Function.layer('登录失败,请重新登录！')
                          this.setData({
                            is_wx : false
                          })
                        }
                      })
                  } 
                }
              })
            }else if(res.data.code == 200){
              Function.layer('登录成功!')
              wx.setStorageSync('token', res.data.data.token)  //保存token
              wx.setStorageSync('user', res.data.data)  //保存信息
      
              setTimeout(() => {
                wx.switchTab({
                  url: '/pages/bill/index/index'
                })
              }, 1000)
            }else{
              Function.layer('登录失败，请稍后重试或联系工作人员！')
            }
          })
        } else {
          Function.layer(res.errMsg)
        }
      }
    })


  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

})