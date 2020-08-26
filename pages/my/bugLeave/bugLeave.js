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
    start_time: '请选择开始时间',
    start_time1 : '请选择开始时间',
    end_time: '请选择结束时间',
    end_time1: '请选择结束时间',
    multiArray: [years, months, days, hours],
    multiIndex: [0, 9, 16, 10, 17],
    choose_year: '',
    jia_array: ['事假', '病假', '调休', '年假'],
    type: 666,
    prell: [], //图片数组
    liexing: '类型',
    content: ''
  },

  handleBtn() {  //提交请假申请
    if (this.data.start_time == '请选择开始时间') {
      Function.layer('请选择请假开始时间!')
      return false;
    }
    if (this.data.end_time == '请选择结束时间') {
      Function.layer('请选择请假结束时间!')
      return false;
    }
    if (this.data.liexing == '类型') {
      Function.layer('请选择请假类型!')
      return false;
    }
    if (this.data.content == '') {
      Function.layer('请填写请假理由!')
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
      request({
        url: '/api/bkb/my/createLeave',
        method: 'post',
        data: {
          token: token,
          start_time: this.data.hou_start,
          end_time: this.data.hou_end,
          type: this.data.type,
          content: this.data.content,
          images: this.data.prell.join(',')
        },
        header: {
          token: token
        }
      }).then(res => {
        console.log(res, '请假申请')
        if (res.data.code == 200) {
          wx.showModal({
            title: '提示',
            content: '请假申请已提交成功,是否查看申请记录!',
            success(res) {
              if (res.confirm) {
                wx.redirectTo({
                  url: '/pages/my/qingjiaList/qingjiaList'
                })
              } else if (res.cancel) {
                wx.navigateBack({
                  delta: 2
                })
              }
            }
          })
        } else {
          Function.layer('提交请假申请失败,请稍后重试！')
          setTimeout(() => {
            this.setData({
              start_time: '请选择开始时间',
              end_time: '请选择结束时间',
              prell: [],
              content: '',
              liexing: '类型',
              type: 666
            })
          })
        }
      })
    }
  },

  handleInput(e) { //监听请假理由
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
        liexing: '病假',
        type: 2
      })
    } else if (e.detail.value == 2) {
      this.setData({
        liexing: '调休',
        type: 3
      })
    } else if (e.detail.value == 3) {
      this.setData({
        liexing: '年假',
        type: 4
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      choose_year: this.data.multiArray[0][0]
    })
  },


  selctPhone(e) {  //点击上传图片
    let that = this;
    wx.chooseImage({
      count: 8,
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
                if(prell.length >= 8){
                   Function.layer('最多上传八张照片！')
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
  bindMultiPickerChange(e) {
    this.setData({
      multiIndex: e.detail.value
    })
    const index = this.data.multiIndex;
    const year = this.data.multiArray[0][index[0]].replace('年', '');
    const month = this.data.multiArray[1][index[1]].replace('月', '');
    const day = this.data.multiArray[2][index[2]].replace('日', '');
    const hour = this.data.multiArray[3][index[3]].replace('时', '');
    // const minute = this.data.multiArray[4][index[4]].replace('分', '');

    this.setData({
      start_time: year + '-' + month + '-' + day + '-' + hour,
      start_time1: year + '-' + month + '-' + day + ' ' + hour + '时'
    })
  },

  //获取结束时间
  bindMultiPickerChange1: function (e) {
    // console.log(e, '获取')
    // console.log('picker发送选择改变，携带值为', e.detail.value)
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

    //判断时间差
    var time = this.data.start_time.split('-');
    var time1 = time[0] + time[1] + time[2] + time[3]
    var time66 =  year + '-' + month + '-' + day + '-' + hour 
    var time2 = time66.split('-');
    var time3 = time2[0] + time2[1] + time2[2] + time2[3]

    if (Number(time1) >= Number(time3)) {
      Function.layer('请假结束时间需大于开始时间！');
      return false;
    }

    this.setData({
      end_time: year + '-' + month + '-' + day + '-' + hour,
      end_time1: year + '-' + month + '-' + day + ' ' + hour + '时',
      hou_start : time1 ,
      hou_end : time3
    })
  },

  //监听picker的滚动事件
  bindMultiPickerColumnChange: function (e) {
    // console.log(e,'滚动')
    //获取年份
    if (e.detail.column == 0) {
      let choose_year = this.data.multiArray[e.detail.column][e.detail.value];
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