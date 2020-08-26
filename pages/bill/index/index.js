var Function = require("../../../utils/function.js");
import request from '../../../utils/request.js'
Page({
  /**
   * 页面的初始数据
   */
  data: {
    activlen: ['待治疗', '治疗中', '已完成', '已取消/过号'], //状态
    orderObj: [], //订单列表
    activeindex: 0,
    pagesize: 10,//页
    type: 1, //类型
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  },
  getIndex(e) {
    if (this.data.activeindex == e.currentTarget.dataset.index) {
      return false;
    }
    this.setData({
      activeindex: e.currentTarget.dataset.index,
      type: e.currentTarget.dataset.index + 1,
      orderObj: [],
      pagesize : 10
    })
    this.orderList();
  },
  orderList() {
    var token = wx.getStorageSync('token') || '';
    if (token == '') {
      wx.showModal({
        title: '提示',
        content: '为了保证您的信息安全，请先授权登录！',
        success(res) {
          if (res.confirm) {
            wx.navigateTo({
              url: '/pages/authorization/auth/auth',
            })
          }
        }
      })
    } else {
      request({
        url: '/api/bkb/my/getOrderList',
        hrader: {
          token: token
        },
        data: {
          token: token,
          type: this.data.type,
          page: 1,
          pagesize: this.data.pagesize
        }
      }).then(res => {
        console.log(res, '订单列表')
        if (res.data.code == 200) {
            this.setData({
              orderObj: res.data.data
            })
        } else if (res.data.code == 401) {
          Function.layer(res.data.msg);
          setTimeout(() => {
            wx.navigateTo({
              url: '/pages/authorization/auth/auth',
            })
          }, 1000)
        } else {
          Function.layer(res.data.msg);
        }
      })
    }
  },
  guoHao(e) {  //点击过号
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
        url: '/api/bkb/my/updateOrder',
        data: {
          token: token,
          order_id: e.currentTarget.dataset.index,
          status: 1
        },
        header: {
          token: token
        }
      }).then(res => {
        // console.log(res, '过号')
        if (res.data.code == 200) {
          Function.layer('该订单过号成功!')
          setTimeout(() => {
            this.orderList();
          }, 1000)
        } else {
          Function.layer('操作失败,请稍后重试!')
        }
      })
    }


  },
  zhiLiao(e) {  //点击开始治疗
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
        url: '/api/bkb/my/updateOrder',
        data: {
          token: token,
          order_id: e.currentTarget.dataset.index,
          status: 2
        },
        header: {
          token: token
        }
      }).then(res => {
        // console.log(res, '过号')
        if (res.data.code == 200) {
          wx.showToast({
            title: '已开始治疗！',
            icon: 'success',
            duration: 2000
          })

          setTimeout(() => {
            this.setData({
              orderObj: [],
              activeindex: 1,
              type: 2
            })
            this.orderList();
          }, 1000)
        } else {
          Function.layer('操作失败,请稍后重试!')
        }
      })
    }
  },
  quXiao(e) {   //点击取消·
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
        url: '/api/bkb/my/updateOrder',
        data: {
          token: token,
          order_id: e.currentTarget.dataset.index,
          status: 1
        },
        header: {
          token: token
        }
      }).then(res => {
        console.log(res, '取消')
        if (res.data.code == 200) {
          Function.layer('该订单取消成功!')
          setTimeout(() => {
            // this.setData({
            //   orderObj: []
            // })
            this.orderList();
          }, 1000)
        } else {
          Function.layer('操作失败,请稍后重试!')
        }
      })
    }

  },
  fangAn(e) {  //填写方案
    wx.navigateTo({
      url: '/pages/bill/precept/precept?id=' + e.currentTarget.dataset.index + '&item=' + e.currentTarget.dataset.item + '&item1=' + e.currentTarget.dataset.item1 + '&item2=' + e.currentTarget.dataset.item2 + '&item3=' + e.currentTarget.dataset.item3
    })
  },
  jieShu(e) {  //点击结束治疗
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
      wx.showModal({
        title: '提示',
        content: '是否结束治疗,提醒客户付款并进行针对方案填写！',
        success: td => {
          if (td.confirm) {
            request({
              url: '/api/bkb/my/updateOrder',
              data: {
                token: token,
                order_id: Number(e.currentTarget.dataset.index),
                status: 3
              },
              header: {
                token: token
              }
            }).then(res => {
              if (res.data.code == 200) {  //已结束治疗
                //  跳到针对方案填写页
                wx.navigateTo({
                  url: '/pages/bill/precept/precept?id=' + e.currentTarget.dataset.index + '&item=' + e.currentTarget.dataset.item + '&item1=' + e.currentTarget.dataset.item1 + '&item2=' + e.currentTarget.dataset.item2 + '&item3=' + e.currentTarget.dataset.item3
                })

              } else {
                Function.layer('操作失败,请稍后重试!')
              }
            })
          }
        }
      })
    }
  },
  pingLun(e) {   //跳评论页面
    wx.navigateTo({
      url: '/pages/my/comment/comment',
    })
  },
  fuKuan(e) {   //提醒付款
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
      //  调用手动提醒付款的接口
      request({
        url: '/api/bkb.my/getRemindPayment',
        header: {
          token: token
        },
        data: {
          token: token,
          order_id: Number(e.currentTarget.dataset.index)
        }
      }).then(res => {
        console.log(res)
        if (res.data.code == 200) {
          setTimeout(() => {
            wx.showToast({
              title: '提醒成功！',
              icon: 'success',
              duration: 2000
            })
          }, 500)
        } else {
          Function.layer('提醒客户付款失败,请稍后重试!')
        }
      })
    }
  },
  onShow: function () {
    this.orderList();
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    setTimeout(() => {
      this.setData({
        orderObj: [],
        pagesize : 10
      })
      this.orderList();
      wx.stopPullDownRefresh()
    }, 2000)
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    wx.showLoading({
      title: '正在加载',
      mask: true
    })
    setTimeout(() => {
      this.setData({
        pagesize: this.data.pagesize + 10
      })
      this.orderList();
      wx.hideLoading()
      if (this.data.orderObj.length % 10 != 0) {
        Function.layer('已加载全部订单！');
        return false;
      }
    }, 1000)
  }
})