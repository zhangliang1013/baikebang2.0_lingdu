var Function = require("../../../utils/function.js");
import request from '../../../utils/request.js'
Page({
  /**
   * 页面的初始数据
   */
  data: {
    qrCode: false, //是否展示二维码
    avatar: '',  //拍照图片
    eatSwitch: false, //开启吃饭
    clockShow: false,
    detail: {}, //个人信息
    latitude: '',
    longitude: '',
    dingwei: true,
    code_msg: '休息中',
    daka_code: '下班',            //打卡的状态
    daka_code1: '上班打卡',
    is_eat: true
  },
  handleDaka() {  //点击打卡

    if (this.data.is_eat == false) { // 吃饭打卡
      var token = wx.getStorageSync('token') || '';

      request({
        url: '/api/bkb.my/updateWorkStatus',
        data: {
          token: token,
          type: 3
        },
        header: {
          token: token
        }
      }).then(res => {
        console.log(res, '吃饭打卡')
        if (res.data.code == 200) {
          wx.showToast({
            title: '吃饭打卡成功！',
            icon: 'success',
            duration: 2000
          })
          setTimeout(() => {
            this.setData({
              clockShow: false,
              daka_code1: '上班打卡',
              code_msg: '吃饭中',
              daka_code: '吃饭',
              eatSwitch: true,
              is_eat: false,
              avatar: '' //拍照图片
            })
            this.userInfo() //个人信息
          }, 1200)


        } else {
          Function.layer('打卡失败，请重试获取联系工作人员！')
          setTimeout(() => {
            this.setData({
              clockShow: false
            })
          }, 1200)
        }
      })
    }
    if (this.data.is_eat == true && this.data.daka_code1 == '上班打卡') {  //上班打卡
      if (this.data.longitude == '' || this.data.latitude == '') {
        Function.layer('请进行定位！')
        return false;
      }
      if (this.data.avatar == '') {
        Function.layer('请进行拍照！')
        return false;
      }
      var token = wx.getStorageSync('token') || '';

      request({
        url: '/api/bkb.my/updateWorkStatus',
        data: {
          type: 1,
          image: this.data.avatar,
          longitude: this.data.longitude,
          latitude: this.data.latitude,
          token: token
        },
        header: {
          token: token
        }
      }).then(res => {
        console.log(res, '上班打卡')
        if (res.data.code == 200) {
          wx.showToast({
            title: '上班打卡成功！',
            icon: 'success',
            duration: 2000
          })
          setTimeout(() => {
            this.setData({
              clockShow: false,
              daka_code1: '下班打卡',
              code_msg: '已上班',
              daka_code: '上班',
              eatSwitch: false,
              is_eat: true,
              latitude: '',
              longitude: '',
              avatar: '',  //拍照图片
              dingwei: true
            })
            this.userInfo() //个人信息
          }, 1200)
        }else{
          Function.layer(res.data.msg)
        }
      })
    }
    if (this.data.is_eat == true && this.data.daka_code1 == '下班打卡') {  //下班打卡
      if (this.data.longitude == '' || this.data.latitude == '') {
        Function.layer('请进行定位！')
        return false;
      }
      if (this.data.avatar == '') {
        Function.layer('请进行拍照！')
        return false;
      }
      var token = wx.getStorageSync('token') || '';
      request({
        url: '/api/bkb.my/updateWorkStatus',
        data: {
          type: 2,
          image: this.data.avatar,
          longitude: this.data.longitude,
          latitude: this.data.latitude,
          token: token
        },
        header: {
          token: token
        }
      }).then(res => {
        console.log(res, '下班打卡')
        if (res.data.code == 200) {
          wx.showToast({
            title: '下班打卡成功！',
            icon: 'success',
            duration: 2000
          })
          setTimeout(() => {
            this.setData({
              clockShow: false,
              daka_code1: '上班打卡',
              code_msg: '休息中',
              daka_code: '下班',
              eatSwitch: false,
              latitude: '',
              longitude: '',
              avatar: '',  //拍照图片
              dingwei: true,
              is_eat: true
            })
            this.userInfo() //个人信息
          }, 1200)
        }
      })
    }
  },
  handleWei() {  //点击打开定位
    wx.getLocation({
      type: 'wgs84',
      isHighAccuracy: true,
      success: res => {
        this.setData({
          latitude: res.latitude,
          longitude: res.longitude,
          dingwei: false
        })

        setTimeout(() => {
          wx.showToast({
            title: '定位成功！',
            icon: 'success',
            duration: 2000
          })
        }, 100)

      },
      fail(res) {
        Function.layer('定位失败，请稍后重试！')
      }
    })
  },

  handleWei1() {  //刷新定位
    wx.getLocation({
      type: 'wgs84',
      isHighAccuracy: true,
      success: res => {
        this.setData({
          latitude: res.latitude,
          longitude: res.longitude
        })

        setTimeout(() => {
          wx.showToast({
            title: '已刷新定位！',
            icon: 'success',
            duration: 2000
          })
        }, 100)

      },
      fail(res) {
        Function.layer('定位失败，请稍后重试！')
      }
    })
  },

  showQrcode() {
    // console.log('二维码')
    this.setData({
      qrCode: true
    })
  // console.log(this.data.qrCode)
  },
  hideQrcode() {
    this.setData({
      qrCode: false
    })
  },
  clockShow() {
    this.setData({
      clockShow: true
    })
  },
  hideClock() {
    this.setData({
      clockShow: false
    })
  },
  switch1Change(e) {  //控制吃饭开关
    if (e.detail.value == true) {
      this.setData({
        is_eat: false
      })
    } else {
      this.setData({
        is_eat: true
      })
    }
  },
  // 获取个人信息
  userInfo() {
    var token = wx.getStorageSync('token') || '';
    if (token == '') {
     
    } else {
      request({
        url: '/api/bkb.my/index',
        data: {
          token: token
        },
        header: {
          token: token
        }
      }).then(res => {
        console.log(res, '个人信息')
        if (res.data.code == 200) {
          this.setData({
            detail: res.data.data
          })
          if (res.data.data.status == 1) {  //上班
            this.setData({
              daka_code1: '下班打卡',
              code_msg: '已上班',
              daka_code: '上班',
              eatSwitch: false,
              is_eat: true,
              latitude: '',
              longitude: '',
              avatar: '',  //拍照图片
              dingwei: true
            })
          } else if (res.data.data.status == 2) {  //下班
            this.setData({
              daka_code1: '上班打卡',
              code_msg: '休息中',
              daka_code: '下班',
              eatSwitch: false,
              is_eat: true,
              latitude: '',
              longitude: '',
              avatar: '',  //拍照图片
              dingwei: true
            })
          } else if (res.data.data.status == 3) { //吃饭
            this.setData({
              daka_code1: '上班打卡',
              code_msg: '吃饭中',
              daka_code: '吃饭',
              eatSwitch: true,
              is_eat: false,
              avatar: ''  //拍照图片
            })

          }
          wx.setStorageSync('img', res.data.data.portrait) //保存头像
        } else if(res.data.code == 401){
          Function.layer(res.data.msg);
          setTimeout(() => {
            wx.navigateTo({
              url: '/pages/authorization/auth/auth',
            })
          }, 1000)
        } else {
          Function.layer('获取个人信息失败!')
        }
      })
    }
  },


  selctPhone(e) {  //点击上传图片
    wx.chooseImage({
      success : re=> {
        const tempFilePaths = re.tempFilePaths
        wx.uploadFile({
          url: 'https://www.imebox.cn/api/common/upload',   //仅为示例，非真实的接口地址
          filePath: tempFilePaths[0],
          name: 'file',
          formData: {},
          success : res=>{
            let url = JSON.parse(res.data)
            console.log(url)
            if(url.code == 200){
              Function.layer('上传成功！')
               this.setData({
                 avatar : 'http://' + url.data.url ,
               })
            }else{
              Function.layer('上传失败，请重试或者联系工作人员！')
            }
          }
        })
      }
    })
  },
  preimg(e) {   //点击图片放大
    var index = parseInt(e.currentTarget.dataset.index);
    var that = this;
    wx.previewImage({
      urls: [that.data.avatar],
      current: that.data.avatar
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.userInfo() //个人信息
  },

  onShow: function () {
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
        url: '/api/bkb.my/index',
        data: {
          token: token
        },
        header: {
          token: token
        }
      }).then(res => {
        console.log(res, '个人信息')
        if (res.data.code == 200) {
          this.setData({
            detail: res.data.data
          })
          if (res.data.data.status == 1) {  //上班
            this.setData({
              daka_code1: '下班打卡',
              code_msg: '已上班',
              daka_code: '上班'
            })
          } else if (res.data.data.status == 2) {  //下班
            this.setData({
              daka_code1: '上班打卡',
              code_msg: '休息中',
              daka_code: '下班'
            })
          } else if (res.data.data.status == 3) { //吃饭
            this.setData({
              daka_code1: '上班打卡',
              code_msg: '吃饭中',
              daka_code: '吃饭',
            })

          }
        }
      })
    }
  },
  onHide: function () {
    this.setData({
      avatar: ''
    })
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
 
    setTimeout(() => {
        this.setData({
            avatar: ''
          })
      this.userInfo();
      wx.stopPullDownRefresh();
    }, 1000)
  },
  penmap(e) {  //调用地图
    var longitude = e.currentTarget.dataset.longitude
    var latitude = e.currentTarget.dataset.latitude
    var name = e.currentTarget.dataset.name
    setTimeout(() => {
      wx.openLocation({
        latitude: Number(latitude),
        longitude: Number(longitude),
        scale: 15,
        name: name,
      })
    }, 500)
  }
})