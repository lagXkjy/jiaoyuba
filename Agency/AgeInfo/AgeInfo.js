// Agency/AgeInfo/AgeInfo.js
const common = require('../../Common.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    viewMsg: '该机构暂未发布课程',
    agenInfo: {
      Id: 0,
      StatusS: 0
    },
    corInfos: [],
    page: 1,
    size: 10,
    haveCor: false,
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
    CoursePath: common.config.CoursePath,
    agePicPath: common.config.AgeLogoPicPath
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var ageId = options.Id;
    this.getPageInfo(ageId);
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
    if (this.data.agenInfo.StatusS == 0) {
      wx.showModal({
        title: '提示信息',
        content: '该机构信息不存在',
        showCancel: false
      });
      return false;
    }
    var ageId = this.data.agenInfo.Id;
    this.getPageInfo(ageId);
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    this.getCorInfos('', '');
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  //搜索课程信息
  searchCorInfo(data) {
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
    this.data.corInfos = [];
    this.data.haveCor = false;
    this.getCorInfos('', seaK);
  },
  //根据机构账号获取机构课程信息
  getCorInfos(account, seaK = '') {
    if (account == undefined || account == '') {
      account = this.data.agenInfo.AdminsMchId;
    }
    var _this = this;
    var lgtlat = wx.getStorageSync('lgtlat');
    wx.request({
      url: common.config.GetCorInfoByAge,
      method: 'POST',
      data: {
        lgt: lgtlat.lgt,
        lat: lgtlat.lat,
        ageAccount: account,
        page: _this.data.page,
        size: _this.data.size,
        seaK: seaK
      },
      dataType: 'json',
      success: function(data) {
        if (data.data.res) {
          var corInfos = data.data.data.corInfos;
          if (corInfos != undefined && corInfos.length > 0) {
            for (var i = 0; i < corInfos.length; i++) {
              if (corInfos[i].Title.length > 19) {
                corInfos[i].Title = corInfos[i].Title.substr(0, 18) + "...";
              }
            }
            if (corInfos.length == _this.data.size) {
              _this.data.page += 1;
              corInfos = _this.data.corInfos.concat(corInfos);
            } else {
              var flat = _this.data.corInfos.length % _this.data.size;
              if (flat <= 0) {
                corInfos = _this.data.corInfos.concat(corInfos);
              } else {
                for (var i = flat; i < corInfos.length; i++) {
                  _this.data.corInfos.push(corInfos[i]);
                }
                corInfos = _this.data.corInfos;
              }
            }
            _this.setData({
              corInfos: corInfos,
              haveCor: corInfos.length > 0 ? true : false
            });
          } else {
            _this.setData({
              corInfos: _this.data.corInfos
            });
          }
        } else {
          wx.showModal({
            title: '提示信息',
            content: data.data.data.msg,
            showCancel: false
          });
          _this.setData({
            viewMsg: data.data.data.msg
          });
        }
      },
      fail: function() {
        wx.showModal({
          title: '提示信息',
          content: '请求出错了',
          showCancel: false
        });
        _this.setData({
          viewMsg: '请求出错了'
        });
      }
    });
    wx.hideLoading();
  },
  //加载或刷新页面
  getPageInfo(ageId) {
    wx.showLoading({
      title: '努力加载中...',
    });
    var _this = this;
    var ageInfo = _this.data.agenInfo;
    var viewMsg = _this.data.viewMsg;
    wx.request({
      url: common.config.GetAgenInfo,
      method: 'POST',
      data: {
        ageId: ageId
      },
      dataType: 'json',
      header: {
        'content-type': 'application/json'
      },
      success: function(data) {
        if (data.data.res) {
          ageInfo = data.data.data.ageInfo;
          _this.getCorInfos(ageInfo.AdminsMchId);
        } else {
          if (data.data.errCode == 1103) {
            ageInfo = data.data.data.ageInfo;
            viewMsg = '该机构信息不存在';
            wx.showModal({
              title: '提示信息',
              content: '该机构信息不存在',
              showCancel: false
            });
          } else {
            wx.showModal({
              title: '提示信息',
              content: data.data.data.msg,
              showCancel: false
            });
            viewMsg = data.data.data.msg;
          }
        }
        _this.setData({
          agenInfo: ageInfo,
          viewMsg: viewMsg
        });
      },
      fail: function() {
        wx.showModal({
          title: '提示信息',
          content: '请求出错了',
          showCancel: false
        });
        viewMsg = '请求出错了';
        _this.setData({
          agenInfo: ageInfo,
          viewMsg: viewMsg
        });
      }
    });
  },
  //查看课程详细信息
  getCorDesInfo(data) {
    var Id = data.currentTarget.dataset.pid;
    var gid = data.currentTarget.dataset.gid;
    var types = data.currentTarget.dataset.type;
    var scount = data.currentTarget.dataset.scount;
    var openid = wx.getStorageSync('openid');
    var name = wx.getStorageSync('nickName');
    if (types == "1") //拼团
    {
      wx.navigateTo({
        url: '../../Kecheng/Detail/Detail?id=' + Id + "&yu=0&copenid=0"
      });
    } else if (types == "4") //砍价
    {
      wx.navigateTo({
        url: '../../Kecheng/Onebargaining/Onebargaining?cid=' + Id + "&yu=0&copenid=0"
      });
    } else if (types == "5") //一元
    {
      var oid = "0";
      if (data.currentTarget.dataset.oid != undefined) {
        oid = data.currentTarget.dataset.oid;
      }
      var sheng = data.currentTarget.dataset.sheng;
      if (sheng != "0") {
        wx.navigateTo({
          url: '../../Kecheng/YiYuan/YiYuan?id=' + Id + "&yu=0&copenid=0&oid=" + oid
        });
      }
    } else if (types == "6") //答题
    {
      var otype = data.currentTarget.dataset.otype;
      var oid = data.currentTarget.dataset.oid;
      var sheng = data.currentTarget.dataset.sheng;
      if (sheng != "0") {
        if (otype == "2") {
          var title = data.currentTarget.dataset.title
          wx.navigateTo({
            url: '../../newpage/succeed/succeed?oid=' + oid + "&cid=" + Id + "&title=" + title
          });
        }
        if (otype == "3") {
          wx.navigateTo({
            url: '../../newpage/answer/answer?id=' + Id,
          });
        } else if (otype == undefined) {
          wx.navigateTo({
            url: '../../newpage/customer/customer?id=' + Id
          });
        }
      }
    } else if (types == '9') //分销课程
    {
      wx.navigateTo({
        url: '../../distribution/Detail/Detail?id=' + Id + "&yu=0&copenid=0" + "lid=" + Id
      });
    } else if (types == '10') //优惠
    {
      wx.navigateTo({
        url: '../../Kecheng/YouHui/YouHui?id=' + Id + "&yu=0&copenid=0"
      });
    } else if (types == "11") //试听
    {
      var oid = "0";
      if (data.currentTarget.dataset.oid != undefined) {
        oid = data.currentTarget.dataset.oid;
      }
      var sheng = data.currentTarget.dataset.sheng;
      if (sheng != "0") {
        wx.navigateTo({
          url: '../../Kecheng/ShiTing/ShiTing?id=' + Id + "&yu=0&copenid=0&oid=" + oid
        });
      }
    } else if (types == '12') {
      wx.navigateTo({
        url: '../../Kecheng/TaoCan/TaoCan?id=' + Id + "&yu=0&copenid=0"
      });
    } else if (types == '13') //套餐
    {
      wx.navigateTo({
        url: '../tcDetail/tcDetail?id=' + Id + "&yu=0&copenid=0"
      });
    } else {
      wx.showModal({
        title: '提示信息',
        content: '该功能正在开发中',
        showCancel: false
      });
    }
  }
})