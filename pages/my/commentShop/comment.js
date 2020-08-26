var Function = require("../../../utils/function.js");
import request from '../../../utils/request.js'
Page({
  /**
   * 页面的初始数据
   */
  data: {
    activeIndex : 99,
    pagesize : 10,
    type : ''
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    that.setData({
      id : options.id
    })
    that.getList();
  },
  getList(){
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
        url: '/api/bkb.manager/getDiscussList',
        data: {
          token: token,
          shop_id : this.data.id,
          // page: this.data.page,
          type : this.data.type,
          pagesize : this.data.pagesize
        },
        header: {
          token: token
        }
      }).then(res => {
        console.log(res, '门店满意度')
        if (res.data.code == 200) {
          this.setData({
          list : res.data.data.items,
          score : res.data.data.score,
          total : res.data.data.total
          })
        } else {
          Function.layer('获取门店满意度失败，请稍后重试！')
          setTimeout(() => {
            wx.navigateBack({
              delta: 1
            })
          }, 1000)
        }
      })
    }
  },
  handIndex(e){  //类型切换
    // console.log(e)
    if(this.data.activeIndex == e.currentTarget.dataset.index){
      return false;
    }
    this.setData({
      activeIndex:e.currentTarget.dataset.index
    })
  
    if(e.currentTarget.dataset.index == 0){
      this.setData({
        type : 'good'
      })
    }else if(e.currentTarget.dataset.index == 1){
      this.setData({
        type : 'medium'
      })
    }else if(e.currentTarget.dataset.index == 2){
      this.setData({
        type : 'bad'
      })
    }
this.getList();
  },
  onShow: function () {
    this.getList();
  },
  previewImage: function (e) {
    let that = this;
    let index = Function.getDataSet(e, 'index');
    let url = Function.getDataSet(e, 'url');  //当前
    wx.previewImage({
      current: url,                  // 当前显示图片的http链接
      urls:  that.data.list[index].images// 需要预览的图片http链接列表
    })
  },
  onPullDownRefresh() {
    setTimeout(()=> {
        let that = this
        that.setData({
          list: [],
          pagesize : 10
        })
        that.getList();
      wx.stopPullDownRefresh()
    }, 2000)
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {
    wx.showLoading({
      title: '正在加载',
      mask: true 
    })
    this.setData({
      pagesize : this.data.pagesize + 10
    })
    setTimeout(() => {
       this.getList();
      wx.hideLoading()
    }, 1000)
    // console.log(this.data.list.length % 10)
    if(this.data.list.length % 10 != 0 ){
      Function.layer('已加载全部评论！')
    }
  }
})