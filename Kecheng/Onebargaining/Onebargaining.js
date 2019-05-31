// Kecheng/bargaining/bargaining.js
var app = getApp();
const util = require('../../utils/util.js')
let page = 1,
  size = 20;
var common = require('../../Common.js')
var WxParse = require('../../wxParse/wxParse.js');
let col1H = 0;
var j = 0;
var pingdian = "true";

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
    like: [],
    addrephone: false,
    tu: {
      c: common.config.StaticPath + "dingwei.jpg",
      d: common.config.StaticPath + "shouji.jpg"
    },
    phone: "",
    xiajiatu: common.config.StaticPath + "XiaJia_03.png",
    XiaJia: true,
    shiping: "",
    copenid: "",
    currred: "",
    numbertime: "",
    agenInfo: {
      Id: 0
    },
    picPath: common.config.AgeLogoPicPath,
    notref: false
  },
  CircleFriends: function() { //显示海报
    var that = this;
    if (that.data.yu == "Xiadan") {
      if (that.data.haibao == "") {
        wx.request({
          url: common.config.InsertKanGroupBooking,
          data: {
            cid: that.data.kid,
            openid: wx.getStorageSync('openid'),
            name: wx.getStorageSync('nickName'),
            province: wx.getStorageSync('province'),
            city: wx.getStorageSync('city'),
            address: wx.getStorageSync('address')
          },
          method: 'POST',
          header: {
            'content-type': 'application/json'
          },
          success: function(res) {
            var gid = res.data.id;
            var img = res.data.img;
            that.setData({
              gid: gid,
              haibao: common.config.GroupImgFile + img
            });
            var show = that.data.show;
            that.setData({
              show: !show
            });
          }
        });
      } else {
        var show = that.data.show;
        that.setData({
          show: !show
        });
      }
    }
  },
  close: function() {
    this.setData({
      show: false
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.setNavigationBarTitle({
      title: common.data.TitleName
    });
    var that = this;
    var id = "";
    var yu = "";
    var copenid = "";
    var numbertime = "";
    var province = wx.getStorageSync("province");
    if (province == null || province == "") {
      common.dingwei();
    }
    if (options != undefined) {
      id = options.cid;
      yu = options.yu;
      copenid = options.copenid;
      numbertime = options.numbertime;
      if (yu == "0") {
        yu = "Xiadan";
      }
      if (copenid == undefined) {
        copenid = "0";
      }
      if (numbertime == undefined) {
        numbertime = "0";
      }
    } else {
      id = that.data.kid;
      yu = that.data.yu;
      copenid = that.data.copenid;
      numbertime = that.data.numbertime;
    }
    if (!this.data.notref) {
      common.addCorBrowTimes(id);
      this.setData({
        notref: true
      });
    }
    this.setData({
      corId: id
    })

    //设置默认校区
    page = 1;
    this.setData({
      length: 4,
      areas: []
    })
    this.getAreas(id, () => {
      this.setData({
        length: 4
      })
    })
    var lgtlat = wx.getStorageSync('lgtlat');
    wx.request({
      url: common.config.GetKanGropOfCourseId,
      data: {
        cid: id,
        openid: wx.getStorageSync('openid'),
        copenid: copenid,
        province: wx.getStorageSync('province'),
        city: wx.getStorageSync('city'),
        address: wx.getStorageSync('address'),
        number: numbertime,
        lgt: lgtlat.lgt,
        lat: lgtlat.lat
      },
      method: 'POST',
      header: {
        'content-type': 'application/json'
      },
      success: function(res) {
        if (res.data.result) {
          var currred = res.data.currred;
          var migs = res.data.imgs;
          var model = res.data.modle;
          //var group = res.data.group;
          var like = res.data.youlike;
          var gp = model.GroupPrice;
          if (model.Status != "2") {
            that.setData({
              XiaJia: false
            });
          } else {
            //zizhiopenid = model.UsersOpenId;
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
              if (like[i].Title.length > 21) {
                like[i].Title = like[i].Title.substr(0, 20) + '...';
              }
              like[i].PicturePath = common.config.CoursePath + like[i].PicturePath;
              like[i].GroupPrice = like[i].GroupPrice.toFixed(2);
              like[i].OriginalPrice = like[i].OriginalPrice.toFixed(2);
            }
            var y = false;
            if (model.Phone == "" && model.Address == "") {
              y = true;
            }
            WxParse.wxParse('article', 'html', model.Description, that, 5);
            that.setData({
              movies: list,
              kid: model.Id,
              title: model.Title,
              jie: model.Introduce,
              // start: common.timeStamp2StringNian(model.StartTime),
              // end: common.timeStamp2StringNian(model.EndTime),
              miao: model.Description,
              gprice: model.GroupPrice,
              gpricecount: model.GroupPriceCount,
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
              //haibao: common.config.GroupImgFile+group.ImgPath,
              like: like,
              addrephone: y,
              shiping: model.VideoPath,
              copenid: copenid,
              currred: currred,
              numbertime: numbertime
            });
          }
        }
      }
    });
  },
  dian: function() {
    var that = this;
    if (that.data.yu == "0") {
      wx.showModal({
        title: "提示信息",
        content: "啦啦啦",
        showCancel: false,
        confirmText: "确定"
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
    wx.setNavigationBarTitle({
      title: common.data.TitleName
    });
    pingdian = "true";
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
      this.getAreas(this.data.kid);
    }
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
            // var show = that.data.show;
            // that.setData({
            //   show: !show
            // });
            wx.redirectTo({
              url: '../Twobargaining/Twobargaining?gid=' + that.data.gid + "&yu=0"
            });
          }
        })
      }
    });
  },
  Xiadan: function(e) {
    var kid = this.data.kid;
    if (pingdian == "false") {
      return;
    } else {
      pingdian = "false";
      //types  11.原价 22.折扣价 33.底价
      wx.navigateTo({
        url: '../Ouder/Ouder?kid=' + kid + '&gid=0&types=11&co=1 '
      });
    }
  },
  onShareAppMessage: function() {
    var that = this;
    var nn = common.GetNumberTime();
    if (that.data.haibao == "") {
      wx.request({
        url: common.config.InsertKanGroupBooking,
        data: {
          cid: that.data.kid,
          openid: wx.getStorageSync('openid'),
          name: wx.getStorageSync('nickName'),
          province: wx.getStorageSync('province'),
          city: wx.getStorageSync('city'),
          address: wx.getStorageSync('address')
        },
        method: 'POST',
        header: {
          'content-type': 'application/json'
        },
        success: function(res) {
          var gid = res.data.id;
          var img = res.data.img;
          that.setData({
            gid: gid,
            haibao: common.config.GroupImgFile + img
          });
          wx.redirectTo({
            url: '../Twobargaining/Twobargaining?yu=0&gid=' + gid
          });
        }
      });
    } else {
      wx.redirectTo({
        url: '../Twobargaining/Twobargaining?yu=0&gid=' + that.data.gid
      });
    }
    return {
      title: that.data.title,
      desc: '快来帮我砍价吧',
      path: '/Kecheng/ThreeWhite/ThreeWhite?yu=0&cid=' + that.data.kid + '&copenid=' + wx.getStorageSync('openid') + '&numbertime=' + nn + `&corId=${that.data.corId}`,
      success: function(res) {
        if (that.data.currred.Id != "0") {
          var aa = "现金";
          if (that.data.currred.RedpocketType == "1") {
            aa = "课程";
          }
          common.modalTap("课程分享成功,好友打开课程后您可获得" + aa + "红包。");
        }
        wx.request({
          url: common.config.InsertColonelOpenIdShare,
          data: {
            openid: wx.getStorageSync('openid'),
            province: wx.getStorageSync('province'),
            city: wx.getStorageSync('city'),
            address: wx.getStorageSync('address'),
            type: 1,
            id: that.data.kid,
            number: nn
          },
          method: 'POST',
          header: {
            'content-type': 'application/json'
          },
          success: function(res) {}
        });
      }
    }
  },
  likekan: function(e) {
    var cid = e.currentTarget.dataset.cid;
    wx.navigateTo({
      url: '../Onebargaining/Onebargaining?cid=' + cid + "&yu=0"
    });
  },
  onPullDownRefresh: function() {
    var that = this;
    wx.request({
      url: common.config.GetGidOfCidAndOpenId,
      data: {
        cid: that.data.kid,
        openid: wx.getStorageSync('openid')
      },
      method: 'POST',
      header: {
        'content-type': 'application/json'
      },
      success: function(res) {
        var gid = res.data.gid;
        if (gid != "0") {
          wx.redirectTo({
            url: '../Twobargaining/Twobargaining?gid=' + gid + "&yu=0"
          })
        }
      }
    })
    wx.stopPullDownRefresh()
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
    var lgtlat = wx.getStorageSync('lgtlat');
    util.request(
      common.config.GetClaAreaInfos,
      "POST", {
        corId: +id,
        corSource: 1,
        page,
        size,
        lgt: lgtlat.lgt,
        lat: lgtlat.lat
      },
      (res) => {
        console.log("GETAREAS", res)
        console.log("GETAREAS_PAGE", page)
        if (res.data.res) {
          let areas = this.data.areas
          let result = res.data.data.cpInfos
          areas = areas.concat(result)
          this.setData({
            areas,
            agenInfo: res.data.data.agenInfo,
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
    let campusId = e.currentTarget.dataset.campusId;
    let cName = e.currentTarget.dataset.name;
    let cPhone = e.currentTarget.dataset.phone;
    let cAddress = e.currentTarget.dataset.address;
    let dis = e.currentTarget.dataset.dis;
    wx.navigateTo({
      url: `/angli/campus/campus?campusId=${campusId}&cName=${cName}&cPhone=${cPhone}&cAddress=${cAddress}&dis=${dis}`,
    })
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
      url: '../../Agency/AgeInfo/AgeInfo?Id=' + Id
    });
  },
})