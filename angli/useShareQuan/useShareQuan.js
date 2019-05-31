// newpage/MyBao/MyBao.js
const common = require('../../Common.js');
const util = require('../../utils/util.js')
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    yl: common.config.StaticPath + "yilinga_03.png",
    quan: [],
    y_quan: app.globalData.y_quan,
    n_quan: app.globalData.n_quan,
    useintro: '去使用'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    var useintro = this.data.useintro;
    var ll = [];
    wx.request({
      url: common.config.GetMyCoupList,
      method: 'POST',
      data: {
        openid: wx.getStorageSync("openid")
      },
      header: {
        'content-type': 'application/json'
      },
      success: function(res) {
        var list = res.data.list;
        for (var i = 0; i < list.length; i++) {
          var st = common.timeStamp2StringNian2(list[i].Coupons.StartTime);
          var et = common.timeStamp2StringNian2(list[i].EndTime);
          var timest = list[i].EndTime.replace(/\D/g, '');
          var coid = list[i].CouponsOrderId;
          var ttype = list[i].Type;
          var mm = {
            img: common.config.StaticPath + "boliang_07.png",
            price: list[i].Price,
            title: list[i].Coupons.Title,
            csid: list[i].Id,
            st: st,
            et: et,
            yao: true
          };
          if (coid == "0" && ttype == "2") //已领取,未使用
          {
            if (timest <= Date.now()) {
              mm.imgAll = common.config.StaticPath + "yiguoQi_03.png";
              mm.huise = "huise";
              mm.status = 2;
              mm.rema = true;
              mm.ShiXiao = false;
              useintro = '已过期';
            } else {
              mm.status = 0;
              mm.rema = false;
              mm.ShiXiao = true;
              useintro = '去使用';
            }
          } else if (coid != "0" && ttype == "2") //已领取,已使用
          {
            mm.imgAll = common.config.StaticPath + "yiguoQi_03.png";
            mm.huise = "huise";
            mm.status = 1;
            mm.rema = true;
            mm.ShiXiao = false;
            useintro = '已使用';
          } else if (ttype == "3") //已领取,已过期
          {
            mm.imgAll = common.config.StaticPath + "yiguoQi_03.png";
            mm.huise = "huise";
            mm.status = 2;
            mm.rema = true;
            mm.ShiXiao = false;
            useintro = '已过期';
          }
          ll.push(mm);
        }
        that.setData({
          list: ll,
          useintro: useintro
        })
      }
    })
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
    this.setData({
      list: [],
    })
    this.onLoad();
    wx.stopPullDownRefresh();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  shiyong: function(e) {
    var csid = e.currentTarget.dataset.csid;
    var price = e.currentTarget.dataset.price;
    var status = e.currentTarget.dataset.status;
    if (status == "0") {
      wx.redirectTo({
        url: '../courses/courses?csid=' + csid + "&price=" + price
      });
    }
  },
  useQuan(e) {
    let quan_id = e.currentTarget.dataset.quan_id;
    let quan_money = e.currentTarget.dataset.quan_money;
    wx.redirectTo({
      url: '../../newpage/courses/courses?csid=' + quan_id + "&price=" + quan_money
    });
  }
})