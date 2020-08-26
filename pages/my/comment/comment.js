var Function = require("../../../utils/function.js");
import request from '../../../utils/request.js'
Page({
  /**
   * 页面的初始数据
   */
  data: {
    activeIndex: 55,
    pages: 1, //页数
    type: '',  //评论分类
    commentList: ''
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.commentList();     //加载评论列表
  },
  handIndex(e) {  //类型切换
     this.setData({
       commentList : [],
       pages : 1
     })
    if (this.data.activeIndex == e.currentTarget.dataset.index) {
      return false;
    }
    if (e.currentTarget.dataset.index == 0) {
      this.setData({
        type: 'good'
      })
    } else if (e.currentTarget.dataset.index == 1) {
      this.setData({
        type: 'medium'
      })
    } else if (e.currentTarget.dataset.index == 2) {
      this.setData({
        type: 'bad'
      })
    }
    this.setData({
      activeIndex: e.currentTarget.dataset.index
    })
    this.commentList();
  },
  commentList() {  //获取评论列表
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
        url: '/api/bkb/my/getDiscussList',
        data: {
          token: token,
          page: this.data.pages,
          pagesize : 10,
          type: this.data.type
        },
        header: {
          token: token
        }
      }).then(res => {
        console.log(res, '评论列表')
        if (res.data.code == 200) {
          this.setData({
            score: res.data.data.score,
            total: res.data.data.total
          })
          if (this.data.commentList.length == 0) {
            this.setData({
              commentList: res.data.data.items,
            })
          } else {
            this.setData({
              commentList: [...this.data.commentList, ...res.data.data.items],
            })
          }
        } else {
          Function.layer('获取评论列表失败,请稍后重试或咨询工作人员!')
        }
      })
    }
  },
  //预览图片
  previewImage: function (e) {
    let that = this;
    let index = Function.getDataSet(e, 'index');
    let url = Function.getDataSet(e, 'url');  //当前
    wx.previewImage({
      current: url,                  // 当前显示图片的http链接
      urls: that.data.commentList[index].images// 需要预览的图片http链接列表
    })
  },
  /**
  * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    setTimeout(() => {
      this.setData({
        commentList: [],
        activeIndex : 66,
        pages: 1
      })
      this.commentList();
      wx.stopPullDownRefresh()
    }, 1500)
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
        pages: this.data.pages + 1
      })
      this.commentList();
      if (this.data.commentList.length % 10 != 0) {
        Function.layer('已加载全部评论数据！')
        return false
      }
      wx.hideLoading()
    }, 1000)
  }
})