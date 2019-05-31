// Agency/AgenAply/AgenAply.js
const common = require('../../Common.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    ruzhubg: common.config.ImgPath + 'ruzhubg.jpg',
    subword: '提交申请',
    btnclass: 'btnsub-c',
    formsub: 'subform',
    Id: 0,
    AgencyName: '',
    Name: '',
    Phone: '',
    param: {
      ageName: '',
      pPhone: '',
      pName: '',
      openId: ''
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var Id = options.Id;
    if (Id > 0) {
      this.getApplyInfo(Id);
    }
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
    var Id = this.data.Id;
    if (Id > 0) {
      this.getApplyInfo(Id);
    } else {
      this.setData({
        Id: 0,
        AgencyName: '',
        Name: '',
        Phone: ''
      });
    };
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

  //提交表单
  subform: function(data) {
    var param = {};
    let correct = true;
    let tishi = '';
    param.ageName = data.detail.value.AgencyName;
    param.pPhone = data.detail.value.Phone;
    param.pName = data.detail.value.Name;
    if (param.pName.length <= 0) {
      tishi = '请输入联系人姓名';
      correct = false;
    }
    if (param.pPhone.length <= 0) {
      tishi = '请输入联系方式';
      correct = false;
    } else {
      var phoneReg = /^1[34578]\d{9}$/; // 正则手机号码
      if (!phoneReg.test(param.pPhone)) {
        tishi = '请输入正确手机号码';
        correct = false;
      }
    }
    if (param.ageName.length <= 1) {
      tishi = param.ageName.length <= 0 ? '请输入机构名称' : '机构名称不得小于2字符';
      correct = false;
    }
    if (!correct) {
      wx.showModal({
        title: '提示信息',
        content: tishi,
        showCancel: false
      });
      return false;
    }
    var openId = wx.getStorageSync('openid');
    if (!openId) {
      common.GetOpenId(this.applyJG);
    } else {
      param.openId = openId;
      this.setData({
        param: param
      });
      this.applyJG();
    }
  },
  //申请入驻平台信息提交
  applyJG: function() {
    var _this = this;
    wx.request({
      url: common.config.ApplyAgency,
      method: 'POST',
      data: {
        ageName: _this.data.param.ageName,
        pName: _this.data.param.pName,
        pPhone: _this.data.param.pPhone,
        openId: _this.data.param.openId
      },
      dataType: 'json',
      success: function(data) {
        if (data.data.res) {
          var Id = data.data.data.Id;
          _this.setData({
            subword: '正在审核中',
            btnclass: 'btnsub-n',
            formsub: '',
            Id: Id,
            AgencyName: _this.data.param.ageName,
            Name: _this.data.param.pName,
            Phone: _this.data.param.pPhone,
          });
          wx.showModal({
            title: '提示信息',
            content: '申请成功',
            showCancel: false
          });
        } else {
          wx.showModal({
            title: '提示信息',
            content: data.data.data.msg,
            showCancel: false
          });
        }
      },
      fail: function() {
        wx.showModal({
          title: '提示信息',
          content: '请求出错了',
          showCancel: false
        });
      }
    });
  },
  //获取申请状态
  getApplyInfo(Id) {
    var _this = this;
    wx.request({
      url: common.config.GetAgencyApplyStatus,
      method: 'POST',
      data: {
        ageId: Id
      },
      dataType: 'json',
      success: function(data) {
        if (data.data.res) {
          var Id = data.data.data.Id;
          var ShStatus = data.data.data.ShStatus;
          var Name = data.data.data.Name;
          var Phone = data.data.data.Phone;
          var AgencyName = data.data.data.AgencyName;
          if (ShStatus == 1) {
            _this.setData({
              subword: '审核已通过',
              btnclass: 'btnsub-n',
              formsub: '',
              Id: Id,
              AgencyName: AgencyName,
              Name: Name,
              Phone: Phone,
            });
          } else {
            _this.setData({
              subword: '正在审核中',
              btnclass: 'btnsub-n',
              formsub: '',
              Id: Id,
              AgencyName: AgencyName,
              Name: Name,
              Phone: Phone,
            });
          }
        } else {
          wx.showModal({
            title: '提示信息',
            content: data.data.data.msg,
            showCancel: false
          });
        }
      },
      fail: function() {
        wx.showModal({
          title: '提示信息',
          content: '获取信息失败了',
          showCancel: false
        });
      }
    });
  }
})