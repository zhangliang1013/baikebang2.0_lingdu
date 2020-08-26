import request from '../../../utils/request.js'
var Function = require("../../../utils/function.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    content_if: '', //方案
    active1: 12,  //记录tab切换
    transmit_: ['急慢性肌骨疼痛', '运动损伤康复', '骨科术后康复', '产后康复'],
    transmit: '', //转诊码
    transmit_code: false, //转诊推荐
    transmit_key: '请选择转诊科目', //转诊科目
    prell: [],//图片数组
    order_id: '' //订单id
  },

  handleClick(e) { //方案推荐
    this.setData({
      active1: e.currentTarget.dataset.index
    })
    if (this.data.active1 == 0) {
      this.setData({
        content_if: '  尊贵的客人，通过今天的按摩感觉您的头部经络非常淤堵，长期下去会影响您的睡眠质量，会造成记忆力下降，专业建议您5天一个按摩周期，医么欢迎您再次光临！'
      })
    } else if (this.data.active1 == 1) {
      this.setData({
        content_if: '   尊贵的客人，通过今天的按摩感觉您的大椎堵塞严重、富贵包突起，长期下去会影响到您的头脑供养供血不足，对您的健康会造成威胁，专业建议您5天一个按摩周期，医么欢迎您再次光临！'
      })
    } else if (this.data.active1 == 2) {
      this.setData({
        content_if: '  尊贵的客人，通过今天的按摩感觉您的肩周劳损严重，经络淤堵不通，长期下去会影响到您的上肢气血运行，专业建议您5天一个按摩周期，医么欢迎您再次光临！'
      })
    }
  },
  // 转诊码输入
  // bindReplaceInput(e) {
  //   this.setData({
  //     transmit: e.detail.value
  //   })
  // },
  handleText(e) {  //理疗师方案
    this.setData({
      content_if: e.detail.value
    })
  },
  handleChange() {  //转诊推荐状态
    // console.log(this.data.transmit_code)
    if (this.data.transmit_code == false) {
      this.setData({
        transmit_code: 1
      })
    } else {
      this.setData({
        transmit_code: 2
      })
    }
  },
  // bindPickerChange(e) {  //选择转诊科目
  //   // console.log(e.detail.value)
  //   this.setData({
  //     transmit_key: this.data.transmit_[e.detail.value]
  //   })
  //   // console.log(this.data.transmit_key)
  // },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    this.setData({      //接收传过来的参数
      order_id: options.id,
      item: options.item,
      item1: options.item1,
      item2: options.item2,
      item3: options.item3
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


  bigImg(e) {  //点击放大
    wx.previewImage({
      current: this.data.prell[e.currentTarget.dataset.index], // 当前显示图片的http链接
      urls: this.data.prell// 需要预览的图片http链接列表
    })
  },
  handleBtn() {  //点击提交
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
      if (this.data.content_if == '') {
        Function.layer('请填写方案!')
        return false;
      }
      request({
        url: '/api/bkb/my/createReferral',
        method: 'post',
        data: {
          token: token,
          order_id: this.data.order_id,
          images: this.data.prell.join(','),
          content: this.data.content_if,
          type: this.data.transmit_code
        },
        header: {
          token: token
        }
      }).then(res => {
        //  console.log(res,'战阵')
        if (res.data.code == 200) {
          Function.layer('提交针对方案成功!')
          setTimeout(() => {
            // wx.navigateBack({
            //   delta: 1
            // })
            wx.switchTab({
              url: '/pages/bill/index/index?type=3'
            })
          }, 1000)
        } else if (res.data.msg == '重复提交') {
          Function.layer('该订单已经提交过,请勿重复操作!')
          setTimeout(() => {
            wx.navigateBack({
              delta: 1
            })
          }, 1500)
        } else {
          Function.layer('针对方案提交失败,请稍后重试!')
          setTimeout(() => {
            wx.navigateBack({
              delta: 1
            })
          }, 1500)
        }
      })
    }
  }
})