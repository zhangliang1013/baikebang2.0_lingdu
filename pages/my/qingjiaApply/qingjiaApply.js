// pages/my/bugLeave/bugLeave.js
var Function = require("../../../utils/function.js");
import request from '../../../utils/request.js'
const date = new Date();
const years = [];
const months = [];
const days = [];
const hours = [];
const minutes = [];
//获取年
for (let i = date.getFullYear(); i <= date.getFullYear() + 1; i++) {
  years.push("" + i + '年');
}
//获取月份
for (let i = 1; i <= 12; i++) {
  if (i < 10) {
    i = "0" + i;
  }
  months.push("" + i + '月');
}
//获取日期
for (let i = 1; i <= 31; i++) {
  if (i < 10) {
    i = "0" + i;
  }
  days.push("" + i + '日');
}
//获取小时
for (let i = 0; i < 24; i++) {
  if (i < 10) {
    i = "0" + i;
  }
  hours.push("" + i + '时');
}
//获取分钟
for (let i = 0; i < 60; i++) {
  if (i < 10) {
    i = "0" + i;
  }
  minutes.push("" + i + '分');
}
Page({
  /**
  * 页面的初始数据
  */
  data: {
    start_time: '',
    end_time: '',
    multiArray: [years, months, days, hours],
    multiIndex: [0, 9, 16, 10, 17],
    choose_year: '',
    jia_array: ['事假', '病假', '调休', '年假'],
    prell: [], //图片数组
    liexing: '类型',
    content: '',
    id: '',
    hou_start: '',
    hou_end: ''
  },
  handleInput(e) { //请假理由监听
    this.setData({
      content: e.detail.value
    })
  },
  bindPickerChange2(e) { //请假类型
    if (e.detail.value == 0) {
      this.setData({
        liexing: '事假',
        type: 1
      })
    } else if (e.detail.value == 1) {
      this.setData({
        type: 2,
        liexing: '病假'
      })
    } else if (e.detail.value == 2) {
      this.setData({
        type: 3,
        liexing: '调休'
      })
    } else if (e.detail.value == 3) {
      this.setData({
        type: 4,
        liexing: '年假'
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.setData({
      choose_year: this.data.multiArray[0][0],
      head_img: wx.getStorageSync('img') || '',
      name: wx.getStorageSync('user').name || '',
      start_time1: options.stime.substring(0, 4) + '-' + options.stime.substring(4, 6) + '-' + options.stime.substring(6, 8) + ' ' + options.stime.substring(8, 10) + '时',
      end_time1: options.etime.substring(0, 4) + '-' + options.etime.substring(4, 6) + '-' + options.etime.substring(6, 8) + ' ' + options.etime.substring(8, 10)+ '时',
      status: options.status,
      hou_start : options.stime,
      hou_end : options.etime,
      content: options.content,
      prell: options.imgs.split(','),
      id: options.id,
      status : options.status
    })
      
    if (options.stime == 0) {
      this.setData({
        start_time1: 0
      })
    }
    if (options.etime == 0) {
      this.setData({
        end_time1: 0
      })
    }

    if (options.type == 1) {
      this.setData({
        liexing: '事假',
        type: 1
      })
    } else if (options.type == 2) {
      this.setData({
        liexing: '病假',
        type: 2
      })
    } else if (options.type == 3) {
      this.setData({
        liexing: '调休',
        type: 3
      })
    } else if (options.type == 4) {
      this.setData({
        liexing: '年假',
        type: 4
      })
    }
  },
  handleChanged() {  //点击保存修改
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
        url: '/api/bkb/my/updateLeave',
        method: 'post',
        data: {
          id: this.data.id,
          start_time: this.data.hou_start,
          end_time: this.data.hou_end,
          content: this.data.content,
          images: this.data.prell.join(','),
          type: this.data.type,
          status: 0,
          token: token
        },
        header: {
          token: token
        }
      }).then(res => {
        console.log(res, '修改信息')
        if (res.data.code == 200) {
          wx.showToast({
            title: '修改成功',
            icon: 'success',
            duration: 2000
          })
          setTimeout(() => {
            wx.navigateBack({
              delta: 1
            })
          }, 1000)
        } else {
          Function.layer(res.data.msg)
        }
      })
    }
  },
  handleQuxiao() {
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
        url: '/api/bkb/my/updateLeave',
        method: 'post',
        data: {
          id: this.data.id,
          start_time: this.data.hou_start,
          end_time: this.data.hou_end,
          content: this.data.content,
          images: this.data.prell.join(','),
          type: this.data.type,
          status: 4,
          token: token
        },
        header: {
          token: token
        }
      }).then(res => {
        console.log(res, '修改信息')
        if (res.data.code == 200) {
          wx.showToast({
            title: '取消请假成功',
            icon: 'success',
            duration: 2000
          })
          setTimeout(() => {
            wx.navigateBack({
              delta: 1
            })
          }, 1000)
        } else {
          Function.layer('取消请假失败，请稍后重试！')
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
  },
  //获取开始时间
  bindMultiPickerChange: function (e) {
    // console.log(e, '获取')
    this.setData({
      multiIndex: e.detail.value
    })
    const index = this.data.multiIndex;
    const year = this.data.multiArray[0][index[0]].replace('年', '');
    const month = this.data.multiArray[1][index[1]].replace('月', '');;
    const day = this.data.multiArray[2][index[2]].replace('日', '');
    const hour = this.data.multiArray[3][index[3]].replace('时', '');
    // const minute = this.data.multiArray[4][index[4]].replace('分', '');

    this.setData({
      start_time: year + '-' + month + '-' + day + ' ' + hour + '时',
      hou_start: year + month + day + hour
    })
  },

  //获取结束时间
  bindMultiPickerChange1(e) {
    // console.log(e, '获取')
    this.setData({
      multiIndex: e.detail.value
    })
    const index = this.data.multiIndex;
    const year = this.data.multiArray[0][index[0]].replace('年', '');
    const month = this.data.multiArray[1][index[1]].replace('月', '');
    const day = this.data.multiArray[2][index[2]].replace('日', '');
    const hour = this.data.multiArray[3][index[3]].replace('时', '');
    // const minute = this.data.multiArray[4][index[4]].replace('分', '');
    // console.log(`${year}-${month}-${day}-${hour}-${minute}`);
    var end_time = Number(year + month + day + hour);
    if (end_time <= Number(this.data.hou_start)) {
      Function.layer('请假结束时间不可小于开始时间！');
      return false;
    }

    this.setData({
      end_time: year + '-' + month + '-' + day + ' ' + hour + '时',
      hou_end: year + month + day + hour
    })
  },
  //监听picker的滚动事件
  bindMultiPickerColumnChange: function (e) {
    // console.log(e,'滚动')
    //获取年份
    if (e.detail.column == 0) {
      let choose_year = this.data.multiArray[e.detail.column][e.detail.value];
      // console.log(choose_year);
      this.setData({
        choose_year
      })
    }
    //console.log('修改的列为', e.detail.column, '，值为', e.detail.value);
    if (e.detail.column == 1) {
      let num = parseInt(this.data.multiArray[e.detail.column][e.detail.value]);
      let temp = [];
      if (num == 1 || num == 3 || num == 5 || num == 7 || num == 8 || num == 10 || num == 12) { //判断31天的月份
        for (let i = 1; i <= 31; i++) {
          if (i < 10) {
            i = "0" + i;
          }
          temp.push("" + i);
        }
        this.setData({
          ['multiArray[2]']: temp
        });
      } else if (num == 4 || num == 6 || num == 9 || num == 11) { //判断30天的月份
        for (let i = 1; i <= 30; i++) {
          if (i < 10) {
            i = "0" + i;
          }
          temp.push("" + i);
        }
        this.setData({
          ['multiArray[2]']: temp
        });
      } else if (num == 2) { //判断2月份天数
        let year = parseInt(this.data.choose_year);
        console.log(year);
        if (((year % 400 == 0) || (year % 100 != 0)) && (year % 4 == 0)) {
          for (let i = 1; i <= 29; i++) {
            if (i < 10) {
              i = "0" + i;
            }
            temp.push("" + i);
          }
          this.setData({
            ['multiArray[2]']: temp
          });
        } else {
          for (let i = 1; i <= 28; i++) {
            if (i < 10) {
              i = "0" + i;
            }
            temp.push("" + i);
          }
          this.setData({
            ['multiArray[2]']: temp
          });
        }
      }
      console.log(this.data.multiArray[2]);
    }
    var data = {
      multiArray: this.data.multiArray,
      multiIndex: this.data.multiIndex
    };
    data.multiIndex[e.detail.column] = e.detail.value;
    this.setData(data);
  }
})