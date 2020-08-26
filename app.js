import request from './utils/request.js'
App({
  onLaunch: function () {
         //封装的request请求加基准路径
         request.defaults.baseURL = "https://www.imebox.cn";  
         var token = wx.getStorageSync('token') || '';
         if(token !=  ''){  //判断是否登录
          wx.switchTab({
            url: '/pages/my/index/index'
          })
         }
     },
})