var Function = require("../../../utils/function.js");
import request from '../../../utils/request.js'
Page({
  /**
   * 页面的初始数据
   */
  data: {
    prell: [],
    content: ''
  },

  handleText(e) {
    this.setData({
      content: e.detail.value
    })
  },
  handBtn() {   //提交意见反馈
  if(this.data.console == ''){
    Function.layer('请填写反馈内容！')
    return false;
  }
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
    
      if (this.data.content == '') {
        Function.layer('请填写反馈内容！')
        return false;
      }
      request({
        url: '/api/bkb.my/getFeedback',
        data: {
          content: this.data.content,
          images: this.data.prell.join(',')
        },
        header: {
          token: token
        }
      }).then(res => {
        // console.log(res, '个人信息')
        if(res.data.code == 200){
          Function.layer('提交反馈成功!')
          setTimeout(()=>{
            wx.navigateBack({
              delta: 1
            })
          },1000)
        }else{
          Function.layer('提交反馈失败,请稍后重试!')
        }
      })
    }
  },
  selctPhone(e) {  //点击上传图片
    let that = this;
    wx.chooseImage({
      count: 5,
      success: res => {
        let tempFilePaths = res.tempFilePaths;
        tempFilePaths.forEach((item,i) =>{
          wx.uploadFile({
            url: 'https://www.imebox.cn/api/common/upload',   //仅为示例，非真实的接口地址
            filePath: tempFilePaths[i],
            name: 'file',
            formData: {},
            success: res => {
              let data = JSON.parse(res.data)
              if (data.code == 200) {
                let prell = that.data.prell;
                if(prell.length >= 5){
                   Function.layer('最多上传五张照片！')
                   return false;
                }
                prell.push('http://' + data.data.url)
                that.setData({
                  prell: prell
                })
                Function.layer('上传成功！')
                console.log(that.data.prell)
              } else {
                Function.layer('上传失败，请重试或者联系工作人员！')
              }
            }
          })
        })
      }
    })
  },

  preimg(e) {   //点击图片放大
    var index = parseInt(e.currentTarget.dataset.index);
    var that = this;
    wx.previewImage({
      urls: that.data.prell,
      current: that.data.prell[index]
    })
  }
})