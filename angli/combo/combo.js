// angli/combo/combo.js
const common = require('../../Common.js')
const util = require('../../utils/util.js')
const app = getApp();
let value = '';
let page = 1,size = 20;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    rule:false,
    html: common.config.StaticPath + "logo_bu_03.png",
    pingimg: common.config.StaticPath + "pingtuan_03.png",
    kanimg: common.config.StaticPath + "KanJia_03.png",
    yiimg: common.config.StaticPath + "YiYuan.png",
    dati: common.config.StaticPath + "DaTi.png",
    jiantou: common.config.StaticPath + "jiantou-red_06.png",
    hongbao: common.config.StaticPath + "RedBao_03.png",
    youhui: common.config.StaticPath + "YouHui_03.png",
    youimg: common.config.StaticPath + "hui_3_03.png",
    shiting: common.config.StaticPath + "shit_03.png",
    taocan: common.config.StaticPath + "taocan_03.png",
    jiantou: common.config.StaticPath + "jiantou-red_06.png",
    CoursePath: common.config.CoursePath,
    myCourList: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var openid = wx.getStorageSync('openid');
    if (openid == null || openid == "") {
      common.GetOpenId();
    }
    page = 1;
    this.setData({ myCourList:[]});
    this.getDatas('');
    this.GetCorPRule();
    
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
    // let chooseLength = 0
    // let chooseList = wx.getStorageSync('chooseList')
    // if (chooseList){
    //   chooseLength = JSON.parse(chooseList).length
    // }
    // this.setData({
    //   chooseLength
    // })
    //获取加入购物车个数
    this.GetAlChosenCor()
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
    page = 1
    this.setData({
      myCourList:[]
    })
    this.getDatas(value);
    this.GetAlChosenCor()
    this.GetCorPRule()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.getDatas(value);
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: common.data.TitleName,
      path: 'Kecheng/Home/Home'
    }
  },
  showRule(){
    this.setData({rule:true})
  },
  hideRule(){
    this.setData({ rule: false })
  },
  jiesuan(){
    let count = this.data.chooseLength;
    if(!count){
      util.showModal('提示','您还未选择课程')
      return
    }
    wx.navigateTo({
      url: '../choose/choose',
    })
  },
  xiangxi: function (e) {
    let id = e.currentTarget.dataset.id
    console.log(e)
    wx.navigateTo({
      url: '../tcDetail/tcDetail?id=' + id + "&yu=0&copenid=0"
    });
  },
  searchCourses(e) {
    console.log(e)
    let val = e.detail.value
    if (val == value) { return }
    value = val
    page = 1
    this.setData({ myCourList: [] })
    this.getDatas(val)
  },
  //获取套餐课程
  getDatas(val){
    util.showLoading('努力加载ing...')
    util.request(
      common.config.GetCorPInfos,
      "POST",
      {
        seaK:val,
        page,
        size,
      },
      (res)=>{
        console.log("套餐班课程",res)
        if(res.data.res){
          let myCourList = this.data.myCourList
          let datas = res.data.data.CorInfos
          for (let i = 0; i < datas.length;i++){
            datas[i].CpPrice = datas[i].CpPrice.toFixed(2)
            if (datas[i].CpTitle.length > 20){
              datas[i].CpTitle = datas[i].CpTitle.substr(0,18)+"..."
            }
          }
          myCourList = myCourList.concat(datas)
          app.globalData.comboList = myCourList
          this.setData({
            myCourList
          })
          page++
          app.globalData.comboPage = page
        }
      },
      (err)=>{
        util.showModal('提示','网络异常')
      },
      (res)=>{
        wx.hideLoading();
        wx.stopPullDownRefresh()
      }
    )
  },
  //获取规则
  GetCorPRule(){
    util.request(
      common.config.GetCorPRule,
      "POST",
      {
      },
      (res) => {
        console.log('GetCorPRule', res)
        if (res.data.res) {
          this.setData({
            rules: res.data.data.CprInfo.CprRule,
            CprUseIntro: res.data.data.CprInfo.CprUseIntro,
            CprRuleByMonth: res.data.data.CprInfo.CprRuleByMonth
          })
        }
      },
      (err) => {
        util.showModal('提示', '网络异常')
      },
      (res) => {
        //wx.hideLoading()
      }
    )
  },
  //获取已加入数量
  GetAlChosenCor(){
    util.request(
      common.config.GetAlChosenCor,
      "POST",
      {
        openId: wx.getStorageSync('openid')
      },
      (res) => {
        console.log('GetAlChosenCor', res)
        if (res.data.res) {
          this.setData({ chooseLength: res.data.data.SelCount})
        }else{
          this.setData({ chooseLength:0})
        }
      },
      (err) => {
        util.showModal('提示', '网络异常')
      },
      (res) => {
        //wx.hideLoading()
      }
    )
  }
})