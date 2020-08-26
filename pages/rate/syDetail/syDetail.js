var wxCharts = require('../../../utils/wx_charts.js')    // 根据wxCharts所在的位置而定
var Function = require("../../../utils/function.js");
import request from '../../../utils/request.js'
var daulineChart = null
var yuelineChart = null
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    activeIndex: 0,//索引
    start_date: '0000-00-00',
    end_date: '0000-00-00',
    type : 'all',
    hou_end : '' ,
    hou_start : '',
    detail : ''//个人业绩详情
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getDetail();    //获取个人业绩
  },
  getDetail() {  //获取个人业绩详情
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
        url: '/api/bkb.my/getOrderMoney',
        data: {
          token: token,
          start_date: this.data.hou_start,
          end_date: this.data.hou_end,
          type : this.data.type
        },
        header: {
          token: token
        }
      }).then(res => {
        console.log(res, '个人业绩')
        if(res.data.code == 200){
          this.setData({
            detail : res.data.data
          })
          this.getMothElectro();
          this.getMothElectro1();
        }else{
          Function.layer('获取个人业绩失败，请稍后重试！')
         setTimeout(()=>{
          wx.navigateBack({
            delta: 1
          })
         },1000)
        }
      })
    }
  },

  bindDateChange(e) {  //开始时间
    var sTime = e.detail.value.split('-');
    var sTime1 = sTime[0] + sTime[1] + sTime[2]
    this.setData({
      start_date: e.detail.value,
      hou_start : e.detail.value,
      hou_start1: sTime1
    })
  },
  bindDateChange2(e) { //结束时间
    if (this.data.start_date == '0000-00-00') {
      Function.layer('请先选择开始日期！')
      return false;
    }
    var sTime2 = e.detail.value.split('-');
    var sTime3 = sTime2[0] + sTime2[1] + sTime2[2]
    if (Number(this.data.hou_start1) >= Number(sTime3)) {
      Function.layer('结束日期需大于开始日期，请重新选择！')
      return false;
    }
    this.setData({
      end_date: e.detail.value,
      hou_end : e.detail.value,
      // hou_end: sTime3,
      activeIndex : 0  ,  //tab栏回到总业绩
      type : ''
    })
    // 调用个人业绩详情接口
    this.getDetail();
  },
  handChooseType(e) {  //点击tap切换
    if (this.data.activeIndex == e.currentTarget.dataset.index) {
      return false;
    }
    if(e.currentTarget.dataset.index == 0){
       this.setData({
         type : 'all'
       })
    }else if(e.currentTarget.dataset.index == 1){
      this.setData({
        type : 'day'
      })
    }else if(e.currentTarget.dataset.index == 2){
      this.setData({
        type : 'month'
      })
    }

    this.setData({
      activeIndex: e.currentTarget.dataset.index,
      hou_start : '',
      hou_end : '',
      start_date : '0000-00-00',
      end_date : '0000-00-00'
    })

    this.getDetail() //调取详情
  },

  forMoreInfoTap: function () { //回退一页
    wx.navigateBack({
      delta: 1
    })
  },

  createSimulationData1() { //获取动态值
    var services_name = this.data.detail.pie_chart;
    return {
      services_name : services_name
    }
  },
  // 展示方法（饼图）
  getMothElectro: function () {
    var simulationData1 = this.createSimulationData1();
    yuelineChart = new wxCharts({
      animation: true,      //是否有动画
      canvasId: 'pieCanvas',
      type: 'pie',
      series:simulationData1.services_name,
      width: 310, // 宽度，单位为px
      height: 300, // 高度，单位为px
      dataLabel: true,
      legend: true
    });
  },

  createSimulationData() { //获取动态值
    var amount = this.data.detail.line_chart.amount;
    var days = this.data.detail.line_chart.days;
    return {
      amount: amount,
      days: days
    }
  },
  // 线图
  getMothElectro1: function () {
    var simulationData = this.createSimulationData();
    yuelineChart = new wxCharts({
      canvasId: 'lineCanvas',
      type: 'line',
      categories: simulationData.days,
      animation: true,
      background: '#f5f5f5',
      series: [{ // 数据列表
        name: '',
        data: simulationData.amount,
        format: function (val, name) {
          return val;
        }
      }],
      xAxis: {
        disableGrid: true //x轴的树岗
      },
      width: 310,
      height: 200,
      dataLabel: true,   // 是否在图表中显示数据内容值
      legend: false,     // 是否显示图表下方各类别的标识
      dataPointShape: false,
      enableScroll: true,
      extra: {
        lineStyle: 'straight'
      }
    });
  },
  touchHandler: function (e) {
    yuelineChart.scrollStart(e);
  },
  moveHandler: function (e) {
    yuelineChart.scroll(e);
  },
  touchEndHandler: function (e) {
    yuelineChart.scrollEnd(e);
  }
})