// Agency/AgeList/AgeList.js
const common = require('../../Common.js');







Page({

  /**
   * 页面的初始数据
   */
  data: {
    picPath: common.config.AgeLogoPicPath, //机构logo路径
    haveAge: false, //是否有机构
    ageInfos: [],
    page: 1,
    size: 10,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.showLoading({
      title: '拼命加载中...',
    });
    var lgtlat = wx.getStorageSync('lgtlat');
    if (!lgtlat) {
      common.dingwei(this.reqInterface);
    } else {
      this.reqInterface();
    }
    wx.hideLoading();
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
    this.data.page = 1;
    this.data.ageInfos = [];
    this.data.haveAge = false;
    this.reqInterface('');
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    this.reqInterface('');
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  //点击校区进入校区信息查看
  getAgencyDes(data) {
    var Id = data.currentTarget.dataset.id;
    if (Id == undefined || parseInt(Id) <= 0) {
      wx.showModal({
        title: '发生错误了',
        content: '获取信息失败，请刷新重试',
        showCancel: false
      });
      return false;
    }
    wx.navigateTo({
      url: '../AgeInfo/AgeInfo?Id=' + Id
    });
  },
  //搜索机构信息
  searchAgency(data) {
    var seaK = data.detail.value;
    if (seaK == undefined || seaK.length <= 0) {
      wx.showModal({
        title: '提示信息',
        content: '请输入搜索内容',
        showCancel: false
      });
      return false;
    }
    this.data.page = 1;
    this.data.ageInfos = [];
    this.data.haveAge = false;
    this.reqInterface(seaK);
  },
  //请求接口，获取机构信息
  reqInterface(seaK = '') {
    var lgtlat = wx.getStorageSync('lgtlat');
    if (!lgtlat) {
      wx.showModal({
        title: '提示信息',
        content: '获取位置失败，请刷新重试',
        showCancel: false
      });
      return false;
    }
    var url = common.config.GetAgenInfos;
    var _this = this;
    wx.request({
      url: url,
      method: 'POST',
      data: {
        lgt: lgtlat.lgt,
        lat: lgtlat.lat,
        page: _this.data.page,
        size: _this.data.size,
        seaK: seaK
      },
      dataType: 'json',
      header: {
        'content-type': 'application/json'
      },
      success: function(data) {
        if (data.data.res) {
          var ageInfos = data.data.data.agenInfos;
          if (ageInfos != undefined && ageInfos.length > 0) {
            if (ageInfos.length == _this.data.size) {
              _this.data.page += 1;
              ageInfos = _this.data.ageInfos.concat(ageInfos);
            } else {
              console.log(_this.data.ageInfos);
              var flat = _this.data.ageInfos.length % _this.data.size;
              if (flat <= 0) {
                ageInfos = _this.data.ageInfos.concat(ageInfos);
              } else {
                for (var i = flat; i < ageInfos.length; i++) {
                  _this.data.ageInfos.push(ageInfos[i]);
                }
                ageInfos = _this.data.ageInfos;
              }
            }
            _this.setData({
              ageInfos: ageInfos,
              haveAge: ageInfos.length > 0 ? true : false
            });
          }else{
            _this.setData({ ageInfos: _this.data.ageInfos });
          }
        } else {
          wx.showModal({
            title: '提示信息',
            content: data.data.data.msg,
            showCancel: false
          });
        }
      },
      fail: function(data) {
        wx.showModal({
          title: '提示信息',
          content: '请求出错了',
          showCancel: false
        });
      }
    })
  }
})