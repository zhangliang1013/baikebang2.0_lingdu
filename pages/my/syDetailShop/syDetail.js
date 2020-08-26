var wxCharts = require('../../../utils/wx_charts.js')    // 根据wxCharts所在的位置而定
var yuelineChart = null
var Function = require("../../../utils/function.js");
import request from '../../../utils/request.js'
Page({
  /**
   * 页面的初始数据
   */
  data: {
    activeIndex: 0,//索引
    start_date: '0000-00-00',
    end_date: '0000-00-00',
    man: '全部', //理疗师 
    manList: ['全部'],
    manList_id : [''],
    doctor_id : '' , //理疗id
    shop_id : '' , //店铺id
    type : 'all'  , //时间分类
    hou_start : '' ,
    hou_end : ''
  }, 

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      shop_id : options.id
    })
    this.getDetail();
    this.getMan();
  },
  getMan(){    //获取理疗师
    var token = wx.getStorageSync('token') || '';
    request({
      url: '/api/bkb.manager/getShopDoctor',
      data: {
        token: token,
        shop_id : Number(this.data.shop_id),
      },
      header: {
        token: token
      }
    }).then(res => {
      // console.log(res, '门店理疗师')
      if (res.data.code == 200) {

      for(var i = 0 ;i< res.data.data.items.length ; i++  ){
         this.data.manList.push(res.data.data.items[i].name)
      }  
         
        this.setData({
              manList : this.data.manList , //理疗师名称
              manList_id : ['',...res.data.data.doctor_ids],
              list: res.data.data.items
        })
      } else {
        Function.layer('获取店铺理疗师，请稍后重试！')
      }
    })
  },


  getDetail(){  //获取门店业绩
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
        url: '/api/bkb.manager/getOrderMoney',
        data: {
          token: token,
          type : this.data.type,
          shop_id : Number(this.data.shop_id),
          doctor_id : this.data.doctor_id,
          start_date : this.data.hou_start,
          end_date : this.data.hou_end 
        },
        header: {
          token: token
        }
      }).then(res => {
        console.log(res, '门店业绩')
        if (res.data.code == 200) {
          this.setData({
                detail: res.data.data,
                total_order_amount : res.data.data.total_order_amount
          })
    this.getMothElectro();
    this.getMothElectro1();
        } else {
          Function.layer('获取门店业绩，请稍后重试！')
          setTimeout(() => {
            wx.navigateBack({
              delta: 1
            })
          }, 1000)
        }
      })
    }
  },
  bindDateChange(e) {  //开始时间
    var sTime = e.detail.value.split('-');
    var sTime1 = sTime[0] + sTime[1] + sTime[2]
    this.setData({
      start_date: e.detail.value,
      hou_start: sTime1
    })
  },
  bindDateChange2(e) { //结束时间
    if (this.data.start_date == '0000-00-00') {
      Function.layer('请先选择开始日期！')
      return false;
    }
    var sTime2 = e.detail.value.split('-');
    var sTime3 = sTime2[0] + sTime2[1] + sTime2[2]
    if (Number(this.data.hou_start) >= Number(sTime3)) {
      Function.layer('结束日期需大于开始日期，请重新选择！')
      return false;
    }
    this.setData({
      end_date: e.detail.value,
      hou_end: sTime3,
      activeIndex: 0,  //tab栏回到总业绩
      type: ''
    })
    // 调用个人业绩详情接口
    this.getDetail();
  },
  bindPickerMan(e) { //选择理疗师
    var index = Number(e.detail.value)
    this.setData({
      man : this.data.manList[index],
      doctor_id : this.data.manList_id[index]
    })
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
      start_date: '0000-00-00',
      end_date: '0000-00-00',
      hou_start : '',
      hou_end : ''
    })
    this.getDetail();
  },

  forMoreInfoTap: function () { //回退一页
    wx.navigateBack({
      delta: 1
    })
  },
   createSimulationData1() { //获取动态值
     var pie_chart = this.data.detail.pie_chart;
    return {
      pie_chart : pie_chart
    }
  },
  // 展示方法（饼图）
  getMothElectro: function () {
    var simulationData1 = this.createSimulationData1();
    yuelineChart = new wxCharts({
      animation: true,      //是否有动画
      canvasId: 'pieCanvas',
      type: 'pie',
      series:simulationData1.pie_chart ,
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
  },
  
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    this.setData({
      man: '全部' ,
      doctor_id : ''  //理疗id
     })
  },
  
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {
     setTimeout(()=> {
        this.setData({
            man: '全部' ,
            doctor_id : '',  //理疗id
            start_date: '0000-00-00',
            end_date: '0000-00-00',
            hou_start : '',
            hou_end : ''
           })
        this.getDetail();
      wx.stopPullDownRefresh()
    }, 1000)
  }
})