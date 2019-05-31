// angli/useQuan/useQuan.js
const app = getApp()
const util = require('../../utils/util.js')
const common = require('../../Common.js')
let page = 1, 
size = 10, 
kid = 0,
title = '',
img = '',
op = 0,
jp = 0,
types;
let use = ''
let name,phone,age,remark;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    y_quan:app.globalData.y_quan,
    n_quan: app.globalData.n_quan,
    quan:[],
    count:0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    page = 1
    kid = options.kid;
    title = options.title;
    img = options.img;
    op = options.op;
    jp = options.jp;
    types = options.types;
    use = options.use;
    name = options.name;
    phone = options.phone;
    age = options.age;
    remark = options.remark;
    this.getQuan()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.getQuan()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return{
      title: common.data.TitleName,
      path:'Kecheng/Home/Home'
    }
  },
  getQuan(){
    util.request(
      common.config.GetCpInfos,
      "POST",
      {
        openId:wx.getStorageSync('openid'),
        mchId: common.data.MchId,
        cpType:0,
        beUsed:1,
        page,
        size,
      },
      (res)=>{
        console.log(res)
        if(res.data.res){
          let quan = this.data.quan
          let datas = res.data.data.cpInfos
          let now = (new Date()).valueOf()
          let count = 0
          for (let i = 0; i < datas.length; i++) {
            let start = datas[i].CnStartTime.replace(/[^0-9]/ig,"")
            let end = datas[i].CnEndTime.replace(/[^0-9]/ig, "")
            console.log(end,start)

            // if (end - now <= 0) {
            //   //datas = datas.splice(i, 1)
            //   //过期改为已使用状态
            //   datas[i].CriBeUsed = 2
            // }else{
            //   count++
            // }
            // if (end - start <= 0) {
            //   datas[i].time = '无使用时间限制'
            // }
            if (end - start == 0) {
              datas[i].time = '无使用时间限制'
              count++
            }
            else if (end - now < 0) {
              //过期改为已使用状态
              datas[i].CriBeUsed = 2
            }
             else {
              start = util.formatDate(new Date(+start))
              end = util.formatDate(new Date(+end))
              datas[i].time = start + " - " + end
              count++
            }
            // if (end - start == 0){
            //   datas[i].time = '无使用时间限制'
            // }
            // else if (end - now < 0){
            //   datas.splice(i, 1)
            //   start = util.formatDate(new Date(+start))
            //   end = util.formatDate(new Date(+end))
            //   datas[i].time = start + " - " + end
            // }
            // else{
            //   start = util.formatDate(new Date(+start))
            //   end = util.formatDate(new Date(+end))
            //   datas[i].time = start + " - " + end
            // }
          }
          quan = quan.concat(datas)
          this.setData({quan,count})
          page++
        }
      },
      (err) => {
        console.log(err)
      },
      (res) => {
        wx.hideLoading()
        wx.stopPullDownRefresh()
      },
    )
  },
  chooseQuan(e){
    console.log(e)
    let index = e.currentTarget.dataset.index
    let quan = this.data.quan
    for (let i = 0; i < quan.length ;i++){
      quan[i].choose = false
    }
    quan[index].choose = true
    this.setData({quan})
    switch(use){
      case 'tc':
        wx.redirectTo({
          url: `../tcOuder/tcOuder?types=${types}&quan_name=${quan[index].CnTitle}&quan_money=${quan[index].CnFValue}&quan_id=${quan[index].CriId}&name=${name}&phone=${phone}&age=${age}&remark=${remark}&saveInp=true`,
        })
        break;
      case 'yh':
        wx.redirectTo({
          url: `../../Kecheng/YouOuder/YouOuder?kid=${kid}&title=${title}&img=${img}&op=${op}&jp=${jp}&types=${types}&quan_name=${quan[index].CnTitle}&quan_money=${quan[index].CnFValue}&quan_id=${quan[index].CriId}&saveInp=true`,
        })
        break;
      default:
        break;
    }
    
  }
})