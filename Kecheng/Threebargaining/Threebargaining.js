// Kecheng/bargaining/bargaining.js
var app = getApp();
const util = require('../../utils/util.js')
let page = 1,
  size = 20;
var common = require('../../Common.js');
var WxParse = require('../../wxParse/wxParse.js');
let col1H = 0;
var j = 0;
let corId;
let id, numbertime, yu
Page({

  /**
   * 页面的初始数据
   */
  data: {
    show: true,
    imga: common.config.StaticPath + "kanjai_03.jpg",
    imgb: common.config.StaticPath + "time_03.jpg",
    imgc: common.config.StaticPath + "top-img_02.png",
    imgd: common.config.StaticPath + "jiantou-on_03.png",
    jindu: common.config.StaticPath + "jindu_01.jpg",
    jindu01: common.config.StaticPath + "jindu_02.jpg",
    yuandian: common.config.StaticPath + "yuandian.jpg",
    liucheng: common.config.StaticPath + "kanjialiuchn_03.jpg",
    xiala: common.config.StaticPath + "shiliangu价_07.png",
    remai: common.config.StaticPath + "remai_03.png",
    xinpin: common.config.StaticPath + "xinpin_07.png",
    penyouquan: common.config.StaticPath + "penyouquan_03.png",
    erweima: common.config.StaticPath + "mianshiba_03.jpg",
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
    like: [],
    addrephone: false,
    tu: {
      c: common.config.StaticPath + "dingwei.jpg",
      d: common.config.StaticPath + "shouji.jpg"
    },
    phone: "",
    xprice: "",
    copenid: "",
    xiajiatu: common.config.StaticPath + "XiaJia_03.png",
    XiaJia: true,
    shiping: "",
    numbertime: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.setNavigationBarTitle({
      title: common.data.TitleName
    });
    var openid = wx.getStorageSync('openid');
    if (openid == null || openid == "") {
      common.GetOpenId();
    } else {
      var name = wx.getStorageSync('nickName');
      var that = this;

      if (options.gid) {
        id = options.gid;
        yu = options.yu;
        numbertime = options.numbertime;
      }
      //设置默认校区
      page = 1;
      this.setData({
        length: 4,
        areas: []
      })
      console.log(numbertime);
      var guoqi = 0;
      var xprice = "";
      var lgtlat = wx.getStorageSync('lgtlat');
      util.request(
        common.config.GetKanGropAndCourse,
        "POST", {
          openid: wx.getStorageSync('openid'),
          gid: id,
          province: wx.getStorageSync('province'),
          city: wx.getStorageSync('city'),
          address: wx.getStorageSync('address'),
          number: numbertime,
          lgt: lgtlat.lgt,
          lat: lgtlat.lat
        },
        (res) => {
          if (res.data.result) {
            that.setData({
              corId: res.data.group.CourseId
            })
            that.getAreas(res.data.group.CourseId, () => {
              that.setData({
                length: 4
              })
            })
            var migs = res.data.imgs;
            var model = res.data.modle;
            var group = res.data.group;
            var gp = model.GroupPrice;
            var like = res.data.youlike;
            var copenid = group.ColonelOpenId;
            var zizhiopenid = model.UsersOpenId;
            if (model.Status != "2") {
              that.setData({
                XiaJia: false
              });
            } else {
              if (parseInt(gp) == gp) {
                model.GroupPrice = gp.toFixed(2);
              }
              var rp = model.RetailPrice;
              if (parseInt(rp) == rp) {
                model.RetailPrice = rp.toFixed(2);
              }
              var op = model.OriginalPrice;
              if (parseInt(op) == op) {
                model.OriginalPrice = op.toFixed(2);
              }
              if (group.Status == 2) {
                guoqi = 1;
              }
              var list = [];
              var bb = "";
              migs = migs.split(",");
              for (var i = 0; i < migs.length; i++) {
                if (i == 0) {
                  bb = common.config.CoursePath + migs[i];
                }
                var a = {
                  url: common.config.CoursePath + migs[i]
                };
                list.push(a);
              }
              for (var i = 0; i < like.length; i++) {
                if (like[i].Title.length > 35) {
                  like[i].Title = like[i].Title.substr(0, 35) + '...';
                }
                like[i].PicturePath = common.config.CoursePath + like[i].PicturePath;
                like[i].GroupPrice = like[i].GroupPrice.toFixed(2);
                like[i].OriginalPrice = like[i].OriginalPrice.toFixed(2);
              }
              var lis = [];
              for (var i = 1; i < group.GroupBooking_Users.length; i++) {
                group.GroupBooking_Users[i].CreateOn = common.timeStamp2String(group.GroupBooking_Users[i].CreateOn);
                if (group.GroupBooking_Users[i].Users.Name.length > 5) {
                  group.GroupBooking_Users[i].Users.Name = group.GroupBooking_Users[i].Users.Name.substr(0, 4) + '...';
                }
                lis.push(group.GroupBooking_Users[i]);
              }
              var xprice = model.OriginalPrice;
              if (group.AttendCount == group.ParticipateCount) {
                xprice = model.GroupPrice;
              } else if (group.AttendCount >= group.RetailPriceCount) {
                xprice = model.RetailPrice;
              }
              var y = false;
              if (model.Phone == "" && model.Address == "") {
                y = true;
              }
              WxParse.wxParse('article', 'html', model.Description, that, 5);
              that.jisuan(model.RetailPriceCount, model.GroupPriceCount, group.AttendCount);
              that.setData({
                movies: list,
                kid: model.Id,
                gid: id,
                title: model.Title,
                jie: model.Introduce,
                miao: model.Description,
                gprice: model.GroupPrice,
                gpricecount: model.GroupPriceCount,
                xprice: xprice,
                oprice: model.OriginalPrice,
                rprice: model.RetailPrice,
                rpricecount: model.RetailPriceCount,
                address: model.Address,
                phone: model.Phone,
                ccount: model.ParticipateCount,
                ccountmin: parseInt(model.ParticipateCount) - 1,
                groupcount: res.data.groupcount,
                wtime: model.WaitTime,
                yu: yu,
                bb: bb,
                haibao: common.config.GroupImgFile + group.ImgPath,
                kancount: group.GroupBooking_Users.length - 1,
                grouplist: lis,
                guoqi: guoqi,
                name: group.Users.Name,
                like: like,
                addrephone: y,
                copenid: copenid,
                shiping: model.VideoPath,
                numbertime: numbertime
              });
            }
          }
        },
        (err) => {

        },
        (res) => {

        }
      )
      return;
      wx.request({
        url: common.config.GetKanGropAndCourse,
        data: {
          openid: wx.getStorageSync('openid'),
          gid: id,
          province: wx.getStorageSync('province'),
          city: wx.getStorageSync('city'),
          address: wx.getStorageSync('address'),
          number: numbertime
        },
        method: 'POST',
        header: {
          'content-type': 'application/json'
        },
        success: function(res) {
          if (res.data.result != "") {

          }
        }
      });
    }
  },
  jisuan: function(rcount, gcount, acount) {
    var r = parseInt(rcount);
    var g = parseInt(gcount);
    var a = parseInt(acount);
    var width = 0;
    if (a > 0) {
      if (a < r)
        width = ((236.25 / r) + (236.25 % r)) * a;
      if (a == r)
        width = 236.25;
      if (a > r && a < g)
        width = ((525 / g) + (525 % g)) * a;
      if (a == g)
        width = 482;
      this.setData({
        width: width,
        topwidth: width - 3
      });
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
    wx.getSystemInfo({
      success: function(res) {
        console.log(res)
      },
    })
    wx.setNavigationBarTitle({
      title: common.data.TitleName
    });
    let avatarUrl = wx.getStorageSync('avatarUrl')
    if (avatarUrl) {
      this.hideMask()
    } else {
      this.showMask()
    }
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

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    if (this.data.onBottom) {
      console.log('this.data.pullDown', this.data.onBottom)
      this.getAreas(this.data.corId);
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  mai: function() {
    var that = this;
    wx.navigateTo({
      url: '../Onebargaining/Onebargaining?cid=' + that.data.kid + "&yu=0"
    });
    // wx.request({
    //   url: common.config.InsertKanGroupBooking,
    //   data: { cid: that.data.kid, openid: wx.getStorageSync('openid') },
    //   method: 'POST',
    //   header: {
    //     'content-type': 'application/json'
    //   },
    //   success: function (res) {
    //     if (res.data.result == "one") {
    //       wx.navigateTo({
    //         url: '../Onebargaining/Onebargaining?gid=' + res.data.id + "&yu=0"
    //       })
    //     }
    //     else if (res.data.result == "two") {
    //       wx.navigateTo({
    //         url: '../Twobargaining/Twobargaining?gid=' + res.data.id + "&yu=0"
    //       })
    //     }
    //   }
    // })
  },
  likekan: function(e) {
    var cid = e.currentTarget.dataset.cid;
    wx.navigateTo({
      url: '../Onebargaining/Onebargaining?cid=' + cid + "&yu=0"
    });
    // wx.request({
    //   url: common.config.InsertKanGroupBooking,
    //   data: { cid: cid, openid: wx.getStorageSync('openid') },
    //   method: 'POST',
    //   header: {
    //     'content-type': 'application/json'
    //   },
    //   success: function (res) {
    //     if (res.data.result == "one") {
    //       wx.navigateTo({
    //         url: '../Onebargaining/Onebargaining?gid=' + res.data.id + "&yu=0"
    //       })
    //     }
    //     else if (res.data.result == "two") {
    //       wx.navigateTo({
    //         url: '../Twobargaining/Twobargaining?gid=' + res.data.id + "&yu=0"
    //       })
    //     }
    //   }
    // });
  },
  onPullDownRefresh: function() {
    this.onLoad();
    wx.stopPullDownRefresh()
  },
  CircleFriends: function() {
    var show = this.data.show;
    this.setData({
      show: !show
    })
  },
  baocun: function() {
    var that = this;
    wx.getImageInfo({
      src: that.data.haibao,
      success: function(res) {
        var path = res.path;
        wx.saveImageToPhotosAlbum({
          filePath: path,
          success(res) {
            common.DoSuccess('图片保存成功');
            var show = that.data.show;
            that.setData({
              show: !show
            })
          }
        })
      }
    });
  },
  onShareAppMessage: function() {
    var that = this;
    return {
      title: common.data.TitleName,
      desc: '快来帮我砍价吧',
      path: '/Kecheng/ThreeWhite/ThreeWhite?yu=0&cid=' + that.data.kid + '&copenid=' + that.data.copenid
    }
  },
  zixun: function() {
    var pp = this.data.phone;
    wx.showModal({
      title: '电话咨询',
      confirmText: '呼叫',
      content: pp,
      success: function(sm) {
        if (sm.confirm) {
          wx.makePhoneCall({
            phoneNumber: pp
          })
        }
      }
    });
  },
  dizhi: function() {
    common.dizhi(this.data.address);
  },
  getAreas(id, cb) {
    //util.showLoading('获取地址ing...')
    util.request(
      common.config.GetClaAreaInfos,
      "POST", {
        corId: +id,
        corSource: 1,
        page,
        size,
      },
      (res) => {
        console.log("GETAREAS", res)
        console.log("")
        console.log("GETAREAS_PAGE", page)
        if (res.data.res) {
          let areas = this.data.areas
          let result = res.data.data.cpInfos
          areas = areas.concat(result)
          this.setData({
            areas,
            length: areas.length
          })
          page++
        }
      },
      (err) => {
        util.showModal('提示', '网络异常')
      },
      (res) => {
        if (cb) {
          cb()
        }
        wx.hideLoading()
        wx.stopPullDownRefresh()
      },
    )
  },
  showAll() {
    this.setData({
      length: this.data.areas.length,
      onBottom: true
    })
    this.getAreas(this.data.kid)
  },
  showSome() {
    this.setData({
      length: 4
    })
  },
  toCampus(e) {
    console.log(e)
    let campusId = e.currentTarget.dataset.campusId
    let cName = e.currentTarget.dataset.name
    let cPhone = e.currentTarget.dataset.phone
    let cAddress = e.currentTarget.dataset.address
    wx.navigateTo({
      url: `/angli/campus/campus?campusId=${campusId}&cName=${cName}&cPhone=${cPhone}&cAddress=${cAddress}`,
    })
  },
  hideMask() {
    this.setData({
      showMask: true
    })
  },
  showMask() {
    this.setData({
      showMask: false
    })
  },
  getUserInfo(e) {
    console.log(e)
    let that = this
    let avatarUrl = wx.getStorageSync('avatarUrl')
    let userInfo = e.detail.userInfo
    if (!userInfo) {
      return
    }
    util.request(
      common.config.PutAvaUrlNick,
      "POST", {
        openId: wx.getStorageSync('openid'),
        nickName: userInfo.nickName,
        avaurl: userInfo.avatarUrl
      },
      (res) => {
        console.log(res)
        if (res.data.res) {
          that.hideMask()
          wx.setStorageSync('avatarUrl', userInfo.avatarUrl)
          wx.setStorageSync('nickName', userInfo.nickName)
        }
      },
      (res) => {
        console.log(res)
      },
      (res) => {
        //this.GetGropuBookingOfId(this.data.gid)
      },
    )
  }
})