var Function = require("../../../utils/function.js");
import request from '../../../utils/request.js'
Page({
  data: {
    isSelect: false,
    manList: []
  },
  onLoad: function (options) {
    console.log(options)
    this.setData({
      shop_id: Number(options.shop_id),
      date: Number(options.date),
    })
if(options.ban == 'zao'){
  this.setData({
    ban : '早班',
    worktype : 'early'
  })
}else if(options.ban == 'wan'){
  this.setData({
    ban : '晚班',
    worktype : 'late'
  })
}
    this.getManList()  //可排班理疗师
  },

  getManList() {  //可排班理疗师
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
        url: '/api/bkb.manager/getLeisureDoctor',
        data: {
          token: token,
          date: this.data.date,
          shop_id: this.data.shop_id
        },
        header: {
          token: token
        }
      }).then(res => {
        console.log(res, '排班理疗师')
        if (res.data.code == 200) {
          this.setData({
            manList: []
          })
          if (res.data.data.length == 0 || res.data.data.items.length == 0  ) {
            Function.layer('暂无可排班理疗师！')
            setTimeout(()=>{
              wx.navigateBack({
                delta: 1
              })
            },1500)
            return false;
          }

          this.setData({
            manList: res.data.data.items      //理疗师名称
          })
        } else {
          Function.layer('获取理疗师排班,请稍后重试!')
        }
      })
    }
  },
  selectApply: function (e) {
    var index = e.currentTarget.dataset.index;
    var item = this.data.manList[index];
    item.isSelect = !item.isSelect;

    this.setData({
      manList : this.data.manList
    })
  },
  handleQu() { //点击取消
    wx.navigateBack({
      delta: 1
    })
  },
  handleSuer() { //确认排班
    let arr_suer = this.data.manList.filter(v=>{
      return v.isSelect == true;
    })
    let pai_id = []
    arr_suer.forEach((v,i)=>{
      pai_id.push(v.id)
    })
   if(pai_id.length == 0){
     Function.layer('请选择理疗师！')
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
       url: '/api/bkb.manager/createPlacement',
       data: {
         token: token,
         shop_id : this.data.shop_id,
         date : this.data.date,
         doctor_id : pai_id.join(','),
         worktype : this.data.worktype
       },
       header: {
         token: token
       }
     }).then(res => {
       console.log(res, '操作排班')
       if (res.data.code == 200) {
        wx.showToast({
          title: this.data.ban + '排班成功！',
          icon: 'success',
          duration: 1500
        })

        setTimeout(()=>{
          wx.navigateBack({
            delta: 1
          })
        },1500)
       } else {
         Function.layer('排班失败，请稍后重试！')

         setTimeout(() => {
           wx.navigateBack({
             delta: 1
           })
         }, 1000)
       }
     })
   }
  }
})