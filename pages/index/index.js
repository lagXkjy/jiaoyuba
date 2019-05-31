var common = require('../../Common.js');
const util = require('../../utils/util.js')
Page({
  data: {
    myInfo: [{
        title: "我的红包",
        info: "￥0",
        bindtap: "hongBao"
      },
      {
        title: "我的优惠券",
        info: "0张",
        bindtap: "HuiJuan"
      },
      {
        title: "申请成为分销员",
        info: "",
        bindtap: "shengqing"
      },
      {
        title: "机构申请入驻",
        info: "",
        bindtap: "ruzhu",
        param: 0
      }
    ],
    html: common.config.StaticPath + "logo_bu_03.png",
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
    jiantou: common.config.StaticPath + "jiantou-red_06.png",
    userInfo: {},
    pageIndex: 1,
    pageSize: 10,
    myCourList: [] //我报名的课程列表
  },
  onLoad: function(options) {
    var openid = wx.getStorageSync('openid');
    if (openid == null || openid == "") {
      common.GetOpenId();
    }
    var nickName = wx.getStorageSync('nickName');
    if (nickName == null || nickName == '') {
      common.Getnameandhead();
    }
    // this.getMyInfo(this);
    this.signUpCourse(this);
  },
  onShow() {
    this.getMyInfo(this);
  },
  onPullDownRefresh: function() {
    this.data.pageIndex = 1;
    this.data.myCourList = [];
    this.getMyInfo(this);
    this.signUpCourse(this);
    wx.stopPullDownRefresh();
  },
  onReachBottom: function() {
    var pageIndex = this.data.pageIndex;
    pageIndex++;
    this.data.pageIndex = pageIndex;
    this.signUpCourse(this);
    console.log("下一页");
  },
  //获取我的信息"：头像，昵称，红包金额，优惠券数量，分销员信息
  getMyInfo: function(indexPage) {
    var openid = wx.getStorageSync('openid');
    var userInfo = {};
    userInfo.AvatarUrl = wx.getStorageSync('avatarUrl');
    userInfo.nickName = wx.getStorageSync('nickName');
    wx.request({
      url: common.config.GetMyIndexInfo,
      method: 'POST',
      data: {
        openId: openid
      },
      header: {
        'content-type': 'application/json'
      },
      success: function(res) {
        var userRedMoney = res.data.userRedMoney;
        var quanCount = res.data.quanCount;
        var distmodel = res.data.distmodel;
        var distcount = res.data.distcount;
        var agenId = res.data.agenId;
        indexPage.data.myInfo[0].info = "￥" + parseFloat(userRedMoney).toFixed(2);
        indexPage.data.myInfo[1].info = "" + quanCount + "个";
        if (distmodel.Type == "1") {
          indexPage.data.myInfo[2].title = "我的分销课程";
          indexPage.data.myInfo[2].info = "" + distcount + "个";
          indexPage.data.myInfo[2].bindtap = "liebiao";
        }
        if (agenId >= 0) {
          indexPage.data.myInfo[3].title = agenId > 0 ? "入驻申请状态查看" : "机构申请入驻";
          indexPage.data.myInfo[3].info = "";
          indexPage.data.myInfo[3].bindtap = "ruzhu";
          indexPage.data.myInfo[3].param = agenId;
        }
        indexPage.setData({
          userInfo: userInfo,
          myInfo: indexPage.data.myInfo
        });
      }
    });
  },
  //获取我报名的课程
  signUpCourse: function(indexPage) {
    var openid = wx.getStorageSync('openid');
    var myCourses = indexPage.data.myCourList;
    wx.request({
      url: common.config.GetMyIndexCoursesNew,
      method: 'POST',
      data: {
        openId: openid,
        pageIndex: indexPage.data.pageIndex,
        pageSize: indexPage.data.pageSize
      },
      header: {
        'content-type': 'application/json'
      },
      success: function(res) {
        var courseList = res.data.list;
        if (courseList != null && courseList.length > 0) {
          for (var i = 0; i < courseList.length; i++) {
            if (courseList[i].Course.Title.length > 20) {
              courseList[i].Course.Title = courseList[i].Course.Title.substr(0, 18) + '...';
            }
            var sp = courseList[i].Course.sPrice;
            courseList[i].Course.sPrice = sp.toFixed(2);
            var gp = courseList[i].Course.GroupPrice;
            if (parseInt(gp) == gp) {
              courseList[i].Course.GroupPrice = gp.toFixed(2);
            }
            var rp = courseList[i].Price;
            if (parseInt(rp) == rp) {
              courseList[i].Price = rp.toFixed(2);
            }
            if (courseList[i].Course.Type == "4") {
              if (courseList[i].AttendCount == courseList[i].ParticipateCount) {
                courseList[i].Price = courseList[i].GroupPrice;
                if (courseList[i].GroupType == "0") {
                  courseList[i].Price = rp.toFixed(2);
                }
              } else if (courseList[i].AttendCount >= courseList[i].RetailPriceCount) {
                courseList[i].Price = courseList[i].RetailPrice;
              }
            }
            var op = courseList[i].Course.OriginalPrice;
            if (parseInt(op) == op) {
              courseList[i].Course.OriginalPrice = op.toFixed(2);
            }
            courseList[i].Course.PicturePath = common.config.CoursePath + courseList[i].Course.PicturePath;
            if (courseList[i].Status == "0") {
              courseList[i].ccount = parseInt(courseList[i].ParticipateCount) - parseInt(courseList[i].AttendCount);
            }
            myCourses.push(courseList[i])
          }
          indexPage.setData({
            myCourList: myCourses
          });
        } else {
          console.log("未请求到数据");
        }
      }
    });
  },
  hongBao: function(e) {
    this.setAvaNick(e, () => {
      wx.navigateTo({
        url: "../../newpage/MyBao/MyBao"
      });
    });
  },
  HuiJuan: function(e) {
    this.setAvaNick(e, () => {
      wx.navigateTo({
        url: '../../newpage/coupons/coupons',
      });
    });
  },
  shengqing: function(e) {
    this.setAvaNick(e, () => {
      wx.navigateTo({
        url: '../../distribution/Apply/Apply',
      });
    });
  },
  liebiao: function(e) {
    this.setAvaNick(e, () => {
      wx.navigateTo({
        url: '../../distribution/disCourse/disCourse',
      });
    });
  },
  xiangxi: function(e) {
    console.log(e);
    var types = e.currentTarget.dataset.types;
    var status = e.currentTarget.dataset.status;
    var gid = e.currentTarget.dataset.id;
    var orderstype = e.currentTarget.dataset.orderstype;
    var title = e.currentTarget.dataset.title;
    if (types == '13') //套餐课程
    {
      wx.navigateTo({
        url: "../../Kecheng/Taosuccess/Taosuccess?zhi=0&gid=" + gid
      });
    }
    if (status == '0' && types == '1') //拼团中
    {
      wx.navigateTo({
        url: "../../Kecheng/OnGroup/OnGroup?gid=" + gid
      })
    }
    if (status == '0' && types == '4') //砍价中
    {
      wx.navigateTo({
        url: "../../Kecheng/Twobargaining/Twobargaining?yu=0&gid=" + gid
      })
    } else if (status == '1' || orderstype == '1') //拼团成功
    {
      if (types == '6') {
        var card = e.currentTarget.dataset.card;
        wx.navigateTo({
          url: '../../newpage/model/model?ling=0&card=' + card + "&title=" + title,
        });
      } else if (types == '10') //优惠课程
      {
        wx.navigateTo({
          url: "../../Kecheng/Yousuccess/Yousuccess?zhi=0&gid=" + gid
        });
      } else if (types == '11') //试听课程
      {
        wx.navigateTo({
          url: "../../Kecheng/Shisuccess/Shisuccess?zhi=0&gid=" + gid
        });
      } else {
        wx.navigateTo({
          url: "../../Kecheng/success/success?zhi=0&gid=" + gid + "&otype=" + types
        });
      }
    } else if (status == '2') //退款
    {
      wx.navigateTo({
        url: "../../Kecheng/falied/falied?gid=" + gid
      })
    } else if (orderstype == '2' && types == '6') //答题课程未领取
    {
      var cid = e.currentTarget.dataset.cid;
      var title = e.currentTarget.dataset.title;
      wx.navigateTo({
        url: '../../newpage/succeed/succeed?oid=' + gid + "&cid=" + cid + "&title=" + title,
      });
    } else if (types == '7') //红包课程
    {
      wx.navigateTo({
        url: "../../newpage/Redsuccess/Redsuccess?zhi=0&gid=" + gid
      });
    } else if (types == '10' || types == '15') //优惠券课程
    {
      wx.navigateTo({
        url: "../../newpage/Coupsuccess/Coupsuccess?zhi=0&gid=" + gid
      });
    } else if (types == '9') //分销商课程
    {
      wx.navigateTo({
        url: "../../distribution/Distsuccess/Distsuccess?zhi=0&gid=" + gid
      });
    }
    // else if (types == '10') //优惠课程
    // {
    //   wx.navigateTo({
    //     url: "../../Kecheng/Yousuccess/Yousuccess?zhi=0&gid=" + gid
    //   });
    // }
    else if (types == '11') //试听课程
    {
      wx.navigateTo({
        url: "../../Kecheng/Shisuccess/Shisuccess?zhi=0&gid=" + gid
      });
    }
  },
  ruzhu: function(e) {
    var param = e.currentTarget.dataset.param;
    if (param == undefined || param < 0) {
      wx.showModal({
        title: '提示信息',
        content: '获取信息失败',
        showCancel: false
      });
      return false;
    }
    this.setAvaNick(e, () => {
      wx.navigateTo({
        url: '../../Agency/AgenAply/AgenAply?Id=' + param,
      });
    });
  },
  setAvaNick(e, callback = () => {}) {
    let avatarUrl = wx.getStorageSync('avatarUrl')
    let userInfo = e.detail.userInfo
    if (!userInfo) {
      return false;
    }
    if (!avatarUrl && userInfo) {
      util.request(
        common.config.PutAvaUrlNick,
        "POST", {
          openId: wx.getStorageSync('openid'),
          nickName: userInfo.nickName,
          avaurl: userInfo.avatarUrl,
        },
        (res) => {
          wx.setStorageSync('avatarUrl', userInfo.avatarUrl);
          wx.setStorageSync('nickName', userInfo.nickName);
          callback();
        },
        (err) => {
          console.log(err)
        },
        (res) => {}
      )
    } else {
      callback();
    }
  }
})