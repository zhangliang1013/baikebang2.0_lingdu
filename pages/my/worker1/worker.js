var Function = require("../../../utils/function.js");
var util = require("../../../utils/util.js");
import request from '../../../utils/request.js'
Page({
  /**
   * 页面的初始数据
   */
  data: {
    date: '',  //当天日期
    hou_date: '',  //后端日期
    man: '请选择',
    man1: '请选择',
    man2: '请选择',
    color: [
      {
        month: 'current',
        day: "01",
        color: 'white',
        background: "#156DF2",
      }
    ]
  },

  dayClick(e) {     //点击当天
    let time_date = e.detail.year + '/' + e.detail.month + '/' + e.detail.day;
    let time1 = time_date.split('/');
    if (time1[1] <= 9) {
      time1[1] = '0' + time1[1]
    } if (time1[2] <= 9) {
      time1[2] = '0' + time1[2]
    }
    let time2 = time1[0] + time1[1] + time1[2]
    if(this.data.hou_date == Number(time2)){
      return false;
    }
    this.setData({
      hou_date: Number(time2),
      color: [
        {
          month: 'current',
          day: e.detail.day,
          color: 'white',
          background: "#156DF2",
        }
      ],
      man: '请选择',
      man1: '请选择',
      man2: '请选择'
    })

    this.getName();  //查询已经排班
  },
  handleDelelt(){  //清除排班接口
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
       url: '/api/bkb.manager/delPlacement',
       data: {
         token: token,
         date : this.data.hou_date,
         shop_id : this.data.shop_id
       },
       header: {
         token: token
       }
     }).then(res => {
       console.log(res, '清除排班')
       if (res.data.code == 200) {
        wx.showToast({
          title: '已清除今日排班！',
          icon: 'success',
          duration: 3000
        })
         this.setData({
          zaoban: false,
          wuban: false,
          wanban: false,
          man: '请选择',
          man1: '请选择',
          man2: '请选择'
         })
       } else {
         Function.layer('清除排班失败，请稍后重试或者联系工作人员！')
       }
     })
   }
  },


  getName() {  //已经排班的查询
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
        url: '/api/bkb.manager/getPlacement',
        data: {
          token: token,
          shop_id: this.data.shop_id,
          date: this.data.hou_date
        },
        header: {
          token: token
        }
      }).then(res => {
        console.log(res, '排班查询')
        if (res.data.code == 200) {
          let arr_early = res.data.data.filter(v => {
            return v.worktype == 'early'
          })
          let arr_middle = res.data.data.filter(v => {
            return v.worktype == 'middle'
          })
          let arr_late = res.data.data.filter(v => {
            return v.worktype == 'late'
          })
          if (arr_early.length != 0) {
            let arr1 =[];
            arr_early.forEach((v,i)=>{
              arr1.push(arr_early[i].doctor.name)
            })
            this.setData({
              man: arr1.join('，')
            })
          }
          // if (arr_middle.length != 0) {
          //   this.setData({
          //     man1: arr_middle[0].doctor.name
          //   })
          // }
          if (arr_late.length != 0) {
            let arr2 =[];
            arr_late.forEach((v,i)=>{
              arr2.push(arr_late[i].doctor.name)
            })
            this.setData({
              man2: arr2.join('，')
            })
          }
        } else {
          Function.layer('获取排班信息失败，请稍后重试！')
          setTimeout(() => {
            wx.navigateBack({
              delta: 1
            })
          }, 1000)
        }
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      shop_id: Number(options.id)
    })
    let TIME = util.formatTime(new Date());
    console.log(time1)
    let time1 = TIME.split('/');
    if (time1[1] <= 9) {
      time1[1] = '0' + time1[1]
    } if (time1[2] <= 9) {
      time1[2] = '0' + time1[1]
    }
    let time2 = time1[0] + time1[1] + time1[2]

    var time = TIME.split('/')[2];
    this.setData({
      date: TIME,
      hou_date: Number(time2),
      color: [
        {
          month: 'current',
          day: time,
          color: 'white',
          background: "#156DF2",
        }
      ]
    });
  },
  onShow(){
    this.getName();
  },
  // 点击早班
  handleZao(){
    if(this.data.man != '请选择'){
      Function.layer('早班已排班，请先清除排班！');
      return false;
    }

    wx.navigateTo({
      url: '/pages/my/worker2/worker2?shop_id='+ this.data.shop_id + '&date=' + this.data.hou_date + '&ban=zao'
    })
  },
  // 点击晚班
  handleWan(){
    if(this.data.man2 != '请选择'){
      Function.layer('晚班已排班，请先清除排班！');
      return false;
    }
    wx.navigateTo({
      url: '/pages/my/worker2/worker2?shop_id='+ this.data.shop_id + '&date=' + this.data.hou_date+ '&ban=wan'
    })
  }
})