// success.js
var app = getApp();
const util = require('../../utils/util.js')
var common = require('../../Common.js');
var zou = "true";
let noshow = false;
Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    show: true,
    succe: common.config.StaticPath + "groupsuccess_03.png",
    cheng: common.config.StaticPath + "successgree_03.png",
    ding: common.config.StaticPath + "dingwei_03.png",
    shou: common.config.StaticPath + "shouji.jpg",
    CoursePath: common.config.CoursePath,
    xian: false,
    kid: "",
    goumai: true,
    types: "",
    address: "",
    phone: "",
    zhi: "",
    gid: "",
    status: "",
    glist:[]
  },
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function (options) {
    wx.setNavigationBarTitle({ title: common.data.TitleName });
    var that = this;
    var zhi = "1";
    if (options.zhi == "0") {
      zhi = "0";
    }
    noshow = options.noshow
    var id = options.gid;
    var goumai = true;
    var openid = wx.getStorageSync('openid');
    if (id == "0") {
      wx.request({
        url: common.config.GetGropuBookingOfOpenId,
        data: {
          openid: openid,
          ctype: "12"
        },
        method: 'POST',
        header: {
          'content-type': 'application/json'
        },
        success: function (res) {
          if (res.data.result) {
            var model = res.data.model;
            var kid = model.CourseId;
            var title = model.Course.Title;
            if (title.length > 20) {
              title = title.substr(0, 18) + '...';
            }
            var types = model.Course.Type;
            var img = common.config.CoursePath + model.Course.PicturePath;
            var sp = model.Course.sPrice;
            sp = sp.toFixed(2);
            var gp = model.Course.GroupPrice;
            gp = gp.toFixed(2);
            var op = model.Course.OriginalPrice;
            op = op.toFixed(2);
            var pp = model.Price;
            pp = pp.toFixed(2);
            var addre = model.Course.Address;
            var phon = model.Course.Phone;
            var glist = [];
            var status="";
            var a = false;
            if (phon == "" && addre == "") {
              a = true;
            }
            ////////////////////////////判断订单来自哪张表
            if(types == 12 || types=="12")
            {
              goumai = false;
              status = model.Type;
              model.CreateOn = common.timeStamp2String(model.CreateOn);
              model.StartTime = model.CreateOn;
              model.EndTime = model.CreateOn;
            }
            //更新数据
            that.setData({
              title: title,
              img: img,
              gprice: pp,
              oprice: op,
              sprice: sp,
              address: addre,
              phone: phon,
              xian: a,
              kid: kid,
              model: model,
              types: types,
              zhi: zhi,
              gid: id,
              status: status,
              goumai:goumai,
              glist:glist
            });
            console.log("44444444444")
            if (noshow) {
              that.setData({ zhi: 1, goumai: false })
            }
          }
        }
      });
    }
    else {
      var otype = options.otype;
      wx.request({
        url: common.config.GetCpOdrInfo,
        data: {
          odrId: id
        },
        method: 'POST',
        header: {
          'content-type': 'application/json'
        },
        success: function (res) {
          console.log('查看订单',res)
          if(res.data.res){
            let myCourList = res.data.data.corInfos
            let model = res.data.data.odrInfo
            model.CpoPayMoney = model.CpoPayMoney.toFixed(2)
            model.CpoCreateOn = util.formatTime(new Date(+model.CpoCreateOn.replace(/[^0-9]/ig, "")))
            model.CpoPayTime = util.formatTime(new Date(+model.CpoPayTime.replace(/[^0-9]/ig, "")))
            for (let i = 0; i < myCourList.length;i++){
              if (myCourList[i].CpTitle.length > 20){
                myCourList[i].CpTitle = myCourList[i].CpTitle.substr(0, 18) + '...';
              }
            }

            that.setData({
              myCourList,
              model,
              zhi: 0
            })
            console.log("44888888844")
            if(noshow){
              that.setData({ zhi: 1 ,goumai:false})
            }
          }
          /*
          if (res.data.result) {
            
            var model = res.data.model;
            otype = model.Course.Type;
            var kid = model.CourseId;
            var glist = [];
            var title = model.Course.Title;
            if (title.length > 20) {
              title = title.substr(0, 18) + '...';
            }
            var types = model.Course.Type;
            var img = common.config.CoursePath + model.Course.PicturePath;
            var sp = model.Course.sPrice;
            if (parseInt(sp) == sp) {
              sp = sp.toFixed(2);
            }
            var gp = model.Course.GroupPrice;
            if (parseInt(gp) == gp) {
              gp = gp.toFixed(2);
            }
            var op = model.Course.OriginalPrice;
            if (parseInt(op) == op) {
              op = op.toFixed(2);
            }
            var addre = model.Course.Address;
            var phon = model.Course.Phone;
            var a = false;
            if (phon == "" && addre == "") {
              a = true;
            }
            var pp = model.Price.toFixed(2);
            var status="";
            ////////////////////////////判断订单来自哪张表
            if (otype == "12") {
              status = model.Type;
              model.CreateOn = common.timeStamp2String(model.CreateOn);
              model.StartTime = model.CreateOn;
              model.EndTime = model.CreateOn;
            }
            //更新数据
            that.setData({
              title: title,
              img: img,
              gprice: pp,
              oprice: op,
              sprice: sp,
              address: addre,
              phone: phon,
              xian: a,
              kid: kid,
              model: model,
              types: types,
              zhi: zhi,
              gid: id,
              status: model.Type,
              glist:glist,
              goumai: goumai
            });
          }
          */
        }
      });
    }
  },
  shouye: function () {
    wx.reLaunch({
      url: '../../Kecheng/Home/Home',
    })
  },
  kecheng: function (e) {
    let corId = e.currentTarget.dataset.id
    wx.redirectTo({
      url: '../../angli/tcDetail/tcDetail?id=' + corId + "&yu=0&copenid=0"
    })
    /*
    zou = "false";
    var that = this;
    if (that.data.types == "12") {
      wx.redirectTo({
        url: '../TaoCan/TaoCan?copenid=0&id=' + that.data.kid
      })
    }
    */
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
    zou = "true";
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
    var that = this;
    if (that.data.zhi != "0" && zou == "true") {
      wx.reLaunch({
        url: '../../Kecheng/Home/Home'
      });
    }
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    wx.stopPullDownRefresh()
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
  zixun: function () {
    var pp = this.data.phone;
    wx.showModal({
      title: '电话咨询',
      confirmText: '呼叫',
      content: pp,
      success: function (sm) {
        if (sm.confirm) {
          wx.makePhoneCall({
            phoneNumber: pp
          })
        }
      }
    });
  },
  dizhi: function () {
    common.dizhi(this.data.address);
  },
  tuisong: function (types,openid, id, ctypes){
    wx.request({
      url: common.config.SendTempletMessge,
      data: {
        type: types, openid: openid, formid: wx.getStorageSync("formId"), id: id, ctype: ctypes
      },
      method: 'GET',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
      }
    });
  }
})