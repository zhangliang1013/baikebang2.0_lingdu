
var wxCharts = require('../../../utils/wx_charts.js')    // 根据wxCharts所在的位置而定
var yuelineChart = null;
import request from '../../../utils/request.js'
var Function = require("../../../utils/function.js");
var util = require("../../../utils/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    plan1: 0,
    plan2: 0,
    plan3: 0,
    now_month: '2020年01月',  //页面展示日期
    now_date: '', //传给后台的日期
    amount: ['1', '5', '500'],//y轴
    days: ['1', '2', '3']  //x轴
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var TIME = util.formatTime(new Date());
    var time6 = TIME.split('/');
    if (Number(time6[1]) <= 9) {
      time6[1] = '0' + time6[1]
    }
    var date1 = time6[0] + '年' + time6[1] + '月';
    var time = date1.replace('年', '-');
    var time1 = time.replace('月', '');
    var time2 = time1.split('-');
    var time3 = time2[0] + time2[1]
    this.setData({
      now_month: date1,
      time3 : time3,
      now_date : time3
    })

    this.getDetail(); //详情
  },
  forMoreInfoTap: function () { //回退一页
    wx.navigateBack({
      delta: 1
    })
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
        url: '/api/bkb.my/getEvaluate',
        data: {
          token: token,
          date: this.data.now_date
        },
        header: {
          token: token
        }
      }).then(res => {
        console.log(res, '个人绩效')
        if (res.data.code == 200) {
        if(res.data.data.performance == null){
           Function.layer('暂未展示该月份绩效！')
           return false;
        }

          this.setData({
            detail: res.data.data,  //详情
            plan1: res.data.data.performance.applause_rate / res.data.data.performance.applause_rate_target * 100,
            plan2: res.data.data.performance.order_num / res.data.data.performance.order_num_target * 100,
            plan3: res.data.data.performance.repetitive_rate / res.data.data.performance.repetitive_rate_target * 100,
            amount: res.data.data.line_chart.amount,
            days: res.data.data.line_chart.days
          })


          this.getMothElectro(); //加载折线图
        } else {
          Function.layer('获取个人绩效失败,请后台工作人员!')
        }
      })
    }
  },
  bindDateChange(e) { //选择日期筛选
    let arr = e.detail.value.split('-');
    var time8 = arr[0] + '年' + arr[1] + '月';
    var time9 = arr[0] + arr[1];

    if(Number(time9) > Number(this.data.time3)){
      Function.layer('无法查询未知绩效!');
      return false;
    }
    // console.log(time9)
    this.setData({
      now_month: time8,
      now_date :time9
    })

    this.getDetail();  //获取详情
  },

  createSimulationData() { //获取动态值
    var amount = this.data.amount;
    var days = this.data.days;
    return {
      amount: amount,
      days: days
    }
  },
  // 线图
  getMothElectro() {
    var simulationData = this.createSimulationData();
    if (simulationData.amount == []) {
      Function.layer('数据不能为空!')
      return false;
    }
    if (simulationData.days == []) {
      Function.layer('数据不能为空!')
      return false;
    }

    yuelineChart = new wxCharts({
      canvasId: 'lineCanvas',
      type: 'line',
      categories:  simulationData.days,
      animation: true,
      background: '#f5f5f5',
      series: [{    // 数据列表
        name: '',
        data: simulationData.amount,
        format: function (val, name) {
          return val;
        }
      }],
      xAxis: {
        disableGrid: true
      },
      width: 310,
      height: 200,
      dataLabel: false,   // 是否在图表中显示数据内容值
      legend: false,     // 是否显示图表下方各类别的标识
      dataPointShape: true,
      enableScroll: true, //开启x轴滚动
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