// angli/searchcampus/searchcampus.js
const util = require('../../utils/util.js')
const common = require('../../Common.js')
let page = 1,
  size = 20;
let value = '';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    campus: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    page = 1;
    util.showLoading('努力加载ing...')
    this.getDatas(value)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    util.showLoading('努力加载ing...')
    this.getDatas('')
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    //util.showLoading('努力加载ing...')
    this.getDatas(value)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {
    return {
      title: common.data.TitleName,
      path: 'Kecheng/Home/Home'
    }
  },
  getDatas(val) {
    //util.showLoading('努力加载ing...')
    if (value != val) {
      this.setData({
        campus: []
      })
      page = 1
    }
    var lgtlat = wx.getStorageSync('lgtlat');
    util.request(
      common.config.GetCampInfos,
      "POST", {
        seaK: val,
        page,
        size,
        lgt: lgtlat.lgt,
        lat: lgtlat.lat
      },
      (res) => {
        if (res.data.res) {
          let campus = this.data.campus;
          let datas = res.data.data.cpInfos;
          campus = campus.concat(datas);
          console.log(campus);
          this.setData({
            campus
          });
          page++;
        }
      },
      (err) => {

      },
      (res) => {
        wx.hideLoading()
        wx.stopPullDownRefresh()
      },
    )
  },
  toCampus(e) {
    let campusId = e.currentTarget.dataset.campusId;
    let cName = e.currentTarget.dataset.cname;
    let cPhone = e.currentTarget.dataset.cphone;
    let cAddress = e.currentTarget.dataset.caddress;
    let dis = e.currentTarget.dataset.dis;
    wx.navigateTo({
      url: `../campus/campus?campusId=${campusId}&cName=${cName}&cPhone=${cPhone}&cAddress=${cAddress}&dis=${dis}`,
    })
  },
  searchCourses(e) {
    let val = e.detail.value
    if (val == value) {
      return
    }
    value = val
    page = 1
    this.setData({
      campus: []
    })
    this.getDatas(val)
  }
})