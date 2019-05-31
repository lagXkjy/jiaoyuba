// Kecheng/bargaining/bargaining.js
var app = getApp();
var common = require('../../Common.js')
let col1H = 0;
var j = 0;
let corId

Page({

  /**
   * 页面的初始数据
   */
  data: {
    show: true,
    yu: "",
    bb: "",
    haibao: "",
    gid: "",
    kid: "",
    kancount: "",
    grouplist: [],
    width: 0,
    topwidth: 0,
    guoqi: 0,
    name: "",
    phone: "",
    xprice: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var id = options.cid;
    var yu = options.yu;
    var copenid = options.copenid;
    corId = options.cid
    let nickName = wx.getStorageSync('nickName')
    let avatarUrl = wx.getStorageSync('avatarUrl')
    var numbertime = options.numbertime;
    wx.setNavigationBarTitle({ title: common.data.TitleName });
    var openid = "";
    if (wx.getStorageSync('openid') == null || wx.getStorageSync('openid') == "") {
      wx.login({
        complete: function (res) {
          if (res.code) {
            //获取code
            console.log("GETOPENID")
            wx.request({
              url: common.config.GetOrSetOpenid,
              data: {
                code: res.code,//wx.getStorageSync('Code'),
                name: nickName,
                img: avatarUrl,
                mchid: common.data.MchId
              },
              header: {
                'content-type': 'application/json'
              },
              method: 'POST',
              success: function (res) {
                console.log('GetOrSetOpenid',res)
                if (res.data.res) {
                  wx.setStorageSync('openid', res.data.data.openId);
                  options = res.data.data.openid;
                  that.fangfa(nickName, id, copenid,numbertime);
                }
              }
            })
          }
        },
        fail: function (res) { //用户无授权时
          that.setData({
            getUserInfoFail: true
          })
        }
      });
    }
    else{
      openid = wx.getStorageSync('openid');
      var name = wx.getStorageSync('nickName');
      that.fangfa(name, id, copenid, numbertime);
    }
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
    wx.setNavigationBarTitle({ title: common.data.TitleName });
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

  },
  onPullDownRefresh: function () {
    wx.stopPullDownRefresh()
  },
  fangfa: function (name, id, copenid, numbertime){
    let that = this;
    wx.request({
      url: common.config.KanGropOfGid,
      data: {
        openid: wx.getStorageSync('openid'),
        name: name,
        cid: id,
        copenid: copenid,
        province: wx.getStorageSync('province'),
        city: wx.getStorageSync('city'),
        address: wx.getStorageSync('address')
      },
      method: 'POST',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        if (res.data.result=="false")
        {
          common.modalTap("请重试...");
        }
        if (copenid == wx.getStorageSync('openid')) {
          wx.redirectTo({
            url: '../Twobargaining/Twobargaining?gid=' + res.data.id + "&yu=0"+"&corId="+corId
          });
        }
        else {
          wx.redirectTo({
            url: '../Threebargaining/Threebargaining?gid=' + res.data.id + '&numbertime=' + numbertime + "&yu=0" + "&corId=" + corId
          });
        }
      }
    });
  }
})