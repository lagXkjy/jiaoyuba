var app = getApp();
var common = require('../../Common.js');
let quan_id = "",
  quan_name = "",
  quan_money = 0

function jisuan(sum, count) {
  var ss = parseInt(sum);
  var cc = parseInt(count);
  var uu = ((100 / ss)) * cc;
  return uu;
}

var LIST = []
var page1 = 0;
var aa;
var pin = "true";
let value = '';
let types = ""

/** 
 * 需要一个目标日期，初始化时，先得出到当前时间还有剩余多少秒
 * 1.将秒数换成格式化输出为XX天XX小时XX分钟XX秒 XX
 * 2.提供一个时钟，每10ms运行一次，渲染时钟，再总ms数自减10
 * 3.剩余的秒次为零时，return，给出tips提示说，已经截止
 */

// 定义一个总毫秒数，以一分钟为例。TODO，传入一个时间点，转换成总毫秒数
// 定义一个总毫秒数，以一分钟为例。TODO，传入一个时间点，转换成总毫秒数
var total_micro_second = 0;
var pp;
var All = [];
var Kan = [];
clearTimeout(pp);

function shijian(that, i) {
  // 渲染倒计时时钟
  var param = {};
  for (var i = 0; i < All.length; i++) {
    if (All[i] != 0) {
      var shia = "col1[" + i + "].shi";
      var fena = "col1[" + i + "].fen";
      var miaoa = "col1[" + i + "].miao";
      var aa = date_format(All[i]);
      var shi = parseInt(aa.substr(0, 2) * 24) + parseInt(aa.substr(3, 2));
      var fen = aa.substr(6, 2);
      var miao = aa.substr(9, 2);
      param[shia] = shi
      param[fena] = fen
      param[miaoa] = miao
      that.setData(param);
      All[i] -= 1;
    }
  }
  if (Kan.length > 0) {
    for (var i = 0; i < Kan.length; i++) {
      if (Kan[i] != 0) {
        var shia = "col2[" + i + "].shi";
        var fena = "col2[" + i + "].fen";
        var miaoa = "col2[" + i + "].miao";
        var aa = date_format(Kan[i]);
        var shi = parseInt(aa.substr(0, 2) * 24) + parseInt(aa.substr(3, 2));
        var fen = aa.substr(6, 2);
        var miao = aa.substr(9, 2);
        param[shia] = shi
        param[fena] = fen
        param[miaoa] = miao
        that.setData(param);
        Kan[i] -= 1;
      }
    }
  }
}


function count_down(that, i) {
  // 渲染倒计时时钟
  var param = {};
  aa = setTimeout(function() {
    for (var i = 0; i < All.length; i++) {
      if (All[i] != 0) {
        var shia = "col1[" + i + "].shi";
        var fena = "col1[" + i + "].fen";
        var miaoa = "col1[" + i + "].miao";
        var aa = date_format(All[i]);
        var shi = parseInt(aa.substr(0, 2) * 24) + parseInt(aa.substr(3, 2));
        var fen = aa.substr(6, 2);
        var miao = aa.substr(9, 2);
        param[shia] = shi
        param[fena] = fen
        param[miaoa] = miao
        that.setData(param);
        All[i] -= 1;
      }
    }
    if (Kan.length > 0) {
      for (var i = 0; i < Kan.length; i++) {
        if (Kan[i] != 0) {
          var shia = "col2[" + i + "].shi";
          var fena = "col2[" + i + "].fen";
          var miaoa = "col2[" + i + "].miao";
          var aa = date_format(Kan[i]);
          var shi = parseInt(aa.substr(0, 2) * 24) + parseInt(aa.substr(3, 2));
          var fen = aa.substr(6, 2);
          var miao = aa.substr(9, 2);
          param[shia] = shi
          param[fena] = fen
          param[miaoa] = miao
          that.setData(param);
          Kan[i] -= 1;
        }
      }
    }
    count_down(that);
  }, 1000)

}
// 时间格式化输出，如03:25:19 86。每10ms都会调用一次
function date_format(micro_second) {
  // 秒数
  var second = micro_second;
  // 小时位
  var hr = Math.floor(second / 3600);
  //天
  var day = Math.floor(hr / 24);
  // 小时
  var hx = fill_zero_prefix((Math.floor(second / 3600 % 24)));
  // 分钟位
  var min = fill_zero_prefix(Math.floor((second - hr * 3600) / 60));
  // 秒位
  var sec = fill_zero_prefix((second - hr * 3600 - min * 60));
  return fill_zero_prefix(day) + "," + hx + "," + min + "," + sec;
}

// 位数不足补零
function fill_zero_prefix(num) {
  return num < 10 ? "0" + num : num
}

Page({
  data: {
    navbar: ['推荐', '拼团', '砍价', "一元购", "答题赢课", "优惠"], //, '优惠', '助力',"一元购"
    currentTab: 0,
    scrollH: 0,
    loadingCount: 0,
    images: [],
    col1: [],
    banners: [],
    quanbu: true,
    KanTui: true,
    imga: common.config.StaticPath + "kanjai_03.jpg",
    imgb: common.config.StaticPath + "time_03.jpg",
    clock: '',
    html: {
      a: common.config.StaticPath + "tuijia_02.jpg",
      b: common.config.StaticPath + "home_sou.jpg",
      c: common.config.StaticPath + "remai_03.png"
    },
    pingimg: common.config.StaticPath + "pingtuan_03.png",
    kanimg: common.config.StaticPath + "KanJia_03.png",
    yiyuan: common.config.StaticPath + "YiYuan.png",
    dati: common.config.StaticPath + "DaTi.png",
    youhui: common.config.StaticPath + "hui_03.png",
    youimg: common.config.StaticPath + "hui_3_03.png",
    ww: "",
    imgHeight: "",
    types: "",
    haveCours: true
  },
  onLoad: function(options) {
    wx.showLoading({
      title: '努力加载中...',
    })
    var that = this;

    pin = "true";
    page1 = 0;
    All = [];
    Kan = [];
    this.setData({
      col1: []
    });
    if (options == undefined) {
      types = that.data.types;
    } else {
      types = options.types;

    }
    wx.getSystemInfo({
      success: (res) => {
        let ww = res.windowWidth;
        let imgHeight = ww * 0.5;
        that.setData({
          ww: ww,
          imgHeight: imgHeight,
          types: types
        });
      }
    });
    var openid = wx.getStorageSync('openid');
    if (openid == null || openid == "") {
      common.GetOpenId();
    }
    if (common.data.TitleName == "") {
      common.data.TitleName = "教育吧";
      wx.setNavigationBarTitle({
        title: common.data.TitleName
      });
    } else {
      wx.setNavigationBarTitle({
        title: common.data.TitleName
      });
    }
    if (types) {
      types = +types
      switch (types) {
        case 1: //团购课程
          wx.setNavigationBarTitle({
            title: '团购课程'
          });
          break;
        case 4: //砍价课程
          wx.setNavigationBarTitle({
            title: '砍价'
          });
          break;
        case 5: //一元课程
          wx.setNavigationBarTitle({
            title: '一元好课'
          });
          break;
        case 6: //答题课程
          wx.setNavigationBarTitle({
            title: '答题赢课'
          });
          break;
        case 10: //优惠课程
          wx.setNavigationBarTitle({
            title: '优惠课程'
          });
          break;
        case 11: //试听课程
          wx.setNavigationBarTitle({
            title: '试听课'
          });
          break;
        default:
          wx.setNavigationBarTitle({
            title: common.data.TitleName
          });
          break;
      }
    }
    that.fanye(types, "");
  },
  onReachBottom: function() {
    var that = this;
    if (that.data.col1.length >= 10)
      this.fanye(that.data.types);
  },
  fanye: function(types, val) {
    var that = this;
    var openid = wx.getStorageSync("openid");
    var cc = [];
    var ppage = 0;
    var KanTui = true;
    ppage = page1;


    cc = that.data.col1;
    var lgtlat = wx.getStorageSync('lgtlat');
    if (ppage != -1) {
      ppage += 1;
      wx.request({
        url: common.config.HomeCourseListOfPage,
        method: 'POST',
        data: {
          corType: types,
          page: ppage,
          openId: openid,
          seaK: val,
          cpId: 0,
          lgt: lgtlat.lgt,
          lat: lgtlat.lat
        },
        header: {
          'content-type': 'application/json'
        },
        success: function(res) {
          if (res.data.result) {
            var kelist = res.data.list;
            for (var i = 0; i < kelist.length; i++) {
              if (kelist[i].Title.length > 20) {
                kelist[i].Title = kelist[i].Title.substr(0, 18) + "..."
              }
              All.push(kelist[i].IsKanGroupEndTime);
              if (kelist[i].Type == 4) {
                KanTui = false;
              }
              if (kelist[i].Title.length > 35) {
                kelist[i].Title = kelist[i].Title.substr(0, 35) + '...';
              }
              var gp = kelist[i].GroupPrice;
              if (parseInt(gp) == gp) {
                kelist[i].GroupPrice = gp.toFixed(2);
              }
              var rp = kelist[i].RetailPrice;
              if (parseInt(rp) == rp) {
                kelist[i].RetailPrice = rp.toFixed(2);
              }
              var op = kelist[i].OriginalPrice;
              if (parseInt(op) == op) {
                kelist[i].OriginalPrice = op.toFixed(2);
              }
              kelist[i].PicturePath = common.config.CoursePath + kelist[i].PicturePath;
              if (kelist[i].Type == 5 || kelist[i].Type == 6) {
                kelist[i].jindu = jisuan(kelist[i].ParticipateCount, kelist[i].GropCount);
              }
              kelist[i].Distance = kelist[i].Distance.toFixed(1);
              cc.push(kelist[i]);
            }
            ///////////////
            shijian(that);
            page1 = ppage;
            that.setData({
              col1: cc
            });
          } else {
            page1 = -1;
            that.setData({
              quanbu: false
            })
          }
        },
        fail: function(e) {
          common.modalTap("亲~网络不给力哦，请稍后重试")
        },
        complete: function() {
          if (that.data.col1.length <= 0) {
            that.setData({
              haveCours: false
            });
          }
          wx.hideLoading();
        }
      });
    }
  },
  Ping: function(e) {
    pin = "false";
    var Id = e.currentTarget.dataset.pid;
    var gid = e.currentTarget.dataset.gid;
    var types = e.currentTarget.dataset.type;
    var scount = e.currentTarget.dataset.scount;
    var openid = wx.getStorageSync('openid');
    var name = wx.getStorageSync('nickName');
    if (types == "1") //拼团
    {
      wx.navigateTo({
        url: '../Detail/Detail?id=' + Id + "&yu=0&copenid=0"
      });
    }
    if (types == "4") //砍价
    {
      if (scount != "0") {
        if (gid == "0") {
          wx.navigateTo({
            url: '../Onebargaining/Onebargaining?cid=' + Id + "&yu=0&copenid=0"
          });
        } else if (gid != "0") {
          wx.navigateTo({
            url: '../Twobargaining/Twobargaining?gid=' + gid + "&yu=0&cid=" + Id
          })
        }
      }
    }
    if (types == "5") //一元
    {
      var oid = "0";
      if (e.currentTarget.dataset.oid != undefined) {
        oid = e.currentTarget.dataset.oid;
      }
      var sheng = e.currentTarget.dataset.sheng;
      if (sheng != "0") {
        wx.navigateTo({
          url: '../YiYuan/YiYuan?id=' + Id + "&yu=0&copenid=0&oid=" + oid
        });
      }
    }
    if (types == "6") //答题
    {
      var otype = e.currentTarget.dataset.otype;
      var oid = e.currentTarget.dataset.oid;
      var sheng = e.currentTarget.dataset.sheng;
      if (sheng != "0") {
        if (otype == "2") {
          var title = e.currentTarget.dataset.title
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
    }
    if (types == '10') //优惠
    {
      wx.navigateTo({
        url: '../YouHui/YouHui?id=' + Id + "&yu=0&copenid=0" +
          `&quan_id=${quan_id}&quan_name=${quan_name}&quan_money=${quan_money}`
      });
    }
    if (types == "11") //试听
    {
      var oid = "0";
      if (e.currentTarget.dataset.oid != undefined) {
        oid = e.currentTarget.dataset.oid;
      }
      var sheng = e.currentTarget.dataset.sheng;
      if (sheng != "0") {
        wx.navigateTo({
          url: '../ShiTing/ShiTing?id=' + Id + "&yu=0&copenid=0&oid=" + oid
        });
      }
    }
    if (types == '12') //套餐
    {
      wx.navigateTo({
        url: '../TaoCan/TaoCan?id=' + Id + "&yu=0&copenid=0"
      });
    }
  },
  onPullDownRefresh: function() {
    pin = "true";
    page1 = 0;
    All = [];
    Kan = [];
    this.setData({
      col1: []
    });
    this.onLoad();
    wx.stopPullDownRefresh();
  },
  onShow: function() {
    if (pin != "true") {
      this.onLoad();
    }
    //wx.setNavigationBarTitle({ title: common.data.TitleName });
    clearTimeout(aa);
    count_down(this);
    shijian(this);
  },
  Ke: function(e) {
    var Id = e.currentTarget.dataset.cid;
    if (Id != "0" && Id != "") {
      wx.navigateTo({
        url: '../Detail/Detail?id=' + Id + "&yu=0&copenid=0"
      });
    }
  },
  Red: function(e) {
    var rid = e.currentTarget.dataset.rid;
    var esid = e.currentTarget.dataset.esid;
    var csid = e.currentTarget.dataset.csid;
    var status = e.currentTarget.dataset.status;
    var couptype = e.currentTarget.dataset.couptype;
    if (status == "1") //红包活动
    {
      if (rid != "0" && rid != "" && esid != "0") { //已创建了拆分红包订单
        wx.navigateTo({
          url: '../../newpage/Twoenvelope/Twoenvelope?esid=' + esid + "&chai=1"
        });
      } else if (rid != "0" && rid != "" && esid == "0") { //没有创建过拆分红包的订单
        wx.request({
          url: common.config.InsertEnvelopeSplits,
          data: {
            rid: rid,
            openid: wx.getStorageSync('openid')
          },
          method: 'POST',
          header: {
            'content-type': 'application/json'
          },
          success: function(res) {
            wx.navigateTo({
              url: '../../newpage/envelope/envelope?tan=' + res.data.tan + '&esid=' + res.data.esid + '&rid=' + rid,
            });
          }
        });
      }
    } else if (status == "2") //优惠券活动
    {
      if (csid == "0") {
        wx.request({
          url: common.config.InsertCouponsSplits,
          data: {
            cid: rid,
            openid: wx.getStorageSync('openid')
          },
          method: 'POST',
          header: {
            'content-type': 'application/json'
          },
          success: function(res) {
            wx.navigateTo({
              url: '../../newpage/envelopeT/envelopeT?csid=' + res.data.csid + '&cid=' + rid,
            });
          }
        });
      } else {
        if (couptype == "1") {
          wx.navigateTo({
            url: '../../newpage/envelopeT/envelopeT?csid=' + csid + '&cid=' + rid,
          });
        } else {
          wx.navigateTo({
            url: '../../newpage/coupons/coupons'
          });
        }
      }
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {},
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {},
  onShareAppMessage: function() {
    return {
      title: common.data.TitleName,
      desc: common.data.TitleName,
      path: '/Kecheng/Home/Home'
    }
  },
  searchCourses(e) {
    let val = e.detail.value
    if (val == value) {
      return
    }
    value = val
    this.setData({
      col1: []
    })
    page1 = 0
    this.fanye(types, val)
  }
})