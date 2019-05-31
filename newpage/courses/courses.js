// newpage/redCourse/redCourse.js
var common = require('../../Common.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    imgHeight: "",
    ww: "",
    csid: "",
    price: "",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    var csid = "";
    var price = "";
    if (options != undefined) {
      csid = options.csid;
      price = options.price;
    } else {
      csid = that.data.csid;
      price = that.data.price;
    }
    this.getCorInfo(csid, price, '');
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
    this.getCorInfo(this.data.csid, this.data.price, '');
    wx.stopPullDownRefresh()
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
  xiangxi: function(e) {
    var that = this;
    var cid = e.currentTarget.dataset.cid;
    wx.navigateTo({
      url: '../Coupcour/Coupcour?id=' + cid + '&yu=0&copenid=0&csid=' + that.data.csid + '&price=' + that.data.price
    });
  },
  //获取课程信息
  getCorInfo: function(csid, price, seaK) {
    var that = this;
    var lgtlat = wx.getStorageSync('lgtlat');
    wx.request({
      url: common.config.GetCouponsCourseList,
      method: 'POST',
      data: {
        csid: csid,
        lgt: lgtlat.lgt,
        lat: lgtlat.lat,
        seaK: seaK
      },
      header: {
        'content-type': 'application/json'
      },
      success: function(res) {
        var list = res.data.list;
        var ll = [];
        for (var i = 0; i < list.length; i++) {
          let title = list[i].Title.length > 20 ? list[i].Title.substr(0, 18) + "..." : list[i].Title;
          var mm = {
            Id: list[i].Id,
            img: common.config.CoursePath + list[i].PicturePath,
            title: title,
            price: (list[i].OriginalPrice - price).toFixed(2),
            Oprice: list[i].OriginalPrice.toFixed(2),
            imgbg: common.config.StaticPath + "kechengY_03.png",
            money: price,
            Distance: list[i].Distance
          };
          ll.push(mm);
        }
        that.setData({
          list: ll,
          csid: csid,
          price: price
        });
      }
    });
  },
  searchCourses(e) {
    let val = e.detail.value;
    this.getCorInfo(this.data.csid, this.data.price, val);
  }
})